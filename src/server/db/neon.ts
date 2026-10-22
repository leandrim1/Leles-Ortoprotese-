import { Pool } from '@neondatabase/serverless';
import type { Sql } from './client';
import { toDatabaseError } from './client';

/**
 * Implementação de `Sql` sobre o Neon.
 * O pool é reaproveitado entre invocações da mesma instância serverless.
 */
let pool: Pool | undefined;

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada. Veja .env.example.');
  }

  pool ??= new Pool({ connectionString });
  return pool;
}

function wrap(run: (text: string, params: readonly unknown[]) => Promise<{ rows: unknown[]; rowCount: number | null }>): Sql {
  return {
    async query(text, params = []) {
      try {
        const result = await run(text, params);
        return { rows: result.rows as never[], rowCount: result.rowCount ?? result.rows.length };
      } catch (error) {
        throw toDatabaseError(error);
      }
    },
    async transaction(fn) {
      // Transação exige uma conexão dedicada do pool.
      const client = await getPool().connect();
      try {
        await client.query('BEGIN');
        const tx = wrap((t, p) => client.query(t, p as unknown[]));
        const result = await fn(tx);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw toDatabaseError(error);
      } finally {
        client.release();
      }
    },
  };
}

export function neonSql(): Sql {
  return wrap((text, params) => getPool().query(text, params as unknown[]));
}
