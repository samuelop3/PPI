import { useEffect, useRef, useState } from 'react'
import { getCronometro, saveCronometro } from '../lib/localData'

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`
}

function Cronometro() {
  const intervalRef = useRef(null)
  const [cronometro, setCronometro] = useState(getCronometro())

  useEffect(() => {
    saveCronometro(cronometro)
  }, [cronometro])

  useEffect(() => {
    if (cronometro.estado !== 'activo') {
      return
    }

    intervalRef.current = setInterval(() => {
      setCronometro((current) => {
        if (current.segundosRestantes <= 1) {
          const siguienteTipo = current.tipo === 'trabajo' ? 'descanso' : 'trabajo'
          const siguienteSegundos = siguienteTipo === 'trabajo' ? current.tiempoTrabajo * 60 : current.tiempoDescanso * 60
          return {
            ...current,
            tipo: siguienteTipo,
            segundosRestantes: siguienteSegundos,
            estado: 'pausado',
          }
        }

        return {
          ...current,
          segundosRestantes: current.segundosRestantes - 1,
        }
      })
    }, 1000)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [cronometro.estado])

  const handleStartPause = () => {
    setCronometro((current) => ({
      ...current,
      estado: current.estado === 'activo' ? 'pausado' : 'activo',
    }))
  }

  const handleReset = () => {
    setCronometro((current) => ({
      ...current,
      estado: 'pausado',
      segundosRestantes: current.tipo === 'trabajo' ? current.tiempoTrabajo * 60 : current.tiempoDescanso * 60,
    }))
  }

  const handleTipo = (tipo) => {
    const segundos = tipo === 'trabajo' ? cronometro.tiempoTrabajo * 60 : cronometro.tiempoDescanso * 60
    setCronometro((current) => ({
      ...current,
      tipo,
      segundosRestantes: segundos,
      estado: 'pausado',
    }))
  }

  return (
    <div className="cronometro-section">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h5">Cronómetro</h2>
            <p className="text-muted mb-3">Controla tu tiempo de trabajo y descanso.</p>
            <div className="display-1 fw-bold text-center mb-4">{formatTime(cronometro.segundosRestantes)}</div>
            <div className="d-flex justify-content-center gap-2 mb-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => handleTipo('trabajo')}
                disabled={cronometro.tipo === 'trabajo'}
              >
                Trabajo
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handleTipo('descanso')}
                disabled={cronometro.tipo === 'descanso'}
              >
                Descanso
              </button>
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button type="button" className="btn btn-primary" onClick={handleStartPause}>
                {cronometro.estado === 'activo' ? 'Pausar' : 'Iniciar'}
              </button>
              <button type="button" className="btn btn-outline-danger" onClick={handleReset}>
                Reiniciar
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h5">Configuración</h2>
            <p className="text-muted mb-4">Ajusta la duración del cronómetro.</p>
            <div className="mb-3">
              <label className="form-label">Tiempo de trabajo (min)</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={cronometro.tiempoTrabajo}
                onChange={(event) => {
                  const value = Number(event.target.value) || 1
                  setCronometro((current) => ({
                    ...current,
                    tiempoTrabajo: value,
                    segundosRestantes: current.tipo === 'trabajo' ? value * 60 : current.segundosRestantes,
                  }))
                }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tiempo de descanso (min)</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={cronometro.tiempoDescanso}
                onChange={(event) => {
                  const value = Number(event.target.value) || 1
                  setCronometro((current) => ({
                    ...current,
                    tiempoDescanso: value,
                    segundosRestantes: current.tipo === 'descanso' ? value * 60 : current.segundosRestantes,
                  }))
                }}
              />
            </div>
            <div className="mt-4">
              <p className="mb-1"><strong>Estado:</strong> {cronometro.estado === 'activo' ? 'Activo' : 'Pausado'}</p>
              <p className="mb-0"><strong>Modo actual:</strong> {cronometro.tipo === 'trabajo' ? 'Trabajo' : 'Descanso'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cronometro
