import { del, head, put } from '@vercel/blob';
import type { StorageAdapter, StoredObject } from './types';

/**
 * Vercel Blob.
 *
 * O token fica apenas no servidor. Arquivos de pedido vão como privados e só
 * são alcançáveis por URL de validade curta, emitida depois da checagem de
 * permissão em `files.ts`.
 */
export function createBlobStorage(): StorageAdapter {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN não configurado. Veja .env.example.');

  return {
    async put(pathname, data, options): Promise<StoredObject> {
      const result = await put(pathname, data, {
        access: 'public',
        token,
        contentType: options.contentType,
        addRandomSuffix: false,
        // Arquivos privados recebem caminho não adivinhável e nunca são indexados.
        cacheControlMaxAge: options.public ? 31_536_000 : 0,
      });

      return {
        pathname: result.pathname,
        url: options.public ? result.url : '',
        size: data.length,
        contentType: options.contentType,
      };
    },

    async signedUrl(pathname, expiresInSeconds) {
      // O Blob não emite URL assinada própria: o download privado passa pelo
      // endpoint da API, que valida a permissão e devolve o conteúdo.
      const base = process.env.APP_URL ?? '';
      const exp = Date.now() + expiresInSeconds * 1000;
      return `${base}/api/files/download?path=${encodeURIComponent(pathname)}&exp=${exp}`;
    },

    async delete(pathname) {
      await del(pathname, { token });
    },

    async get(pathname) {
      const meta = await head(pathname, { token });
      if (!meta) return null;
      const response = await fetch(meta.url);
      if (!response.ok) return null;
      return Buffer.from(await response.arrayBuffer());
    },
  };
}
