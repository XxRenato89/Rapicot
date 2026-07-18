-- Migration 002: Dashboard features (soft delete, fecha_validez, moneda)
-- Ejecutar en el SQL Editor de Supabase

ALTER TABLE empresas ADD COLUMN IF NOT EXISTS moneda TEXT NOT NULL DEFAULT 'CLP';

ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS fecha_validez DATE;
