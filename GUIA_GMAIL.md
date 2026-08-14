# 📧 Guía: Configurar Notificaciones por Gmail

## Problema
Las notificaciones no se envían a Gmail porque EmailJS no está configurado.

## Solución: Configurar EmailJS + Gmail (5 minutos)

### ✅ Paso 1: Crear cuenta en EmailJS (GRATIS)
1. Ve a https://www.emailjs.com/
2. Haz clic en **Sign Up**
3. Registrate con tu email (puedes usar Gmail)
4. Verifica tu correo
5. ¡Listo! Tienes 200 correos/mes gratis

---

### ✅ Paso 2: Obtener tu PUBLIC_KEY
1. Después de registrarte, ve a https://dashboard.emailjs.com/admin/account
2. En la sección **API Keys**, copia tu **Public Key**
3. Guárdalo (lo necesitaremos en el Paso 4)

---

### ✅ Paso 3: Conectar Gmail a EmailJS
1. En el dashboard de EmailJS, ve a **Email Services** (lado izquierdo)
2. Haz clic en **Add Service**
3. Selecciona **Gmail**
4. Sigue estos pasos:
   - Ingresa tu email de Gmail
   - Haz clic en **Connect Account**
   - Se abrirá una ventana de Google
   - Inicia sesión con tu cuenta de Gmail
   - Dale permisos a EmailJS
   - Verifica que aparezca como "Connected" (verde) ✅

**Importante:** Si usas Gmail con 2FA, necesitas una **Contraseña de Aplicación**:
- Ve a https://myaccount.google.com/apppasswords
- Selecciona "Correo" y "Windows"
- Google te generará una contraseña
- Usa esa contraseña en EmailJS en lugar de tu contraseña normal

---

### ✅ Paso 4: Crear una Plantilla SIMPLE
1. En el dashboard, ve a **Email Templates** (lado izquierdo)
2. Haz clic en **Create New Template**
3. Copia y pega esto en el editor (versión simple - solo el mensaje):

```
{{message}}

---
⏰ Recordatorio programado para: {{scheduled_time}}
Enviado desde Cronómetro App
```

**Alternativa - Si quieres más información:**
```
🔔 Recordatorio

{{message}}

📅 Programado para: {{scheduled_time}}
👤 Para: {{to_name}}

---
Enviado desde Cronómetro App
```

4. Haz clic en **Save** (debe mostrar "Template ID: template_xxxx")
5. Copia ese **Template ID** (lo necesitaremos en el Paso 5)

---

### ✅ Paso 5: Obtener tu SERVICE_ID
1. Vuelve a **Email Services** en el dashboard
2. Junto al servicio Gmail que conectaste, verás un ID gris (ej: `gmail_1234567890`)
3. Copia ese **Service ID**

---

### ✅ Paso 6: Crear archivo .env.local
1. En la carpeta `/workspaces/PPI/app/`, crea un archivo llamado **`.env.local`**
2. Copia esto y reemplaza con tus valores:

```env
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_del_paso_2
VITE_EMAILJS_SERVICE_ID=tu_service_id_del_paso_5
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_del_paso_4
```

**Ejemplo:**
```env
VITE_EMAILJS_PUBLIC_KEY=k1a2b3c4d5e6f7g8h9i0
VITE_EMAILJS_SERVICE_ID=gmail_1234567890
VITE_EMAILJS_TEMPLATE_ID=template_abcdef1234567
```

3. Guarda el archivo
4. **Reinicia el servidor**: `npm run dev`

---

### ✅ Paso 7: ¡Prueba!
1. Abre la app: http://localhost:5173/
2. Inicia sesión
3. Ve a **Notificaciones**
4. Programa una notificación en 1-2 minutos
5. Espera... ¡Deberías recibir un correo en Gmail! 📧

---

## 🔧 Troubleshooting

### "No recibo el correo"
- ✅ Verifica que Gmail esté **Connected** (verde) en EmailJS
- ✅ Revisa la carpeta de SPAM de Gmail
- ✅ Verifica que `.env.local` tenga los valores correctos
- ✅ Reinicia el servidor después de crear `.env.local`

### "Error 400 en EmailJS"
- Significa que los parámetros no coinciden con la plantilla
- Verifica que tu plantilla tenga: `{{to_email}}`, `{{subject}}`, `{{message}}`, `{{scheduled_time}}`

### "Error 401"
- Tu PUBLIC_KEY está mal
- Copia nuevamente desde https://dashboard.emailjs.com/admin/account

### "Service not found"
- Tu SERVICE_ID está mal
- Verifica que Gmail esté conectado en EmailServices

---

## 📊 Plan Gratis de EmailJS
- ✅ 200 correos/mes
- ✅ 1 servicio de email
- ✅ Unlimited templates
- ✅ Perfecto para desarrollo y testing

Si necesitas más correos, puedes hacer upgrade a un plan pago.

---

## ✨ ¿Qué pasará después?

Una vez configurado:
1. Programa una notificación en la app
2. A la hora exacta, la app enviará **UNA sola notificación** a tu Gmail
3. Recibirás un correo con:
   - Tu mensaje personalizado
   - Hora de envío
   - Información del recordatorio

---

¡Disfruta de las notificaciones automáticas! 🚀
