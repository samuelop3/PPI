# 📋 Menú Dinámico por Usuario y Entorno Gráfico

## Descripción
Se ha implementado un sistema de menú completamente dinámico que muestra opciones diferentes según:
- **Estado de autenticación** del usuario
- **Rol asignado** (Usuario, Moderador, Administrador)
- **Entorno gráfico** (Desktop, Mobile, Tablet)

## Cambios Implementados

### 1️⃣ **Header.jsx** - Menú Superior Adaptativo
**Ubicación:** `app/src/components/Header.jsx`

**Características:**
- ✅ Menú dinámico que cambia según autenticación y rol
- 📱 Menú móvil desplegable (hamburguesa)
- 👤 Muestra nombre de usuario y rol actual
- 🎨 Iconos visuales para cada sección
- 🔐 Oculta automáticamente opciones protegidas si no está autenticado

**Opciones según Rol:**
- **Usuarios no autenticados:** Inicio, Proyecto
- **Usuarios normales:** + Cronómetro, Tareas, Notificaciones, Perfil
- **Moderadores:** + Reportes y Estadísticas
- **Administradores:** + Panel de Administración

### 2️⃣ **SideMenu.jsx** - Menú Lateral Profesional (NUEVO)
**Ubicación:** `app/src/components/SideMenu.jsx`

**Características:**
- 🎯 Menú lateral colapsable con animaciones
- 👥 Avatar con inicial del nombre
- 📊 Información del rol del usuario
- 🎨 Estilos profesionales con gradientes
- 📱 Responsive (se esconde en mobile)

**Funcionalidades:**
- Botón de colapsar/expandir
- Iconos visuales para cada opción
- Navegación fluida
- Información del rol en tiempo real

### 3️⃣ **AdminPanel.jsx** - Panel de Administración (NUEVO)
**Ubicación:** `app/src/components/AdminPanel.jsx`

**Características:**
- 🔒 Acceso exclusivo para administradores
- 👥 Gestión de usuarios y roles
- 📊 Tabla interactiva de usuarios
- 🔄 Cambio dinámico de roles
- ⚠️ Advertencias de seguridad

**Funcionalidades:**
- Ver lista completa de usuarios
- Cambiar roles (Usuario → Moderador → Admin)
- Visualizar rol actual de cada usuario
- Colores diferenciados por rol

### 4️⃣ **Dashboard.jsx** - Integración Completa
**Ubicación:** `app/src/components/Dashboard.jsx`

**Cambios:**
- 📐 Estructura flexbox con menú lateral + contenido
- 🎯 Integración de AdminPanel
- 🎨 Iconos en títulos
- 📱 Responsive layout

### 5️⃣ **localData.js** - Sistema de Roles
**Ubicación:** `app/src/lib/localData.js`

**Nuevas Funciones:**
```javascript
- getUserRole()              // Obtener rol del usuario actual
- setUserRole(email, role)   // Asignar rol a un usuario
- changeUserRole(email, role)// Cambiar rol existente
- getAllRoles()              // Ver todos los roles registrados
```

**Almacenamiento:**
- Roles guardados en `localStorage` con clave `cronometro-user-roles`
- Estructura: `{ "email": "role" }`

### 6️⃣ **App.jsx** - Estado del Rol
**Ubicación:** `app/src/App.jsx`

**Cambios:**
- 🔄 Nuevo estado `userRole`
- 📡 Carga automática del rol al autenticar
- 📤 Pasa `userRole` a Header y Dashboard
- 🔐 Reset de rol al logout

### 7️⃣ **App.css** - Estilos Dinámicos
**Ubicación:** `app/src/App.css`

**Nuevas Clases:**
- `.side-menu` - Menú lateral
- `.side-menu-header` - Encabezado con avatar
- `.side-menu-item` - Elementos del menú
- `.side-menu-item.active` - Estado activo
- `.side-menu.collapsed` - Estado colapsado
- `.dashboard-page` - Layout flexbox
- `.mobile-menu` - Menú móvil

**Estilos:**
- Animaciones suaves (0.3s)
- Colores coherentes con tema
- Responsive breakpoints (992px, 768px)

---

## 📊 Flujo de Funcionalidad

```
App.jsx
  ├── Lee rol con getUserRole()
  ├── Pasa userRole → Header.jsx
  │   ├── Filtra opciones de menú según rol
  │   └── Muestra rol en desktop/mobile
  │
  └── Pasa userRole → Dashboard.jsx
      ├── SideMenu.jsx
      │   └── Menú lateral según rol
      └── Componentes dinámicos
          ├── Si Admin → AdminPanel.jsx
          ├── Si Moderator → Reportes.jsx
          └── Si User → Opciones estándar
```

---

## 🎯 Ejemplo de Uso

### Cambiar rol de usuario (desde AdminPanel):
```javascript
// El panel permite:
1. Ver lista de usuarios
2. Hacer click en botones de rol
3. El sistema actualiza automáticamente
4. Se refleja en el menú la próxima vez que inicie sesión
```

### Verificar rol actual (en localStorage):
```javascript
// Abrir DevTools → Console
localStorage.getItem('cronometro-user-roles')
// Salida: {"user@email.com": "admin"}
```

---

## 🎨 Componentes Visuales

### Por Rol:
- **🔴 Admin:** Rojo - Acceso total
- **🟠 Moderator:** Naranja - Reportes + Gestión
- **🟢 User:** Verde - Acceso estándar

### Responsive:
- **Desktop:** Header + Sidebar completo
- **Tablet:** Header responsivo + Sidebar
- **Mobile:** Header con hamburguesa (sin sidebar)

---

## 🔐 Seguridad

- ✅ Roles almacenados en `localStorage` (cliente)
- ⚠️ **Nota:** Para producción, usar backend con JWT/Auth
- 🔒 Panel Admin solo visible si rol = 'admin'
- 📋 Sistema de permisos escalable

---

## 📝 Próximas Mejoras

- [ ] Backend de roles (Supabase)
- [ ] Persistencia de roles en servidor
- [ ] Más roles específicos (Editor, Viewer)
- [ ] Sistema de permisos granular
- [ ] Auditoría de cambios de rol
- [ ] Notificaciones de cambios

---

**Versión:** 1.0.0  
**Fecha:** 2026-08-14  
**Estado:** ✅ Implementado y Funcional
