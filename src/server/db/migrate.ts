import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Sql } from './client';

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), 'migrations');

export interface AppliedMigration {
  name: string;
  applied_at: Date;
}

/** Garante a tabela de controle antes de aplicar qualquer migration. */
async function ensureMigrationsTable(sql: Sql): Promise<void> {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

export async function listMigrationFiles(): Promise<string[]> {
  const entries = await readdir(MIGRATIONS_DIR);
  return entries.filter((f) => f.endsWith('.sql')).sort();
}

/**
 * Aplica as migrations pendentes em ordem.
 * Cada migration roda na sua própria transação: ou entra inteira, ou não entra.
 */
export async function migrate(sql: Sql, log: (msg: string) => void = () => {}): Promise<string[]> {
  await ensureMigrationsTable(sql);

  const { rows } = await sql.query<{ name: string }>('SELECT name FROM schema_migrations');
  const applied = new Set(rows.map((r) => r.name));
  const files = await listMigrationFiles();
  const executed: string[] = [];

  for (const file of files) {
    if (applied.has(file)) continue;

    const statements = await readFile(join(MIGRATIONS_DIR, file), 'utf8');

    await sql.transaction(async (tx) => {
      await tx.query(statements);
      await tx.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
    });

    executed.push(file);
    log(`aplicada: ${file}`);
  }

  return executed;
}
