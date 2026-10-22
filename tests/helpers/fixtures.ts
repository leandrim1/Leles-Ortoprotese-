import type { Sql } from '@/server/db/client';
import type { SessionUser } from '@/server/auth/session';
import type { UserRole } from '@/server/auth/rbac';
import { hashPassword } from '@/server/auth/password';

/** Cria um usuário ativo e, para clientes, o perfil correspondente. */
export async function makeUser(
  sql: Sql,
  role: UserRole,
  email: string,
  name = 'Usuário',
): Promise<SessionUser> {
  const hash = await hashPassword('senhaSegura123');
  const user = await sql.query<{ id: string }>(
    `INSERT INTO users (email, password_hash, name, role, status)
     VALUES ($1, $2, $3, $4, 'ativo') RETURNING id`,
    [email, hash, name, role],
  );
  const userId = user.rows[0].id;

  let clientId: string | null = null;
  if (role === 'cliente') {
    const client = await sql.query<{ id: string }>(
      'INSERT INTO clients (user_id) VALUES ($1) RETURNING id',
      [userId],
    );
    clientId = client.rows[0].id;
  }

  return { userId, sessionId: 'sessao-de-teste', email, name, role, status: 'ativo', clientId };
}

export async function makeService(
  sql: Sql,
  slug: string,
  options: { requiresQuote?: boolean; basePrice?: string; active?: boolean } = {},
): Promise<string> {
  const { rows } = await sql.query<{ id: string }>(
    `INSERT INTO services (slug, name, requires_quote, base_price, active)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [
      slug,
      slug,
      options.requiresQuote ?? true,
      options.basePrice ?? null,
      options.active ?? true,
    ],
  );
  return rows[0].id;
}
