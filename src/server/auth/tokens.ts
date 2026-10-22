import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Tokens opacos para sessão, recuperação de senha e verificação de e-mail.
 * O valor em claro só existe na resposta ao usuário; o banco guarda o hash.
 */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Comparação em tempo constante entre dois hashes hexadecimais. */
export function tokensMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
