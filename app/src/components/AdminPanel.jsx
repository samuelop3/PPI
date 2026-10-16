import { useEffect, useState } from 'react'
import { loadUsers, updateUserRole, usesSupabase } from '../lib/dataService'

function AdminPanel() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingEmail, setUpdatingEmail] = useState('')
  const [status, setStatus] = useState('')

  const refreshUsers = async () => {
    setUsers(await loadUsers())
  }

  useEffect(() => {
    refreshUsers()
      .catch((error) => setStatus(`No se pudieron cargar los usuarios: ${error.message}`))
      .finally(() => setLoading(false))
  }, [])

  const handleChangeRole = async (email, role) => {
    setUpdatingEmail(email)
    setStatus('')
    try {
      await updateUserRole(email, role)
      await refreshUsers()
      setStatus(`Se actualizó el rol de ${email}.`)
    } catch (error) {
      setStatus(`No se pudo cambiar el rol: ${error.message}`)
    } finally {
      setUpdatingEmail('')
    }
  }

  return (
    <div className="admin-panel">
      <h2 className="h4">Administración</h2>
      <p className="text-muted">Gestiona roles de forma segura mediante funciones protegidas de Supabase.</p>
      {!usesSupabase && (
        <div className="alert alert-warning" role="status">
          El modo local no ofrece administración segura de roles. Configura Supabase y asigna el primer administrador desde el SQL Editor.
        </div>
      )}
      {status && (
        <div className={`alert ${status.startsWith('No se pudo') || status.startsWith('No se pudieron') ? 'alert-danger' : 'alert-info'}`} role="status">
          {status}
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h3 className="h5 mb-0">Usuarios</h3>
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => refreshUsers().catch((error) => setStatus(`No se pudieron cargar los usuarios: ${error.message}`))}>
          Actualizar
        </button>
      </div>
      {loading ? (
        <p role="status">Cargando usuarios…</p>
      ) : users.length === 0 ? (
        <div className="alert alert-secondary" role="status">Aún no hay usuarios disponibles.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr><th>Correo</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td><small>{user.email}</small></td>
                  <td>{user.name || '—'}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'moderator' ? 'bg-warning text-dark' : 'bg-success'}`}>
                      {user.role === 'admin' ? 'Administrador' : user.role === 'moderator' ? 'Moderador' : 'Usuario'}
                    </span>
                  </td>
                  <td>
                    <label className="visually-hidden" htmlFor={`role-${user.email}`}>Rol de {user.email}</label>
                    <select
                      id={`role-${user.email}`}
                      className="form-select form-select-sm"
                      value={user.role}
                      disabled={updatingEmail === user.email || !usesSupabase}
                      onChange={(event) => handleChangeRole(user.email, event.target.value)}
                    >
                      <option value="user">Usuario</option>
                      <option value="moderator">Moderador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="small text-muted mt-3 mb-0">
        Los permisos se verifican también en Supabase; ocultar una opción del menú no constituye una medida de seguridad.
      </p>
    </div>
  )
}

export default AdminPanel
