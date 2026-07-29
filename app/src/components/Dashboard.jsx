import React from 'react'
import Cronometro from './Cronometro'
import Tareas from './Tareas'
import Notificaciones from './Notificaciones'
import Perfil from './Perfil'

function Dashboard({ activeSection }) {
  let SectionComponent = Cronometro

  switch (activeSection) {
    case 'Tareas':
      SectionComponent = Tareas
      break
    case 'Notificaciones':
      SectionComponent = Notificaciones
      break
    case 'Perfil':
      SectionComponent = Perfil
      break
    default:
      SectionComponent = Cronometro
  }

  return (
    <section className="dashboard-page">
      <div className="mb-4">
        <h1>Panel de control</h1>
        <p className="text-muted">Desde aquí puedes acceder a las secciones protegidas de la aplicación.</p>
      </div>
      <div className="section-card p-4 bg-white rounded shadow-sm">
        <SectionComponent />
      </div>
    </section>
  )
}

export default Dashboard
