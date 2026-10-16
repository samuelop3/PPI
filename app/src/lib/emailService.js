import emailjs from '@emailjs/browser'

let isInitialized = false
const isPlaceholder = (value) => !value?.trim() || /^(your_|tu_)|_your_/i.test(value)

export const initEmailJS = () => {
  if (isInitialized) return
  
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  
  if (!isPlaceholder(PUBLIC_KEY)) {
    emailjs.init(PUBLIC_KEY)
    isInitialized = true
  }
}

initEmailJS()

export const sendRealEmailNotification = async (params) => {
  try {
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (isPlaceholder(SERVICE_ID) || isPlaceholder(TEMPLATE_ID) || isPlaceholder(PUBLIC_KEY)) {
      return { success: false, configured: false }
    }

    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: params.to_email,
      to_name: params.to_name || 'Usuario',
      message: params.message,
      scheduled_time: params.scheduled_time,
    })

    return { success: true, configured: true, messageId: result.status }
  } catch (error) {
    return { success: false, configured: true, error: error.message }
  }
}

export const sendEmailNotification = async (params) => {
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (isPlaceholder(PUBLIC_KEY)) {
    return { success: false, configured: false }
  }

  return await sendRealEmailNotification(params)
}
