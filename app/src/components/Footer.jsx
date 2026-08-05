import React from 'react'

function Footer() {
  return (
    <footer className="app-footer bg-light border-top py-4 mt-auto">
      <div className="container px-4">
        <div className="row gy-3">
          <div className="col-md-4">
            <h6>Información del proyecto</h6>
            <p className="mb-0">App creada para gestionar tareas, cronómetro y perfil de usuario.</p>
          </div>
          <div className="col-md-4">
            <h6>Contacto</h6>
            <ul className="list-unstyled mb-0">
              <li>support@cronometro.example</li>
              <li>+52 55 1234 5678</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6>Legal</h6>
            <ul className="list-unstyled mb-0">
              <li>Ayuda</li>
              <li>Política de privacidad</li>
              <li>Versión 0.1</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
