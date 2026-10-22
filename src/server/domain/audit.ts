import type { Sql } from '@/server/db/client';

export interface AuditEntry {
  actorUserId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  ip?: string;
}

/** Campos que nunca devem ir para a auditoria. */
const REDACTED = new Set(['password', 'password_hash', 'token', 'token_hash', 'senha']);

function sanitize(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(sanitize);

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([k, v]) => [
      k,
      REDACTED.has(k.toLowerCase()) ? '[omitido]' : sanitize(v),
    ]),
  );
}

export async function recordAudit(sql: Sql, entry: AuditEntry): Promise<void> {
  await sql.query(
    `INSERT INTO audit_log (actor_user_id, action, entity, entity_id, before, after, ip)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7)`,
    [
      entry.actorUserId ?? null,
      entry.action,
      entry.entity,
      entry.entityId ?? null,
      entry.before === undefined ? null : JSON.stringify(sanitize(entry.before)),
      entry.after === undefined ? null : JSON.stringify(sanitize(entry.after)),
      entry.ip ?? null,
    ],
  );
}
