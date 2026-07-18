-- Migration 005: Calificaciones del servicio (star rating 1-5)
-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS calificaciones_servicio (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  estrellas   INTEGER NOT NULL CHECK (estrellas >= 1 AND estrellas <= 5),
  comentario  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE calificaciones_servicio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "calificaciones_insert" ON calificaciones_servicio FOR INSERT WITH CHECK (
  empresa_id = get_user_empresa_id()
);

CREATE POLICY "calificaciones_select" ON calificaciones_servicio FOR SELECT USING (
  empresa_id = get_user_empresa_id()
);

CREATE INDEX idx_calificaciones_empresa_id ON calificaciones_servicio(empresa_id);
