-- Migration 004: Token público para vistas de cotización
-- Ejecutar en el SQL Editor de Supabase

ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS token TEXT UNIQUE;
ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS respondida_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_cotizaciones_token ON cotizaciones(token);
