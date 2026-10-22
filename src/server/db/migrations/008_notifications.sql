-- Notificações no portal e registro das tentativas de envio externo.

CREATE TYPE notification_type AS ENUM (
  'pedido_recebido',
  'informacoes_solicitadas',
  'orcamento_disponivel',
  'orcamento_aprovado',
  'producao_iniciada',
  'pedido_concluido',
  'pedido_enviado'
);

CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      text NOT NULL,
  body       text,
  order_id   uuid REFERENCES orders(id) ON DELETE CASCADE,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_idx ON notifications (user_id, created_at DESC);
CREATE INDEX notifications_unread_idx ON notifications (user_id) WHERE read_at IS NULL;

CREATE TYPE delivery_channel AS ENUM ('portal', 'email');
CREATE TYPE delivery_status AS ENUM ('pendente', 'enviado', 'falhou');

-- Resultado real de cada tentativa. Nada é marcado como enviado sem provedor.
CREATE TABLE notification_deliveries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  channel         delivery_channel NOT NULL,
  status          delivery_status NOT NULL DEFAULT 'pendente',
  attempts        int NOT NULL DEFAULT 0,
  last_error      text,
  sent_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (notification_id, channel)
);

CREATE INDEX deliveries_pending_idx ON notification_deliveries (status, created_at)
  WHERE status <> 'enviado';
