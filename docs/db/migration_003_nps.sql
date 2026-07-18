-- Migration 003: NPS survey table
-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS encuestas_nps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  puntaje     INTEGER NOT NULL CHECK (puntaje >= 0 AND puntaje <= 10),
  comentario  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE encuestas_nps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nps_insert" ON encuestas_nps FOR INSERT WITH CHECK (
  empresa_id = get_user_empresa_id()
);

CREATE POLICY "nps_select" ON encuestas_nps FOR SELECT USING (
  empresa_id = get_user_empresa_id()
);
