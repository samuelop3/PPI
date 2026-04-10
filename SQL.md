-- Tabla estudiante
CREATE TABLE estudiante (
  id_estudiante SERIAL PRIMARY KEY,
  nombre        VARCHAR(50),
  correo        VARCHAR(50)
);

-- Tabla cronometro
CREATE TABLE cronometro (
  id_cronometro  SERIAL PRIMARY KEY,
  tiempo_trabajo  INTEGER,
  tiempo_descanso INTEGER,
  estado          VARCHAR(50),
  id_estudiante   INTEGER REFERENCES estudiante(id_estudiante) ON DELETE CASCADE
);

-- Tabla tarea
CREATE TABLE tarea (
  id_tarea    SERIAL PRIMARY KEY,
  nombre      VARCHAR(50),
  descripcion VARCHAR(100),
  estado      VARCHAR(50)
);

-- Tabla notificacion
CREATE TABLE notificacion (
  id_notificacion SERIAL PRIMARY KEY,
  tipo            VARCHAR(50),
  mensaje         VARCHAR(100),
  id_cronometro   INTEGER REFERENCES cronometro(id_cronometro) ON DELETE SET NULL,
  id_tarea        INTEGER REFERENCES tarea(id_tarea) ON DELETE SET NULL
);
