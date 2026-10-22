import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb, type TestDb } from './helpers/db';
import { hashPassword, validatePasswordStrength, verifyPassword } from '@/server/auth/password';
import { can, isStaff, permissionsFor } from '@/server/auth/rbac';
import { createSession, resolveSession, revokeAllSessions, revokeSession } from '@/server/auth/session';
import { login, registerClient, requestPasswordReset, resetPassword } from '@/server/domain/accounts';
import { setSetting } from '@/server/domain/settings';
import { MAX_ATTEMPTS_PER_IDENTIFIER } from '@/server/auth/rateLimit';
import { AppError } from '@/server/http/errors';

let db: TestDb;

beforeEach(async () => {
  db = await createTestDb();
  // Aprovação automática simplifica os testes que não tratam de aprovação.
  await setSetting(db.sql, 'clientes.aprovacao_manual', false, null);
});

afterEach(async () => {
  await db?.close();
});

const CADASTRO = {
  name: 'Ana Souza',
  email: 'ana@clinica.com.br',
  password: 'senhaSegura123',
  clinicName: 'Clínica Souza',
  cro: '12345',
  croUf: 'mg',
};

describe('hash de senha', () => {
  it('verifica a senha correta e recusa a errada', async () => {
    const hash = await hashPassword('senhaSegura123');
    expect(await verifyPassword('senhaSegura123', hash)).toBe(true);
    expect(await verifyPassword('senhaErrada123', hash)).toBe(false);
  });

  it('gera hashes diferentes para a mesma senha (salt aleatório)', async () => {
    expect(await hashPassword('senhaSegura123')).not.toBe(await hashPassword('senhaSegura123'));
  });

  it('não guarda a senha em claro', async () => {
    expect(await hashPassword('senhaSegura123')).not.toContain('senhaSegura123');
  });

  it('recusa formato de hash corrompido sem lançar erro', async () => {
    expect(await verifyPassword('x', 'lixo')).toBe(false);
    expect(await verifyPassword('x', '')).toBe(false);
  });

  it('exige senha com tamanho, letra e número', () => {
    expect(validatePasswordStrength('curta1')).not.toBeNull();
    expect(validatePasswordStrength('somenteletras')).not.toBeNull();
    expect(validatePasswordStrength('1234567890')).not.toBeNull();
    expect(validatePasswordStrength('senhaSegura123')).toBeNull();
  });
});

describe('permissões', () => {
  it('cliente não enxerga pedidos de terceiros nem administra nada', () => {
    expect(can('cliente', 'orders:read:own')).toBe(true);
    expect(can('cliente', 'orders:read:all')).toBe(false);
    expect(can('cliente', 'services:manage')).toBe(false);
    expect(can('cliente', 'users:manage')).toBe(false);
    expect(can('cliente', 'files:read:all')).toBe(false);
  });

  it('produção não mexe em orçamento nem em conteúdo do site', () => {
    expect(can('producao', 'orders:advance:production')).toBe(true);
    expect(can('producao', 'quotes:manage')).toBe(false);
    expect(can('producao', 'content:edit')).toBe(false);
    expect(can('producao', 'clients:manage')).toBe(false);
  });

  it('atendimento cuida de orçamento e cliente, mas não do catálogo', () => {
    expect(can('atendimento', 'quotes:manage')).toBe(true);
    expect(can('atendimento', 'clients:manage')).toBe(true);
    expect(can('atendimento', 'services:manage')).toBe(false);
    expect(can('atendimento', 'users:manage')).toBe(false);
  });

  it('admin acumula as permissões dos demais perfis', () => {
    for (const p of [...permissionsFor('atendimento'), ...permissionsFor('producao')]) {
      expect(can('admin', p), `admin deveria ter ${p}`).toBe(true);
    }
    expect(can('admin', 'users:manage')).toBe(true);
    expect(can('admin', 'content:publish')).toBe(true);
  });

  it('separa equipe de cliente', () => {
    expect(isStaff('admin')).toBe(true);
    expect(isStaff('atendimento')).toBe(true);
    expect(isStaff('producao')).toBe(true);
    expect(isStaff('cliente')).toBe(false);
  });
});

describe('cadastro', () => {
  it('cria usuário e perfil de cliente juntos', async () => {
    const r = await registerClient(db.sql, CADASTRO);
    expect(r.userId).toBeTruthy();
    expect(r.clientId).toBeTruthy();

    const { rows } = await db.sql.query<{ email: string; role: string; cro_uf: string }>(
      `SELECT u.email, u.role, c.cro_uf FROM users u JOIN clients c ON c.user_id = u.id WHERE u.id = $1`,
      [r.userId],
    );
    expect(rows[0].email).toBe('ana@clinica.com.br');
    expect(rows[0].role).toBe('cliente');
    expect(rows[0].cro_uf).toBe('MG');
  });

  it('normaliza o e-mail para minúsculas', async () => {
    const r = await registerClient(db.sql, { ...CADASTRO, email: '  ANA@Clinica.COM.BR ' });
    const { rows } = await db.sql.query<{ email: string }>('SELECT email FROM users WHERE id = $1', [r.userId]);
    expect(rows[0].email).toBe('ana@clinica.com.br');
  });

  it('recusa e-mail já cadastrado', async () => {
    await registerClient(db.sql, CADASTRO);
    await expect(registerClient(db.sql, CADASTRO)).rejects.toMatchObject({ code: 'email_em_uso', status: 409 });
  });

  it('recusa senha fraca e e-mail inválido', async () => {
    await expect(registerClient(db.sql, { ...CADASTRO, password: '123' })).rejects.toMatchObject({
      code: 'senha_fraca',
    });
    await expect(registerClient(db.sql, { ...CADASTRO, email: 'sem-arroba' })).rejects.toMatchObject({
      code: 'email_invalido',
    });
  });

  it('não deixa usuário órfão quando a transação falha', async () => {
    await registerClient(db.sql, CADASTRO);
    await registerClient(db.sql, { ...CADASTRO, email: 'outro@c.com' }).catch(() => undefined);
    await expect(registerClient(db.sql, CADASTRO)).rejects.toThrow();

    const { rows } = await db.sql.query<{ n: string }>(
      `SELECT count(*) AS n FROM users u LEFT JOIN clients c ON c.user_id = u.id WHERE c.id IS NULL`,
    );
    expect(Number(rows[0].n)).toBe(0);
  });

  it('respeita a configuração de aprovação manual', async () => {
    await setSetting(db.sql, 'clientes.aprovacao_manual', true, null);
    const r = await registerClient(db.sql, { ...CADASTRO, email: 'pendente@c.com' });
    expect(r.status).toBe('pendente');
  });
});

describe('login', () => {
  it('autentica e devolve um token de sessão', async () => {
    await registerClient(db.sql, CADASTRO);
    const r = await login(db.sql, CADASTRO.email, CADASTRO.password);
    expect(r.token).toBeTruthy();
    expect(r.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('dá a mesma resposta para conta inexistente e senha errada', async () => {
    await registerClient(db.sql, CADASTRO);
    const inexistente = await login(db.sql, 'ninguem@c.com', 'qualquerSenha1').catch((e) => e as AppError);
    const senhaErrada = await login(db.sql, CADASTRO.email, 'senhaErrada123').catch((e) => e as AppError);

    expect(inexistente.message).toBe(senhaErrada.message);
    expect(inexistente.status).toBe(senhaErrada.status);
  });

  it('bloqueia a conta após tentativas repetidas', async () => {
    await registerClient(db.sql, CADASTRO);
    for (let i = 0; i < MAX_ATTEMPTS_PER_IDENTIFIER; i += 1) {
      await login(db.sql, CADASTRO.email, 'senhaErrada123').catch(() => undefined);
    }
    // Mesmo com a senha certa, segue bloqueado dentro da janela.
    await expect(login(db.sql, CADASTRO.email, CADASTRO.password)).rejects.toMatchObject({
      status: 429,
      code: 'muitas_tentativas',
    });
  });

  it('recusa conta pendente de aprovação', async () => {
    await setSetting(db.sql, 'clientes.aprovacao_manual', true, null);
    await registerClient(db.sql, { ...CADASTRO, email: 'pend@c.com' });
    await expect(login(db.sql, 'pend@c.com', CADASTRO.password)).rejects.toMatchObject({ status: 401 });
  });

  it('recusa conta suspensa', async () => {
    const r = await registerClient(db.sql, CADASTRO);
    await db.sql.query("UPDATE users SET status = 'suspenso' WHERE id = $1", [r.userId]);
    await expect(login(db.sql, CADASTRO.email, CADASTRO.password)).rejects.toMatchObject({ status: 401 });
  });
});

describe('sessões', () => {
  it('resolve o usuário a partir do token', async () => {
    const reg = await registerClient(db.sql, CADASTRO);
    const { token } = await login(db.sql, CADASTRO.email, CADASTRO.password);

    const sessao = await resolveSession(db.sql, token);
    expect(sessao?.userId).toBe(reg.userId);
    expect(sessao?.clientId).toBe(reg.clientId);
    expect(sessao?.role).toBe('cliente');
  });

  it('não guarda o token em claro no banco', async () => {
    await registerClient(db.sql, CADASTRO);
    const { token } = await login(db.sql, CADASTRO.email, CADASTRO.password);
    const { rows } = await db.sql.query<{ n: string }>(
      'SELECT count(*) AS n FROM sessions WHERE token_hash = $1', [token],
    );
    expect(Number(rows[0].n)).toBe(0);
  });

  it('recusa token inválido, revogado ou expirado', async () => {
    const reg = await registerClient(db.sql, CADASTRO);
    expect(await resolveSession(db.sql, 'token-falso')).toBeNull();
    expect(await resolveSession(db.sql, undefined)).toBeNull();

    const { token } = await login(db.sql, CADASTRO.email, CADASTRO.password);
    await revokeSession(db.sql, token);
    expect(await resolveSession(db.sql, token)).toBeNull();

    const expirada = await createSession(db.sql, reg.userId);
    await db.sql.query("UPDATE sessions SET expires_at = now() - interval '1 hour' WHERE user_id = $1", [reg.userId]);
    expect(await resolveSession(db.sql, expirada.token)).toBeNull();
  });

  it('derruba a sessão quando a conta é suspensa', async () => {
    const reg = await registerClient(db.sql, CADASTRO);
    const { token } = await login(db.sql, CADASTRO.email, CADASTRO.password);
    await db.sql.query("UPDATE users SET status = 'suspenso' WHERE id = $1", [reg.userId]);
    expect(await resolveSession(db.sql, token)).toBeNull();
  });

  it('revoga todas as sessões de uma vez', async () => {
    const reg = await registerClient(db.sql, CADASTRO);
    const a = await createSession(db.sql, reg.userId);
    const b = await createSession(db.sql, reg.userId);
    await revokeAllSessions(db.sql, reg.userId);
    expect(await resolveSession(db.sql, a.token)).toBeNull();
    expect(await resolveSession(db.sql, b.token)).toBeNull();
  });
});

describe('recuperação de senha', () => {
  it('troca a senha e encerra as sessões abertas', async () => {
    await registerClient(db.sql, CADASTRO);
    const sessaoAntiga = await login(db.sql, CADASTRO.email, CADASTRO.password);

    const token = await requestPasswordReset(db.sql, CADASTRO.email);
    expect(token).toBeTruthy();

    await resetPassword(db.sql, token as string, 'novaSenhaForte456');

    expect(await resolveSession(db.sql, sessaoAntiga.token)).toBeNull();
    await expect(login(db.sql, CADASTRO.email, CADASTRO.password)).rejects.toThrow();
    await expect(login(db.sql, CADASTRO.email, 'novaSenhaForte456')).resolves.toMatchObject({ role: 'cliente' });
  });

  it('não revela se o e-mail existe', async () => {
    expect(await requestPasswordReset(db.sql, 'ninguem@c.com')).toBeNull();
  });

  it('recusa token usado, inválido ou expirado', async () => {
    await registerClient(db.sql, CADASTRO);
    const token = (await requestPasswordReset(db.sql, CADASTRO.email)) as string;

    await resetPassword(db.sql, token, 'novaSenhaForte456');
    await expect(resetPassword(db.sql, token, 'outraSenhaForte789')).rejects.toMatchObject({
      code: 'token_invalido',
    });
    await expect(resetPassword(db.sql, 'inexistente', 'outraSenhaForte789')).rejects.toMatchObject({
      code: 'token_invalido',
    });

    const t2 = (await requestPasswordReset(db.sql, CADASTRO.email)) as string;
    await db.sql.query("UPDATE password_reset_tokens SET expires_at = now() - interval '1 hour' WHERE used_at IS NULL");
    await expect(resetPassword(db.sql, t2, 'outraSenhaForte789')).rejects.toMatchObject({ code: 'token_invalido' });
  });

  it('recusa senha nova fraca', async () => {
    await registerClient(db.sql, CADASTRO);
    const token = (await requestPasswordReset(db.sql, CADASTRO.email)) as string;
    await expect(resetPassword(db.sql, token, '123')).rejects.toMatchObject({ code: 'senha_fraca' });
  });
});

describe('auditoria', () => {
  it('registra o cadastro sem guardar a senha', async () => {
    await registerClient(db.sql, CADASTRO);
    const { rows } = await db.sql.query<{ action: string; after: Record<string, unknown> }>(
      "SELECT action, after FROM audit_log WHERE entity = 'users'",
    );
    expect(rows[0].action).toBe('cadastro');
    expect(JSON.stringify(rows[0].after)).not.toContain(CADASTRO.password);
  });
});
