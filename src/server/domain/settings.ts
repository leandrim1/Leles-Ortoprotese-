import type { Sql } from '@/server/db/client';

/** Chaves de configuração conhecidas, com seus valores padrão. */
export const SETTING_DEFAULTS = {
  'clientes.aprovacao_manual': true,
  'uploads.tamanho_maximo_mb': 100,
  'uploads.extensoes_permitidas': ['stl', 'obj', 'ply', 'jpg', 'jpeg', 'png', 'pdf'],
  'uploads.max_arquivos_por_pedido': 20,
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;

export async function getSetting<K extends SettingKey>(
  sql: Sql,
  key: K,
): Promise<(typeof SETTING_DEFAULTS)[K]> {
  const { rows } = await sql.query<{ value: unknown }>('SELECT value FROM site_settings WHERE key = $1', [key]);
  if (rows.length === 0) return SETTING_DEFAULTS[key];
  return rows[0].value as (typeof SETTING_DEFAULTS)[K];
}

export async function setSetting(
  sql: Sql,
  key: SettingKey,
  value: unknown,
  updatedBy: string | null,
): Promise<void> {
  await sql.query(
    `INSERT INTO site_settings (key, value, updated_by, updated_at)
     VALUES ($1, $2::jsonb, $3, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = now()`,
    [key, JSON.stringify(value), updatedBy],
  );
}
