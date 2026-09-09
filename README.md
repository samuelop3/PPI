# Cronómetro PPI

Aplicación web para organizar tareas, administrar sesiones de trabajo con la técnica Pomodoro y programar notificaciones por correo. La aplicación está construida con React, Vite y Supabase, e incluye un modo local para desarrollo sin credenciales externas.

## Capturas de pantalla

La interfaz incluye una pantalla de inicio, autenticación, dashboard protegido, cronómetro, tareas, notificaciones, perfil y vistas de administración según el rol del usuario.

## Tecnologías usadas

- React 19
- Vite
- Supabase Auth
- EmailJS para el envío de correos
- Bootstrap 5 y CSS personalizado
- Oxlint

## Instalación y ejecución

Requisitos: Node.js 20 o superior y npm.

```bash
git clone <url-del-repositorio>
cd PPI/app
npm install
npm run dev
```

Para comprobar la aplicación antes de publicarla:

```bash
npm run lint
npm run build
```

## Variables de entorno

Copia `app/.env.example` como `app/.env.local` y completa los valores. Nunca subas las claves reales al repositorio.

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_publica
VITE_EMAILJS_PUBLIC_KEY=tu_clave_publica_de_emailjs
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
```

El template de EmailJS debe aceptar `to_email`, `to_name`, `message` y `scheduled_time`. Las notificaciones programadas se procesan en el navegador, por lo que la aplicación debe permanecer abierta para enviar el correo en la hora indicada.

## Estructura del proyecto

- `app/src/components` -> componentes reutilizables y vistas de la aplicación.
- `app/src/lib/supabaseClient.js` -> autenticación con Supabase y fallback local.
- `app/src/lib/localData.js` -> persistencia local separada por usuario.
- `app/src/lib/emailService.js` -> integración con EmailJS.
- `app/src/App.jsx` -> sesión, navegación y composición principal.
- `app/src/App.css` -> estilos visuales de la aplicación.

## Funcionalidades

- [x] Registro e inicio de sesión.
- [x] Persistencia de la sesión activa.
- [x] Cronómetro de trabajo y descanso con configuración Pomodoro.
- [x] Crear, completar y eliminar tareas.
- [x] Guardar perfil, preferencias y datos de usuario.
- [x] Programar notificaciones del navegador.
- [x] Enviar notificaciones por correo mediante EmailJS configurado.
- [x] Menús y permisos para usuarios, moderadores y administradores.
- [x] Persistencia local de respaldo cuando no hay configuración de Supabase.

## Autores

Equipo del proyecto PPI.

## Licencia

Proyecto académico. Todos los derechos reservados por sus autores.