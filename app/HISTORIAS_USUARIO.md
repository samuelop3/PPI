# Taller: De lo que ya tienen (login, Supabase, mapa) a Historias de Usuario

> Estado actualizado: el esquema que usa la aplicación está en [`../supabase/schema.sql`](../supabase/schema.sql). Este documento conserva el ejercicio original, pero su inventario y deuda de datos se mantienen alineados con ese esquema.

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
- **Usuario:** propietario de su perfil, tareas, ajustes Pomodoro y recordatorios.
- **Moderador:** consulta los reportes agregados.
- **Administrador:** gestiona roles y puede consultar reportes.
- Los roles se guardan en `profiles.role`; las operaciones administrativas se validan en funciones de servidor y políticas de Supabase.

**1B. Tablas de Supabase**
- **`profiles`** — Perfil vinculado por UUID a `auth.users`; incluye los roles.
- **`tasks`** — Tareas con propietario, título y estado completado.
- **`pomodoro_settings`** — Preferencias de duración de trabajo y descanso del propietario.
- **`notifications`** — Recordatorios programados con estado, destinatario, intentos y resultado de envío.
- Todas las tablas activan Row Level Security. La función Edge procesa el correo en segundo plano.

**1C. Pantallas (sitemap extraído de componentes)**
- **Home** — Visible a: público / visitante. Tablas: —
- **Login / Registro** — Visible a: visitante. Tablas: Supabase Auth y trigger de perfil.
- **Dashboard** (panel protegido) — Visible a: usuario autenticado. Subpantallas: `Cronómetro`, `Tareas`, `Notificaciones`, `Perfil`; `Reportes` para moderadores/administradores y `Admin` para administradores.
- **Proyecto** — Visible a: público y autenticado (informativa). Tablas: —
- **Perfil** — Visible a: usuario autenticado. Tabla: `profiles`.
- **Tareas** — Visible a: usuario autenticado. Tabla: `tasks`.
- **Cronómetro** — Visible a: usuario autenticado. Tabla: `pomodoro_settings`.
- **Notificaciones** — Visible a: usuario autenticado. Tabla: `notifications`.

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

Tabla `profiles`:
- Create: Al registrarse, un trigger crea el perfil con rol `user`.
- Read/Update: El usuario consulta y modifica sus propios datos; solo un administrador puede listar perfiles y cambiar roles mediante funciones protegidas.

Tabla `pomodoro_settings`:
- Create/Read/Update: El usuario mantiene sus duraciones de trabajo y descanso.

Tabla `tasks`:
- Create/Read/Update/Delete: El usuario administra únicamente sus propias tareas.

Tabla `notifications`:
- Create/Read/Delete: El usuario programa y consulta sus recordatorios; el acceso queda limitado a su cuenta.
- Update de estado: exclusivo del worker de servidor; el usuario puede solicitar un reintento de un recordatorio fallido mediante una función protegida.

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
- Reportes agregados para moderadores y administración de roles protegida para administradores.

---

## Cierre — Puesta en marcha

- Ejecutar `supabase/schema.sql` en el proyecto Supabase y configurar variables de entorno.
- Asignar el primer administrador desde el SQL Editor.
- Para enviar correos con la página cerrada, desplegar la función Edge y configurar el cron de `supabase/schedule_notifications.sql`.
- Las sesiones individuales del cronómetro siguen siendo temporales; se sincronizan las duraciones configuradas, no un historial de sesiones.

---

## Siguientes pasos sugeridos
- Ejecutar pruebas manuales con cuentas de usuario, moderador y administrador en un proyecto Supabase configurado.
- Añadir pruebas de extremo a extremo cuando se defina el entorno de CI del proyecto.

---

Generado automáticamente a partir del código en el repositorio (componentes React y SQL).