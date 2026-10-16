import React from 'react'
import SideMenu from './SideMenu'
import Cronometro from './Cronometro'
import Tareas from './Tareas'
import Notificaciones from './Notificaciones'
import Perfil from './Perfil'
import Proyecto from './Proyecto'
import AdminPanel from './AdminPanel'
import Reportes from './Reportes'

function Dashboard({ activeSection, onNavigate, userRole = 'user', statusMessage = '' }) {
  let SectionComponent = Cronometro
  let title = 'Cronómetro'
  let description = 'Desde aquí puedes acceder a las secciones protegidas de la aplicación.'
  let icon = '⏱️'

  switch (activeSection) {
    case 'Tareas':
      SectionComponent = Tareas
      title = 'Tareas'
      description = 'Administra tus tareas y marca lo que ya completaste.'
      icon = '✅'
      break
    case 'Notificaciones':
      SectionComponent = Notificaciones
      title = 'Notificaciones'
      description = 'Revisa los avisos y mensajes importantes sobre tu cuenta.'
      icon = '🔔'
      break
    case 'Perfil':
      SectionComponent = Perfil
      title = 'Perfil'
      description = 'Consulta la información de tu perfil y ajustes de usuario.'
      icon = '👤'
      break
    case 'Proyecto':
      SectionComponent = Proyecto
      title = 'Proyecto'
      description = 'Consulta información sobre el propósito y uso de la aplicación.'
      icon = '📋'
      break
    case 'Admin':
      if (userRole !== 'admin') {
        SectionComponent = () => <div className="alert alert-danger" role="alert">No tienes permiso para acceder a esta sección.</div>
        title = 'Acceso denegado'
        description = 'Esta sección está reservada a administradores.'
        icon = '🔒'
      } else {
        SectionComponent = AdminPanel
        title = 'Administración'
        description = 'Gestiona usuarios y roles protegidos en el servidor.'
        icon = '⚙️'
      }
      break
    case 'Reportes':
      SectionComponent = ['admin', 'moderator'].includes(userRole)
        ? Reportes
        : () => <div className="alert alert-danger" role="alert">No tienes permiso para consultar los reportes.</div>
      title = 'Reportes'
      description = 'Análisis y estadísticas del sistema.'
      icon = '📈'
      break
    case 'Inicio':
      SectionComponent = () => (
        <div>
          <h2>Bienvenido a la aplicación</h2>
          <p className="text-muted">
            Usa el menú lateral para navegar entre Cronómetro, Tareas, Notificaciones, Perfil y más.
          </p>
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">⏱️ Cronómetro</h5>
                  <p className="card-text">Gestiona tu tiempo con técnica Pomodoro.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">✅ Tareas</h5>
                  <p className="card-text">Organiza y controla tus tareas diarias.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      title = 'Dashboard'
      description = 'El tablero principal te ayudará a comenzar.'
      icon = '📊'
      break
    default:
      SectionComponent = Cronometro
      title = 'Cronómetro'
      description = 'Controla el tiempo dedicado a cada actividad.'
  }

  return (
    <section className="dashboard-page d-flex">
      {/* Menú lateral */}
      <SideMenu activeSection={activeSection} onNavigate={onNavigate} userRole={userRole} />

      {/* Contenido principal */}
      <div className="dashboard-content flex-grow-1">
        {statusMessage && <div className="alert alert-info text-start" role="status">{statusMessage}</div>}
        <div className="mb-4 text-start">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="fs-4">{icon}</span>
            <h1 className="mb-0">{title}</h1>
          </div>
          <p className="text-muted">{description}</p>
        </div>
        <div className="section-card p-4 bg-white rounded shadow-sm text-start">
          <SectionComponent />
        </div>
      </div>
    </section>
  )
}

export default Dashboard
