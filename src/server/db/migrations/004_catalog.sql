-- Catálogo administrável de serviços.

CREATE TABLE service_categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text NOT NULL UNIQUE,
  name       text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  active     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE services (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     uuid REFERENCES service_categories(id) ON DELETE SET NULL,
  slug            text NOT NULL UNIQUE,
  name            text NOT NULL,
  description     text,
  -- Instruções que o dentista vê ao solicitar este serviço.
  instructions    text,
  image_media_id  uuid REFERENCES media(id) ON DELETE SET NULL,
  -- Preço nulo significa "sob orçamento"; nunca inventar valor.
  base_price      numeric(12,2) CHECK (base_price IS NULL OR base_price >= 0),
  requires_quote  boolean NOT NULL DEFAULT true,
  lead_time_days  int CHECK (lead_time_days IS NULL OR lead_time_days > 0),
  -- Regras de anexo: extensões, tamanho máximo e quantidade.
  file_rules      jsonb NOT NULL DEFAULT '{}'::jsonb,
  active          boolean NOT NULL DEFAULT true,
  sort_order      int NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  -- Um serviço com preço definido não pode exigir orçamento, e vice-versa.
  CONSTRAINT services_price_or_quote CHECK (requires_quote OR base_price IS NOT NULL)
);

CREATE INDEX services_category_idx ON services (category_id) WHERE deleted_at IS NULL;
CREATE INDEX services_active_idx ON services (active, sort_order) WHERE deleted_at IS NULL;

CREATE TYPE field_type AS ENUM ('texto', 'texto_longo', 'numero', 'selecao', 'data', 'booleano');

-- Campos técnicos configuráveis por serviço, preenchidos na criação do pedido.
CREATE TABLE service_fields (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  key        text NOT NULL,
  label      text NOT NULL,
  type       field_type NOT NULL DEFAULT 'texto',
  required   boolean NOT NULL DEFAULT false,
  options    jsonb,
  help_text  text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (service_id, key),
  -- Campo de seleção precisa de opções; os demais não as usam.
  CONSTRAINT service_fields_options CHECK (type <> 'selecao' OR jsonb_array_length(COALESCE(options, '[]'::jsonb)) > 0)
);

CREATE INDEX service_fields_service_idx ON service_fields (service_id, sort_order);
