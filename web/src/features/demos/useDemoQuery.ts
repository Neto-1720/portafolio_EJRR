import { useEffect, useState } from 'react'
import { ApiError } from '../../services/api.ts'

type RemoteState<T> =
  | { status: 'loading' }
  | { status: 'ok'; data: T }
  | { status: 'error'; message: string; statusCode: number | null }

export function useDemoQuery<T>(
  load: (signal: AbortSignal) => Promise<T>,
  resetKey = '',
  keepPrevious = true,
): { state: RemoteState<T>; refreshing: boolean; retry: () => void } {
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${resetKey}:${attempt}`
  const [trackedKey, setTrackedKey] = useState(requestKey)
  const [refreshing, setRefreshing] = useState(false)
  const [state, setState] = useState<RemoteState<T>>({ status: 'loading' })

  if (trackedKey !== requestKey) {
    setTrackedKey(requestKey)
    if (keepPrevious && state.status === 'ok') {
      setRefreshing(true)
    } else {
      setRefreshing(false)
      setState({ status: 'loading' })
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: 'ok', data })
          setRefreshing(false)
        }
      })
      .catch((error: unknown) => {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === 'AbortError')
        ) {
          return
        }

        setRefreshing(false)
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
  }, [load, requestKey])

  return {
    state,
    refreshing,
    retry: () => setAttempt((current) => current + 1),
  }
}
