-- Tipo ENUM para estados
CREATE TYPE estado_cronometro AS ENUM ('activo', 'pausado', 'finalizado');
CREATE TYPE estado_tarea AS ENUM ('pendiente', 'en_progreso', 'completada');

-- Tabla estudiante
CREATE TABLE estudiante (
  id_estudiante UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        VARCHAR(50) NOT NULL,
  correo        VARCHAR(254) NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla cronometro
CREATE TABLE cronometro (
  id_cronometro   UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  tiempo_trabajo  INTEGER            NOT NULL CHECK (tiempo_trabajo > 0),
  tiempo_descanso INTEGER            NOT NULL CHECK (tiempo_descanso > 0),
  estado          estado_cronometro  NOT NULL DEFAULT 'pausado',
  id_estudiante   UUID               NOT NULL REFERENCES estudiante(id_estudiante) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ        NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ        NOT NULL DEFAULT now()
);

-- Tabla tarea
CREATE TABLE tarea (
  id_tarea    UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      VARCHAR(50)    NOT NULL,
  descripcion VARCHAR(255),
  estado      estado_tarea   NOT NULL DEFAULT 'pendiente',
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- Tabla notificacion
CREATE TABLE notificacion (
  id_notificacion UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo            VARCHAR(50) NOT NULL,
  mensaje         VARCHAR(500) NOT NULL,
  id_cronometro   UUID REFERENCES cronometro(id_cronometro) ON DELETE SET NULL,
  id_tarea        UUID REFERENCES tarea(id_tarea) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para claves foráneas
CREATE INDEX idx_cronometro_estudiante   ON cronometro(id_estudiante);
CREATE INDEX idx_notificacion_cronometro ON notificacion(id_cronometro);
CREATE INDEX idx_notificacion_tarea      ON notificacion(id_tarea);

-- Row Level Security (Supabase)
ALTER TABLE estudiante   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cronometro   ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarea        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacion ENABLE ROW LEVEL SECURITY;
