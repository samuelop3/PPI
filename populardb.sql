CREATE OR REPLACE FUNCTION obtenerNotificaciones()
RETURNS TABLE(id_notificacion INT, tipo VARCHAR, mensaje VARCHAR, id_cronometro INT, id_tarea INT)
LANGUAGE sql
AS $$
  SELECT id_notificacion, tipo, mensaje, id_cronometro, id_tarea FROM notificacion;
$$;
 
SELECT * FROM obtenerNotificaciones();



CREATE OR REPLACE FUNCTION obtenerTareas()
RETURNS TABLE(id_tarea INT, nombre VARCHAR, descripcion VARCHAR, estado VARCHAR)
LANGUAGE sql
AS $$
  SELECT id_tarea, nombre, descripcion, estado FROM tarea;
$$;
 
SELECT * FROM obtenerTareas();



CREATE OR REPLACE FUNCTION obtenerCronometros()
RETURNS TABLE(id_cronometro INT, tiempo_trabajo INT, tiempo_descanso INT, estado VARCHAR, id_estudiante INT)
LANGUAGE sql
AS $$
  SELECT id_cronometro, tiempo_trabajo, tiempo_descanso, estado, id_estudiante FROM cronometro;
$$;
 
SELECT * FROM obtenerCronometros();


CREATE OR REPLACE FUNCTION obtenerEstudiantes()
RETURNS TABLE(id_estudiante INT, nombre VARCHAR, correo VARCHAR)
LANGUAGE sql
AS $$
  SELECT id_estudiante, nombre, correo FROM estudiante;
$$;
 
SELECT * FROM obtenerEstudiantes();

import { createClient } from '@supabase/supabase-js'

const supabase = createClient('TU_URL', 'TU_ANON_KEY')

// Obtener tareas pendientes de un estudiante
const { data, error } = await supabase
  .from('tarea')
  .select('*')
  .eq('id_estudiante', 1)
  .eq('estado', 'pendiente')

// Marcar tarea como completada
await supabase
  .from('tarea')
  .update({ estado: 'completada' })
  .eq('id_tarea', 1)

// Crear nueva tarea
await supabase
  .from('tarea')
  .insert({ nombre: 'Nueva tarea', descripcion: '...', id_estudiante: 1 })


INSERT INTO estudiante (nombre, correo) VALUES
  ('Darwin Betancur', 'darwin@example.com'),
  ('Samuel Bolívar', 'samuel@example.com');

INSERT INTO cronometro (tiempo_trabajo, tiempo_descanso, estado, id_estudiante) VALUES
  (25, 5, 'activo', 1),
  (30, 10, 'inactivo', 2);

INSERT INTO tarea (nombre, descripcion, estado, id_estudiante) VALUES
  ('Estudiar matemáticas', 'Repasar capítulo 3', 'pendiente', 1),
  ('Leer historia', 'Páginas 20-30', 'completada', 1),
  ('Proyecto de inglés', 'Presentación oral', 'pendiente', 2);

INSERT INTO notificacion (tipo, mensaje, id_cronometro) VALUES
  ('trabajo', '¡Sesión de trabajo iniciada! 25 minutos.', 1),
  ('descanso', '¡Tiempo de descanso! 5 minutos.', 1);







ALTER TABLE estudiante      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cronometro      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarea           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacion    ENABLE ROW LEVEL SECURITY;

-- Política básica: cada estudiante solo ve sus propios datos
CREATE POLICY "estudiante_propios" ON estudiante
  FOR ALL USING (auth.uid()::text = correo);

CREATE POLICY "cronometro_propio" ON cronometro
  FOR ALL USING (
    id_estudiante = (SELECT id_estudiante FROM estudiante WHERE correo = auth.uid()::text)
  );

CREATE POLICY "tarea_propia" ON tarea
  FOR ALL USING (
    id_estudiante = (SELECT id_estudiante FROM estudiante WHERE correo = auth.uid()::text)
  );






-- Tabla estudiante
CREATE TABLE estudiante (
  id_estudiante SERIAL PRIMARY KEY,
  nombre        VARCHAR(50)  NOT NULL,
  correo        VARCHAR(50)  UNIQUE NOT NULL,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- Tabla cronometro
CREATE TABLE cronometro (
  id_cronometro   SERIAL PRIMARY KEY,
  tiempo_trabajo  INT          NOT NULL DEFAULT 25,  -- minutos
  tiempo_descanso INT          NOT NULL DEFAULT 5,   -- minutos
  estado          VARCHAR(50)  NOT NULL DEFAULT 'inactivo',
  id_estudiante   INT          REFERENCES estudiante(id_estudiante) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- Tabla tarea
CREATE TABLE tarea (
  id_tarea    SERIAL PRIMARY KEY,
  nombre      VARCHAR(50)  NOT NULL,
  descripcion VARCHAR(100),
  estado      VARCHAR(50)  NOT NULL DEFAULT 'pendiente',  -- pendiente | completada
  id_estudiante INT        REFERENCES estudiante(id_estudiante) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Tabla notificacion
CREATE TABLE notificacion (
  id_notificacion SERIAL PRIMARY KEY,
  tipo            VARCHAR(50)  NOT NULL,   -- 'trabajo' | 'descanso'
  mensaje         VARCHAR(100) NOT NULL,
  id_cronometro   INT          REFERENCES cronometro(id_cronometro) ON DELETE SET NULL,
  id_tarea        INT          REFERENCES tarea(id_tarea) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ  DEFAULT NOW()
);





INSERT INTO estudiantes (nombre, edad, email, curso_id)
VALUES
('Ana', 20, 'ana1@email.com', 1),
('Luis', 22, 'luis1@email.com', 2),
('María', 19, 'maria1@email.com', 1),
('Pedro', 25, 'pedro1@email.com', 3),
('Camila', 23, 'camila@email.com', 1),
('Jorge', 21, 'jorge@email.com', 2),
('Valentina', 18, 'valentina@email.com', 3),
('Sebastián', 24, 'sebastian@email.com', 1),
('Daniela', 20, 'daniela@email.com', 2);






