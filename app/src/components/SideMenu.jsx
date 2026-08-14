import React, { useState } from 'react'
import { getProfile } from '../lib/localData'

function SideMenu({ activeSection, onNavigate, userRole = 'user' }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const profile = getProfile()

  // Menú según rol del usuario
  const menuItems = {
    admin: [
      { label: '📊 Dashboard', key: 'Inicio', icon: '📊' },
      { label: '⏱️ Cronómetro', key: 'Cronómetro', icon: '⏱️' },
      { label: '✅ Tareas', key: 'Tareas', icon: '✅' },
      { label: '🔔 Notificaciones', key: 'Notificaciones', icon: '🔔' },
      { label: '👤 Perfil', key: 'Perfil', icon: '👤' },
      { label: '⚙️ Administración', key: 'Admin', icon: '⚙️' },
    ],
    moderator: [
      { label: '📊 Dashboard', key: 'Inicio', icon: '📊' },
      { label: '⏱️ Cronómetro', key: 'Cronómetro', icon: '⏱️' },
      { label: '✅ Tareas', key: 'Tareas', icon: '✅' },
      { label: '🔔 Notificaciones', key: 'Notificaciones', icon: '🔔' },
      { label: '👤 Perfil', key: 'Perfil', icon: '👤' },
      { label: '📈 Reportes', key: 'Reportes', icon: '📈' },
    ],
    user: [
      { label: '📊 Dashboard', key: 'Inicio', icon: '📊' },
      { label: '⏱️ Cronómetro', key: 'Cronómetro', icon: '⏱️' },
      { label: '✅ Tareas', key: 'Tareas', icon: '✅' },
      { label: '🔔 Notificaciones', key: 'Notificaciones', icon: '🔔' },
      { label: '👤 Perfil', key: 'Perfil', icon: '👤' },
    ],
  }

  const items = menuItems[userRole] || menuItems.user

  return (
    <aside className={`side-menu ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="side-menu-header">
        <div className="d-flex align-items-center gap-2">
          <div className="user-avatar">
            <span className="fs-5">{profile.name?.charAt(0)?.toUpperCase() || '👤'}</span>
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name fw-bold">{profile.name || 'Usuario'}</div>
              <div className="user-role text-muted small">
                {userRole === 'admin' && '🔴 Admin'}
                {userRole === 'moderator' && '🟠 Moderador'}
                {userRole === 'user' && '🟢 Usuario'}
              </div>
            </div>
          )}
        </div>
        <button
          className="btn btn-sm btn-light toggle-collapse"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expandir' : 'Contraer'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="side-menu-nav">
        {items.map((item) => (
          <button
            key={item.key}
            className={`side-menu-item ${activeSection === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
            title={isCollapsed ? item.label : ''}
          >
            <span className="menu-icon">{item.icon}</span>
            {!isCollapsed && <span className="menu-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="side-menu-footer">
        {!isCollapsed && (
          <div className="role-info">
            <small className="text-muted d-block mb-2">Permisos según rol:</small>
            {userRole === 'admin' && (
              <small className="text-success d-block">✓ Acceso total al sistema</small>
            )}
            {userRole === 'moderator' && (
              <small className="text-info d-block">✓ Gestión y reportes</small>
            )}
            {userRole === 'user' && (
              <small className="text-secondary d-block">✓ Acceso estándar</small>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

export default SideMenu
