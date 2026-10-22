import { createHash } from 'node:crypto';
import type { StorageAdapter, StoredObject } from './types';

/** Adaptador em memória usado nos testes, com a mesma interface do Blob. */
export function createLocalStorage(): StorageAdapter & { size: () => number } {
  const objects = new Map<string, { data: Buffer; contentType: string; public: boolean }>();

  return {
    async put(pathname, data, options): Promise<StoredObject> {
      objects.set(pathname, { data, contentType: options.contentType, public: options.public });
      return {
        pathname,
        url: options.public ? `https://local.test/public/${pathname}` : '',
        size: data.length,
        contentType: options.contentType,
      };
    },
    async signedUrl(pathname, expiresInSeconds) {
      if (!objects.has(pathname)) throw new Error('Objeto não encontrado');
      const exp = Date.now() + expiresInSeconds * 1000;
      const sig = createHash('sha256').update(`${pathname}:${exp}`).digest('hex').slice(0, 16);
      return `https://local.test/signed/${pathname}?exp=${exp}&sig=${sig}`;
    },
    async delete(pathname) {
      objects.delete(pathname);
    },
    async get(pathname) {
      return objects.get(pathname)?.data ?? null;
    },
    size: () => objects.size,
  };
}
