import { PGlite } from '@electric-sql/pglite';
import type { Sql } from '@/server/db/client';
import { toDatabaseError } from '@/server/db/client';
import { migrate } from '@/server/db/migrate';

/**
 * Banco de testes: PostgreSQL real em WASM, em memória, isolado por teste.
 * Usa exatamente as mesmas migrations que vão para o Neon.
 */
function wrap(pg: PGlite, inTransaction = false): Sql {
  const self: Sql = {
    async query(text, params = []) {
      try {
        // Sem parâmetros o texto pode trazer vários comandos (DDL das
        // migrations), e aí só `exec` funciona. Com parâmetros, `query`.
        if (params.length === 0) {
          const results = await pg.exec(text);
          const last = results.at(-1);
          return {
            rows: (last?.rows ?? []) as never[],
            rowCount: last?.affectedRows ?? last?.rows.length ?? 0,
          };
        }

        const result = await pg.query(text, params as unknown[]);
        return { rows: result.rows as never[], rowCount: result.affectedRows ?? result.rows.length };
      } catch (error) {
        throw toDatabaseError(error);
      }
    },
    async transaction(fn) {
      // PGlite não aninha transações; reaproveita a corrente quando já aberta.
      if (inTransaction) return fn(self);

      await pg.exec('BEGIN');
      try {
        const result = await fn(wrap(pg, true));
        await pg.exec('COMMIT');
        return result;
      } catch (error) {
        await pg.exec('ROLLBACK').catch(() => undefined);
        throw toDatabaseError(error);
      }
    },
  };
  return self;
}

export interface TestDb {
  sql: Sql;
  close: () => Promise<void>;
}

export async function createTestDb(): Promise<TestDb> {
  const pg = new PGlite();
  const sql = wrap(pg);
  await migrate(sql);
  return { sql, close: () => pg.close() };
}
