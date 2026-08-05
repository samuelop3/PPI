import React from 'react'

function Home() {
  return (
    <section className="home-page py-5 position-relative overflow-hidden">
      <div className="hero-graphic" aria-hidden="true">
        <svg viewBox="0 0 560 560" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="280" cy="280" r="160" fill="rgba(86, 108, 244, 0.18)" />
          <circle cx="430" cy="160" r="80" fill="rgba(157, 109, 240, 0.16)" />
          <path d="M360 420C400 375 450 360 500 380" stroke="rgba(86, 108, 244, 0.22)" strokeWidth="12" strokeLinecap="round" />
          <path d="M120 220C170 190 235 170 280 210" stroke="rgba(157, 109, 240, 0.22)" strokeWidth="12" strokeLinecap="round" />
        </svg>
      </div>
      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-9 col-md-11">
          <div className="hero-card shadow-sm border-0 overflow-hidden">
            <div className="card-body p-5">
              <span className="feature-pill">Organiza tu día</span>
              <h1 className="mb-4">Administra tareas, tiempo y notificaciones con estilo.</h1>
              <p className="lead text-muted mb-5">
                Cronómetro te ayuda a mantener el foco y avanzar en tus objetivos con un panel sencillo y diseño profesional.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <div className="rounded-4 bg-white p-3 shadow-sm text-start" style={{ minWidth: '180px' }}>
                  <strong>Visión clara</strong>
                  <p className="mb-0 text-muted">Un tablero diseñado para tu ritmo.</p>
                </div>
                <div className="rounded-4 bg-white p-3 shadow-sm text-start" style={{ minWidth: '180px' }}>
                  <strong>Trabajo enfocado</strong>
                  <p className="mb-0 text-muted">Sigue bloques de tiempo eficientes.</p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="border rounded-3 p-4 h-100 bg-white shadow-sm">
                    <h2 className="h5">Cronómetro</h2>
                    <p className="mb-0 text-muted">Gestiona tus bloques de trabajo y descanso fácilmente.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded-3 p-4 h-100 bg-white shadow-sm">
                    <h2 className="h5">Tareas</h2>
                    <p className="mb-0 text-muted">Crea y completa tareas para tu rutina diaria.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded-3 p-4 h-100 bg-white shadow-sm">
                    <h2 className="h5">Notificaciones</h2>
                    <p className="mb-0 text-muted">Recibe avisos relevantes sobre tu progreso.</p>
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
