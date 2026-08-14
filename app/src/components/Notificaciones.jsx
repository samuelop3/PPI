import { useEffect, useState } from 'react'
import { addNotification, clearNotifications, getNotifications, saveNotifications, getProfile } from '../lib/localData'
import { sendEmailNotification } from '../lib/emailService'

function Notificaciones() {
  const [notifications, setNotifications] = useState(getNotifications())
  const [newMessage, setNewMessage] = useState('')
  const [notificationTime, setNotificationTime] = useState(() => {
    const date = new Date(Date.now() + 5 * 60000)
    return date.toISOString().slice(0, 16)
  })
  const [status, setStatus] = useState('')
  const [emailAddress, setEmailAddress] = useState(getProfile().email || '')
  const [sentNotifications, setSentNotifications] = useState(
    JSON.parse(localStorage.getItem('cronometro-sent-notifications') || '{}')
  )

  // Intervalo que verifica notificaciones cada 10 segundos (no cada 1 segundo para evitar duplicados)
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((current) => {
        const now = new Date()
        let updated = [...current]
        let hasChanges = false

        updated = updated.map((notice) => {
          const scheduled = notice.scheduledAt ? new Date(notice.scheduledAt) : null
          const noticeKey = notice.id

          // Si ya fue entregada, no hacer nada
          if (notice.delivered) {
            return notice
          }

          // Si ya fue enviada, marcar como entregada
          if (sentNotifications[noticeKey]) {
            hasChanges = true
            return {
              ...notice,
              delivered: true,
              deliveredAt: new Date().toISOString(),
            }
          }

          // Si llegó la hora y no ha sido enviada aún
          if (scheduled && scheduled <= now) {
            // Trigger browser notification
            triggerBrowserNotification(notice)

            // Si tiene email, enviar automáticamente
            if (notice.emailAddress) {
              sendAutomaticEmail(notice, noticeKey)
            }

            // Marcar como entregada
            hasChanges = true
            return {
              ...notice,
              due: true,
              delivered: true,
              deliveredAt: new Date().toISOString(),
            }
          }

          return notice
        })

        if (hasChanges) {
          saveNotifications(updated)
          return updated
        }

        return current
      })
    }, 10000) // Verificar cada 10 segundos en lugar de 1 segundo

    return () => clearInterval(interval)
  }, [sentNotifications])

  const sendAutomaticEmail = async (notice, noticeKey) => {
    try {
      const result = await sendEmailNotification({
        to_email: notice.emailAddress,
        to_name: getProfile().name || 'Usuario',
        message: notice.message,
        scheduled_time: new Date(notice.scheduledAt).toLocaleString(),
      })

      if (!result.success) {
        setStatus('⚠️ Gmail no está configurado. Revisa VITE_EMAILJS_PUBLIC_KEY, SERVICE_ID y TEMPLATE_ID en .env.local.')
        return
      }

      const updated = { ...sentNotifications, [noticeKey]: true }
      setSentNotifications(updated)
      localStorage.setItem('cronometro-sent-notifications', JSON.stringify(updated))

      setStatus(`✅ Correo enviado automáticamente a ${notice.emailAddress}`)
    } catch (error) {
      setStatus('⚠️ Error al enviar por Gmail. Verifica la configuración de EmailJS.')
    }
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const triggerBrowserNotification = (notice) => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      new Notification(notice.title, {
        body: notice.message,
        icon: '/favicon.svg',
        tag: notice.id, // Evita notificaciones duplicadas del navegador
      })
    }
  }

  const handleSend = async (event) => {
    event.preventDefault()
    setStatus('')

    const message = newMessage.trim()
    if (!message) {
      setStatus('⚠️ Escribe un mensaje para la notificación.')
      return
    }

    const scheduledAt = new Date(notificationTime)
    if (Number.isNaN(scheduledAt.getTime())) {
      setStatus('⚠️ Selecciona una hora válida para la notificación.')
      return
    }

    const now = new Date()
    if (scheduledAt < now) {
      setStatus('⚠️ Selecciona una hora futura para que la notificación se programe.')
      return
    }

    if (Notification.permission !== 'granted' && emailAddress) {
      await requestNotificationPermission()
    }

    const notification = {
      title: '🔔 Recordatorio',
      message,
      scheduledAt: scheduledAt.toISOString(),
      delivered: false,
      emailAddress: emailAddress || null,
    }

    addNotification(notification)
    setNotifications(getNotifications())
    setNewMessage('')
    setStatus(`✅ Notificación programada para ${scheduledAt.toLocaleString()}. Se enviará automáticamente.`)
  }

  const handleDeleteNotification = (notificationId) => {
    const updated = notifications.filter((n) => n.id !== notificationId)
    saveNotifications(updated)
    setNotifications(updated)
    setStatus('✅ Notificación eliminada.')
  }

  const handleClear = () => {
    clearNotifications()
    setNotifications([])
    setStatus('✅ Todas las notificaciones han sido eliminadas.')
  }

  return (
    <div className="notificaciones-section">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h5">📨 Programar notificación</h2>
            <p className="text-muted mb-3">Crea un recordatorio que se enviará automáticamente al correo en la hora elegida.</p>
            {status && (
              <div className={`alert ${status.includes('Error') || status.includes('⚠️') ? 'alert-warning' : 'alert-info'}`} role="alert">
                {status}
              </div>
            )}
            <form onSubmit={handleSend}>
              <div className="mb-3">
                <label htmlFor="notificationInput" className="form-label">
                  📝 Mensaje
                </label>
                <textarea
                  id="notificationInput"
                  className="form-control"
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  placeholder="Ej. Revisa la tarea de hoy"
                  rows="3"
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="notificationTime" className="form-label">
                    🕐 Hora de envío
                  </label>
                  <input
                    id="notificationTime"
                    type="datetime-local"
                    className="form-control"
                    value={notificationTime}
                    onChange={(event) => setNotificationTime(event.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="notificationEmail" className="form-label">
                    ✉️ Correo destino
                  </label>
                  <input
                    id="notificationEmail"
                    type="email"
                    className="form-control"
                    value={emailAddress}
                    onChange={(event) => setEmailAddress(event.target.value)}
                    placeholder="tu@correo.com"
                  />
                </div>
              </div>

              <div className="alert alert-info small mb-3">
                <strong>ℹ️ Cómo funciona:</strong><br/>
                • La notificación se enviará automáticamente en la hora elegida<br/>
                • Se enviará UNA SOLA VEZ a tu correo electrónico<br/>
                • También recibirás una notificación del navegador
              </div>

              <button type="submit" className="btn btn-primary w-100">
                ✅ Programar notificación
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="border rounded-3 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="h5 mb-0">📋 Notificaciones programadas</h2>
                <p className="text-muted mb-0 small">Avisos que se enviarán automáticamente</p>
              </div>
              {notifications.length > 0 && (
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleClear}>
                  Borrar todo
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No hay notificaciones programadas.
              </div>
            ) : (
              <div className="list-group">
                {notifications.map((notice) => (
                  <div
                    key={notice.id}
                    className={`list-group-item ${notice.delivered ? 'bg-light' : 'bg-white'}`}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <strong>{notice.title}</strong>
                          {notice.delivered ? (
                            <span className="badge bg-success">✅ Enviada</span>
                          ) : (
                            <span className="badge bg-warning text-dark">⏳ Pendiente</span>
                          )}
                        </div>
                        <div className="small text-muted mt-1">
                          🕐 {new Date(notice.scheduledAt).toLocaleString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-close"
                        onClick={() => handleDeleteNotification(notice.id)}
                        title="Eliminar"
                      />
                    </div>
                    <p className="mb-2 mt-2">{notice.message}</p>
                    {notice.emailAddress && (
                      <div className="small text-muted">
                        ✉️ Correo: <strong>{notice.emailAddress}</strong>
                      </div>
                    )}
                    {notice.delivered && notice.deliveredAt && (
                      <div className="small text-success mt-2">
                        ✓ Entregada: {new Date(notice.deliveredAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notificaciones
