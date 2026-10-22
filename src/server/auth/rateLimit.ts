import type { Sql } from '@/server/db/client';

/**
 * Limite de tentativas de autenticação, contado no banco.
 * Vale por conta e por IP, para travar tanto o ataque dirigido a um usuário
 * quanto a varredura de senhas a partir de uma mesma origem.
 */
export const MAX_ATTEMPTS_PER_IDENTIFIER = 5;
export const MAX_ATTEMPTS_PER_IP = 20;
export const WINDOW_MINUTES = 15;

export interface RateLimitResult {
  blocked: boolean;
  retryAfterSeconds: number;
}

export async function recordLoginAttempt(
  sql: Sql,
  identifier: string,
  ip: string | undefined,
  succeeded: boolean,
): Promise<void> {
  await sql.query('INSERT INTO login_attempts (identifier, ip, succeeded) VALUES ($1, $2, $3)', [
    identifier.toLowerCase(),
    ip ?? null,
    succeeded,
  ]);
}

export async function checkLoginRateLimit(
  sql: Sql,
  identifier: string,
  ip: string | undefined,
): Promise<RateLimitResult> {
  const { rows } = await sql.query<{ by_identifier: string; by_ip: string }>(
    `SELECT
       count(*) FILTER (WHERE identifier = $1) AS by_identifier,
       count(*) FILTER (WHERE ip IS NOT NULL AND ip = $2) AS by_ip
     FROM login_attempts
     WHERE succeeded = false
       AND created_at > now() - ($3 || ' minutes')::interval`,
    [identifier.toLowerCase(), ip ?? null, String(WINDOW_MINUTES)],
  );

  const byIdentifier = Number(rows[0]?.by_identifier ?? 0);
  const byIp = Number(rows[0]?.by_ip ?? 0);
  const blocked = byIdentifier >= MAX_ATTEMPTS_PER_IDENTIFIER || byIp >= MAX_ATTEMPTS_PER_IP;

  return { blocked, retryAfterSeconds: blocked ? WINDOW_MINUTES * 60 : 0 };
}

/** Zera o bloqueio após autenticação bem-sucedida. */
export async function clearFailedAttempts(sql: Sql, identifier: string): Promise<void> {
  await sql.query('DELETE FROM login_attempts WHERE identifier = $1 AND succeeded = false', [
    identifier.toLowerCase(),
  ]);
}
