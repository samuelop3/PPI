import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY

const isDevFallback =
  !supabaseUrl ||
  !supabaseKey ||
  supabaseUrl === 'http://localhost' ||
  supabaseKey === 'anon_key_for_dev'

function createDevAuth() {
  const storageKey = 'cronometro-dev-auth'
  const usersKey = 'cronometro-dev-users'

  const getUsers = () => {
    try {
      const raw = localStorage.getItem(usersKey)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  const setUsers = (users) => {
    localStorage.setItem(usersKey, JSON.stringify(users))
  }

  const getSession = async () => {
    let session = null
    try {
      const raw = localStorage.getItem(storageKey)
      session = raw ? JSON.parse(raw) : null
    } catch {
      localStorage.removeItem(storageKey)
    }
    return { data: { session } }
  }

  const listeners = new Set()
  const notify = (event, session) => {
    listeners.forEach((callback) => callback(event, session))
  }

  const saveSession = (email) => {
    const session = {
      user: {
        email,
      },
      access_token: 'dev-token',
      expires_in: 3600,
    }
    localStorage.setItem(storageKey, JSON.stringify(session))
    notify('SIGNED_IN', session)
    return session
  }

  return {
    auth: {
      getSession,
      onAuthStateChange: (callback) => {
        listeners.add(callback)
        return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } }
      },
      signInWithPassword: async ({ email, password }) => {
        const users = getUsers()
        const record = users[email]
        if (!record || record.password !== password) {
          return {
            data: null,
            error: {
              message: 'Credenciales incorrectas. Verifica el correo y la contraseña.',
            },
          }
        }
        return {
          data: { session: saveSession(email) },
          error: null,
        }
      },
      signUp: async ({ email, password }) => {
        const users = getUsers()
        if (users[email]) {
          return {
            data: null,
            error: { message: 'El correo ya está registrado.' },
          }
        }
        users[email] = { password }
        setUsers(users)
        return {
          data: { user: { email } },
          error: null,
        }
      },
      signOut: async () => {
        localStorage.removeItem(storageKey)
        notify('SIGNED_OUT', null)
        return { error: null }
      },
    },
  }
}

export const supabase = isDevFallback
  ? createDevAuth()
  : createClient(supabaseUrl, supabaseKey)
