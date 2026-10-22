-- Biblioteca de mídia. O binário vive no Vercel Blob; aqui ficam os metadados.

CREATE TYPE media_visibility AS ENUM ('publico', 'privado');

CREATE TABLE media (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visibility     media_visibility NOT NULL DEFAULT 'privado',
  blob_pathname  text NOT NULL UNIQUE,
  blob_url       text,
  mime_type      text NOT NULL,
  size_bytes     bigint NOT NULL CHECK (size_bytes > 0),
  checksum_sha256 text,
  -- Nome exibido na interface. Não deve conter dado pessoal de paciente.
  display_name   text NOT NULL,
  width          int,
  height         int,
  alt_text       text,
  uploaded_by    uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  deleted_at     timestamptz
);

CREATE INDEX media_visibility_idx ON media (visibility) WHERE deleted_at IS NULL;
CREATE INDEX media_uploader_idx ON media (uploaded_by, created_at DESC);
