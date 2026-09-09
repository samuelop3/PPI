import emailjs from '@emailjs/browser'

let isInitialized = false

export const initEmailJS = () => {
  if (isInitialized) return
  
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  
  if (PUBLIC_KEY && PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    try {
      emailjs.init(PUBLIC_KEY)
      isInitialized = true
    } catch {
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

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      return { success: false, configured: false }
    }

    if (
      SERVICE_ID === 'YOUR_SERVICE_ID' ||
      SERVICE_ID === 'your_service_id_here' ||
      TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
      TEMPLATE_ID === 'your_template_id_here' ||
      PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
      PUBLIC_KEY === 'your_public_key_here'
    ) {
      return { success: false, configured: false }
    }

    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: params.to_email,
      to_name: params.to_name || 'Usuario',
      message: params.message,
      scheduled_time: params.scheduled_time,
    })

    return { success: true, configured: true, messageId: result.status }
  } catch {
    return { success: false, configured: true }
  }
}

export const sendEmailNotification = async (params) => {
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!PUBLIC_KEY || PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || PUBLIC_KEY === 'your_public_key_here') {
    return { success: false, configured: false }
  }

  return await sendRealEmailNotification(params)
}
