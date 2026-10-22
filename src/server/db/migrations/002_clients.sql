-- Clínicas, clientes (dentistas) e endereços.

CREATE TABLE clinics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  tax_id      text,
  phone       text,
  email       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

-- Perfil profissional do dentista. Um usuário tem no máximo um perfil de cliente.
CREATE TABLE clients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  clinic_id   uuid REFERENCES clinics(id) ON DELETE SET NULL,
  cro         text,
  cro_uf      char(2),
  tax_id      text,
  notes_admin text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz,
  CONSTRAINT clients_cro_uf_upper CHECK (cro_uf IS NULL OR cro_uf = upper(cro_uf))
);

CREATE INDEX clients_clinic_idx ON clients (clinic_id) WHERE deleted_at IS NULL;

CREATE TYPE address_kind AS ENUM ('comercial', 'entrega', 'cobranca');

CREATE TABLE addresses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  kind        address_kind NOT NULL DEFAULT 'comercial',
  label       text,
  zip         text NOT NULL,
  street      text NOT NULL,
  number      text,
  complement  text,
  district    text,
  city        text NOT NULL,
  state       char(2) NOT NULL,
  is_default  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

CREATE INDEX addresses_client_idx ON addresses (client_id) WHERE deleted_at IS NULL;
-- No máximo um endereço padrão por cliente e tipo.
CREATE UNIQUE INDEX addresses_one_default ON addresses (client_id, kind)
  WHERE is_default AND deleted_at IS NULL;
