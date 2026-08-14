import emailjs from '@emailjs/browser'

// Configuración de EmailJS (usa credenciales públicas - es seguro para desarrollo)
// Registrate en https://www.emailjs.com/ para obtener tus credenciales
export const initEmailJS = () => {
  // Puedes obtener tu PUBLIC_KEY en emailjs.com
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
  emailjs.init(PUBLIC_KEY)
}

export const sendEmailNotification = async (params) => {
  try {
    // Necesitas crear un servicio en emailjs.com
    // SERVICE_ID: tu ID de servicio de correo
    // TEMPLATE_ID: tu ID de plantilla
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID'
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
    return { success: true, messageId: response.status }
  } catch (error) {
    console.error('Error enviando correo:', error)
    return { success: false, error: error.message }
  }
}

// Versión de prueba que simula envío de correo (sin requerer configuración de EmailJS)
export const sendTestEmailNotification = async (params) => {
  // Simula un envío de correo guardando en localStorage
  const sentEmails = JSON.parse(localStorage.getItem('cronometro-sent-emails') || '[]')
  
  const emailRecord = {
    id: Date.now().toString(),
    to: params.to_email,
    subject: params.subject,
    message: params.message,
    sentAt: new Date().toISOString(),
    status: 'enviado',
  }

  sentEmails.push(emailRecord)
  localStorage.setItem('cronometro-sent-emails', JSON.stringify(sentEmails))

  return { success: true, messageId: emailRecord.id }
}
