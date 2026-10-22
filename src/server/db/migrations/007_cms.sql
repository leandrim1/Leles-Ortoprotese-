-- Conteúdo do site editável pelo painel, sem novo deploy.

-- Configurações globais em pares chave/valor tipados como jsonb.
CREATE TABLE site_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE publish_status AS ENUM ('rascunho', 'publicado');

CREATE TABLE pages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  title       text NOT NULL,
  seo_title   text,
  seo_description text,
  og_image_media_id uuid REFERENCES media(id) ON DELETE SET NULL,
  status      publish_status NOT NULL DEFAULT 'rascunho',
  published_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

-- Cada seção guarda o rascunho e a versão publicada lado a lado, para que
-- editar não afete o site antes da publicação explícita.
CREATE TABLE page_sections (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  key             text NOT NULL,
  type            text NOT NULL,
  draft_content   jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_content jsonb,
  visible         boolean NOT NULL DEFAULT true,
  sort_order      int NOT NULL DEFAULT 0,
  updated_by      uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, key)
);

CREATE INDEX page_sections_page_idx ON page_sections (page_id, sort_order);

-- Instantâneos para histórico e reversão.
CREATE TABLE content_versions (
  id          bigserial PRIMARY KEY,
  entity      text NOT NULL,
  entity_id   uuid NOT NULL,
  snapshot    jsonb NOT NULL,
  label       text,
  created_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX content_versions_entity_idx ON content_versions (entity, entity_id, created_at DESC);

-- Galeria do site. Referencia a biblioteca de mídia, não duplica o arquivo.
CREATE TABLE gallery_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id    uuid NOT NULL REFERENCES media(id) ON DELETE RESTRICT,
  caption     text,
  category    text,
  sort_order  int NOT NULL DEFAULT 0,
  visible     boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

CREATE INDEX gallery_visible_idx ON gallery_items (visible, sort_order) WHERE deleted_at IS NULL;

CREATE TABLE business_hours (
  weekday    int PRIMARY KEY CHECK (weekday BETWEEN 0 AND 6),
  opens_at   time,
  closes_at  time,
  closed     boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Dia aberto precisa dos dois horários, e a abertura vem antes do fechamento.
  CONSTRAINT business_hours_range CHECK (
    closed OR (opens_at IS NOT NULL AND closes_at IS NOT NULL AND opens_at < closes_at)
  )
);
