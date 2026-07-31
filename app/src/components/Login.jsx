import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Login({ onLogin, onStatus }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    onStatus('')

    if (!email || !password) {
      setError('Ingresa un correo y una contraseña.')
      return
    }

    setLoading(true)

    if (mode === 'login') {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      setLoading(false)

      if (authError) {
        setError(authError.message)
        return
      }

      if (data?.session) {
        onLogin()
      } else {
        setError('No se pudo iniciar sesión. Verifica tus credenciales.')
      }
      return
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (data?.user) {
      onStatus('Registro exitoso. Revisa tu correo para confirmar tu cuenta.')
      setMode('login')
    }
  }

  return (
    <section className="login-page py-5">
      <div className="row justify-content-center">
        <div className="col-xl-5 col-lg-6 col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="card-title mb-3">{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
              <p className="card-text text-muted">
                {mode === 'login'
                  ? 'Accede para ver las secciones protegidas.'
                  : 'Regístrate y confirma tu cuenta para empezar.'}
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tu@correo.com"
                  />
                </div>

                <div className="mb-4 text-start">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Registrar cuenta'}
                </button>
              </form>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login')
                    setError('')
                    onStatus('')
                  }}
                >
                  {mode === 'login'
                    ? '¿No tienes cuenta? Regístrate'
                    : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
