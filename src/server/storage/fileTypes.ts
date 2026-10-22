/**
 * Detecção do tipo real do arquivo pelo conteúdo.
 *
 * A extensão é informação do cliente e não vale como prova: um .stl pode ser
 * um executável renomeado. Aqui o conteúdo é inspecionado antes de aceitar.
 */
export type AllowedKind = 'stl' | 'obj' | 'ply' | 'jpg' | 'png' | 'pdf';

export interface SniffResult {
  kind: AllowedKind | null;
  mimeType: string | null;
}

const startsWith = (buf: Buffer, bytes: number[], offset = 0): boolean =>
  bytes.every((b, i) => buf[offset + i] === b);

const asText = (buf: Buffer, len = 256): string => buf.subarray(0, len).toString('latin1');

/** STL binário: cabeçalho de 80 bytes + contagem de triângulos de 50 bytes cada. */
function isBinaryStl(buf: Buffer): boolean {
  if (buf.length < 84) return false;
  const triangles = buf.readUInt32LE(80);
  return buf.length === 84 + triangles * 50;
}

function isAsciiStl(text: string): boolean {
  return /^\s*solid\b/i.test(text) && /\bfacet\b|\bendsolid\b/i.test(text);
}

function isObj(text: string): boolean {
  // OBJ é texto: comentários, vértices, normais ou faces nas primeiras linhas.
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return false;
  return lines.slice(0, 20).some((l) => /^(v|vn|vt|f|g|o|usemtl|mtllib)\s/.test(l.trim())) &&
    lines.slice(0, 20).every((l) => /^(#|v|vn|vt|f|g|o|s|usemtl|mtllib)\b/.test(l.trim()));
}

/**
 * Identifica o tipo real do arquivo.
 * Devolve `kind: null` para qualquer coisa fora da lista permitida.
 */
export function sniffFileType(buf: Buffer, declaredName: string): SniffResult {
  if (buf.length === 0) return { kind: null, mimeType: null };

  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { kind: 'png', mimeType: 'image/png' };
  }
  if (startsWith(buf, [0xff, 0xd8, 0xff])) {
    return { kind: 'jpg', mimeType: 'image/jpeg' };
  }
  if (startsWith(buf, [0x25, 0x50, 0x44, 0x46, 0x2d])) {
    return { kind: 'pdf', mimeType: 'application/pdf' };
  }

  const text = asText(buf);

  if (/^ply\r?\n/.test(text)) {
    return { kind: 'ply', mimeType: 'application/octet-stream' };
  }

  // STL ASCII e binário compartilham a extensão, mas têm formatos distintos.
  if (isAsciiStl(text) || isBinaryStl(buf)) {
    return { kind: 'stl', mimeType: 'model/stl' };
  }

  // OBJ não tem assinatura; só é aceito quando a extensão também diz OBJ.
  if (declaredName.toLowerCase().endsWith('.obj') && isObj(text)) {
    return { kind: 'obj', mimeType: 'model/obj' };
  }

  return { kind: null, mimeType: null };
}

/** Remove caminho, acentos e caracteres de controle do nome enviado. */
export function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'arquivo';
  return base
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w.\- ]+/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'arquivo';
}
