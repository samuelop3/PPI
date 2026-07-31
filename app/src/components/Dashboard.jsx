import React from 'react'
import Cronometro from './Cronometro'
import Tareas from './Tareas'
import Notificaciones from './Notificaciones'
import Perfil from './Perfil'
import Proyecto from './Proyecto'

function Dashboard({ activeSection }) {
  let SectionComponent = Cronometro
  let title = 'Cronómetro'
  let description = 'Desde aquí puedes acceder a las secciones protegidas de la aplicación.'

  switch (activeSection) {
    case 'Tareas':
      SectionComponent = Tareas
      title = 'Tareas'
      description = 'Administra tus tareas y marca lo que ya completaste.'
      break
    case 'Notificaciones':
      SectionComponent = Notificaciones
      title = 'Notificaciones'
      description = 'Revisa los avisos y mensajes importantes sobre tu cuenta.'
      break
    case 'Perfil':
      SectionComponent = Perfil
      title = 'Perfil'
      description = 'Consulta la información de tu perfil y ajustes de usuario.'
      break
    case 'Proyecto':
      SectionComponent = Proyecto
      title = 'Proyecto'
      description = 'Consulta información sobre el propósito y uso de la aplicación.'
      break
    case 'Inicio':
      SectionComponent = () => (
        <div>
          <h2>Bienvenido a la aplicación</h2>
          <p className="text-muted">
            Usa el menú para navegar entre Proyecto, Cronómetro, Tareas, Notificaciones y Perfil.
          </p>
        </div>
      )
      title = 'Inicio'
      description = 'El tablero principal te ayudará a comenzar.'
      break
    default:
      SectionComponent = Cronometro
      title = 'Cronómetro'
      description = 'Controla el tiempo dedicado a cada actividad.'
  }

  return (
    <section className="dashboard-page">
      <div className="mb-4 text-start">
        <h1>{title}</h1>
        <p className="text-muted">{description}</p>
      </div>
      <div className="section-card p-4 bg-white rounded shadow-sm text-start">
        <SectionComponent />
      </div>
    </section>
  )
}

export default Dashboard
