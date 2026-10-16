import { useEffect, useState } from 'react'
import {
  createScheduledNotification,
  defaultProfile,
  deleteAllScheduledNotifications,
  deleteScheduledNotification,
  loadNotifications,
  loadProfile,
  retryNotification,
  usesSupabase,
} from '../lib/dataService'
import { validateNotificationInput } from '../lib/notificationRules'

function Notificaciones() {
  const [notifications, setNotifications] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [notificationTime, setNotificationTime] = useState(() => {
    const date = new Date(Date.now() + 5 * 60000)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date.toISOString().slice(0, 16)
  })
  const [status, setStatus] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const refresh = async () => {
    setNotifications(await loadNotifications())
  }

  useEffect(() => {
    Promise.all([loadNotifications(), loadProfile()])
      .then(([items, profile]) => {
        setNotifications(items)
        setEmailAddress(profile.email || defaultProfile().email)
      })
      .catch((error) => setStatus(`No se pudieron cargar los recordatorios: ${error.message}`))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadNotifications()
        .then(setNotifications)
        .catch((error) => setStatus(`No se pudo actualizar el estado: ${error.message}`))
    }, 30000)
    return () => window.clearInterval(interval)
  }, [])

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    return (await Notification.requestPermission()) === 'granted'
  }

  const handleSend = async (event) => {
    event.preventDefault()
    setStatus('')

    const message = newMessage.trim()
    const validationError = validateNotificationInput({
      message,
      scheduledAt: notificationTime,
      emailAddress,
      requiresEmail: usesSupabase,
    })
    if (validationError) {
      setStatus(validationError)
      return
    }
    const scheduledAt = new Date(notificationTime)

    setSaving(true)
    try {
      await requestNotificationPermission()
      const created = await createScheduledNotification({
        title: 'Recordatorio',
        message,
        scheduledAt: scheduledAt.toISOString(),
        emailAddress: emailAddress.trim() || null,
      })
      setNotifications((current) => [created, ...current])
      setNewMessage('')
      setStatus(
        usesSupabase
          ? 'Recordatorio programado. Se enviará desde el servidor cuando el programador esté configurado.'
          : 'Recordatorio programado. Para procesarlo, mantén esta aplicación abierta.',
      )
    } catch (error) {
      setStatus(`No se pudo programar el recordatorio: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteNotification = async (id) => {
    try {
      await deleteScheduledNotification(id)
      setNotifications((current) => current.filter((notice) => notice.id !== id))
      setStatus('Recordatorio eliminado.')
    } catch (error) {
      setStatus(`No se pudo eliminar el recordatorio: ${error.message}`)
    }
  }

  const handleClear = async () => {
    try {
      await deleteAllScheduledNotifications()
      await refresh()
      setStatus('Se eliminaron los recordatorios que todavía no estaban en proceso.')
    } catch (error) {
      setStatus(`No se pudieron eliminar los recordatorios: ${error.message}`)
    }
  }

  const handleRetry = async (id) => {
    try {
      await retryNotification(id)
      await refresh()
      setStatus('Recordatorio programado de nuevo.')
    } catch (error) {
      setStatus(`No se pudo reintentar el recordatorio: ${error.message}`)
    }
  }

  return (
    <div className="notificaciones-section">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h5">Programar recordatorio</h2>
            <p className="text-muted mb-3">
              {usesSupabase
                ? 'Los recordatorios se guardan en Supabase y se envían con el programador del servidor.'
                : 'En modo local, la aplicación debe permanecer abierta a la hora programada.'}
            </p>
            {status && (
              <div className={`alert ${status.startsWith('No se pudo') || status.startsWith('Escribe') || status.startsWith('Selecciona') || status.startsWith('Indica') || status.startsWith('El mensaje') ? 'alert-warning' : 'alert-info'}`} role="status">
                {status}
              </div>
            )}
            <form onSubmit={handleSend}>
              <div className="mb-3">
                <label htmlFor="notificationInput" className="form-label">Mensaje</label>
                <textarea
                  id="notificationInput"
                  className="form-control"
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  placeholder="Ej. Revisa la tarea de hoy"
                  rows="3"
                  maxLength="500"
                  required
                />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="notificationTime" className="form-label">Fecha y hora</label>
                  <input
                    id="notificationTime"
                    type="datetime-local"
                    className="form-control"
                    value={notificationTime}
                    onChange={(event) => setNotificationTime(event.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="notificationEmail" className="form-label">Correo destino</label>
                  <input
                    id="notificationEmail"
                    type="email"
                    className="form-control"
                    value={emailAddress}
                    onChange={(event) => setEmailAddress(event.target.value)}
                    placeholder="tu@correo.com"
                    required={usesSupabase}
                    readOnly={usesSupabase}
                  />
                  {usesSupabase && <small className="form-text text-muted">Se usa el correo verificado de tu cuenta.</small>}
                </div>
              </div>
              <div className="alert alert-info small mb-3">
                {usesSupabase
                  ? 'Los correos programados requieren configurar la función serverless y el proveedor de correo; las credenciales del proveedor nunca se publican en el navegador.'
                  : 'Las notificaciones locales se procesan mientras la aplicación está abierta. El correo requiere una configuración válida de EmailJS.'}
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                {saving ? 'Programando…' : 'Programar recordatorio'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="border rounded-3 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="h5 mb-0">Recordatorios</h2>
                <p className="text-muted mb-0 small">Pendientes, entregados y fallidos</p>
              </div>
              {notifications.length > 0 && (
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleClear}>
                  Borrar historial
                </button>
              )}
            </div>
            {loading ? (
              <p role="status">Cargando recordatorios…</p>
            ) : notifications.length === 0 ? (
              <div className="alert alert-secondary" role="status">No hay recordatorios programados.</div>
            ) : (
              <div className="list-group">
                {notifications.map((notice) => (
                  <div key={notice.id} className={`list-group-item ${notice.delivered ? 'bg-light' : 'bg-white'}`}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <strong>{notice.title}</strong>
                          {notice.delivered ? (
                            <span className="badge bg-success">Entregado</span>
                          ) : notice.processing ? (
                            <span className="badge bg-info text-dark">En proceso</span>
                          ) : notice.failed ? (
                            <span className="badge bg-danger">Fallido</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Pendiente</span>
                          )}
                        </div>
                        <div className="small text-muted mt-1">
                          {new Date(notice.scheduledAt).toLocaleString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-close"
                        onClick={() => handleDeleteNotification(notice.id)}
                        disabled={notice.processing}
                        title="Eliminar recordatorio"
                        aria-label="Eliminar recordatorio"
                      />
                    </div>
                    <p className="mb-2 mt-2">{notice.message}</p>
                    {notice.emailAddress && <div className="small text-muted">Correo: {notice.emailAddress}</div>}
                    {notice.error && <div className="small text-danger mt-2">{notice.error}</div>}
                    {notice.failed && (
                      <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={() => handleRetry(notice.id)}>
                        Reintentar
                      </button>
                    )}
                    {notice.deliveredAt && (
                      <div className="small text-success mt-2">Entregado: {new Date(notice.deliveredAt).toLocaleString()}</div>
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
