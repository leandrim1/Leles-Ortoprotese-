/** Contrato de armazenamento. Produção usa Vercel Blob; testes, um adaptador em memória. */
export interface StoredObject {
  pathname: string;
  url: string;
  size: number;
  contentType: string;
}

export interface StorageAdapter {
  put(pathname: string, data: Buffer, options: { contentType: string; public: boolean }): Promise<StoredObject>;
  /** URL de leitura com validade curta. Para objetos privados, nunca permanente. */
  signedUrl(pathname: string, expiresInSeconds: number): Promise<string>;
  delete(pathname: string): Promise<void>;
  get(pathname: string): Promise<Buffer | null>;
}
