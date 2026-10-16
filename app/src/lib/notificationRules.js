export function validateNotificationInput({
  message,
  scheduledAt,
  emailAddress,
  requiresEmail = false,
  now = new Date(),
}) {
  const trimmedMessage = message.trim()
  if (!trimmedMessage) return 'Escribe un mensaje para el recordatorio.'
  if (trimmedMessage.length > 500) return 'El mensaje no puede superar los 500 caracteres.'

  const scheduledDate = new Date(scheduledAt)
  if (Number.isNaN(scheduledDate.getTime()) || scheduledDate <= now) {
    return 'Selecciona una fecha y hora futuras válidas.'
  }
  if (requiresEmail && !emailAddress.trim()) {
    return 'Indica un correo: el envío en segundo plano requiere un destinatario.'
  }
  return null
}

export function getDueNotifications(notifications, now = new Date(), includeProcessing = false) {
  return notifications.filter((notice) => {
    const scheduledAt = new Date(notice.scheduledAt)
    return !notice.delivered
      && !notice.failed
      && (includeProcessing || !notice.processing)
      && !Number.isNaN(scheduledAt.getTime())
      && scheduledAt <= now
  })
}
