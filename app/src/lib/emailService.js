import emailjs from '@emailjs/browser'

// Configuración de EmailJS - Inicialización
let isInitialized = false

export const initEmailJS = () => {
  if (isInitialized) return
  
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  
  if (PUBLIC_KEY && PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(PUBLIC_KEY)
    isInitialized = true
    console.log('✅ EmailJS inicializado correctamente')
  } else {
    console.warn('⚠️ EmailJS no configurado. Asigna VITE_EMAILJS_PUBLIC_KEY en .env.local')
  }
}

// Inicializar automáticamente al importar
initEmailJS()

export const sendRealEmailNotification = async (params) => {
  try {
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    // Verificar que todas las credenciales estén configuradas
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.warn('Credenciales de EmailJS incompletas')
      return { success: false, error: 'EmailJS no configurado correctamente' }
    }

    if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      return { success: false, error: 'EmailJS no configurado - usa valores de prueba' }
    }

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: params.to_email,
      to_name: params.to_name || 'Usuario',
      subject: params.subject,
      message: params.message,
      scheduled_time: params.scheduled_time,
      from_name: 'Cronómetro App',
    })

    console.log('✅ Correo enviado:', response.status)
    return { success: true, messageId: response.status }
  } catch (error) {
    console.error('❌ Error enviando correo:', error)
    return { success: false, error: error.message }
  }
}

// Versión de simulación para desarrollo (sin EmailJS configurado)
export const sendTestEmailNotification = async (params) => {
  // Simula un envío guardando en localStorage
  const sentEmails = JSON.parse(localStorage.getItem('cronometro-sent-emails') || '[]')
  
  const emailRecord = {
    id: Date.now().toString(),
    to: params.to_email,
    subject: params.subject,
    message: params.message,
    sentAt: new Date().toISOString(),
    status: 'simulado-local',
  }

  sentEmails.push(emailRecord)
  localStorage.setItem('cronometro-sent-emails', JSON.stringify(sentEmails))

  console.log('📧 Correo simulado (desarrollo):', emailRecord)
  return { success: true, messageId: emailRecord.id }
}

// Función inteligente que elige entre real o simulado
export const sendEmailNotification = async (params) => {
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  
  // Si está configurado con credenciales reales, usar EmailJS
  if (PUBLIC_KEY && PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    return await sendRealEmailNotification(params)
  }
  
  // Si no, usar simulación
  return await sendTestEmailNotification(params)
}
