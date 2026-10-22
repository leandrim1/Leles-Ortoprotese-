import type { Sql } from '@/server/db/client';
import { isUniqueViolation } from '@/server/db/client';
import type { SessionUser } from '@/server/auth/session';
import { can } from '@/server/auth/rbac';
import { badRequest, forbidden, notFound } from '@/server/http/errors';
import { findTransition, type OrderStatus } from './orderStatus';
import { recordAudit } from './audit';

export interface OrderSummary {
  id: string;
  number: string;
  status: OrderStatus;
  case_code: string | null;
  service_name: string;
  price: string | null;
  created_at: Date;
  due_date: string | null;
}

export interface CreateOrderInput {
  serviceId: string;
  caseCode?: string;
  fieldValues?: Record<string, unknown>;
  notes?: string;
  desiredDate?: string;
  /** Evita pedido duplicado quando o cliente reenvia a mesma solicitação. */
  idempotencyKey?: string;
}

/** Gera o número do pedido travando a linha do ano, para não repetir sob concorrência. */
async function nextOrderNumber(tx: Sql): Promise<string> {
  const year = new Date().getUTCFullYear();

  const { rows } = await tx.query<{ last_value: number }>(
    `INSERT INTO order_number_sequence (year, last_value) VALUES ($1, 1)
     ON CONFLICT (year) DO UPDATE SET last_value = order_number_sequence.last_value + 1
     RETURNING last_value`,
    [year],
  );

  return `LL-${year}-${String(rows[0].last_value).padStart(4, '0')}`;
}

/** Valida as respostas contra os campos técnicos configurados no serviço. */
async function validateFieldValues(
  sql: Sql,
  serviceId: string,
  values: Record<string, unknown>,
): Promise<void> {
  const { rows } = await sql.query<{ key: string; label: string; required: boolean; type: string; options: string[] | null }>(
    'SELECT key, label, required, type, options FROM service_fields WHERE service_id = $1',
    [serviceId],
  );

  for (const field of rows) {
    const value = values[field.key];
    const empty = value === undefined || value === null || value === '';

    if (field.required && empty) {
      throw badRequest('campo_obrigatorio', `Preencha o campo "${field.label}".`, { campo: field.key });
    }
    if (empty) continue;

    if (field.type === 'numero' && Number.isNaN(Number(value))) {
      throw badRequest('campo_invalido', `O campo "${field.label}" precisa ser um número.`, { campo: field.key });
    }
    if (field.type === 'selecao' && Array.isArray(field.options) && !field.options.includes(String(value))) {
      throw badRequest('campo_invalido', `Valor inválido para "${field.label}".`, { campo: field.key });
    }
  }
}

/**
 * Cria um pedido para o cliente autenticado.
 *
 * Tudo acontece numa transação: número, pedido e primeiro registro de
 * histórico entram juntos ou não entram.
 */
export async function createOrder(
  sql: Sql,
  user: SessionUser,
  input: CreateOrderInput,
): Promise<{ id: string; number: string; status: OrderStatus }> {
  if (!can(user.role, 'orders:create')) throw forbidden();
  if (!user.clientId) throw forbidden('Sua conta não tem perfil de cliente.');

  const service = await sql.query<{ id: string; active: boolean; requires_quote: boolean; base_price: string | null }>(
    'SELECT id, active, requires_quote, base_price FROM services WHERE id = $1 AND deleted_at IS NULL',
    [input.serviceId],
  );

  if (service.rows.length === 0) throw notFound('Serviço não encontrado.');
  if (!service.rows[0].active) throw badRequest('servico_inativo', 'Este serviço não está disponível.');

  const fieldValues = input.fieldValues ?? {};
  await validateFieldValues(sql, input.serviceId, fieldValues);

  // Preço vem do catálogo, nunca do cliente. Sob orçamento, fica nulo.
  const price = service.rows[0].requires_quote ? null : service.rows[0].base_price;

  try {
    return await sql.transaction(async (tx) => {
      const number = await nextOrderNumber(tx);

      const inserted = await tx.query<{ id: string; status: OrderStatus }>(
        `INSERT INTO orders (number, client_id, service_id, case_code, field_values, notes, desired_date, price, idempotency_key, created_by, submitted_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, now())
         RETURNING id, status`,
        [
          number,
          user.clientId,
          input.serviceId,
          input.caseCode?.trim() || null,
          JSON.stringify(fieldValues),
          input.notes?.trim() || null,
          input.desiredDate || null,
          price,
          input.idempotencyKey ?? null,
          user.userId,
        ],
      );

      const order = inserted.rows[0];

      await tx.query(
        `INSERT INTO order_status_history (order_id, from_status, to_status, changed_by, note)
         VALUES ($1, NULL, $2, $3, 'Pedido enviado pelo portal.')`,
        [order.id, order.status, user.userId],
      );

      await recordAudit(tx, {
        actorUserId: user.userId,
        action: 'pedido_criado',
        entity: 'orders',
        entityId: order.id,
        after: { number, service_id: input.serviceId },
      });

      return { id: order.id, number, status: order.status };
    });
  } catch (error) {
    // Reenvio da mesma solicitação devolve o pedido já criado.
    if (isUniqueViolation(error, 'orders_idempotency_unique') && input.idempotencyKey) {
      const { rows } = await sql.query<{ id: string; number: string; status: OrderStatus }>(
        'SELECT id, number, status FROM orders WHERE client_id = $1 AND idempotency_key = $2',
        [user.clientId, input.idempotencyKey],
      );
      if (rows[0]) return rows[0];
    }
    throw error;
  }
}

/**
 * Lista pedidos conforme o perfil.
 * Cliente vê apenas os seus; o filtro é aplicado no SQL, não na interface.
 */
export async function listOrders(
  sql: Sql,
  user: SessionUser,
  filters: { status?: OrderStatus; clientId?: string; search?: string; limit?: number } = {},
): Promise<OrderSummary[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (can(user.role, 'orders:read:all')) {
    if (filters.clientId) {
      params.push(filters.clientId);
      conditions.push(`o.client_id = $${params.length}`);
    }
  } else if (can(user.role, 'orders:read:own')) {
    if (!user.clientId) return [];
    params.push(user.clientId);
    conditions.push(`o.client_id = $${params.length}`);
  } else {
    throw forbidden();
  }

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`o.status = $${params.length}`);
  }

  if (filters.search?.trim()) {
    params.push(`%${filters.search.trim()}%`);
    conditions.push(`(o.number ILIKE $${params.length} OR o.case_code ILIKE $${params.length})`);
  }

  params.push(Math.min(filters.limit ?? 50, 200));

  const { rows } = await sql.query<OrderSummary>(
    `SELECT o.id, o.number, o.status, o.case_code, s.name AS service_name, o.price, o.created_at, o.due_date
       FROM orders o
       JOIN services s ON s.id = o.service_id
      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
      ORDER BY o.created_at DESC
      LIMIT $${params.length}`,
    params,
  );

  return rows;
}

/** Busca um pedido garantindo que o cliente só alcança o que é dele. */
export async function getOrder(sql: Sql, user: SessionUser, orderId: string) {
  const { rows } = await sql.query<{
    id: string;
    number: string;
    client_id: string;
    status: OrderStatus;
    case_code: string | null;
    field_values: Record<string, unknown>;
    notes: string | null;
    price: string | null;
    due_date: string | null;
    created_at: Date;
    service_name: string;
    client_name: string;
  }>(
    `SELECT o.*, s.name AS service_name, u.name AS client_name
       FROM orders o
       JOIN services s ON s.id = o.service_id
       JOIN clients c ON c.id = o.client_id
       JOIN users u ON u.id = c.user_id
      WHERE o.id = $1`,
    [orderId],
  );

  const order = rows[0];
  // Mesma resposta para "não existe" e "não é seu": não revela ids alheios.
  if (!order) throw notFound('Pedido não encontrado.');

  if (!can(user.role, 'orders:read:all')) {
    if (!user.clientId || order.client_id !== user.clientId) throw notFound('Pedido não encontrado.');
  }

  return order;
}

/** Linha do tempo do pedido; o cliente não vê as anotações internas. */
export async function getOrderHistory(sql: Sql, user: SessionUser, orderId: string) {
  await getOrder(sql, user, orderId);
  const seesInternal = can(user.role, 'messages:write:internal');

  const { rows } = await sql.query(
    `SELECT h.from_status, h.to_status, h.note, h.internal, h.created_at, u.name AS changed_by_name
       FROM order_status_history h
       LEFT JOIN users u ON u.id = h.changed_by
      WHERE h.order_id = $1 ${seesInternal ? '' : 'AND h.internal = false'}
      ORDER BY h.created_at ASC`,
    [orderId],
  );

  return rows;
}

/**
 * Muda o status respeitando a máquina de transições e a permissão do perfil.
 * Toda mudança grava histórico com autor, origem e destino.
 */
export async function changeOrderStatus(
  sql: Sql,
  user: SessionUser,
  orderId: string,
  to: OrderStatus,
  options: { note?: string; internal?: boolean } = {},
): Promise<void> {
  const order = await getOrder(sql, user, orderId);

  const transition = findTransition(order.status, to);
  if (!transition) {
    throw badRequest(
      'transicao_invalida',
      `Não é possível mudar de "${order.status}" para "${to}".`,
    );
  }

  if (!can(user.role, transition.permission)) throw forbidden();

  await sql.transaction(async (tx) => {
    // Recarrega com trava: impede duas transições concorrentes a partir do mesmo estado.
    const current = await tx.query<{ status: OrderStatus }>(
      'SELECT status FROM orders WHERE id = $1 FOR UPDATE',
      [orderId],
    );

    if (current.rows[0].status !== order.status) {
      throw badRequest('conflito_de_status', 'O pedido mudou de status enquanto você trabalhava nele.');
    }

    await tx.query(
      // O cast é necessário: sem ele o Postgres deduz tipos diferentes para $1
      // ao usá-lo como enum na atribuição e como texto na comparação.
      `UPDATE orders SET status = $1::order_status, updated_at = now(),
         delivered_at = CASE WHEN $1::order_status = 'entregue' THEN now() ELSE delivered_at END,
         cancelled_at = CASE WHEN $1::order_status = 'cancelado' THEN now() ELSE cancelled_at END
       WHERE id = $2`,
      [to, orderId],
    );

    await tx.query(
      `INSERT INTO order_status_history (order_id, from_status, to_status, changed_by, note, internal)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, order.status, to, user.userId, options.note?.trim() || null, options.internal ?? false],
    );

    await recordAudit(tx, {
      actorUserId: user.userId,
      action: 'status_alterado',
      entity: 'orders',
      entityId: orderId,
      before: { status: order.status },
      after: { status: to },
    });
  });
}
