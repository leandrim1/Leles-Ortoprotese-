import type { Sql } from '@/server/db/client';
import type { UserRole } from './rbac';
import { generateToken, hashToken } from './tokens';

export const SESSION_TTL_HOURS = 12;
export const SESSION_COOKIE = 'll_session';

export interface SessionUser {
  userId: string;
  sessionId: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'pendente' | 'ativo' | 'suspenso';
  /** Presente apenas para usuários com perfil de cliente. */
  clientId: string | null;
}

/** Cria a sessão e devolve o token em claro, que só existe aqui e no cookie. */
export async function createSession(
  sql: Sql,
  userId: string,
  meta: { ip?: string; userAgent?: string } = {},
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 3600_000);

  await sql.query(
    `INSERT INTO sessions (user_id, token_hash, expires_at, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, hashToken(token), expiresAt, meta.ip ?? null, meta.userAgent?.slice(0, 500) ?? null],
  );

  return { token, expiresAt };
}

/**
 * Resolve o usuário a partir do token. Devolve null para sessão inexistente,
 * expirada, revogada ou de conta que não está ativa.
 */
export async function resolveSession(sql: Sql, token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;

  const { rows } = await sql.query<{
    session_id: string;
    user_id: string;
    email: string;
    name: string;
    role: UserRole;
    status: SessionUser['status'];
    client_id: string | null;
  }>(
    `SELECT s.id AS session_id, u.id AS user_id, u.email, u.name, u.role, u.status, c.id AS client_id
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN clients c ON c.user_id = u.id AND c.deleted_at IS NULL
      WHERE s.token_hash = $1
        AND s.revoked_at IS NULL
        AND s.expires_at > now()
        AND u.deleted_at IS NULL`,
    [hashToken(token)],
  );

  const row = rows[0];
  if (!row || row.status !== 'ativo') return null;

  // Marca atividade sem bloquear a resposta em caso de falha.
  await sql
    .query('UPDATE sessions SET last_seen_at = now() WHERE id = $1', [row.session_id])
    .catch(() => undefined);

  return {
    userId: row.user_id,
    sessionId: row.session_id,
    email: row.email,
    name: row.name,
    role: row.role,
    status: row.status,
    clientId: row.client_id,
  };
}

export async function revokeSession(sql: Sql, token: string): Promise<void> {
  await sql.query('UPDATE sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL', [
    hashToken(token),
  ]);
}

/** Encerra todas as sessões do usuário (troca de senha, suspensão de conta). */
export async function revokeAllSessions(sql: Sql, userId: string): Promise<number> {
  const { rowCount } = await sql.query(
    'UPDATE sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL',
    [userId],
  );
  return rowCount;
}

/** Monta o cookie de sessão com as flags de segurança. */
export function sessionCookie(token: string, expiresAt: Date, secure = true): string {
  return [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    secure ? 'Secure' : '',
    `Expires=${expiresAt.toUTCString()}`,
  ]
    .filter(Boolean)
    .join('; ');
}

export function clearSessionCookie(secure = true): string {
  return [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', secure ? 'Secure' : '', 'Max-Age=0']
    .filter(Boolean)
    .join('; ');
}
