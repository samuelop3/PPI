import { useEffect, useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { supabase } from './lib/supabaseClient'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState('Inicio')
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    let subscription

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setIsAuthenticated(Boolean(data.session))
      setLoading(false)
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(Boolean(session))
      if (!session) {
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
    setActiveSection('Inicio')
    setStatusMessage('Has iniciado sesión correctamente.')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
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
      />
      <main className="flex-grow-1 container py-5">
        {loading ? (
          <div className="text-center py-5">Cargando sesión...</div>
        ) : isAuthenticated ? (
          <Dashboard activeSection={activeSection} />
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
