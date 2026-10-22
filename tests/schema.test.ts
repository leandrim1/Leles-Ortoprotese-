import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestDb, type TestDb } from './helpers/db';
import { listMigrationFiles } from '@/server/db/migrate';

let db: TestDb;

beforeAll(async () => {
  db = await createTestDb();
});

afterAll(async () => {
  await db?.close();
});

describe('migrations', () => {
  it('aplica todas as migrations do diretório', async () => {
    const files = await listMigrationFiles();
    const { rows } = await db.sql.query<{ name: string }>('SELECT name FROM schema_migrations ORDER BY name');
    expect(rows.map((r) => r.name)).toEqual(files);
    expect(files.length).toBeGreaterThan(0);
  });

  it('cria todas as tabelas do domínio', async () => {
    const { rows } = await db.sql.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
    );
    const tabelas = rows.map((r) => r.table_name);

    for (const esperada of [
      'users', 'sessions', 'password_reset_tokens', 'login_attempts', 'audit_log',
      'clinics', 'clients', 'addresses', 'media',
      'service_categories', 'services', 'service_fields',
      'orders', 'order_files', 'order_status_history', 'order_messages',
      'quotes', 'quote_items',
      'site_settings', 'pages', 'page_sections', 'content_versions', 'gallery_items', 'business_hours',
      'notifications', 'notification_deliveries',
    ]) {
      expect(tabelas, `faltou a tabela ${esperada}`).toContain(esperada);
    }
  });

  it('é idempotente: rodar de novo não aplica nada', async () => {
    const { migrate } = await import('@/server/db/migrate');
    const executadas = await migrate(db.sql);
    expect(executadas).toEqual([]);
  });
});

describe('restrições de integridade', () => {
  it('recusa e-mail com maiúsculas', async () => {
    await expect(
      db.sql.query('INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)', [
        'Alguem@Exemplo.com', 'x', 'Alguém',
      ]),
    ).rejects.toThrow();
  });

  it('recusa e-mail sem formato válido', async () => {
    await expect(
      db.sql.query('INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)', [
        'sem-arroba', 'x', 'Alguém',
      ]),
    ).rejects.toThrow();
  });

  it('recusa serviço sem preço que não exija orçamento', async () => {
    await expect(
      db.sql.query(
        `INSERT INTO services (slug, name, requires_quote, base_price) VALUES ($1, $2, false, NULL)`,
        ['invalido', 'Inválido'],
      ),
    ).rejects.toThrow();
  });

  it('recusa campo de seleção sem opções', async () => {
    const { rows } = await db.sql.query<{ id: string }>(
      `INSERT INTO services (slug, name) VALUES ('s-teste', 'Teste') RETURNING id`,
    );
    await expect(
      db.sql.query(
        `INSERT INTO service_fields (service_id, key, label, type) VALUES ($1, 'k', 'K', 'selecao')`,
        [rows[0].id],
      ),
    ).rejects.toThrow();
  });

  it('calcula o total da linha do orçamento no banco', async () => {
    const svc = await db.sql.query<{ id: string }>(
      `INSERT INTO services (slug, name) VALUES ('s-orc', 'Orç') RETURNING id`,
    );
    const user = await db.sql.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, name) VALUES ('d@e.com','x','D') RETURNING id`,
    );
    const cli = await db.sql.query<{ id: string }>(
      `INSERT INTO clients (user_id) VALUES ($1) RETURNING id`, [user.rows[0].id],
    );
    const ord = await db.sql.query<{ id: string }>(
      `INSERT INTO orders (number, client_id, service_id) VALUES ('LL-TESTE-1', $1, $2) RETURNING id`,
      [cli.rows[0].id, svc.rows[0].id],
    );
    const q = await db.sql.query<{ id: string }>(
      `INSERT INTO quotes (order_id) VALUES ($1) RETURNING id`, [ord.rows[0].id],
    );
    const item = await db.sql.query<{ line_total: string }>(
      `INSERT INTO quote_items (quote_id, description, quantity, unit_price)
       VALUES ($1, 'Peça', 3, 150.50) RETURNING line_total`,
      [q.rows[0].id],
    );
    expect(Number(item.rows[0].line_total)).toBe(451.5);
  });

  it('permite apenas um orçamento aberto por pedido', async () => {
    const svc = await db.sql.query<{ id: string }>(
      `INSERT INTO services (slug, name) VALUES ('s-dup', 'Dup') RETURNING id`,
    );
    const user = await db.sql.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, name) VALUES ('d2@e.com','x','D2') RETURNING id`,
    );
    const cli = await db.sql.query<{ id: string }>(
      `INSERT INTO clients (user_id) VALUES ($1) RETURNING id`, [user.rows[0].id],
    );
    const ord = await db.sql.query<{ id: string }>(
      `INSERT INTO orders (number, client_id, service_id) VALUES ('LL-TESTE-2', $1, $2) RETURNING id`,
      [cli.rows[0].id, svc.rows[0].id],
    );
    await db.sql.query(`INSERT INTO quotes (order_id, version) VALUES ($1, 1)`, [ord.rows[0].id]);
    await expect(
      db.sql.query(`INSERT INTO quotes (order_id, version) VALUES ($1, 2)`, [ord.rows[0].id]),
    ).rejects.toThrow();
  });
});
