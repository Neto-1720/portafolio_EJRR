import { useEffect, useState } from 'react'
import { ApiError } from '../services/api.ts'

type RemoteState<T> =
  | { status: 'loading' }
  | { status: 'ok'; data: T }
  | { status: 'error'; message: string; statusCode: number | null }

export function useRemoteData<T>(
  load: (signal: AbortSignal) => Promise<T>,
  resetKey = '',
): { state: RemoteState<T>; retry: () => void } {
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${resetKey}:${attempt}`
  const [trackedKey, setTrackedKey] = useState(requestKey)
  const [state, setState] = useState<RemoteState<T>>({ status: 'loading' })

  if (trackedKey !== requestKey) {
    setTrackedKey(requestKey)
    setState({ status: 'loading' })
  }

  useEffect(() => {
    const controller = new AbortController()

    load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: 'ok', data })
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setState({
          status: 'error',
          message:
            error instanceof ApiError
              ? error.message
              : 'No se pudo cargar la información.',
          statusCode: error instanceof ApiError ? error.status : null,
        })
      })

    return () => controller.abort()
  }, [attempt, load])

  return {
    state,
    retry: () => setAttempt((current) => current + 1),
  }
}
