# 🔧 Arreglar Error "undefined" al enviar correo

## El Problema
Cuando intentas enviar un correo, aparece: **"Error al enviar correo: undefined"**

Esto significa que la plantilla de EmailJS no tiene los parámetros que espera.

---

## ✅ Soluciones (intenta en este orden)

### 1️⃣ VERIFICA TU PLANTILLA EN EMAILJS
**Esto es lo más probable que esté mal:**

1. Ve a https://dashboard.emailjs.com/
2. Click en **Email Templates**
3. Selecciona tu plantilla
4. En la sección de **Body**, verifica que tenga EXACTAMENTE esto:

```
{{message}}

---
⏰ Programado: {{scheduled_time}}
Cronómetro App
```

**IMPORTANTE:** Los nombres de variables DEBEN SER EXACTOS:
- ✅ `{{message}}` 
- ✅ `{{scheduled_time}}`
- ❌ NO `{{msg}}`, NO `{{scheduled}}` etc.

---

### 2️⃣ VERIFICA TU .env.local
Abre `/workspaces/PPI/app/.env.local` y verifica:

```env
VITE_EMAILJS_PUBLIC_KEY=abc123... (tu key real, NO "YOUR_PUBLIC_KEY")
VITE_EMAILJS_SERVICE_ID=gmail_xxx... (tu service ID real)
VITE_EMAILJS_TEMPLATE_ID=template_xxx... (tu template ID real)
```

**Si alguno tiene "YOUR_"**, reemplázalo con el valor real.

---

### 3️⃣ REINICIA EL SERVIDOR
Después de cambiar `.env.local`:

1. Presiona `Ctrl+C` en la terminal donde corre `npm run dev`
2. Ejecuta: `npm run dev`
3. Recarga la página en el navegador (F5)

---

### 4️⃣ VERIFICA EN LA CONSOLA DEL NAVEGADOR
1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Mira los mensajes: debería decir algo como:
   - `📧 Enviando con: {to_email: "tu@email.com", ...}`
   - Si ves esto, significa que los parámetros se están enviando bien

Si ves `undefined` en la consola, copia el mensaje exacto y comparte.

---

### 5️⃣ PRUEBA CON LA PLANTILLA ALTERNATIVA
Si nada funciona, intenta esta plantilla más simple:

En tu dashboard de EmailJS, en el **Body** pon:

```
Message: {{message}}

Time: {{scheduled_time}}
```

(Sin los emojis ni el separador)

---

## 🆘 Si Nada Funciona

### Opción A: Usa la simulación (funciona en desarrollo)
- Simplemente NO llenes `VITE_EMAILJS_PUBLIC_KEY`
- Deja `.env.local` con valores de ejemplo
- El correo se "simula" en localStorage
- Perfecto para probar sin Gmail real

### Opción B: Recrea la plantilla desde cero
1. Ve a https://dashboard.emailjs.com/email-templates
2. Elimina tu plantilla actual (trash icon)
3. Haz click **Create New Template**
4. En **Body**, copia EXACTAMENTE:

```
{{message}}

---
{{scheduled_time}}
```

5. Click **Save**
6. Copia el nuevo **Template ID**
7. Actualiza `.env.local` con el nuevo ID
8. Reinicia servidor

---

## 📋 Checklist de Debugging

- [ ] ¿Verificaste que tu plantilla tiene `{{message}}` y `{{scheduled_time}}`?
- [ ] ¿Tu `.env.local` NO tiene valores de ejemplo ("YOUR_...")?
- [ ] ¿Reiniciaste el servidor después de cambiar `.env.local`?
- [ ] ¿Recargaste la página del navegador (F5)?
- [ ] ¿Gmail está conectado a EmailJS (verde ✅)?
- [ ] ¿Tu SERVICE_ID comienza con "gmail_"?
- [ ] ¿Tu TEMPLATE_ID comienza con "template_"?

---

## 💡 Qué Significa Cada Error

| Error | Causa | Solución |
|-------|-------|----------|
| "undefined" | Parámetro no existe en la plantilla | Verifica que la plantilla tenga `{{message}}` y `{{scheduled_time}}` |
| "Service not found" | SERVICE_ID incorrecto | Copia el ID gris de Email Services |
| "Template not found" | TEMPLATE_ID incorrecto | Copia el ID de Email Templates |
| "Invalid API key" | PUBLIC_KEY incorrecta | Copia de https://dashboard.emailjs.com/admin/account |

---

## ✨ Después de Arreglarlo

Una vez funcione, deberías ver:
1. ✅ Mensaje de confirmación en la app
2. 📧 Correo en tu Gmail (revisa también SPAM)
3. 📧 Correo simple con solo tu mensaje

¿Todavía no funciona? Comparte en la consola qué error específico ves. 🔍
