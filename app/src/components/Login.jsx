import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Aquí se puede conectar con Supabase para autenticar
    await supabase
      .from('users')
      .select('*')
      .limit(1)
    onLogin()
  }

  return (
    <section className="login-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h1 className="card-title">En construcción</h1>
                <p className="card-text text-muted">Login provisional para acceder a las secciones protegidas.</p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
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

                  <div className="mb-3">
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

                  <button type="submit" className="btn btn-primary w-100">
                    Iniciar sesión
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
