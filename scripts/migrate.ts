/**
 * Aplica as migrations pendentes no banco apontado por DATABASE_URL.
 * Uso: npm run db:migrate
 */
import { neonSql } from '../src/server/db/neon';
import { migrate } from '../src/server/db/migrate';

const sql = neonSql();
const aplicadas = await migrate(sql, (msg) => console.log(msg));

console.log(
  aplicadas.length === 0
    ? 'Banco já estava atualizado.'
    : `${aplicadas.length} migration(s) aplicada(s).`,
);
