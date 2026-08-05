import { useEffect, useState } from 'react'
import { addTask, getTasks, saveTasks } from '../lib/localData'

function Tareas() {
  const [tasks, setTasks] = useState(getTasks())
  const [text, setText] = useState('')

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const handleAdd = (event) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    const newTask = {
      id: Date.now().toString(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    addTask(newTask)
    setTasks((current) => [newTask, ...current])
    setText('')
  }

  const handleToggle = (taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const handleDelete = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId))
  }

  return (
    <div className="tareas-section">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h5">Crear tarea</h2>
            <p className="text-muted mb-3">Agrega actividades para tu día.</p>
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
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Agregar tarea
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h5">Lista de tareas</h2>
            <p className="text-muted mb-3">Marca lo completado y administra tu progreso.</p>
            {tasks.length === 0 ? (
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
                        onClick={() => handleToggle(task.id)}
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
