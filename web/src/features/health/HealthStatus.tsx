import { useEffect, useState } from 'react'
import { ApiError, getHealth } from '../../services/api.ts'

type HealthState =
  | { status: 'loading' }
  | { status: 'ok' }
  | { status: 'error'; message: string }

export function HealthStatus() {
  const [state, setState] = useState<HealthState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    getHealth(controller.signal)
      .then((health) => {
        if (health.status !== 'ok') {
          setState({
            status: 'error',
            message: 'Respuesta inesperada del backend.',
          })
          return
        }

        setState({ status: 'ok' })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        const message =
          error instanceof ApiError
            ? error.message
            : 'No se pudo consultar el backend.'

        setState({ status: 'error', message })
      })

    return () => controller.abort()
  }, [])

  if (state.status === 'loading') {
    return <p>Comprobando backend…</p>
  }

  if (state.status === 'error') {
    return <p role="alert">{state.message}</p>
  }

  return <p>Backend conectado</p>
}
