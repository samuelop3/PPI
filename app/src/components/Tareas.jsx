import { useEffect, useState } from 'react'
import { createTask, deleteTask, loadTasks, setTaskCompleted } from '../lib/dataService'

function Tareas() {
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTasks()
      .then(setTasks)
      .catch((loadError) => setError(`No se pudieron cargar las tareas: ${loadError.message}`))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (event) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    setSaving(true)
    setError('')
    try {
      const newTask = await createTask(trimmed)
      setTasks((current) => [newTask, ...current])
      setText('')
    } catch (saveError) {
      setError(`No se pudo guardar la tarea: ${saveError.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (task) => {
    setError('')
    try {
      await setTaskCompleted(task.id, !task.completed)
      setTasks((current) =>
        current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item),
      )
    } catch (saveError) {
      setError(`No se pudo actualizar la tarea: ${saveError.message}`)
    }
  }

  const handleDelete = async (taskId) => {
    setError('')
    try {
      await deleteTask(taskId)
      setTasks((current) => current.filter((task) => task.id !== taskId))
    } catch (deleteError) {
      setError(`No se pudo eliminar la tarea: ${deleteError.message}`)
    }
  }

  return (
    <div className="tareas-section">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h5">Crear tarea</h2>
            <p className="text-muted mb-3">Agrega actividades para tu día.</p>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label htmlFor="taskInput" className="form-label">
                  Nueva tarea
                </label>
                <input
                  id="taskInput"
                  type="text"
                  className="form-control"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Ej. Revisar correo"
                  maxLength="500"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                {saving ? 'Guardando…' : 'Agregar tarea'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h5">Lista de tareas</h2>
            <p className="text-muted mb-3">Marca lo completado y administra tu progreso.</p>
            {loading ? (
              <p role="status">Cargando tareas…</p>
            ) : tasks.length === 0 ? (
              <div className="alert alert-secondary" role="alert">
                Aún no hay tareas. Crea una tarea para comenzar.
              </div>
            ) : (
              <div className="list-group">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`list-group-item d-flex justify-content-between align-items-start ${task.completed ? 'list-group-item-success' : ''}`}
                  >
                    <div className="ms-2 me-auto">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="fw-bold">{task.title}</span>
                        {task.completed && <span className="badge bg-success">Completada</span>}
                      </div>
                      <small className="text-muted">Creado {new Date(task.createdAt).toLocaleString()}</small>
                    </div>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className={`btn btn-sm ${task.completed ? 'btn-outline-secondary' : 'btn-success'}`}
                        onClick={() => handleToggle(task)}
                      >
                        {task.completed ? 'Reabrir' : 'Completar'}
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(task.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tareas
