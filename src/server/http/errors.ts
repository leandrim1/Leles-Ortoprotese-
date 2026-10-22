/** Erro de aplicação com status HTTP e código estável para o front-end. */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const badRequest = (code: string, message: string, details?: Record<string, string>) =>
  new AppError(400, code, message, details);

export const unauthorized = (message = 'Faça login para continuar.') =>
  new AppError(401, 'nao_autenticado', message);

export const forbidden = (message = 'Você não tem permissão para esta ação.') =>
  new AppError(403, 'sem_permissao', message);

export const notFound = (message = 'Registro não encontrado.') => new AppError(404, 'nao_encontrado', message);

export const conflict = (code: string, message: string) => new AppError(409, code, message);

export const tooManyRequests = (message: string, retryAfterSeconds: number) =>
  new AppError(429, 'muitas_tentativas', message, { retryAfter: String(retryAfterSeconds) });
