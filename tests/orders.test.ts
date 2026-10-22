import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestDb, type TestDb } from './helpers/db';
import { makeService, makeUser } from './helpers/fixtures';
import { changeOrderStatus, createOrder, getOrder, getOrderHistory, listOrders } from '@/server/domain/orders';
import { allowedTransitions, findTransition, isTerminal, ORDER_STATUS_LABELS } from '@/server/domain/orderStatus';
import type { SessionUser } from '@/server/auth/session';

let db: TestDb;
let dentistaA: SessionUser;
let dentistaB: SessionUser;
let atendimento: SessionUser;
let producao: SessionUser;
let admin: SessionUser;
let servicoId: string;

beforeEach(async () => {
  db = await createTestDb();
  dentistaA = await makeUser(db.sql, 'cliente', 'a@c.com', 'Dra. A');
  dentistaB = await makeUser(db.sql, 'cliente', 'b@c.com', 'Dr. B');
  atendimento = await makeUser(db.sql, 'atendimento', 'at@lab.com');
  producao = await makeUser(db.sql, 'producao', 'pr@lab.com');
  admin = await makeUser(db.sql, 'admin', 'ad@lab.com');
  servicoId = await makeService(db.sql, 'ortopedia');
});

afterEach(async () => {
  await db?.close();
});

describe('máquina de status', () => {
  it('não deixa pular etapas', () => {
    expect(findTransition('recebido', 'entregue')).toBeUndefined();
    expect(findTransition('recebido', 'em_producao')).toBeUndefined();
    expect(findTransition('recebido', 'em_analise')).toBeDefined();
  });

  it('marca entregue e cancelado como terminais', () => {
    expect(isTerminal('entregue')).toBe(true);
    expect(isTerminal('cancelado')).toBe(true);
    expect(isTerminal('recebido')).toBe(false);
  });

  it('exige permissão de produção para a bancada e comercial para o resto', () => {
    expect(findTransition('aprovado_para_producao', 'em_producao')?.permission).toBe('orders:advance:production');
    expect(findTransition('recebido', 'em_analise')?.permission).toBe('orders:advance:commercial');
  });

  it('tem rótulo para todos os status', () => {
    for (const status of Object.keys(ORDER_STATUS_LABELS)) {
      expect(ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]).toBeTruthy();
    }
  });

  it('permite retrabalho da revisão técnica de volta à produção', () => {
    expect(allowedTransitions('em_revisao_tecnica').map((t) => t.to)).toContain('em_producao');
  });
});

describe('criação de pedido', () => {
  it('cria com número sequencial e histórico inicial', async () => {
    const p1 = await createOrder(db.sql, dentistaA, { serviceId: servicoId, caseCode: 'CASO-1' });
    const p2 = await createOrder(db.sql, dentistaA, { serviceId: servicoId, caseCode: 'CASO-2' });

    const ano = new Date().getUTCFullYear();
    expect(p1.number).toBe(`LL-${ano}-0001`);
    expect(p2.number).toBe(`LL-${ano}-0002`);
    expect(p1.status).toBe('recebido');

    const historico = await getOrderHistory(db.sql, dentistaA, p1.id);
    expect(historico).toHaveLength(1);
  });

  it('não duplica pedido quando a mesma solicitação é reenviada', async () => {
    const chave = 'clique-duplo-123';
    const a = await createOrder(db.sql, dentistaA, { serviceId: servicoId, idempotencyKey: chave });
    const b = await createOrder(db.sql, dentistaA, { serviceId: servicoId, idempotencyKey: chave });

    expect(b.id).toBe(a.id);
    expect(b.number).toBe(a.number);

    const { rows } = await db.sql.query<{ n: string }>('SELECT count(*) AS n FROM orders');
    expect(Number(rows[0].n)).toBe(1);
  });

  it('usa o preço do catálogo e ignora o que vier do cliente', async () => {
    const comPreco = await makeService(db.sql, 'placa', { requiresQuote: false, basePrice: '250.00' });
    const pedido = await createOrder(db.sql, dentistaA, {
      serviceId: comPreco,
      // Campo malicioso: não existe na entrada, mas confirma que o preço vem do banco.
      ...({ price: '1.00' } as object),
    });
    const o = await getOrder(db.sql, dentistaA, pedido.id);
    expect(Number(o.price)).toBe(250);
  });

  it('deixa o preço nulo quando o serviço é sob orçamento', async () => {
    const pedido = await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    const o = await getOrder(db.sql, dentistaA, pedido.id);
    expect(o.price).toBeNull();
  });

  it('recusa serviço inativo ou inexistente', async () => {
    const inativo = await makeService(db.sql, 'inativo', { active: false });
    await expect(createOrder(db.sql, dentistaA, { serviceId: inativo })).rejects.toMatchObject({
      code: 'servico_inativo',
    });
    await expect(
      createOrder(db.sql, dentistaA, { serviceId: '00000000-0000-0000-0000-000000000000' }),
    ).rejects.toMatchObject({ status: 404 });
  });

  it('impede que a equipe crie pedido em nome próprio', async () => {
    await expect(createOrder(db.sql, atendimento, { serviceId: servicoId })).rejects.toMatchObject({ status: 403 });
    await expect(createOrder(db.sql, producao, { serviceId: servicoId })).rejects.toMatchObject({ status: 403 });
  });

  it('valida os campos técnicos configurados no serviço', async () => {
    await db.sql.query(
      `INSERT INTO service_fields (service_id, key, label, type, required) VALUES ($1,'arcada','Arcada','selecao',true)`,
      [servicoId],
    ).catch(() => undefined);
    await db.sql.query(
      `INSERT INTO service_fields (service_id, key, label, type, required, options)
       VALUES ($1,'arcada2','Arcada','selecao',true,'["superior","inferior"]'::jsonb)`,
      [servicoId],
    );

    await expect(createOrder(db.sql, dentistaA, { serviceId: servicoId })).rejects.toMatchObject({
      code: 'campo_obrigatorio',
    });
    await expect(
      createOrder(db.sql, dentistaA, { serviceId: servicoId, fieldValues: { arcada2: 'lateral' } }),
    ).rejects.toMatchObject({ code: 'campo_invalido' });
    await expect(
      createOrder(db.sql, dentistaA, { serviceId: servicoId, fieldValues: { arcada2: 'superior' } }),
    ).resolves.toBeTruthy();
  });
});

describe('isolamento entre clientes', () => {
  it('cada dentista só lista os próprios pedidos', async () => {
    await createOrder(db.sql, dentistaA, { serviceId: servicoId, caseCode: 'DE-A' });
    await createOrder(db.sql, dentistaB, { serviceId: servicoId, caseCode: 'DE-B' });

    const listaA = await listOrders(db.sql, dentistaA);
    const listaB = await listOrders(db.sql, dentistaB);

    expect(listaA).toHaveLength(1);
    expect(listaA[0].case_code).toBe('DE-A');
    expect(listaB).toHaveLength(1);
    expect(listaB[0].case_code).toBe('DE-B');
  });

  it('não abre o pedido de outro cliente nem revela que ele existe', async () => {
    const deA = await createOrder(db.sql, dentistaA, { serviceId: servicoId });

    const erro = await getOrder(db.sql, dentistaB, deA.id).catch((e) => e);
    expect(erro.status).toBe(404);
    // Mesma mensagem de um id inexistente: não confirma a existência do pedido.
    const inexistente = await getOrder(db.sql, dentistaB, '00000000-0000-0000-0000-000000000000').catch((e) => e);
    expect(erro.message).toBe(inexistente.message);
  });

  it('não deixa outro cliente mudar o status', async () => {
    const deA = await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    await expect(changeOrderStatus(db.sql, dentistaB, deA.id, 'em_analise')).rejects.toMatchObject({ status: 404 });
  });

  it('não deixa o próprio cliente mudar o status do seu pedido', async () => {
    const deA = await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    await expect(changeOrderStatus(db.sql, dentistaA, deA.id, 'em_analise')).rejects.toMatchObject({ status: 403 });
  });

  it('a equipe enxerga os pedidos de todos', async () => {
    await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    await createOrder(db.sql, dentistaB, { serviceId: servicoId });
    expect(await listOrders(db.sql, atendimento)).toHaveLength(2);
    expect(await listOrders(db.sql, admin)).toHaveLength(2);
  });

  it('filtra por cliente apenas para quem pode ver todos', async () => {
    await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    await createOrder(db.sql, dentistaB, { serviceId: servicoId });

    const soDeA = await listOrders(db.sql, atendimento, { clientId: dentistaA.clientId as string });
    expect(soDeA).toHaveLength(1);

    // Cliente tentando filtrar por outro cliente continua vendo só o que é seu.
    const tentativa = await listOrders(db.sql, dentistaB, { clientId: dentistaA.clientId as string });
    expect(tentativa).toHaveLength(1);
    expect(tentativa[0].case_code).toBeNull();
    const { rows } = await db.sql.query<{ client_id: string }>(
      'SELECT client_id FROM orders WHERE id = $1', [tentativa[0].id],
    );
    expect(rows[0].client_id).toBe(dentistaB.clientId);
  });
});

describe('transições de status', () => {
  it('registra autor, origem e destino no histórico', async () => {
    const pedido = await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    await changeOrderStatus(db.sql, atendimento, pedido.id, 'em_analise', { note: 'Conferindo o caso.' });

    const historico = await getOrderHistory(db.sql, atendimento, pedido.id);
    const ultima = historico.at(-1) as Record<string, unknown>;
    expect(ultima.from_status).toBe('recebido');
    expect(ultima.to_status).toBe('em_analise');
    expect(ultima.changed_by_name).toBe('Usuário');
  });

  it('recusa transição fora da máquina de estados', async () => {
    const pedido = await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    await expect(changeOrderStatus(db.sql, admin, pedido.id, 'entregue')).rejects.toMatchObject({
      code: 'transicao_invalida',
    });
  });

  it('produção não executa etapa comercial e vice-versa', async () => {
    const pedido = await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    // Produção não pode iniciar a análise.
    await expect(changeOrderStatus(db.sql, producao, pedido.id, 'em_analise')).rejects.toMatchObject({ status: 403 });

    await changeOrderStatus(db.sql, atendimento, pedido.id, 'em_analise');
    await changeOrderStatus(db.sql, atendimento, pedido.id, 'aprovado_para_producao');

    // Atendimento não toca na bancada.
    await expect(changeOrderStatus(db.sql, atendimento, pedido.id, 'em_producao')).rejects.toMatchObject({
      status: 403,
    });
    await expect(changeOrderStatus(db.sql, producao, pedido.id, 'em_producao')).resolves.toBeUndefined();
  });

  it('percorre o fluxo completo até a entrega', async () => {
    const pedido = await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    await changeOrderStatus(db.sql, atendimento, pedido.id, 'em_analise');
    await changeOrderStatus(db.sql, atendimento, pedido.id, 'aprovado_para_producao');
    await changeOrderStatus(db.sql, producao, pedido.id, 'em_producao');
    await changeOrderStatus(db.sql, producao, pedido.id, 'em_revisao_tecnica');
    await changeOrderStatus(db.sql, producao, pedido.id, 'pronto');
    await changeOrderStatus(db.sql, atendimento, pedido.id, 'enviado');
    await changeOrderStatus(db.sql, atendimento, pedido.id, 'entregue');

    const o = await getOrder(db.sql, dentistaA, pedido.id);
    expect(o.status).toBe('entregue');
    const { rows } = await db.sql.query<{ delivered_at: Date | null }>(
      'SELECT delivered_at FROM orders WHERE id = $1', [pedido.id],
    );
    expect(rows[0].delivered_at).not.toBeNull();
  });

  it('mantém o histórico após o cancelamento', async () => {
    const pedido = await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    await changeOrderStatus(db.sql, atendimento, pedido.id, 'cancelado', { note: 'Pedido duplicado.' });

    const historico = await getOrderHistory(db.sql, atendimento, pedido.id);
    expect(historico.length).toBeGreaterThanOrEqual(2);
    // Terminal: não avança mais.
    await expect(changeOrderStatus(db.sql, admin, pedido.id, 'em_analise')).rejects.toMatchObject({
      code: 'transicao_invalida',
    });
  });

  it('esconde do cliente as anotações internas', async () => {
    const pedido = await createOrder(db.sql, dentistaA, { serviceId: servicoId });
    await changeOrderStatus(db.sql, atendimento, pedido.id, 'em_analise', {
      note: 'Modelo com bolha, avisar o dentista.',
      internal: true,
    });

    const visaoCliente = await getOrderHistory(db.sql, dentistaA, pedido.id);
    expect(JSON.stringify(visaoCliente)).not.toContain('bolha');

    const visaoEquipe = await getOrderHistory(db.sql, atendimento, pedido.id);
    expect(JSON.stringify(visaoEquipe)).toContain('bolha');
  });
});
