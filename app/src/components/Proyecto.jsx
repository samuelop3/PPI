import React from 'react'

function Proyecto() {
  return (
    <section className="project-page">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-11">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h1 className="mb-4">Sobre el proyecto Cronómetro</h1>
              <p className="lead text-muted mb-4">
                Cronómetro es una aplicación web diseñada para ayudar a los usuarios a organizar su tiempo y tareas de forma práctica, con acceso seguro mediante inicio de sesión.
              </p>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="border rounded-3 p-4 h-100">
                    <h2 className="h5">Objetivo</h2>
                    <p className="mb-0 text-muted">
                      Ofrecer un espacio sencillo para gestionar actividades diarias, controlar el tiempo dedicado a cada tarea y recibir notificaciones relevantes.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded-3 p-4 h-100">
                    <h2 className="h5">Funcionalidades</h2>
                    <ul className="mb-0 text-muted ps-3">
                      <li>Gestión de tareas.</li>
                      <li>Cronómetro para medir el tiempo.</li>
                      <li>Notificaciones de actividad.</li>
                      <li>Panel de usuario con perfil.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="h5">Tecnologías</h2>
                <p className="text-muted mb-1">Esta aplicación usa:</p>
                <ul className="text-muted ps-3">
                  <li>React con Vite</li>
                  <li>Bootstrap para el diseño</li>
                  <li>Supabase para autenticación</li>
                </ul>
              </div>

              <div className="mt-4">
                <h2 className="h5">Cómo usarla</h2>
                <p className="text-muted">
                  Regístrate o inicia sesión desde la página principal, luego accede al panel para usar el cronómetro, gestionar tareas y ver notificaciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Proyecto
