import { createHash, randomUUID } from 'node:crypto';
import type { Sql } from '@/server/db/client';
import type { SessionUser } from '@/server/auth/session';
import { can } from '@/server/auth/rbac';
import { badRequest, forbidden, notFound } from '@/server/http/errors';
import type { StorageAdapter } from '@/server/storage/types';
import { sanitizeFileName, sniffFileType, type AllowedKind } from '@/server/storage/fileTypes';
import { getSetting } from './settings';
import { getOrder } from './orders';
import { recordAudit } from './audit';

/** Validade curta do link de download de arquivo privado. */
export const DOWNLOAD_URL_TTL_SECONDS = 300;

export interface UploadInput {
  orderId: string;
  fileName: string;
  content: Buffer;
}

export interface UploadResult {
  mediaId: string;
  kind: AllowedKind;
  sizeBytes: number;
}

/**
 * Recebe um anexo de pedido.
 *
 * A validação é toda no servidor: dono do pedido, tipo real pelo conteúdo,
 * tamanho, quantidade e extensão liberada pelo administrador. O arquivo só é
 * registrado no banco depois de gravado no armazenamento.
 */
export async function uploadOrderFile(
  sql: Sql,
  storage: StorageAdapter,
  user: SessionUser,
  input: UploadInput,
): Promise<UploadResult> {
  if (!can(user.role, 'files:upload:own')) throw forbidden();

  // getOrder já recusa pedido de outro cliente.
  const order = await getOrder(sql, user, input.orderId);

  const maxMb = await getSetting(sql, 'uploads.tamanho_maximo_mb');
  const allowed = await getSetting(sql, 'uploads.extensoes_permitidas');
  const maxFiles = await getSetting(sql, 'uploads.max_arquivos_por_pedido');

  if (input.content.length === 0) throw badRequest('arquivo_vazio', 'O arquivo está vazio.');
  if (input.content.length > maxMb * 1024 * 1024) {
    throw badRequest('arquivo_grande', `O arquivo passa do limite de ${maxMb} MB.`);
  }

  const { rows: counted } = await sql.query<{ n: string }>(
    'SELECT count(*) AS n FROM order_files WHERE order_id = $1 AND deleted_at IS NULL',
    [input.orderId],
  );
  if (Number(counted[0].n) >= maxFiles) {
    throw badRequest('limite_de_arquivos', `Este pedido já atingiu o limite de ${maxFiles} arquivos.`);
  }

  // O tipo vem do conteúdo, não da extensão informada.
  const sniffed = sniffFileType(input.content, input.fileName);
  if (!sniffed.kind) {
    throw badRequest('tipo_nao_suportado', 'Este tipo de arquivo não é aceito.');
  }

  // Fixa o tipo fora do closure, para o TypeScript manter a narrowing.
  const kind: AllowedKind = sniffed.kind;
  if (!(allowed as readonly string[]).includes(kind)) {
    throw badRequest('tipo_nao_permitido', `Arquivos ${kind.toUpperCase()} não estão liberados.`);
  }

  const displayName = sanitizeFileName(input.fileName);
  const checksum = createHash('sha256').update(input.content).digest('hex');
  // Caminho não adivinhável e sem dado pessoal: apenas ids opacos.
  const pathname = `pedidos/${order.id}/${randomUUID()}.${kind}`;

  const stored = await storage.put(pathname, input.content, {
    contentType: sniffed.mimeType ?? 'application/octet-stream',
    public: false,
  });

  return sql.transaction(async (tx) => {
    const media = await tx.query<{ id: string }>(
      `INSERT INTO media (visibility, blob_pathname, mime_type, size_bytes, checksum_sha256, display_name, uploaded_by)
       VALUES ('privado', $1, $2, $3, $4, $5, $6) RETURNING id`,
      [stored.pathname, sniffed.mimeType, input.content.length, checksum, displayName, user.userId],
    );

    const mediaId = media.rows[0].id;

    await tx.query(
      `INSERT INTO order_files (order_id, media_id, kind, uploaded_by)
       VALUES ($1, $2, $3, $4)`,
      [
        input.orderId,
        mediaId,
        kind === 'pdf' ? 'documento' : kind === 'jpg' || kind === 'png' ? 'foto' : 'escaneamento',
        user.userId,
      ],
    );

    await recordAudit(tx, {
      actorUserId: user.userId,
      action: 'arquivo_enviado',
      entity: 'order_files',
      entityId: mediaId,
      // Nome e checksum ficam fora do log: podem carregar dado do paciente.
      after: { order_id: input.orderId, kind, size: input.content.length },
    });

    return { mediaId, kind, sizeBytes: input.content.length };
  });
}

/**
 * Autoriza o acesso a um arquivo e devolve um link de validade curta.
 * Cliente só alcança arquivo de pedido seu; a equipe, qualquer um.
 */
export async function getFileDownloadUrl(
  sql: Sql,
  storage: StorageAdapter,
  user: SessionUser,
  mediaId: string,
): Promise<{ url: string; displayName: string; expiresInSeconds: number }> {
  const { rows } = await sql.query<{
    blob_pathname: string;
    display_name: string;
    visibility: string;
    order_id: string | null;
    client_id: string | null;
  }>(
    `SELECT m.blob_pathname, m.display_name, m.visibility, f.order_id, o.client_id
       FROM media m
       LEFT JOIN order_files f ON f.media_id = m.id AND f.deleted_at IS NULL
       LEFT JOIN orders o ON o.id = f.order_id
      WHERE m.id = $1 AND m.deleted_at IS NULL`,
    [mediaId],
  );

  const file = rows[0];
  if (!file) throw notFound('Arquivo não encontrado.');

  if (file.visibility === 'privado') {
    const canSeeAll = can(user.role, 'files:read:all');
    const isOwner = Boolean(user.clientId) && file.client_id === user.clientId;

    // Mesma resposta de inexistente: não confirma que o arquivo existe.
    if (!canSeeAll && !isOwner) throw notFound('Arquivo não encontrado.');
  }

  await recordAudit(sql, {
    actorUserId: user.userId,
    action: 'arquivo_acessado',
    entity: 'media',
    entityId: mediaId,
  });

  return {
    url: await storage.signedUrl(file.blob_pathname, DOWNLOAD_URL_TTL_SECONDS),
    displayName: file.display_name,
    expiresInSeconds: DOWNLOAD_URL_TTL_SECONDS,
  };
}

/** Lista os anexos de um pedido, respeitando a mesma regra de acesso. */
export async function listOrderFiles(sql: Sql, user: SessionUser, orderId: string) {
  await getOrder(sql, user, orderId);

  const { rows } = await sql.query(
    `SELECT m.id, m.display_name, m.mime_type, m.size_bytes, f.kind, f.created_at
       FROM order_files f
       JOIN media m ON m.id = f.media_id
      WHERE f.order_id = $1 AND f.deleted_at IS NULL AND m.deleted_at IS NULL
      ORDER BY f.created_at ASC`,
    [orderId],
  );

  return rows;
}
