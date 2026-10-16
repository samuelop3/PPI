function Footer({ onNavigate }) {
  return (
    <footer className="app-footer bg-light border-top py-4 mt-auto">
      <div className="container px-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <strong>Cronómetro PPI</strong>
            <p className="mb-0 text-muted">Proyecto académico para organizar tareas y tiempo de concentración.</p>
          </div>
          <nav aria-label="Navegación del pie de página" className="d-flex gap-3">
            <button type="button" className="btn btn-link p-0" onClick={() => onNavigate('Inicio')}>Inicio</button>
            <button type="button" className="btn btn-link p-0" onClick={() => onNavigate('Proyecto')}>Proyecto</button>
          </nav>
        </div>
        <small className="text-muted d-block mt-3">© {new Date().getFullYear()} Equipo PPI.</small>
      </div>
    </footer>
  )
}

export default Footer
