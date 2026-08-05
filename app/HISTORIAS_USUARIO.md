# Taller: De lo que ya tienen (login, Supabase, mapa) a Historias de Usuario

## Entregable generado
- Inventario de roles, tablas y pantallas
- Historias de usuario por pantalla
- Historias CRUD por tabla
- 5 historias con criterios de aceptación (Gherkin)
- Prioridad MoSCoW y asignación a sprints
- Lista de deuda de datos

---

## Actividad 1 — Inventario (extraído del código y SQL)

**1A. Roles / Actores identificados en el login**
- **Estudiante (usuario autenticado):** identificado en Supabase por la tabla `estudiante` (campos principales: `id_estudiante`, `correo`, `nombre`). No se detectan roles administrativos explícitos.

**1B. Tablas de Supabase**
- **`estudiante`** — Campos clave: `id_estudiante`, `nombre`, `correo`, `created_at`. Representa a los usuarios/estudiantes.
- **`cronometro`** — Campos clave: `id_cronometro`, `tiempo_trabajo`, `tiempo_descanso`, `estado`, `id_estudiante`. Representa sesiones de cronómetro asociadas a un estudiante.
- **`tarea`** — Campos clave: `id_tarea`, `nombre`, `descripcion`, `estado`, (posible) `id_estudiante`. Representa tareas del usuario.
- **`notificacion`** — Campos clave: `id_notificacion`, `tipo`, `mensaje`, `id_cronometro`, `id_tarea`. Representa avisos relacionados a cronómetros o tareas.

(Se detectaron dos variantes en los SQL; confirmar esquema final: `tarea` y `cronometro` deben referenciar `id_estudiante`.)

**1C. Pantallas (sitemap extraído de componentes)**
- **Home** — Visible a: público / visitante. Tablas: —
- **Login / Registro** — Visible a: visitante. Tablas: auth (Supabase Auth) y `estudiante` (registro/confirmación).
- **Dashboard** (panel protegido) — Visible a: `Estudiante` autenticado. Subpantallas: `Cronómetro`, `Tareas`, `Notificaciones`, `Perfil`, `Proyecto`.
- **Proyecto** — Visible a: público y autenticado (informativa). Tablas: —
- **Perfil** — Visible a: `Estudiante` autenticado. Tablas: `estudiante`.
- **Tareas** — Visible a: `Estudiante` autenticado. Tablas: `tarea` (y posiblemente `estudiante`).
- **Notificaciones** — Visible a: `Estudiante` autenticado. Tablas: `notificacion` (+ relaciones a `cronometro`/`tarea`).

---

## Actividad 2 — Historias por pantalla (una mínima por pantalla)

- Home
  - Como visitante, quiero ver la presentación de la aplicación para entender su propósito y navegar a registro o inicio de sesión.

- Login / Registro
  - Como visitante, quiero iniciar sesión con correo y contraseña para acceder al panel protegido.
  - Como visitante, quiero registrarme con correo y contraseña para crear mi cuenta.

- Dashboard — Cronómetro
  - Como estudiante, quiero iniciar y pausar un cronómetro para registrar el tiempo dedicado a una tarea.

- Dashboard — Tareas
  - Como estudiante, quiero crear una tarea con nombre y descripción para organizar mi trabajo.

- Dashboard — Notificaciones
  - Como estudiante, quiero ver notificaciones relacionadas con mis cronómetros y tareas para estar informado.

- Perfil
  - Como estudiante, quiero editar mi nombre y correo para mantener mis datos actualizados.

- Proyecto
  - Como cualquier usuario, quiero leer la descripción del proyecto para entender funcionalidades y tecnologías.

---

## Actividad 3 — Historias CRUD por tabla

Tabla `estudiante`:
- Create: Aplica — Historia: Como visitante quiero registrarme con correo/contraseña para crear mi perfil. (Pantalla: Login/Registro)
- Read: Aplica — Historia: Como estudiante quiero ver mi perfil para consultar mis datos. (Pantalla: Perfil)
- Update: Aplica — Historia: Como estudiante quiero editar mi nombre/correo para actualizar mi perfil. (Pantalla: Perfil)
- Delete: Opcional — Historia: Como estudiante quiero eliminar mi cuenta para borrar mis datos (podría requerir pantalla/flujo propio).

Tabla `cronometro`:
- Create: Aplica — Historia: Como estudiante quiero iniciar un cronómetro para registrar una sesión. (Pantalla: Cronómetro)
- Read: Aplica — Historia: Como estudiante quiero ver el estado del cronómetro para saber tiempo restante/estado. (Pantalla: Cronómetro)
- Update: Aplica — Historia: Como estudiante quiero pausar o finalizar el cronómetro para detener la sesión. (Pantalla: Cronómetro)
- Delete: Rara — Historia: Como estudiante quiero eliminar sesiones antiguas para limpiar mi historial. (Pantalla: Cronómetro / Historial)

Tabla `tarea`:
- Create: Aplica — Historia: Como estudiante quiero crear tareas. (Pantalla: Tareas)
- Read: Aplica — Historia: Como estudiante quiero listar mis tareas. (Pantalla: Tareas)
- Update: Aplica — Historia: Como estudiante quiero marcar una tarea como completada o editarla. (Pantalla: Tareas)
- Delete: Aplica — Historia: Como estudiante quiero eliminar una tarea. (Pantalla: Tareas)

Tabla `notificacion`:
- Create: Generalmente creada por el sistema — Historia: Como sistema quiero generar notificaciones vinculadas a cronómetros/tareas. (Backend)
- Read: Aplica — Historia: Como estudiante quiero ver mis notificaciones. (Pantalla: Notificaciones)
- Update: Pocas veces — marcar leída podría aplicar.
- Delete: Opcional — permitir limpiar notificaciones.

---

## Actividad 4 — 5 historias con criterios de aceptación (Gherkin)

Historia 1: Inicio de sesión
  Como visitante, quiero iniciar sesión con correo y contraseña para acceder al panel.

Criterio 1:
  Dado que estoy en la página de inicio y no he iniciado sesión
  Cuando ingreso un correo y contraseña válidos y presiono "Iniciar sesión"
  Entonces inicio sesión y veo el `Dashboard` (se redirige al panel protegido)

Criterio 2 (error):
  Dado que estoy en la página de inicio
  Cuando ingreso credenciales inválidas y presiono "Iniciar sesión"
  Entonces veo un mensaje de error y no se inicia sesión

---

Historia 2: Editar perfil
  Como estudiante, quiero editar mi nombre y correo para mantener mi información actualizada.

Criterio 1:
  Dado que estoy en `/perfil` y he iniciado sesión
  Cuando cambio el campo "nombre" y presiono "Guardar"
  Entonces el registro en la tabla `estudiante` se actualiza y veo un mensaje de confirmación

Criterio 2 (error):
  Dado que estoy en `/perfil`
  Cuando dejo el correo vacío y presiono "Guardar"
  Entonces no se guarda y se muestra un mensaje de validación

---

Historia 3: Crear tarea
  Como estudiante, quiero crear una tarea con nombre y descripción para organizar mi trabajo.

Criterio 1:
  Dado que estoy en `Tareas` y he iniciado sesión
  Cuando lleno nombre y descripción y presiono "Crear"
  Entonces se inserta una fila en `tarea` y veo la tarea en la lista

Criterio 2 (error):
  Dado que estoy en `Tareas`
  Cuando intento crear una tarea sin nombre
  Entonces la tarea no se crea y veo un error de validación

---

Historia 4: Marcar tarea como completada
  Como estudiante, quiero marcar una tarea como completada para llevar control de mi progreso.

Criterio 1:
  Dado que tengo una tarea con estado `pendiente`
  Cuando presiono "Marcar como completada"
  Entonces el campo `estado` en `tarea` cambia a `completada` y la UI lo refleja

Criterio 2 (concurrencia):
  Dado que otra sesión intentó actualizar la misma tarea
  Cuando la actualización falla por conflicto
  Entonces muestro un mensaje y ofrezco recargar la lista

---

Historia 5: Ver notificaciones
  Como estudiante, quiero ver mis notificaciones para recibir avisos sobre cronómetro y tareas.

Criterio 1:
  Dado que estoy en `Notificaciones` y he iniciado sesión
  Cuando abro la pantalla
  Entonces veo la lista de `notificacion` relacionada a mis `cronometro` o `tarea`

Criterio 2 (vacío):
  Dado que no tengo notificaciones
  Cuando abro la pantalla
  Entonces veo un mensaje "No hay notificaciones"

---

## Actividad 5 — Priorización MoSCoW y sprints

Must (imprescindible):
- Inicio de sesión / Registro (auth)
- Navegación básica (Home, Dashboard)
- Crear/Listar/Editar tareas básicas
- Editar perfil (propietario)
- Cronómetro: empezar/pausar/guardar sesión (básico)

Should (debería):
- Ver notificaciones vinculadas
- Marcar tarea como completada
- Asociar tareas a `id_estudiante` (si no existe)

Could (podría):
- Eliminar tareas y sesiones antiguas
- Historial de cronómetros
- Marcar notificaciones como leídas

Won't (por ahora):
- Roles administrativos avanzados
- Integraciones externas

Sprint 1 (login + navegación básica):
- Inicio de sesión/registro, Home, Dashboard (estructura), crear/listar tareas básicas, editar perfil mínimo.

Sprint 2 (funcionalidad principal):
- Cronómetro (start/pause/finish con persistencia), completar tarea, ver notificaciones.

Sprint 3 (extras / roles avanzados):
- Historial, borrado avanzado, mejoras de UI, roles/admin.

---

## Cierre — Deuda de datos

- Confirmar que la tabla `tarea` incluye `id_estudiante` como FK en el esquema de producción (hay versiones mixtas en los SQL). Si falta, agregar campo y políticas RLS.
- Alinear la forma en que `auth.uid()` se compara con `estudiante`: usar `auth.uid()` -> `id_estudiante` (UUID) o usar `correo` consistentemente; hoy hay mezcla entre comparar con `correo` y con `id_estudiante`.
- Añadir timestamp/estado para notificaciones leídas si se desea marcar como "leída".
- Decidir si se necesita una tabla intermedia para vincular tareas con cronómetros o proyectos (si se planea esa relación).

---

## Siguientes pasos sugeridos
- Revisar el esquema en Supabase y confirmar FK `id_estudiante` en `tarea` y `cronometro`.
- Implementar endpoints/funciones mínimas para crear tareas y cronómetros y aplicar políticas RLS según las historias.
- Convertir las 5 historias Gherkin en tests E2E o pruebas unitarias.

---

Generado automáticamente a partir del código en el repositorio (componentes React y SQL).