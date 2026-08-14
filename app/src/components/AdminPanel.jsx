import React, { useState } from 'react'
import { getAllRoles, changeUserRole } from '../lib/localData'

function AdminPanel() {
  const [users, setUsers] = useState([])
  const [showUsers, setShowUsers] = useState(false)

  const handleLoadUsers = () => {
    const roles = getAllRoles()
    const userList = Object.entries(roles).map(([email, role]) => ({ email, role }))
    setUsers(userList)
    setShowUsers(true)
  }

  const handleChangeRole = (email, newRole) => {
    changeUserRole(email, newRole)
    handleLoadUsers()
  }

  return (
    <div className="admin-panel">
      <h3>🔒 Panel de Administración</h3>
      <p className="text-muted">Acceso exclusivo para administradores del sistema.</p>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">👥 Gestión de Usuarios</h5>
              <p className="card-text">Visualiza y modifica los roles de los usuarios.</p>
              <button className="btn btn-primary btn-sm" onClick={handleLoadUsers}>
                Ver Usuarios
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">📊 Estadísticas</h5>
              <p className="card-text">Visualiza métricas y reportes del sistema.</p>
              <button className="btn btn-primary btn-sm" disabled>
                Ver Reportes (próximamente)
              </button>
            </div>
          </div>
        </div>
      </div>

      {showUsers && (
        <div className="mt-4">
          <h5>Lista de Usuarios</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.email}>
                      <td>
                        <small>{user.email}</small>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === 'admin'
                              ? 'bg-danger'
                              : user.role === 'moderator'
                                ? 'bg-warning text-dark'
                                : 'bg-success'
                          }`}
                        >
                          {user.role === 'admin'
                            ? '🔴 Admin'
                            : user.role === 'moderator'
                              ? '🟠 Moderador'
                              : '🟢 Usuario'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleChangeRole(user.email, 'user')}
                            disabled={user.role === 'user'}
                          >
                            Usuario
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => handleChangeRole(user.email, 'moderator')}
                            disabled={user.role === 'moderator'}
                          >
                            Moderador
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleChangeRole(user.email, 'admin')}
                            disabled={user.role === 'admin'}
                          >
                            Admin
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="alert alert-warning mt-4">
        <strong>⚠️ Nota:</strong> Solo los administradores pueden acceder a este panel. Las acciones realizadas
        aquí afectan directamente a los permisos del sistema.
      </div>
    </div>
  )
}

export default AdminPanel
