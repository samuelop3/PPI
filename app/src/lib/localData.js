const STORAGE_PREFIX = 'cronometro'
const AUTH_KEY = 'cronometro-dev-auth'
const ROLES_KEY = 'cronometro-user-roles'
let currentEmail = null

const getStored = (key, fallback) => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const setStored = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getCurrentEmail = () => {
  if (currentEmail) return currentEmail
  const session = getStored(AUTH_KEY, null)
  return session?.user?.email || 'invitado'
}

export const setCurrentEmail = (email) => {
  currentEmail = email || null
}

const buildKey = (name) => `${STORAGE_PREFIX}:${getCurrentEmail()}:${name}`

export const getProfile = () => {
  const email = getCurrentEmail()
  const stored = getStored(buildKey('profile'), null)
  return {
    name: '',
    email,
    bio: '',
    phone: '',
    location: '',
    favorites: '',
    interests: '',
    ...stored,
  }
}

export const saveProfile = (profile) => {
  setStored(buildKey('profile'), profile)
}

// Funciones de roles
export const getUserRole = () => {
  const email = getCurrentEmail()
  const roles = getStored(ROLES_KEY, {})
  return roles[email] || 'user'
}

export const setUserRole = (email, role) => {
  const roles = getStored(ROLES_KEY, {})
  roles[email] = role
  setStored(ROLES_KEY, roles)
}

export const getAllRoles = () => {
  return getStored(ROLES_KEY, {})
}

export const changeUserRole = (email, role) => {
  setUserRole(email, role)
}

export const getTasks = () => {
  return getStored(buildKey('tasks'), [])
}

export const saveTasks = (tasks) => {
  setStored(buildKey('tasks'), tasks)
}

export const addTask = (task) => {
  const tasks = getTasks()
  tasks.unshift(task)
  saveTasks(tasks)
}

export const getNotifications = () => {
  return getStored(buildKey('notifications'), [])
}

export const saveNotifications = (notifications) => {
  setStored(buildKey('notifications'), notifications)
}

export const getSentNotifications = () => {
  return getStored(buildKey('sent-notifications'), {})
}

export const saveSentNotifications = (sentNotifications) => {
  setStored(buildKey('sent-notifications'), sentNotifications)
}

export const addNotification = (notification) => {
  const notifications = getNotifications()
  notifications.unshift({
    id: Date.now().toString(),
    ...notification,
    createdAt: new Date().toISOString(),
  })
  saveNotifications(notifications)
}

export const clearNotifications = () => {
  saveNotifications([])
}

export const getCronometro = () => {
  return getStored(buildKey('cronometro'), {
    tiempoTrabajo: 25,
    tiempoDescanso: 5,
    estado: 'pausado',
    segundosRestantes: 25 * 60,
    tipo: 'trabajo',
  })
}

export const saveCronometro = (cronometro) => {
  setStored(buildKey('cronometro'), cronometro)
}
