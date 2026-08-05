import { useEffect, useState } from 'react'
import { addNotification, clearNotifications, getNotifications, saveNotifications, getProfile } from '../lib/localData'

function Notificaciones() {
  const [notifications, setNotifications] = useState(getNotifications())
  const [newMessage, setNewMessage] = useState('')
  const [notificationTime, setNotificationTime] = useState(() => {
    const date = new Date(Date.now() + 5 * 60000)
    return date.toISOString().slice(0, 16)
  })
  const [status, setStatus] = useState('')
  const [emailAddress, setEmailAddress] = useState(getProfile().email || '')

  useEffect(() => {
    setNotifications(getNotifications())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((current) => {
        const now = new Date()
        let updated = current.map((notice) => {
          const scheduled = notice.scheduledAt ? new Date(notice.scheduledAt) : null
          if (scheduled && !notice.delivered && scheduled <= now) {
            triggerBrowserNotification(notice)
            return {
              ...notice,
              readyToSend: Boolean(notice.emailAddress),
              due: true,
            }
          }
          return notice
        })

        const changed = updated.some((notice, index) => JSON.stringify(notice) !== JSON.stringify(current[index]))
        if (changed) {
          saveNotifications(updated)
          return updated
        }

        return current
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

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
      })
      setStatus(`Notificación enviada: ${notice.message}`)
    } else {
      setStatus(`Es hora de: ${notice.message}`)
    }
  }

  const triggerEmailNotification = (notice) => {
    const emailTo = notice.emailAddress
    if (!emailTo) return

    const subject = encodeURIComponent('Recordatorio de tarea: ' + notice.message)
    const body = encodeURIComponent(`Es hora de hacer tu tarea:\n\n${notice.message}\n\nProgramado para: ${new Date(notice.scheduledAt).toLocaleString()}`)
    const mailto = `mailto:${emailTo}?subject=${subject}&body=${body}`

    try {
      const anchor = document.createElement('a')
      anchor.href = mailto
      anchor.target = '_blank'
      anchor.rel = 'noreferrer noopener'
      anchor.click()
      setStatus(`Correo abierto en tu cliente para ${emailTo}`)
    } catch (error) {
      setStatus(`No se pudo abrir el correo automáticamente. Usa este email: ${emailTo}`)
    }
  }

  const handleSend = async (event) => {
    event.preventDefault()
    setStatus('')

    const message = newMessage.trim()
    if (!message) {
      setStatus('Escribe un mensaje para la notificación.')
      return
    }

    const scheduledAt = new Date(notificationTime)
    if (Number.isNaN(scheduledAt.getTime())) {
      setStatus('Selecciona una hora válida para la notificación.')
      return
    }

    const now = new Date()
    if (scheduledAt < now) {
      setStatus('Selecciona una hora futura para que la notificación se programe.')
      return
    }

    if (Notification.permission !== 'granted') {
      await requestNotificationPermission()
    }

    const notification = {
      title: 'Notificación programada',
      message,
      scheduledAt: scheduledAt.toISOString(),
      delivered: false,
      emailAddress: emailAddress || null,
    }

    addNotification(notification)
    setNotifications(getNotifications())
    setNewMessage('')
    setStatus(`Notificación programada para ${scheduledAt.toLocaleString()}`)
  }

  const handleClear = () => {
    clearNotifications()
    setNotifications([])
  }

  return (
    <div className="notificaciones-section">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h5">Enviar notificación</h2>
            <p className="text-muted mb-3">Agrega un aviso rápido y programa el envío de correo en tu cliente.</p>
            {status && (
              <div className="alert alert-info" role="alert">
                {status}
              </div>
            )}
            <form onSubmit={handleSend}>
              <div className="mb-3">
                <label htmlFor="notificationInput" className="form-label">
                  Mensaje
                </label>
                <input
                  id="notificationInput"
                  type="text"
                  className="form-control"
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  placeholder="Ej. Revisa la tarea de hoy"
                />
              </div>
              <div className="alert alert-secondary small">
                Nota: el correo se prepara en tu cliente de correo cuando llegue la hora programada.
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="notificationTime" className="form-label">
                    Hora de notificación
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
                    Enviar correo a
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
              <button type="submit" className="btn btn-primary w-100">
                Programar notificación
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="border rounded-3 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="h5 mb-0">Notificaciones</h2>
                <p className="text-muted mb-0">Tus avisos programados.</p>
              </div>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleClear}>
                Borrar todo
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                No hay notificaciones todavía.
              </div>
            ) : (
              <div className="list-group">
                {notifications.map((notice) => (
                  <div key={notice.id} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{notice.title}</strong>
                        <div className="small text-muted">Programado para {new Date(notice.scheduledAt).toLocaleString()}</div>
                      </div>
                      <small className="text-muted">
                        {notice.delivered ? 'Entregada' : 'Pendiente'}
                      </small>
                    </div>
                    <p className="mb-1">{notice.message}</p>
                    {notice.emailAddress && (
                      <div className="small text-muted mb-2">Correo: {notice.emailAddress}</div>
                    )}
                    {notice.due && notice.emailAddress && !notice.delivered && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => triggerEmailNotification(notice)}
                      >
                        Enviar correo ahora
                      </button>
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
