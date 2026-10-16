import { useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { supabase } from './lib/supabaseClient'
import { setCurrentEmail } from './lib/localData'
import { loadUserRole, loadNotifications, updateLocalNotification, usesSupabase } from './lib/dataService'
import { sendEmailNotification } from './lib/emailService'
import { getDueNotifications } from './lib/notificationRules'
import Proyecto from './components/Proyecto'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState('Inicio')
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [userRole, setUserRole] = useState('user')
  const processingNotifications = useRef(new Set())
  const shownBrowserNotifications = useRef(new Set())

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const isAuth = Boolean(session)
      setIsAuthenticated(isAuth)
      setCurrentEmail(session?.user?.email)

      if (isAuth) {
        Promise.resolve()
          .then(loadUserRole)
          .then(setUserRole)
          .catch((error) => setStatusMessage(`No se pudo cargar el rol: ${error.message}`))
      } else {
        setUserRole('user')
        setActiveSection('Inicio')
      }
      setLoading(false)
    })

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error
        const session = data.session
        setIsAuthenticated(Boolean(session))
        setCurrentEmail(session?.user?.email)
        if (session) {
          return loadUserRole()
            .then(setUserRole)
            .catch((roleError) => setStatusMessage(`No se pudo cargar el rol: ${roleError.message}`))
        }
        setUserRole('user')
      })
      .catch((error) => setStatusMessage(`No se pudo verificar la sesión: ${error.message}`))
      .finally(() => setLoading(false))

    return () => authListener?.subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return undefined
    const refreshRole = () => {
      loadUserRole()
        .then(setUserRole)
        .catch((error) => setStatusMessage(`No se pudo actualizar el rol: ${error.message}`))
    }
    window.addEventListener('role-updated', refreshRole)
    return () => window.removeEventListener('role-updated', refreshRole)
  }, [isAuthenticated])

  const handleLogin = () => {
    setIsAuthenticated(true)
    loadUserRole()
      .then(setUserRole)
      .catch((error) => setStatusMessage(`No se pudo cargar el rol: ${error.message}`))
    setActiveSection('Inicio')
    setStatusMessage('Has iniciado sesión correctamente.')
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setStatusMessage(`No se pudo cerrar la sesión: ${error.message}`)
        return
      }
      setStatusMessage('Has cerrado sesión.')
    } catch (error) {
      setStatusMessage(`No se pudo cerrar la sesión: ${error.message}`)
    }
  }

  const handleNavigate = (section) => {
    setActiveSection(section)
  }

  useEffect(() => {
    if (!isAuthenticated) return undefined

    const checkDueNotifications = async () => {
      const due = getDueNotifications(await loadNotifications(), new Date(), usesSupabase)

      if (usesSupabase) {
        if ('Notification' in window && Notification.permission === 'granted') {
          due.forEach((notice) => {
            if (shownBrowserNotifications.current.has(notice.id)) return
            new Notification(notice.title, {
              body: notice.message,
              icon: '/favicon.svg',
              tag: notice.id,
            })
            shownBrowserNotifications.current.add(notice.id)
          })
        }
        return
      }

      await Promise.all(due.map(async (notice) => {
        if (processingNotifications.current.has(notice.id)) return
        processingNotifications.current.add(notice.id)
        try {
          let delivered = false
          let failure = ''
          if (notice.emailAddress) {
            const result = await sendEmailNotification({
              to_email: notice.emailAddress,
              to_name: 'Usuario',
              message: notice.message,
              scheduled_time: new Date(notice.scheduledAt).toLocaleString(),
            })
            if (result.success) delivered = true
            else failure = result.configured
              ? `No se pudo enviar el correo${result.error ? `: ${result.error}` : '.'}`
              : 'EmailJS no está configurado. Revisa las variables de entorno locales.'
          }
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notice.title, {
              body: notice.message,
              icon: '/favicon.svg',
              tag: notice.id,
            })
            if (!notice.emailAddress) delivered = true
          } else if (!notice.emailAddress) {
            failure = 'No hay permiso para mostrar la notificación del navegador.'
          }
          await updateLocalNotification(notice.id, {
            delivered,
            failed: !delivered,
            error: delivered ? null : failure || 'No se pudo entregar el recordatorio.',
            deliveredAt: delivered ? new Date().toISOString() : null,
          })
        } catch (error) {
          setStatusMessage(`No se pudo procesar el recordatorio: ${error.message}`)
        } finally {
          processingNotifications.current.delete(notice.id)
        }
      }))
    }

    checkDueNotifications().catch((error) => setStatusMessage(`No se pudieron revisar los recordatorios: ${error.message}`))
    const interval = window.setInterval(() => {
      checkDueNotifications().catch((error) => setStatusMessage(`No se pudieron revisar los recordatorios: ${error.message}`))
    }, usesSupabase ? 30000 : 10000)
    return () => window.clearInterval(interval)
  }, [isAuthenticated])

  return (
    <div className="app-shell min-vh-100 d-flex flex-column">
      <Header
        isAuthenticated={isAuthenticated}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userRole={userRole}
      />
      <main className="flex-grow-1 container py-5">
        {loading ? (
          <div className="text-center py-5">Cargando sesión...</div>
        ) : isAuthenticated ? (
          <Dashboard activeSection={activeSection} onNavigate={handleNavigate} userRole={userRole} statusMessage={statusMessage} />
        ) : activeSection === 'Proyecto' ? (
          <>
            {statusMessage && (
              <div className="alert alert-info mb-4" role="alert">
                {statusMessage}
              </div>
            )}
            <Proyecto />
          </>
        ) : activeSection === 'Acceso' ? (
          <>
            {statusMessage && (
              <div className="alert alert-info mb-4" role="alert">
                {statusMessage}
              </div>
            )}
            <Login onLogin={handleLogin} onStatus={setStatusMessage} />
          </>
        ) : (
          <>
            {statusMessage && (
              <div className="alert alert-info mb-4" role="alert">
                {statusMessage}
              </div>
            )}
            <Home />
            <Login onLogin={handleLogin} onStatus={setStatusMessage} />
          </>
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  )
}

export default App
