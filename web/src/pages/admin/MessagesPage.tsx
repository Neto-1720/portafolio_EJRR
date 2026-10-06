import { useCallback, useEffect } from 'react'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getAdminMessages } from '../../services/admin/messages.ts'

export function MessagesPage() {
  const load = useCallback((signal: AbortSignal) => {
    signal.throwIfAborted()
    return getAdminMessages()
  }, [])
  const { state, retry } = useRemoteData(load)

  useEffect(() => {
    document.title = 'Mensajes — Admin'
  }, [])

  if (state.status === 'loading') {
    return <LoadingState label="Cargando mensajes" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={retry} />
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-h2">Mensajes</h1>
      {state.data.length === 0 ? (
        <p className="mt-6 text-body text-text-secondary">No hay mensajes todavía.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {state.data.map((message) => (
            <li key={message.id} className="rounded-lg border border-border bg-surface p-4">
              <p className="text-small">{message.name}</p>
              <p className="text-caption text-text-secondary">{message.email}</p>
              {message.subject ? <p className="mt-2 text-small">{message.subject}</p> : null}
              <p className="mt-2 text-small text-text-secondary">{message.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
