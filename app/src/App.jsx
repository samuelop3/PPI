import { useEffect, useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { supabase } from './lib/supabaseClient'
import { getUserRole } from './lib/localData'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState('Inicio')
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [userRole, setUserRole] = useState('user')

  useEffect(() => {
    let subscription

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()
      const isAuth = Boolean(data.session)
      setIsAuthenticated(isAuth)
      
      // Cargar el rol del usuario si está autenticado
      if (isAuth) {
        const role = getUserRole()
        setUserRole(role)
      }
      
      setLoading(false)
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuth = Boolean(session)
      setIsAuthenticated(isAuth)
      
      if (isAuth) {
        const role = getUserRole()
        setUserRole(role)
      } else {
        setUserRole('user')
        setActiveSection('Inicio')
      }
    })

    subscription = authListener?.subscription
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    const role = getUserRole()
    setUserRole(role)
    setActiveSection('Inicio')
    setStatusMessage('Has iniciado sesión correctamente.')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUserRole('user')
    setActiveSection('Inicio')
    setStatusMessage('Has cerrado sesión.')
  }

  const handleNavigate = (section) => {
    setActiveSection(section)
  }

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
          <Dashboard activeSection={activeSection} onNavigate={handleNavigate} userRole={userRole} />
        ) : activeSection === 'Inicio' ? (
          <>
            {statusMessage && (
              <div className="alert alert-info mb-4" role="alert">
                {statusMessage}
              </div>
            )}
            <Home />
            <Login onLogin={handleLogin} onStatus={setStatusMessage} />
          </>
        ) : (
          <>
            {statusMessage && (
              <div className="alert alert-info mb-4" role="alert">
                {statusMessage}
              </div>
            )}
            <Login onLogin={handleLogin} onStatus={setStatusMessage} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
