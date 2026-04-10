-- Activar seguridad
ALTER TABLE estudiante ENABLE ROW LEVEL SECURITY;
ALTER TABLE cronometro ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarea ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacion ENABLE ROW LEVEL SECURITY;

-- =========================
-- ESTUDIANTE
-- =========================

-- Ver sus datos
CREATE POLICY "ver mi perfil"
ON estudiante
FOR SELECT
USING (auth.uid()::text = id_estudiante::text);

-- Actualizar sus datos
CREATE POLICY "editar mi perfil"
ON estudiante
FOR UPDATE
USING (auth.uid()::text = id_estudiante::text);

-- =========================
-- CRONOMETRO
-- =========================

-- Ver
CREATE POLICY "ver mis cronometros"
ON cronometro
FOR SELECT
USING (auth.uid()::text = id_estudiante::text);

-- Crear
CREATE POLICY "crear cronometros"
ON cronometro
FOR INSERT
WITH CHECK (auth.uid()::text = id_estudiante::text);

-- Editar
CREATE POLICY "editar cronometros"
ON cronometro
FOR UPDATE
USING (auth.uid()::text = id_estudiante::text);

-- Eliminar
CREATE POLICY "eliminar cronometros"
ON cronometro
FOR DELETE
USING (auth.uid()::text = id_estudiante::text);

-- =========================
-- TAREA
-- =========================

-- (Simple: todos pueden ver y manejar tareas)
CREATE POLICY "tareas libres"
ON tarea
FOR ALL
USING (true)
WITH CHECK (true);

-- =========================
-- NOTIFICACION
-- =========================

-- Ver notificaciones relacionadas a sus cronometros
CREATE POLICY "ver mis notificaciones"
ON notificacion
FOR SELECT
USING (
id_cronometro IN (
SELECT id_cronometro FROM cronometro
WHERE auth.uid()::text = id_estudiante::text
)
);
