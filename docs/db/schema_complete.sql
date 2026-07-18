-- ============================================================
-- ESQUEMA DE BASE DE DATOS COMPLETO — Rapicot (MVP)
-- Ejecutar en el SQL Editor de tu proyecto en Supabase
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. TABLAS
-- ==========================================

-- Tabla: empresas
CREATE TABLE empresas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL DEFAULT '',
  rut         TEXT,
  email       TEXT,
  telefono    TEXT,
  direccion   TEXT,
  logo_url    TEXT,
  moneda      TEXT NOT NULL DEFAULT 'CLP',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla: profiles (enlace con auth.users de Supabase)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla: clientes
CREATE TABLE clientes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  rut         TEXT,
  email       TEXT,
  telefono    TEXT,
  direccion   TEXT,
  notas       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla: productos / servicios
CREATE TABLE productos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id      UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  descripcion     TEXT,
  precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
  unidad          TEXT NOT NULL DEFAULT 'unidad',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla: cotizaciones
CREATE TABLE cotizaciones (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id       UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  cliente_id       UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  numero           INTEGER NOT NULL,
  estado           TEXT NOT NULL DEFAULT 'borrador'
                     CHECK (estado IN ('borrador','enviada','aceptada','rechazada')),
  notas            TEXT,
  subtotal         DECIMAL(12,2) NOT NULL DEFAULT 0,
  descuento_global DECIMAL(12,2) NOT NULL DEFAULT 0,
  iva              DECIMAL(12,2) NOT NULL DEFAULT 0,
  total            DECIMAL(12,2) NOT NULL DEFAULT 0,
  deleted_at       TIMESTAMPTZ,
  fecha_validez    DATE,
  token            TEXT UNIQUE,
  respondida_at    TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  emitida_at       TIMESTAMPTZ,
  UNIQUE (empresa_id, numero)
);

-- Tabla: cotizacion_items (líneas de detalle de cotización)
CREATE TABLE cotizacion_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cotizacion_id   UUID NOT NULL REFERENCES cotizaciones(id) ON DELETE CASCADE,
  producto_id     UUID REFERENCES productos(id) ON DELETE SET NULL,
  descripcion     TEXT NOT NULL,
  cantidad        DECIMAL(12,2) NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
  descuento       DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (descuento >= 0),
  total           DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla: encuestas_nps (NPS Feedback del cliente)
CREATE TABLE encuestas_nps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  puntaje     INTEGER NOT NULL CHECK (puntaje >= 0 AND puntaje <= 10),
  comentario  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla: calificaciones_servicio (Star rating 1-5)
CREATE TABLE calificaciones_servicio (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  estrellas   INTEGER NOT NULL CHECK (estrellas >= 1 AND estrellas <= 5),
  comentario  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ==========================================
-- 2. ÍNDICES DE RENDIMIENTO Y BÚSQUEDA
-- ==========================================

CREATE INDEX idx_profiles_empresa_id ON profiles(empresa_id);
CREATE INDEX idx_clientes_empresa_id ON clientes(empresa_id);
CREATE INDEX idx_productos_empresa_id ON productos(empresa_id);
CREATE INDEX idx_cotizaciones_empresa_id ON cotizaciones(empresa_id);
CREATE INDEX idx_cotizaciones_cliente_id ON cotizaciones(cliente_id);
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX idx_cotizacion_items_cotizacion_id ON cotizacion_items(cotizacion_id);
CREATE INDEX idx_cotizaciones_token ON cotizaciones(token);
CREATE INDEX idx_calificaciones_empresa_id ON calificaciones_servicio(empresa_id);


-- ==========================================
-- 3. FUNCIONES Y TRIGGERS (Automatización)
-- ==========================================

-- Trigger: Crear automáticamente empresa y perfil del usuario al registrarse en Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_empresa_id UUID;
BEGIN
  INSERT INTO public.empresas (nombre, email)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'empresa_nombre', 'Mi Empresa'), NEW.email)
  RETURNING id INTO v_empresa_id;

  INSERT INTO public.profiles (id, empresa_id, nombre)
  VALUES (NEW.id, v_empresa_id, COALESCE(NEW.raw_user_meta_data->>'nombre', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Función auxiliar para obtener el ID de la empresa del usuario autenticado
CREATE OR REPLACE FUNCTION get_user_empresa_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Función para autogenerar número correlativo de cotización por empresa
CREATE OR REPLACE FUNCTION next_cotizacion_numero(p_empresa_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT COALESCE(MAX(numero), 0) + 1 FROM public.cotizaciones WHERE empresa_id = p_empresa_id
$$;


-- ==========================================
-- 4. SEGURIDAD A NIVEL DE FILAS (RLS)
-- ==========================================

ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizacion_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE encuestas_nps ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones_servicio ENABLE ROW LEVEL SECURITY;

-- Políticas: empresas
CREATE POLICY "empresas_select" ON empresas FOR SELECT USING (id = get_user_empresa_id());
CREATE POLICY "empresas_update" ON empresas FOR UPDATE USING (id = get_user_empresa_id()) WITH CHECK (id = get_user_empresa_id());

-- Políticas: profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Políticas: clientes
CREATE POLICY "clientes_select" ON clientes FOR SELECT USING (empresa_id = get_user_empresa_id());
CREATE POLICY "clientes_insert" ON clientes FOR INSERT WITH CHECK (empresa_id = get_user_empresa_id());
CREATE POLICY "clientes_update" ON clientes FOR UPDATE USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());
CREATE POLICY "clientes_delete" ON clientes FOR DELETE USING (empresa_id = get_user_empresa_id());

-- Políticas: productos
CREATE POLICY "productos_select" ON productos FOR SELECT USING (empresa_id = get_user_empresa_id());
CREATE POLICY "productos_insert" ON productos FOR INSERT WITH CHECK (empresa_id = get_user_empresa_id());
CREATE POLICY "productos_update" ON productos FOR UPDATE USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());
CREATE POLICY "productos_delete" ON productos FOR DELETE USING (empresa_id = get_user_empresa_id());

-- Políticas: cotizaciones
CREATE POLICY "cotizaciones_select" ON cotizaciones FOR SELECT USING (empresa_id = get_user_empresa_id());
CREATE POLICY "cotizaciones_insert" ON cotizaciones FOR INSERT WITH CHECK (empresa_id = get_user_empresa_id());
CREATE POLICY "cotizaciones_update" ON cotizaciones FOR UPDATE USING (empresa_id = get_user_empresa_id()) WITH CHECK (empresa_id = get_user_empresa_id());
CREATE POLICY "cotizaciones_delete" ON cotizaciones FOR DELETE USING (empresa_id = get_user_empresa_id());

-- Políticas: cotizacion_items (líneas de cotización)
CREATE POLICY "items_select" ON cotizacion_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM cotizaciones WHERE cotizaciones.id = cotizacion_items.cotizacion_id AND cotizaciones.empresa_id = get_user_empresa_id())
);
CREATE POLICY "items_insert" ON cotizacion_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM cotizaciones WHERE cotizaciones.id = cotizacion_items.cotizacion_id AND cotizaciones.empresa_id = get_user_empresa_id())
);
CREATE POLICY "items_update" ON cotizacion_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM cotizaciones WHERE cotizaciones.id = cotizacion_items.cotizacion_id AND cotizaciones.empresa_id = get_user_empresa_id())
) WITH CHECK (
  EXISTS (SELECT 1 FROM cotizaciones WHERE cotizaciones.id = cotizacion_items.cotizacion_id AND cotizaciones.empresa_id = get_user_empresa_id())
);
CREATE POLICY "items_delete" ON cotizacion_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM cotizaciones WHERE cotizaciones.id = cotizacion_items.cotizacion_id AND cotizaciones.empresa_id = get_user_empresa_id())
);

-- Políticas: encuestas_nps
CREATE POLICY "nps_insert" ON encuestas_nps FOR INSERT WITH CHECK (empresa_id = get_user_empresa_id());
CREATE POLICY "nps_select" ON encuestas_nps FOR SELECT USING (empresa_id = get_user_empresa_id());

-- Políticas: calificaciones_servicio
CREATE POLICY "calificaciones_insert" ON calificaciones_servicio FOR INSERT WITH CHECK (empresa_id = get_user_empresa_id());
CREATE POLICY "calificaciones_select" ON calificaciones_servicio FOR SELECT USING (empresa_id = get_user_empresa_id());
