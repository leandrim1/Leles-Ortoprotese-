-- Pedidos, arquivos, histórico de status e mensagens.

CREATE TYPE order_status AS ENUM (
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
  'entregue',
  'cancelado'
);

CREATE TABLE orders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Número legível, gerado em transação: LL-2026-0001.
  number        text NOT NULL UNIQUE,
  client_id     uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  service_id    uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  status        order_status NOT NULL DEFAULT 'recebido',
  -- Código do caso no lugar do nome do paciente (minimização de dados).
  case_code     text,
  -- Respostas dos campos técnicos configuráveis do serviço.
  field_values  jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes         text,
  desired_date  date,
  price         numeric(12,2) CHECK (price IS NULL OR price >= 0),
  -- Prazo acordado; só existe quando o laboratório o define.
  due_date      date,
  submitted_at  timestamptz,
  delivered_at  timestamptz,
  cancelled_at  timestamptz,
  -- Chave enviada pelo cliente para que reenvio não vire pedido duplicado.
  idempotency_key text,
  created_by    uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX orders_idempotency_unique ON orders (client_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX orders_client_idx ON orders (client_id, created_at DESC);
CREATE INDEX orders_status_idx ON orders (status, created_at DESC);
CREATE INDEX orders_service_idx ON orders (service_id);
CREATE INDEX orders_due_idx ON orders (due_date) WHERE due_date IS NOT NULL AND status <> 'entregue';

-- Sequência por ano para o número do pedido, com travamento por linha.
CREATE TABLE order_number_sequence (
  year      int PRIMARY KEY,
  last_value int NOT NULL DEFAULT 0
);

CREATE TYPE order_file_kind AS ENUM ('escaneamento', 'foto', 'documento', 'outro');

CREATE TABLE order_files (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  media_id    uuid NOT NULL REFERENCES media(id) ON DELETE RESTRICT,
  kind        order_file_kind NOT NULL DEFAULT 'outro',
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz,
  UNIQUE (order_id, media_id)
);

CREATE INDEX order_files_order_idx ON order_files (order_id) WHERE deleted_at IS NULL;

-- Histórico imutável: toda transição fica registrada, inclusive cancelamentos.
CREATE TABLE order_status_history (
  id             bigserial PRIMARY KEY,
  order_id       uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status    order_status,
  to_status      order_status NOT NULL,
  changed_by     uuid REFERENCES users(id) ON DELETE SET NULL,
  note           text,
  -- Observação interna não aparece para o cliente.
  internal       boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_history_order_idx ON order_status_history (order_id, created_at DESC);

CREATE TABLE order_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  author_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  body       text NOT NULL,
  -- Mensagem interna da equipe, invisível ao cliente.
  internal   boolean NOT NULL DEFAULT false,
  -- Marca pedidos de informação, que mudam o pedido para aguardando_informacoes.
  is_request boolean NOT NULL DEFAULT false,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_messages_order_idx ON order_messages (order_id, created_at DESC);
