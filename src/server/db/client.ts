/**
 * Acesso ao banco.
 *
 * A aplicação depende apenas da interface `Sql`. Em produção ela é servida pelo
 * driver serverless do Neon; nos testes, por um PostgreSQL real rodando em WASM
 * (PGlite). O mesmo SQL roda nos dois, então o que é testado é o que vai ao ar.
 */

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

export interface Sql {
  query<T = Record<string, unknown>>(text: string, params?: readonly unknown[]): Promise<QueryResult<T>>;
  /** Executa `fn` dentro de uma transação, revertendo tudo em caso de erro. */
  transaction<T>(fn: (tx: Sql) => Promise<T>): Promise<T>;
}

/** Erro de banco já traduzido, sem expor SQL nem dados ao cliente. */
export class DatabaseError extends Error {
  constructor(
    message: string,
    readonly code?: string,
    readonly constraint?: string,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

interface PgLikeError {
  code?: string;
  constraint?: string;
  message?: string;
}

/** Normaliza erros do driver, preservando apenas código e constraint. */
export function toDatabaseError(error: unknown): DatabaseError {
  const pg = error as PgLikeError;
  return new DatabaseError(pg?.message ?? 'Falha ao acessar o banco de dados', pg?.code, pg?.constraint);
}

/** Violação de unicidade (23505), usada para traduzir conflitos de cadastro. */
export function isUniqueViolation(error: unknown, constraint?: string): boolean {
  const pg = error as PgLikeError;
  if (pg?.code !== '23505') return false;
  return constraint ? pg.constraint === constraint : true;
}
