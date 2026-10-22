import type { Permission } from '@/server/auth/rbac';

export type OrderStatus =
  | 'recebido'
  | 'em_analise'
  | 'aguardando_informacoes'
  | 'aguardando_aprovacao_orcamento'
  | 'aguardando_confirmacao_cliente'
  | 'aprovado_para_producao'
  | 'em_producao'
  | 'em_revisao_tecnica'
  | 'pronto'
  | 'enviado'
  | 'entregue'
  | 'cancelado';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  recebido: 'Pedido recebido',
  em_analise: 'Em análise',
  aguardando_informacoes: 'Aguardando informações',
  aguardando_aprovacao_orcamento: 'Aguardando aprovação do orçamento',
  aguardando_confirmacao_cliente: 'Aguardando confirmação do cliente',
  aprovado_para_producao: 'Aprovado para produção',
  em_producao: 'Em produção',
  em_revisao_tecnica: 'Em revisão técnica',
  pronto: 'Pronto para envio ou retirada',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

interface Transition {
  to: OrderStatus;
  permission: Permission;
}

/**
 * Transições válidas do pedido.
 *
 * O estado não é um campo livre: cada passagem precisa estar nesta tabela e o
 * usuário precisa da permissão correspondente. Etapas comerciais ficam com o
 * atendimento; etapas de bancada, com a produção.
 */
const TRANSITIONS: Record<OrderStatus, Transition[]> = {
  recebido: [
    { to: 'em_analise', permission: 'orders:advance:commercial' },
    { to: 'aguardando_informacoes', permission: 'orders:advance:commercial' },
    { to: 'cancelado', permission: 'orders:cancel' },
  ],
  em_analise: [
    { to: 'aguardando_informacoes', permission: 'orders:advance:commercial' },
    { to: 'aguardando_aprovacao_orcamento', permission: 'orders:advance:commercial' },
    { to: 'aguardando_confirmacao_cliente', permission: 'orders:advance:commercial' },
    { to: 'aprovado_para_producao', permission: 'orders:advance:commercial' },
    { to: 'cancelado', permission: 'orders:cancel' },
  ],
  aguardando_informacoes: [
    { to: 'em_analise', permission: 'orders:advance:commercial' },
    { to: 'cancelado', permission: 'orders:cancel' },
  ],
  aguardando_aprovacao_orcamento: [
    // Volta para análise quando o orçamento precisa ser revisto.
    { to: 'em_analise', permission: 'orders:advance:commercial' },
    { to: 'aprovado_para_producao', permission: 'orders:advance:commercial' },
    { to: 'cancelado', permission: 'orders:cancel' },
  ],
  aguardando_confirmacao_cliente: [
    { to: 'em_analise', permission: 'orders:advance:commercial' },
    { to: 'aprovado_para_producao', permission: 'orders:advance:commercial' },
    { to: 'cancelado', permission: 'orders:cancel' },
  ],
  aprovado_para_producao: [
    { to: 'em_producao', permission: 'orders:advance:production' },
    { to: 'cancelado', permission: 'orders:cancel' },
  ],
  em_producao: [
    { to: 'em_revisao_tecnica', permission: 'orders:advance:production' },
    { to: 'aguardando_informacoes', permission: 'orders:advance:commercial' },
    { to: 'cancelado', permission: 'orders:cancel' },
  ],
  em_revisao_tecnica: [
    // Retrabalho volta para a bancada.
    { to: 'em_producao', permission: 'orders:advance:production' },
    { to: 'pronto', permission: 'orders:advance:production' },
  ],
  pronto: [
    { to: 'enviado', permission: 'orders:advance:commercial' },
    // Retirada no balcão pula o envio.
    { to: 'entregue', permission: 'orders:advance:commercial' },
  ],
  enviado: [{ to: 'entregue', permission: 'orders:advance:commercial' }],
  entregue: [],
  cancelado: [],
};

export function allowedTransitions(from: OrderStatus): Transition[] {
  return TRANSITIONS[from] ?? [];
}

export function isTerminal(status: OrderStatus): boolean {
  return allowedTransitions(status).length === 0;
}

/** Diz se a transição existe e qual permissão ela exige. */
export function findTransition(from: OrderStatus, to: OrderStatus): Transition | undefined {
  return allowedTransitions(from).find((t) => t.to === to);
}

/** Status que o cliente vê como "em andamento". */
export const ACTIVE_STATUSES: OrderStatus[] = [
  'recebido',
  'em_analise',
  'aguardando_informacoes',
  'aguardando_aprovacao_orcamento',
  'aguardando_confirmacao_cliente',
  'aprovado_para_producao',
  'em_producao',
  'em_revisao_tecnica',
  'pronto',
  'enviado',
];
