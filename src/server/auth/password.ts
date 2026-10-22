import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from 'node:crypto';
import { promisify } from 'node:util';

// promisify escolhe a sobrecarga de 3 argumentos; aqui precisamos das opções.
const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;

/**
 * Hash de senha com scrypt (função de derivação recomendada pelo OWASP).
 * Escolhido no lugar de argon2/bcrypt por vir no próprio Node: não exige
 * compilação nativa, o que quebraria no ambiente serverless da Vercel.
 */
const N = 16384; // custo de CPU/memória
const r = 8;
const p = 1;
const KEY_LEN = 64;
const SALT_LEN = 16;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LEN);
  const derived = await scrypt(password.normalize('NFKC'), salt, KEY_LEN, { N, r, p });
  return ['scrypt', N, r, p, salt.toString('base64'), derived.toString('base64')].join('$');
}

/** Compara em tempo constante. Retorna false para qualquer formato inesperado. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, nRaw, rRaw, pRaw, saltB64, hashB64] = parts;
  const params = { N: Number(nRaw), r: Number(rRaw), p: Number(pRaw) };
  if (!Number.isInteger(params.N) || !Number.isInteger(params.r) || !Number.isInteger(params.p)) return false;

  const expected = Buffer.from(hashB64, 'base64');
  const derived = await scrypt(password.normalize('NFKC'), Buffer.from(saltB64, 'base64'), expected.length, {
    ...params,
    maxmem: 256 * 1024 * 1024,
  });

  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

/** Regras mínimas de senha, validadas no servidor. */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 10) return 'A senha precisa ter ao menos 10 caracteres.';
  if (password.length > 200) return 'A senha é longa demais.';
  if (!/[a-zA-Z]/.test(password)) return 'A senha precisa ter ao menos uma letra.';
  if (!/[0-9]/.test(password)) return 'A senha precisa ter ao menos um número.';
  return null;
}
