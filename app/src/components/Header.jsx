import React, { useEffect, useState } from 'react'
import { loadProfile } from '../lib/dataService'

function Header({ isAuthenticated, activeSection, onNavigate, onLogout, userRole = 'user' }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [profileName, setProfileName] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileName('')
      return
    }
    const refreshProfile = () => {
      loadProfile()
        .then((profile) => setProfileName(profile.name))
        .catch(() => setProfileName('Perfil no disponible'))
    }
    refreshProfile()
    window.addEventListener('profile-updated', refreshProfile)
    return () => window.removeEventListener('profile-updated', refreshProfile)
  }, [isAuthenticated])

  const publicLinks = [
    { label: '🏠 Inicio', key: 'Inicio', icon: '🏠', protected: false },
    { label: '📋 Proyecto', key: 'Proyecto', icon: '📋', protected: false },
    { label: '🔐 Acceder', key: 'Acceso', icon: '🔐', protected: false },
  ]

  const authenticatedLinks = [
    { label: '⏱️ Cronómetro', key: 'Cronómetro', icon: '⏱️', protected: true },
    { label: '✅ Tareas', key: 'Tareas', icon: '✅', protected: true },
    { label: '🔔 Notificaciones', key: 'Notificaciones', icon: '🔔', protected: true },
    { label: '👤 Perfil', key: 'Perfil', icon: '👤', protected: true },
    ...(userRole === 'admin'
      ? [{ label: '⚙️ Admin', key: 'Admin', icon: '⚙️', protected: true }]
      : []),
    ...(['admin', 'moderator'].includes(userRole)
      ? [{ label: '📈 Reportes', key: 'Reportes', icon: '📈', protected: true }]
      : []),
  ]

  const allLinks = isAuthenticated
    ? [...publicLinks.filter((link) => link.key !== 'Acceso'), ...authenticatedLinks]
    : publicLinks

  const getRoleColor = () => {
    if (userRole === 'admin') return 'danger'
    if (userRole === 'moderator') return 'warning'
    return 'success'
  }

  const getRoleLabel = () => {
    if (userRole === 'admin') return 'Administrador'
    if (userRole === 'moderator') return 'Moderador'
    return 'Usuario'
  }

  return (
    <header className="app-header navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid px-4 py-3">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-primary fw-bold">Cronómetro</span>
          <div>
            <div className="text-white fs-5 mb-0">Cronómetro</div>
            <small className="text-white-50">App de tareas y tiempo</small>
          </div>
        </div>

        {/* Menú escritorio */}
        <nav aria-label="Navegación principal" className="d-none d-lg-flex align-items-center gap-2 mt-3 mt-lg-0">
          {allLinks.map((link) => (
            <button
              key={link.key}
              type="button"
              className={`btn btn-sm ${activeSection === link.key ? 'btn-light text-primary' : 'btn-outline-light'}`}
              onClick={() => onNavigate(link.key)}
              aria-current={activeSection === link.key ? 'page' : undefined}
            >
              {link.icon} {link.label}
            </button>
          ))}
        </nav>

        {/* Menú móvil toggle */}
        <button
          type="button"
          className="btn btn-light btn-sm d-lg-none ms-auto me-2"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-expanded={showMobileMenu}
          aria-label={showMobileMenu ? 'Cerrar menú' : 'Abrir menú'}
        >
          ☰
        </button>

        {/* Usuario y logout */}
        <div className="ms-auto mt-3 mt-lg-0 d-none d-lg-block">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              <div className="text-white-75 text-end">
                <div className="small">{profileName || 'Usuario'}</div>
                <span className={`badge bg-${getRoleColor()}`}>{getRoleLabel()}</span>
              </div>
              <button type="button" className="btn btn-outline-light btn-sm" onClick={onLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <span className="text-white-75">Accede para ver tu dashboard</span>
          )}
        </div>
      </div>

      {/* Menú móvil expandible */}
      {showMobileMenu && (
        <div className="d-lg-none mobile-menu bg-primary border-top border-light">
          <nav aria-label="Navegación móvil" className="d-flex flex-column p-3 gap-2">
            {allLinks.map((link) => (
              <button
                key={link.key}
                type="button"
                className={`btn btn-sm text-start ${
                  activeSection === link.key ? 'btn-light text-primary' : 'btn-outline-light'
                }`}
                onClick={() => {
                  onNavigate(link.key)
                  setShowMobileMenu(false)
                }}
                aria-current={activeSection === link.key ? 'page' : undefined}
              >
                {link.icon} {link.label}
              </button>
            ))}
            {isAuthenticated && (
              <button
                type="button"
                className="btn btn-sm btn-outline-light text-start mt-2"
                onClick={() => {
                  onLogout()
                  setShowMobileMenu(false)
                }}
              >
                🚪 Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
