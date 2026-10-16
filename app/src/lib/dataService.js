import { supabase, usesSupabase } from './supabaseClient'
import {
  addNotification,
  addTask,
  changeUserRole,
  clearNotifications,
  getAllRoles,
  getCronometro,
  getNotifications,
  getProfile,
  getTasks,
  getUserRole,
  saveNotifications,
  saveProfile,
  saveTasks,
} from './localData'

const defaultProfile = (email = '') => ({
  name: '',
  email,
  bio: '',
  phone: '',
  location: '',
  favorites: '',
  interests: '',
})

const throwIfError = (error) => {
  if (error) throw error
}

async function getUserId() {
  const { data, error } = await supabase.auth.getUser()
  throwIfError(error)
  if (!data.user) throw new Error('Debes iniciar sesión para realizar esta acción.')
  return data.user.id
}

export async function loadProfile() {
  if (!usesSupabase) return getProfile()

  const { data: auth, error: authError } = await supabase.auth.getUser()
  throwIfError(authError)
  if (!auth.user) throw new Error('No se encontró una sesión activa.')

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, name, bio, phone, location, favorites, interests, role')
    .eq('id', auth.user.id)
    .single()
  throwIfError(error)
  return data
}

export async function updateProfile(profile) {
  if (!usesSupabase) {
    saveProfile(profile)
    window.dispatchEvent(new Event('profile-updated'))
    return profile
  }

  const id = await getUserId()
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: profile.name.trim(),
      bio: profile.bio.trim(),
      phone: profile.phone.trim(),
      location: profile.location.trim(),
      favorites: profile.favorites.trim(),
      interests: profile.interests.trim(),
    })
    .eq('id', id)
    .select('id, email, name, bio, phone, location, favorites, interests, role')
    .single()
  throwIfError(error)
  window.dispatchEvent(new Event('profile-updated'))
  return data
}

export async function loadTasks() {
  if (!usesSupabase) return getTasks()

  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, completed, created_at')
    .order('created_at', { ascending: false })
  throwIfError(error)
  return data.map((task) => ({
    id: task.id,
    title: task.title,
    completed: task.completed,
    createdAt: task.created_at,
  }))
}

export async function createTask(title) {
  if (!usesSupabase) {
    const task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    addTask(task)
    return task
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title })
    .select('id, title, completed, created_at')
    .single()
  throwIfError(error)
  return { id: data.id, title: data.title, completed: data.completed, createdAt: data.created_at }
}

export async function setTaskCompleted(taskId, completed) {
  if (!usesSupabase) {
    const tasks = getTasks().map((task) => task.id === taskId ? { ...task, completed } : task)
    saveTasks(tasks)
    return tasks
  }
  const { error } = await supabase.from('tasks').update({ completed }).eq('id', taskId)
  throwIfError(error)
}

export async function deleteTask(taskId) {
  if (!usesSupabase) {
    saveTasks(getTasks().filter((task) => task.id !== taskId))
    return
  }
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  throwIfError(error)
}

export async function loadPomodoroSettings() {
  if (!usesSupabase) return getCronometro()

  const { data, error } = await supabase
    .from('pomodoro_settings')
    .select('work_minutes, break_minutes')
    .maybeSingle()
  throwIfError(error)
  const local = getCronometro()
  return {
    ...local,
    tiempoTrabajo: data?.work_minutes ?? 25,
    tiempoDescanso: data?.break_minutes ?? 5,
    segundosRestantes: (data?.work_minutes ?? 25) * 60,
  }
}

export async function persistPomodoroSettings(timer) {
  if (!usesSupabase) return

  const next = { work_minutes: timer.tiempoTrabajo, break_minutes: timer.tiempoDescanso }
  const userId = await getUserId()
  const { error } = await supabase.from('pomodoro_settings').upsert(
    { user_id: userId, ...next },
    { onConflict: 'user_id' },
  )
  throwIfError(error)
}

const toNotification = (notification) => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  scheduledAt: notification.scheduled_at,
  delivered: notification.status === 'delivered',
  processing: notification.status === 'processing',
  failed: notification.status === 'failed',
  error: notification.last_error,
  deliveredAt: notification.delivered_at,
  emailAddress: notification.email_address,
  createdAt: notification.created_at,
})

export async function loadNotifications() {
  if (!usesSupabase) return getNotifications()
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, message, scheduled_at, status, last_error, delivered_at, email_address, created_at')
    .order('scheduled_at', { ascending: false })
  throwIfError(error)
  return data.map(toNotification)
}

export async function createScheduledNotification(notification) {
  if (!usesSupabase) {
    addNotification({
      title: notification.title,
      message: notification.message,
      scheduledAt: notification.scheduledAt,
      emailAddress: notification.emailAddress,
      delivered: false,
      failed: false,
    })
    return getNotifications()[0]
  }
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      title: notification.title,
      message: notification.message,
      scheduled_at: notification.scheduledAt,
      email_address: notification.emailAddress || null,
    })
    .select('id, title, message, scheduled_at, status, last_error, delivered_at, email_address, created_at')
    .single()
  throwIfError(error)
  return toNotification(data)
}

export async function deleteScheduledNotification(id) {
  if (!usesSupabase) {
    saveNotifications(getNotifications().filter((notice) => notice.id !== id))
    return
  }
  const { error } = await supabase.from('notifications').delete().eq('id', id)
  throwIfError(error)
}

export async function deleteAllScheduledNotifications() {
  if (!usesSupabase) {
    clearNotifications()
    return
  }
  const { error } = await supabase.from('notifications').delete().neq('status', 'processing')
  throwIfError(error)
}

export async function updateLocalNotification(id, changes) {
  if (usesSupabase) throw new Error('Los recordatorios remotos se procesan desde el servidor.')
  const notices = getNotifications().map((notice) => notice.id === id ? { ...notice, ...changes } : notice)
  saveNotifications(notices)
  return notices
}

export async function retryNotification(id) {
  if (!usesSupabase) return updateLocalNotification(id, { failed: false, error: null })
  const { error } = await supabase.rpc('retry_notification', { notification_id: id })
  throwIfError(error)
}

export async function loadUserRole() {
  if (!usesSupabase) return getUserRole()
  const userId = await getUserId()
  const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single()
  throwIfError(error)
  return data.role
}

export async function loadUsers() {
  if (!usesSupabase) {
    return Object.entries(getAllRoles()).map(([email, role]) => ({ email, role }))
  }
  const { data, error } = await supabase.rpc('admin_list_users')
  throwIfError(error)
  return data
}

export async function updateUserRole(email, role) {
  if (!usesSupabase) {
    changeUserRole(email, role)
    return
  }
  const { error } = await supabase.rpc('admin_change_user_role', {
    target_email: email,
    new_role: role,
  })
  throwIfError(error)
  window.dispatchEvent(new Event('role-updated'))
}

export async function loadReports() {
  if (!usesSupabase) {
    return {
      users: 1,
      tasks: getTasks().length,
      completedTasks: getTasks().filter((task) => task.completed).length,
    }
  }
  const { data, error } = await supabase.rpc('staff_report_summary')
  throwIfError(error)
  return data
}

export { defaultProfile, usesSupabase }
