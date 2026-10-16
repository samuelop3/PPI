import { useEffect, useState } from 'react'
import { loadReports, usesSupabase } from '../lib/dataService'

function Reportes() {
  const [reports, setReports] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReports()
      .then(setReports)
      .catch((loadError) => setError(`No se pudieron cargar los reportes: ${loadError.message}`))
  }, [])

  if (error) return <div className="alert alert-danger" role="alert">{error}</div>
  if (!reports) return <p role="status">Cargando reportes…</p>

  const users = reports.users ?? reports.total_users ?? 0
  const tasks = reports.tasks ?? reports.total_tasks ?? 0
  const completedTasks = reports.completedTasks ?? reports.completed_tasks ?? 0

  return (
    <div>
      {!usesSupabase && (
        <div className="alert alert-warning" role="status">
          En modo local las estadísticas solo incluyen los datos del usuario actual.
        </div>
      )}
      <div className="row g-3">
        <div className="col-md-4"><div className="card h-100"><div className="card-body"><h2 className="h6">Usuarios</h2><p className="display-6 mb-0">{users}</p></div></div></div>
        <div className="col-md-4"><div className="card h-100"><div className="card-body"><h2 className="h6">Tareas</h2><p className="display-6 mb-0">{tasks}</p></div></div></div>
        <div className="col-md-4"><div className="card h-100"><div className="card-body"><h2 className="h6">Completadas</h2><p className="display-6 mb-0">{completedTasks}</p></div></div></div>
      </div>
      <p className="small text-muted mt-3 mb-0">
        {tasks ? `${Math.round((completedTasks / tasks) * 100)}% de las tareas consultadas están completadas.` : 'Todavía no hay tareas registradas.'}
      </p>
    </div>
  )
}

export default Reportes
