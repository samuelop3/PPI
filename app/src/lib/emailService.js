import emailjs from '@emailjs/browser'

let isInitialized = false

export const initEmailJS = () => {
  if (isInitialized) return
  
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  
  if (PUBLIC_KEY && PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    try {
      emailjs.init(PUBLIC_KEY)
      isInitialized = true
    } catch (error) {
      // Fallo silencioso
    }
  }
}

initEmailJS()

export const sendRealEmailNotification = async (params) => {
  try {
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return { success: false }
    if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID') return { success: false }

    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: params.to_email,
      to_name: params.to_name || 'Usuario',
      message: params.message,
      scheduled_time: params.scheduled_time,
    })
    
    return { success: true, messageId: result.status }
  } catch (error) {
    return { success: false }
  }
}

export const sendTestEmailNotification = async (params) => {
  const sentEmails = JSON.parse(localStorage.getItem('cronometro-sent-emails') || '[]')
  sentEmails.push({
    id: Date.now().toString(),
    to: params.to_email,
    message: params.message,
    sentAt: new Date().toISOString(),
  })
  localStorage.setItem('cronometro-sent-emails', JSON.stringify(sentEmails))
  return { success: true, messageId: Date.now().toString() }
}

export const sendEmailNotification = async (params) => {
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  
  if (PUBLIC_KEY && PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    const result = await sendRealEmailNotification(params)
    if (result.success) return result
  }
  
  return await sendTestEmailNotification(params)
}
