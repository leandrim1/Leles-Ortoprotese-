-- Núcleo: identidade, sessões, auditoria.
-- Compatível com Neon PostgreSQL (16+) e PGlite, usado nos testes.

CREATE TYPE user_role AS ENUM ('admin', 'atendimento', 'producao', 'cliente');
CREATE TYPE account_status AS ENUM ('pendente', 'ativo', 'suspenso');

CREATE TABLE users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL,
  password_hash   text NOT NULL,
  name            text NOT NULL,
  phone           text,
  role            user_role NOT NULL DEFAULT 'cliente',
  status          account_status NOT NULL DEFAULT 'pendente',
  email_verified_at timestamptz,
  last_login_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  CONSTRAINT users_email_lowercase CHECK (email = lower(email)),
  CONSTRAINT users_email_format CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);

-- E-mail único apenas entre contas vivas: permite recadastro após exclusão.
CREATE UNIQUE INDEX users_email_unique ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX users_role_idx ON users (role) WHERE deleted_at IS NULL;

-- Sessões opacas: o token em claro nunca é persistido, só o seu hash.
CREATE TABLE sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash   text NOT NULL UNIQUE,
  expires_at   timestamptz NOT NULL,
  revoked_at   timestamptz,
  ip           text,
  user_agent   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sessions_user_idx ON sessions (user_id) WHERE revoked_at IS NULL;
CREATE INDEX sessions_expiry_idx ON sessions (expires_at) WHERE revoked_at IS NULL;

CREATE TABLE password_reset_tokens (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX password_reset_user_idx ON password_reset_tokens (user_id) WHERE used_at IS NULL;

CREATE TABLE email_verification_tokens (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tentativas de autenticação, para limitar força bruta por conta e por IP.
CREATE TABLE login_attempts (
  id         bigserial PRIMARY KEY,
  identifier text NOT NULL,
  ip         text,
  succeeded  boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX login_attempts_identifier_idx ON login_attempts (identifier, created_at DESC);
CREATE INDEX login_attempts_ip_idx ON login_attempts (ip, created_at DESC);

-- Auditoria: quem fez o quê, com o estado antes e depois.
CREATE TABLE audit_log (
  id            bigserial PRIMARY KEY,
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action        text NOT NULL,
  entity        text NOT NULL,
  entity_id     text,
  before        jsonb,
  after         jsonb,
  ip            text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_entity_idx ON audit_log (entity, entity_id, created_at DESC);
CREATE INDEX audit_actor_idx ON audit_log (actor_user_id, created_at DESC);
