# Cronómetro PPI

Aplicación web en español para organizar tareas, trabajar con bloques Pomodoro y programar recordatorios. Usa React, Vite y Supabase; también ofrece un modo local de desarrollo sin servicios externos.

## Requisitos e inicio

Requiere Node.js 20.19 o superior (o 22.12 o superior) y npm.

```bash
cd app
npm ci
npm run dev
```

Sin variables de Supabase, `npm run dev` usa autenticación y almacenamiento locales. Ese modo es solo para desarrollo y guarda los datos en el navegador.

## Configurar Supabase

1. Crea un proyecto Supabase y copia `app/.env.example` a `app/.env.local`.
2. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los valores públicos del proyecto.
3. Ejecuta [`supabase/schema.sql`](./supabase/schema.sql) en el SQL Editor de Supabase. El esquema crea tablas nuevas `profiles`, `tasks`, `pomodoro_settings` y `notifications` con Row Level Security.
4. Confirma el registro de una cuenta y asígnale el rol inicial de administrador desde el SQL Editor:

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'correo-del-administrador@ejemplo.com';
   ```

5. Reinicia Vite después de cambiar las variables de entorno.

El sistema de acceso no usa `DB.sql` ni `populardb.sql`: son esquemas anteriores del proyecto. Para la aplicación actual, `supabase/schema.sql` es la fuente de verdad.

## Envío de recordatorios en segundo plano

Los recordatorios remotos se guardan en Supabase. Para que se envíen aunque el usuario cierre la página, configura el worker en Supabase y una cuenta de Resend con dominio/correo remitente verificado:

1. Instala y vincula Supabase CLI con el proyecto.
2. Genera un secreto aleatorio, guárdalo para usar el mismo valor en la función y en `schedule_notifications.sql`, y configura los secretos del proyecto:

   ```bash
   openssl rand -hex 32
   supabase secrets set CRON_SECRET="valor-generado" RESEND_API_KEY="re_..." RESEND_FROM="Cronómetro PPI <notificaciones@tudominio.com>"
   ```

   `RESEND_FROM` debe ser un remitente verificado por Resend. No publiques los valores reales.
3. Despliega `send-due-notifications` sin verificación JWT: usa `supabase functions deploy send-due-notifications --no-verify-jwt`. El worker valida su propio `CRON_SECRET` y usa la clave service-role que Supabase proporciona al entorno Edge Function.
4. En [`supabase/schedule_notifications.sql`](./supabase/schedule_notifications.sql), reemplaza la URL del proyecto y el placeholder del secreto por los mismos valores configurados en la función; ejecuta el script en SQL Editor.

El programador consulta cada minuto, procesa recordatorios con bloqueo para evitar envíos paralelos y reintenta fallos hasta tres veces. Mantener la página abierta añade notificaciones del navegador; para correo remoto, el worker sigue funcionando aunque la página esté cerrada. Nunca pongas `RESEND_API_KEY`, `CRON_SECRET` ni la clave `service_role` en variables `VITE_*`.

Las notificaciones del modo local se procesan mientras la aplicación está abierta. Para correo local opcional, configura EmailJS en `.env.local`; estas credenciales públicas no se usan en el envío remoto.

## Comprobaciones

Desde `app/`:

```bash
npm run lint
npm run test
npm run build
```

## Funcionalidades

- Registro e inicio de sesión.
- Inicio, proyecto y pie de página públicos; las secciones privadas requieren sesión.
- Gestión de tareas y ajustes Pomodoro persistidos en Supabase o en almacenamiento local de desarrollo.
- Perfil editable y recordatorios con estado de entrega, reintentos y correo programado del lado del servidor.
- Administración de roles mediante funciones autorizadas en Supabase y políticas Row Level Security.
- Reportes de usuarios y tareas para administradores y moderadores.
