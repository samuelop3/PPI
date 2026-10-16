# Esquema de base de datos actual

El esquema que utiliza la aplicación es [`supabase/schema.sql`](./supabase/schema.sql). Incluye perfiles vinculados a `auth.users`, tareas, preferencias Pomodoro, recordatorios programados, Row Level Security y funciones protegidas de administración.

Para configurar el envío de correos, sigue el apartado de Supabase del [README](./README.md) y configura [`supabase/schedule_notifications.sql`](./supabase/schedule_notifications.sql) después de desplegar la función Edge.

Los archivos `DB.sql`, `populardb.sql` y `profiles.md` contienen ejercicios/esquemas históricos incompatibles con la aplicación actual. No los ejecutes en el proyecto Supabase de PPI.
