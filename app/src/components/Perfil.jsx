import { useEffect, useState } from 'react'
import { getProfile, saveProfile } from '../lib/localData'

function Perfil() {
  const [profile, setProfile] = useState(getProfile())
  const [status, setStatus] = useState('')

  useEffect(() => {
    saveProfile(profile)
  }, [profile])

  const handleChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    setStatus('Perfil actualizado correctamente.')
    setTimeout(() => setStatus(''), 3000)
  }

  return (
    <div className="perfil-section">
      <div className="row justify-content-center">
        <div className="col-xl-8">
          <div className="border rounded-3 p-4">
            <h2 className="h5 mb-3">Perfil de usuario</h2>
            <p className="text-muted mb-4">Actualiza tus datos personales, gustos y preferencias.</p>
            {status && (
              <div className="alert alert-success" role="alert">
                {status}
              </div>
            )}
            <form onSubmit={handleSave}>
              <div className="row g-3 mb-3">
                <div className="col-md-6 text-start">
                  <label htmlFor="profileEmail" className="form-label">
                    Correo electrónico
                  </label>
                  <input id="profileEmail" type="email" className="form-control" value={profile.email} disabled />
                </div>
                <div className="col-md-6 text-start">
                  <label htmlFor="profilePhone" className="form-label">
                    Teléfono
                  </label>
                  <input
                    id="profilePhone"
                    type="tel"
                    className="form-control"
                    value={profile.phone}
                    onChange={(event) => handleChange('phone', event.target.value)}
                    placeholder="Ej. +57 300 000 0000"
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6 text-start">
                  <label htmlFor="profileName" className="form-label">
                    Nombre
                  </label>
                  <input
                    id="profileName"
                    type="text"
                    className="form-control"
                    value={profile.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="col-md-6 text-start">
                  <label htmlFor="profileLocation" className="form-label">
                    Ubicación
                  </label>
                  <input
                    id="profileLocation"
                    type="text"
                    className="form-control"
                    value={profile.location}
                    onChange={(event) => handleChange('location', event.target.value)}
                    placeholder="Ciudad, país"
                  />
                </div>
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="profileBio" className="form-label">
                  Bio
                </label>
                <textarea
                  id="profileBio"
                  className="form-control"
                  value={profile.bio}
                  onChange={(event) => handleChange('bio', event.target.value)}
                  rows="3"
                  placeholder="Describe brevemente quién eres"
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="profileInterests" className="form-label">
                  Gustos e intereses
                </label>
                <textarea
                  id="profileInterests"
                  className="form-control"
                  value={profile.interests}
                  onChange={(event) => handleChange('interests', event.target.value)}
                  rows="3"
                  placeholder="Ej. Música, tecnología, deportes"
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="profileFavorites" className="form-label">
                  Cosas favoritas
                </label>
                <textarea
                  id="profileFavorites"
                  className="form-control"
                  value={profile.favorites}
                  onChange={(event) => handleChange('favorites', event.target.value)}
                  rows="3"
                  placeholder="Ej. Café, series, diseño"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Guardar perfil
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Perfil
