import React from 'react'

function Home() {
  return (
    <section className="home-page py-5">
      <div className="row justify-content-center">
        <div className="col-xl-7 col-lg-8 col-md-10 text-center">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h1 className="mb-4">Bienvenido a la aplicación</h1>
              <p className="lead text-muted mb-4">
                Esta aplicación te ayuda a gestionar tu tiempo, tareas y notificaciones de forma simple.
                Inicia sesión o regístrate para acceder al panel protegido.
              </p>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="border rounded-3 p-3 h-100">
                    <h2 className="h5">Cronómetro</h2>
                    <p className="mb-0 text-muted">Registra tu tiempo y mantente enfocado.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded-3 p-3 h-100">
                    <h2 className="h5">Tareas</h2>
                    <p className="mb-0 text-muted">Crea, organiza y marca las tareas completadas.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded-3 p-3 h-100">
                    <h2 className="h5">Notificaciones</h2>
                    <p className="mb-0 text-muted">Mantente al día con tus avisos más importantes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
