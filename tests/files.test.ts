import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb, type TestDb } from './helpers/db';
import { makeService, makeUser } from './helpers/fixtures';
import { createLocalStorage } from '@/server/storage/local';
import { sanitizeFileName, sniffFileType } from '@/server/storage/fileTypes';
import { getFileDownloadUrl, listOrderFiles, uploadOrderFile } from '@/server/domain/files';
import { createOrder } from '@/server/domain/orders';
import { setSetting } from '@/server/domain/settings';
import type { SessionUser } from '@/server/auth/session';
import type { StorageAdapter } from '@/server/storage/types';

let db: TestDb;
let storage: StorageAdapter & { size: () => number };
let dentistaA: SessionUser;
let dentistaB: SessionUser;
let producao: SessionUser;
let pedidoA: string;

/** Monta um PNG mínimo válido (assinatura + IHDR). */
const png = () => Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.from([0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52]),
  Buffer.alloc(32, 1),
]);
const jpg = () => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(64, 2)]);
const pdf = () => Buffer.concat([Buffer.from('%PDF-1.7\n'), Buffer.alloc(64, 3)]);
const stlAscii = () => Buffer.from('solid peca\nfacet normal 0 0 1\nendfacet\nendsolid peca\n');
const stlBinario = () => {
  const triangulos = 2;
  const buf = Buffer.alloc(84 + triangulos * 50);
  buf.writeUInt32LE(triangulos, 80);
  return buf;
};
const ply = () => Buffer.from('ply\nformat ascii 1.0\nelement vertex 0\nend_header\n');

beforeEach(async () => {
  db = await createTestDb();
  storage = createLocalStorage();
  dentistaA = await makeUser(db.sql, 'cliente', 'a@c.com', 'Dra. A');
  dentistaB = await makeUser(db.sql, 'cliente', 'b@c.com', 'Dr. B');
  producao = await makeUser(db.sql, 'producao', 'pr@lab.com');
  const servicoId = await makeService(db.sql, 'impressao-3d');
  pedidoA = (await createOrder(db.sql, dentistaA, { serviceId: servicoId })).id;
});

afterEach(async () => {
  await db?.close();
});

describe('detecção do tipo real', () => {
  it('reconhece os formatos aceitos pelo conteúdo', () => {
    expect(sniffFileType(png(), 'x.png').kind).toBe('png');
    expect(sniffFileType(jpg(), 'x.jpg').kind).toBe('jpg');
    expect(sniffFileType(pdf(), 'x.pdf').kind).toBe('pdf');
    expect(sniffFileType(stlAscii(), 'x.stl').kind).toBe('stl');
    expect(sniffFileType(stlBinario(), 'x.stl').kind).toBe('stl');
    expect(sniffFileType(ply(), 'x.ply').kind).toBe('ply');
  });

  it('ignora a extensão e olha o conteúdo', () => {
    // Executável disfarçado de modelo 3D.
    const exe = Buffer.concat([Buffer.from([0x4d, 0x5a]), Buffer.alloc(200, 0)]);
    expect(sniffFileType(exe, 'modelo.stl').kind).toBeNull();

    // PNG com extensão errada continua sendo PNG.
    expect(sniffFileType(png(), 'arquivo.stl').kind).toBe('png');
  });

  it('recusa script, HTML e arquivo vazio', () => {
    expect(sniffFileType(Buffer.from('<?php system($_GET[0]); ?>'), 'x.pdf').kind).toBeNull();
    expect(sniffFileType(Buffer.from('<html><script>alert(1)</script>'), 'x.png').kind).toBeNull();
    expect(sniffFileType(Buffer.alloc(0), 'x.stl').kind).toBeNull();
  });

  it('limpa o nome do arquivo', () => {
    expect(sanitizeFileName('../../etc/passwd')).toBe('passwd');
    expect(sanitizeFileName('C:\\temp\\modelo.stl')).toBe('modelo.stl');
    expect(sanitizeFileName('açaí ôrtese.stl')).toBe('acai ortese.stl');
    expect(sanitizeFileName('<script>.png')).toBe('_script_.png');
  });
});

describe('envio de arquivo', () => {
  it('aceita um modelo e registra os metadados', async () => {
    const r = await uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'arcada.stl', content: stlAscii(),
    });
    expect(r.kind).toBe('stl');
    expect(storage.size()).toBe(1);

    const arquivos = await listOrderFiles(db.sql, dentistaA, pedidoA);
    expect(arquivos).toHaveLength(1);
  });

  it('guarda o arquivo como privado e com caminho não adivinhável', async () => {
    await uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'paciente-maria-silva.stl', content: stlAscii(),
    });
    const { rows } = await db.sql.query<{ visibility: string; blob_pathname: string; blob_url: string | null }>(
      'SELECT visibility, blob_pathname, blob_url FROM media',
    );
    expect(rows[0].visibility).toBe('privado');
    expect(rows[0].blob_url).toBeNull();
    // O caminho não carrega o nome do paciente.
    expect(rows[0].blob_pathname).not.toContain('maria');
    expect(rows[0].blob_pathname).toMatch(/^pedidos\/[0-9a-f-]+\/[0-9a-f-]+\.stl$/);
  });

  it('recusa tipo não suportado e arquivo vazio', async () => {
    await expect(uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'virus.exe', content: Buffer.from([0x4d, 0x5a, 0x90, 0x00]),
    })).rejects.toMatchObject({ code: 'tipo_nao_suportado' });

    await expect(uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'vazio.stl', content: Buffer.alloc(0),
    })).rejects.toMatchObject({ code: 'arquivo_vazio' });
  });

  it('respeita a lista de extensões do administrador', async () => {
    await setSetting(db.sql, 'uploads.extensoes_permitidas', ['stl'], null);
    await expect(uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'foto.png', content: png(),
    })).rejects.toMatchObject({ code: 'tipo_nao_permitido' });
    await expect(uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'm.stl', content: stlAscii(),
    })).resolves.toBeTruthy();
  });

  it('respeita o tamanho máximo e a quantidade', async () => {
    // Limite de 1 MB contra um PDF de 2 MB.
    await setSetting(db.sql, 'uploads.tamanho_maximo_mb', 1, null);
    const pdfGrande = Buffer.concat([Buffer.from('%PDF-1.7\n'), Buffer.alloc(2 * 1024 * 1024, 3)]);
    await expect(uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'g.pdf', content: pdfGrande,
    })).rejects.toMatchObject({ code: 'arquivo_grande' });

    await setSetting(db.sql, 'uploads.tamanho_maximo_mb', 100, null);
    await setSetting(db.sql, 'uploads.max_arquivos_por_pedido', 1, null);
    await uploadOrderFile(db.sql, storage, dentistaA, { orderId: pedidoA, fileName: 'a.stl', content: stlAscii() });
    await expect(uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'b.stl', content: stlAscii(),
    })).rejects.toMatchObject({ code: 'limite_de_arquivos' });
  });

  it('não deixa enviar arquivo para pedido de outro cliente', async () => {
    await expect(uploadOrderFile(db.sql, storage, dentistaB, {
      orderId: pedidoA, fileName: 'intruso.stl', content: stlAscii(),
    })).rejects.toMatchObject({ status: 404 });
    expect(storage.size()).toBe(0);
  });
});

describe('acesso ao arquivo', () => {
  it('o dono baixa o próprio arquivo por link de validade curta', async () => {
    const r = await uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'arcada.stl', content: stlAscii(),
    });
    const link = await getFileDownloadUrl(db.sql, storage, dentistaA, r.mediaId);
    expect(link.url).toContain('exp=');
    expect(link.expiresInSeconds).toBeLessThanOrEqual(300);
  });

  it('outro cliente não baixa nem descobre que o arquivo existe', async () => {
    const r = await uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'arcada.stl', content: stlAscii(),
    });

    const erro = await getFileDownloadUrl(db.sql, storage, dentistaB, r.mediaId).catch((e) => e);
    expect(erro.status).toBe(404);

    const inexistente = await getFileDownloadUrl(
      db.sql, storage, dentistaB, '00000000-0000-0000-0000-000000000000',
    ).catch((e) => e);
    expect(erro.message).toBe(inexistente.message);
  });

  it('a produção acessa arquivo técnico de qualquer pedido', async () => {
    const r = await uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'arcada.stl', content: stlAscii(),
    });
    await expect(getFileDownloadUrl(db.sql, storage, producao, r.mediaId)).resolves.toMatchObject({
      displayName: 'arcada.stl',
    });
  });

  it('outro cliente não lista os arquivos do pedido alheio', async () => {
    await uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'arcada.stl', content: stlAscii(),
    });
    await expect(listOrderFiles(db.sql, dentistaB, pedidoA)).rejects.toMatchObject({ status: 404 });
  });

  it('registra o acesso na auditoria sem guardar o nome do arquivo', async () => {
    const r = await uploadOrderFile(db.sql, storage, dentistaA, {
      orderId: pedidoA, fileName: 'paciente-joao.stl', content: stlAscii(),
    });
    await getFileDownloadUrl(db.sql, storage, producao, r.mediaId);

    const { rows } = await db.sql.query<{ action: string }>(
      "SELECT action FROM audit_log WHERE action = 'arquivo_acessado'",
    );
    expect(rows).toHaveLength(1);

    const todos = await db.sql.query<{ n: string }>(
      "SELECT count(*) AS n FROM audit_log WHERE after::text ILIKE '%joao%'",
    );
    expect(Number(todos.rows[0].n)).toBe(0);
  });
});
