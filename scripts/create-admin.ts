/**
 * Provisiona o primeiro administrador.
 *
 * Não existe senha fixa no código: ou você informa ADMIN_PASSWORD no ambiente,
 * ou o script gera uma senha forte e a imprime uma única vez.
 *
 * Uso: ADMIN_EMAIL=... ADMIN_NAME="..." npm run db:create-admin
 */
import { randomBytes } from 'node:crypto';
import { neonSql } from '../src/server/db/neon';
import { hashPassword, validatePasswordStrength } from '../src/server/auth/password';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const name = process.env.ADMIN_NAME?.trim();

if (!email || !name) {
  console.error('Defina ADMIN_EMAIL e ADMIN_NAME antes de rodar.');
  process.exit(1);
}

const sql = neonSql();

const existente = await sql.query('SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
if (existente.rows.length > 0) {
  console.error(`Já existe uma conta com ${email}.`);
  process.exit(1);
}

const senha = process.env.ADMIN_PASSWORD ?? randomBytes(18).toString('base64url');
const problema = validatePasswordStrength(senha);
if (problema) {
  console.error(`Senha recusada: ${problema}`);
  process.exit(1);
}

await sql.query(
  `INSERT INTO users (email, password_hash, name, role, status, email_verified_at)
   VALUES ($1, $2, $3, 'admin', 'ativo', now())`,
  [email, await hashPassword(senha), name],
);

console.log(`Administrador criado: ${email}`);
if (!process.env.ADMIN_PASSWORD) {
  console.log(`Senha gerada (anote agora, não será exibida de novo): ${senha}`);
}
