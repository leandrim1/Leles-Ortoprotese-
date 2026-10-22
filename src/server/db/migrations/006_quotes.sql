-- Orçamentos por pedido.

CREATE TYPE quote_status AS ENUM ('rascunho', 'enviado', 'aprovado', 'recusado', 'expirado', 'cancelado');

CREATE TABLE quotes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  -- Versão do orçamento para o mesmo pedido; revisões criam nova versão.
  version     int NOT NULL DEFAULT 1,
  status      quote_status NOT NULL DEFAULT 'rascunho',
  total       numeric(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  lead_time_days int CHECK (lead_time_days IS NULL OR lead_time_days > 0),
  notes       text,
  valid_until date,
  created_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  sent_at     timestamptz,
  decided_at  timestamptz,
  decided_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  decision_note text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, version),
  -- Um orçamento decidido precisa registrar quando e por quem.
  CONSTRAINT quotes_decision_complete CHECK (
    (status NOT IN ('aprovado', 'recusado'))
    OR (decided_at IS NOT NULL AND decided_by IS NOT NULL)
  )
);

CREATE INDEX quotes_order_idx ON quotes (order_id, version DESC);
CREATE INDEX quotes_status_idx ON quotes (status, created_at DESC);

-- Apenas um orçamento ativo (não decidido) por pedido.
CREATE UNIQUE INDEX quotes_one_open ON quotes (order_id)
  WHERE status IN ('rascunho', 'enviado');

CREATE TABLE quote_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id    uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity    numeric(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  numeric(12,2) NOT NULL CHECK (unit_price >= 0),
  -- Total da linha calculado no banco, nunca enviado pelo cliente.
  line_total  numeric(12,2) GENERATED ALWAYS AS (ROUND(quantity * unit_price, 2)) STORED,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX quote_items_quote_idx ON quote_items (quote_id, sort_order);
