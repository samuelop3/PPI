# 📧 Si ya tienes EmailJS configurado, actualiza tu plantilla

Si ya configuraste EmailJS y quieres que el correo sea más simple (sin tanto texto por defecto), sigue estos pasos:

## 🔧 Actualizar Plantilla Existente

### Opción 1: Plantilla Minimalista (Recomendada)
1. Ve a https://dashboard.emailjs.com/ 
2. Click en **Email Templates**
3. Selecciona tu plantilla actual
4. Reemplaza TODO el contenido con:

```
{{message}}

---
⏰ Programado: {{scheduled_time}}
Cronómetro App
```

5. Click en **Save**
6. ¡Listo! El próximo correo será limpio y simple

---

### Opción 2: Plantilla con Más Detalles
Si prefieres un poco más de información:

```
🔔 Recordatorio

{{message}}

📅 Programado para: {{scheduled_time}}

---
Enviado desde Cronómetro App
```

---

## ✅ Resultado

Cuando programe una notificación con el mensaje:
```
Revisar tareas pendientes del día
```

**Recibirás un correo así:**

```
Revisar tareas pendientes del día

---
⏰ Programado: 14/08/2026 14:30:00
Cronómetro App
```

**SIN** todo el texto por defecto anterior.

---

## 💡 Nota

- El asunto del correo seguirá siendo "Recordatorio" (configurado en EmailJS)
- Si quieres cambiar el asunto también, ve a la sección "Subject" de tu plantilla en EmailJS
- Los cambios aplican inmediatamente - no necesitas reiniciar nada
