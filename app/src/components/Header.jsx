import React from 'react'

function Header({ isAuthenticated, activeSection, onNavigate, onLogout }) {
  const links = [
    { label: 'Inicio', key: 'Inicio', protected: false },
    { label: 'Proyecto', key: 'Proyecto', protected: false },
    { label: 'Cronómetro', key: 'Cronómetro', protected: true },
    { label: 'Tareas', key: 'Tareas', protected: true },
    { label: 'Notificaciones', key: 'Notificaciones', protected: true },
    { label: 'Perfil', key: 'Perfil', protected: true },
  ]

  return (
    <header className="app-header navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid px-4 py-3">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-primary fw-bold">PPI</span>
          <div>
            <div className="text-white fs-5 mb-0">Productividad PPI</div>
            <small className="text-white-50">App de tareas y tiempo</small>
          </div>
        </div>

        <nav className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
          {links.map((link) => {
            if (link.protected && !isAuthenticated) {
              return null
            }

            return (
              <button
                key={link.key}
                type="button"
                className={`btn btn-sm ${activeSection === link.key ? 'btn-light text-primary' : 'btn-outline-light'}`}
                onClick={() => onNavigate(link.key)}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        <div className="ms-auto mt-3 mt-lg-0">
          {isAuthenticated ? (
            <button type="button" className="btn btn-outline-light btn-sm" onClick={onLogout}>
              Cerrar sesión
            </button>
          ) : (
            <span className="text-white-75">Accede para ver tu dashboard</span>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
