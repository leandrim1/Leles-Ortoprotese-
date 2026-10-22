import type { Sql } from '@/server/db/client';
import { isUniqueViolation } from '@/server/db/client';
import { hashPassword, validatePasswordStrength, verifyPassword } from '@/server/auth/password';
import { generateToken, hashToken } from '@/server/auth/tokens';
import { createSession, revokeAllSessions } from '@/server/auth/session';
import {
  checkLoginRateLimit,
  clearFailedAttempts,
  recordLoginAttempt,
} from '@/server/auth/rateLimit';
import { badRequest, conflict, tooManyRequests, unauthorized } from '@/server/http/errors';
import { getSetting } from './settings';
import { recordAudit } from './audit';

export const PASSWORD_RESET_TTL_MINUTES = 60;

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  clinicName?: string;
  cro?: string;
  croUf?: string;
  taxId?: string;
}

export interface RegisterResult {
  userId: string;
  clientId: string;
  status: 'pendente' | 'ativo';
}

/**
 * Cadastra um dentista. Usuário e perfil de cliente nascem na mesma transação:
 * nunca fica um usuário sem perfil se algo falhar no meio.
 */
export async function registerClient(
  sql: Sql,
  input: RegisterInput,
  meta: { ip?: string } = {},
): Promise<RegisterResult> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  if (name.length < 3) throw badRequest('nome_invalido', 'Informe seu nome completo.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw badRequest('email_invalido', 'Informe um e-mail válido.');

  const passwordProblem = validatePasswordStrength(input.password);
  if (passwordProblem) throw badRequest('senha_fraca', passwordProblem);

  const requiresApproval = await getSetting(sql, 'clientes.aprovacao_manual');
  const status = requiresApproval ? 'pendente' : 'ativo';
  const passwordHash = await hashPassword(input.password);

  try {
    return await sql.transaction(async (tx) => {
      const user = await tx.query<{ id: string }>(
        `INSERT INTO users (email, password_hash, name, phone, role, status)
         VALUES ($1, $2, $3, $4, 'cliente', $5) RETURNING id`,
        [email, passwordHash, name, input.phone?.trim() || null, status],
      );
      const userId = user.rows[0].id;

      let clinicId: string | null = null;
      if (input.clinicName?.trim()) {
        const clinic = await tx.query<{ id: string }>(
          'INSERT INTO clinics (name) VALUES ($1) RETURNING id',
          [input.clinicName.trim()],
        );
        clinicId = clinic.rows[0].id;
      }

      const client = await tx.query<{ id: string }>(
        `INSERT INTO clients (user_id, clinic_id, cro, cro_uf, tax_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          userId,
          clinicId,
          input.cro?.trim() || null,
          input.croUf?.trim().toUpperCase() || null,
          input.taxId?.replace(/\D/g, '') || null,
        ],
      );

      await recordAudit(tx, {
        actorUserId: userId,
        action: 'cadastro',
        entity: 'users',
        entityId: userId,
        after: { email, status },
        ip: meta.ip,
      });

      return { userId, clientId: client.rows[0].id, status };
    });
  } catch (error) {
    if (isUniqueViolation(error, 'users_email_unique')) {
      throw conflict('email_em_uso', 'Já existe uma conta com este e-mail.');
    }
    throw error;
  }
}

export interface LoginResult {
  token: string;
  expiresAt: Date;
  userId: string;
  role: string;
}

/**
 * Autentica por e-mail e senha.
 *
 * A mesma mensagem é devolvida para e-mail inexistente e senha errada, e o
 * hash é sempre verificado, para não vazar quais contas existem nem pelo texto
 * nem pelo tempo de resposta.
 */
export async function login(
  sql: Sql,
  emailRaw: string,
  password: string,
  meta: { ip?: string; userAgent?: string } = {},
): Promise<LoginResult> {
  const email = emailRaw.trim().toLowerCase();

  const limit = await checkLoginRateLimit(sql, email, meta.ip);
  if (limit.blocked) {
    throw tooManyRequests(
      'Muitas tentativas de login. Aguarde alguns minutos e tente de novo.',
      limit.retryAfterSeconds,
    );
  }

  const { rows } = await sql.query<{
    id: string;
    password_hash: string;
    role: string;
    status: string;
  }>(
    `SELECT id, password_hash, role, status FROM users
      WHERE email = $1 AND deleted_at IS NULL`,
    [email],
  );

  const user = rows[0];
  // Hash descartável mantém o tempo de resposta parecido quando não há conta.
  const stored = user?.password_hash ?? '$scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAA';
  const valid = await verifyPassword(password, stored);

  if (!user || !valid) {
    await recordLoginAttempt(sql, email, meta.ip, false);
    throw unauthorized('E-mail ou senha incorretos.');
  }

  if (user.status === 'pendente') {
    await recordLoginAttempt(sql, email, meta.ip, false);
    throw unauthorized('Sua conta ainda está aguardando aprovação do laboratório.');
  }

  if (user.status === 'suspenso') {
    await recordLoginAttempt(sql, email, meta.ip, false);
    throw unauthorized('Esta conta está suspensa. Fale com o laboratório.');
  }

  await recordLoginAttempt(sql, email, meta.ip, true);
  await clearFailedAttempts(sql, email);

  const session = await createSession(sql, user.id, meta);
  await sql.query('UPDATE users SET last_login_at = now() WHERE id = $1', [user.id]);

  return { ...session, userId: user.id, role: user.role };
}

/**
 * Inicia a recuperação de senha.
 * Devolve o token apenas quando a conta existe; o endpoint responde sempre a
 * mesma coisa, para não revelar quais e-mails estão cadastrados.
 */
export async function requestPasswordReset(sql: Sql, emailRaw: string): Promise<string | null> {
  const email = emailRaw.trim().toLowerCase();
  const { rows } = await sql.query<{ id: string }>(
    'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email],
  );
  if (rows.length === 0) return null;

  const token = generateToken();
  await sql.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, now() + ($3 || ' minutes')::interval)`,
    [rows[0].id, hashToken(token), String(PASSWORD_RESET_TTL_MINUTES)],
  );

  return token;
}

/** Troca a senha e encerra todas as sessões abertas daquele usuário. */
export async function resetPassword(sql: Sql, token: string, newPassword: string): Promise<void> {
  const problem = validatePasswordStrength(newPassword);
  if (problem) throw badRequest('senha_fraca', problem);

  const passwordHash = await hashPassword(newPassword);

  await sql.transaction(async (tx) => {
    const { rows } = await tx.query<{ id: string; user_id: string }>(
      `SELECT id, user_id FROM password_reset_tokens
        WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
        FOR UPDATE`,
      [hashToken(token)],
    );

    const record = rows[0];
    if (!record) throw badRequest('token_invalido', 'Este link de recuperação é inválido ou expirou.');

    await tx.query('UPDATE password_reset_tokens SET used_at = now() WHERE id = $1', [record.id]);
    await tx.query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [
      passwordHash,
      record.user_id,
    ]);

    await revokeAllSessions(tx, record.user_id);
    await recordAudit(tx, {
      actorUserId: record.user_id,
      action: 'senha_redefinida',
      entity: 'users',
      entityId: record.user_id,
    });
  });
}
