-- ============================================================
-- DB.sql — Esquema para PostgreSQL / Supabase
-- Proyecto: PPI
-- ============================================================

-- Habilitar RLS (Row Level Security) en Supabase
-- Se activa por tabla más abajo

-- ============================================================
-- EXTENSIONES
-- ============================================================
-- uuid-ossp ya viene incluido en Supabase; se activa así:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: estudiante
-- ============================================================
CREATE TABLE IF NOT EXISTS estudiante (
  id_estudiante  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre         VARCHAR(50) NOT NULL,
  correo         VARCHAR(100) NOT NULL UNIQUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas por correo
CREATE INDEX IF NOT EXISTS idx_estudiante_correo ON estudiante(correo);

-- Habilitar RLS
ALTER TABLE estudiante ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TABLA: cronometro
-- ============================================================
CREATE TABLE IF NOT EXISTS cronometro (
  id_cronometro   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  tiempo_trabajo  INTEGER     NOT NULL CHECK (tiempo_trabajo > 0),
  tiempo_descanso INTEGER     NOT NULL CHECK (tiempo_descanso > 0),
  estado          VARCHAR(20) NOT NULL DEFAULT 'inactivo'
                              CHECK (estado IN ('activo', 'pausado', 'inactivo', 'completado')),
  id_estudiante   UUID        NOT NULL REFERENCES estudiante(id_estudiante) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cronometro_estudiante ON cronometro(id_estudiante);

ALTER TABLE cronometro ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TABLA: tarea
-- ============================================================
CREATE TABLE IF NOT EXISTS tarea (
  id_tarea     UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre       VARCHAR(50)  NOT NULL,
  descripcion  VARCHAR(255),
  estado       VARCHAR(20)  NOT NULL DEFAULT 'pendiente'
                            CHECK (estado IN ('pendiente', 'en_progreso', 'completada', 'cancelada')),
  id_estudiante UUID        REFERENCES estudiante(id_estudiante) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tarea_estado      ON tarea(estado);
CREATE INDEX IF NOT EXISTS idx_tarea_estudiante  ON tarea(id_estudiante);

ALTER TABLE tarea ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TABLA: notificacion
-- ============================================================
CREATE TABLE IF NOT EXISTS notificacion (
  id_notificacion UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo            VARCHAR(50) NOT NULL
                              CHECK (tipo IN ('recordatorio', 'alerta', 'info', 'completado')),
  mensaje         VARCHAR(255) NOT NULL,
  leida           BOOLEAN     NOT NULL DEFAULT FALSE,
  id_cronometro   UUID        REFERENCES cronometro(id_cronometro) ON DELETE SET NULL,
  id_tarea        UUID        REFERENCES tarea(id_tarea)           ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificacion_cronometro ON notificacion(id_cronometro);
CREATE INDEX IF NOT EXISTS idx_notificacion_tarea      ON notificacion(id_tarea);

ALTER TABLE notificacion ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TRIGGER: actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_estudiante_updated_at
  BEFORE UPDATE ON estudiante
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_cronometro_updated_at
  BEFORE UPDATE ON cronometro
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tarea_updated_at
  BEFORE UPDATE ON tarea
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROLES DE BASE DE DATOS
-- (Opcional: crear en Supabase vía Dashboard > Database > Roles)
-- ============================================================

-- Rol estudiante (acceso limitado a sus propios datos)
-- CREATE ROLE rol_estudiante;

-- Rol administrador (acceso total)
-- CREATE ROLE rol_administrador;

-- ============================================================
-- POLÍTICAS RLS — EJEMPLO para tabla estudiante
-- (Adaptar según lógica de auth de Supabase)
-- ============================================================

-- Política: cada estudiante solo ve su propio registro
-- (Requiere que auth.uid() esté vinculado a id_estudiante)
-- CREATE POLICY "estudiante_select_own"
--   ON estudiante FOR SELECT
--   USING (id_estudiante::text = auth.uid()::text);

-- Política: el administrador ve todo
-- CREATE POLICY "admin_select_all"
--   ON estudiante FOR ALL
--   USING (auth.role() = 'authenticated');
