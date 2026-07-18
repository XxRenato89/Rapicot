-- ============================================================
-- Migraciones completas — Rapicot
-- Ejecutar completo en el SQL Editor de Supabase
-- ============================================================

-- 002: Dashboard features
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS moneda TEXT NOT NULL DEFAULT 'CLP';
ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS fecha_validez DATE;

-- 003: NPS survey table
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

-- 004: Public token for cotizaciones
ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS token TEXT UNIQUE;
ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS respondida_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_cotizaciones_token ON cotizaciones(token);

-- 005: Calificaciones del servicio (star rating 1-5)
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
CREATE INDEX IF NOT EXISTS idx_calificaciones_empresa_id ON calificaciones_servicio(empresa_id);
