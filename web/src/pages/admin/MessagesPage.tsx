import { useCallback, useEffect, useState } from 'react'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { useAuth } from '../../features/admin/useAuth.ts'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { ApiError } from '../../services/api.ts'
import {
  getAdminMessage,
  getAdminMessages,
  updateAdminMessageStatus,
} from '../../services/admin/messages.ts'
import type {
  AdminMessageDetail,
  AdminMessageSummary,
  MessageStatus,
} from '../../services/admin/types.ts'

const statusLabel: Record<MessageStatus, string> = {
  new: 'Nuevo',
  read: 'Leído',
  archived: 'Archivado',
}

export function MessagesPage() {
  const { clear } = useAuth()
  const load = useCallback((signal: AbortSignal) => {
    signal.throwIfAborted()
    return getAdminMessages()
  }, [])
  const { state, retry } = useRemoteData(load)
  const [rows, setRows] = useState<AdminMessageSummary[] | null>(null)
  const [detail, setDetail] = useState<AdminMessageDetail | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Mensajes — Admin'
  }, [])

  if (state.status === 'ok' && rows === null) {
    setRows(state.data)
  }

  if (state.status === 'loading') {
    return <LoadingState label="Cargando mensajes" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={retry} />
  }

  const list = rows ?? state.data

  async function openMessage(id: number) {
    setError('')
    try {
      setDetail(await getAdminMessage(id))
    } catch (caught) {
      report(caught, setError, clear)
    }
  }

  async function changeStatus(status: MessageStatus) {
    if (!detail) {
      return
    }

    setError('')
    try {
      const updated = await updateAdminMessageStatus(detail.id, status)
      setDetail(updated)
      setRows((current) =>
        (current ?? []).map((row) =>
          row.id === updated.id ? { ...row, status: updated.status } : row,
        ),
      )
    } catch (caught) {
      report(caught, setError, clear)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-h2">Mensajes</h1>
      {error ? (
        <p className="mt-4 text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {list.length === 0 ? (
        <p className="mt-6 text-body text-text-secondary">No hay mensajes todavía.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
          {list.map((message) => (
            <li key={message.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-small">{message.name}</p>
                <p className="text-caption text-text-secondary">{message.email}</p>
                {message.subject ? <p className="mt-1 text-small">{message.subject}</p> : null}
                <p className="mt-1 text-caption text-text-secondary">
                  {statusLabel[message.status]}
                  {message.created_at ? ` · ${formatDate(message.created_at)}` : ''}
                </p>
              </div>
              <button
                type="button"
                className="focus-ring text-small text-accent"
                onClick={() => void openMessage(message.id)}
              >
                Ver
              </button>
            </li>
          ))}
        </ul>
      )}
      {detail ? (
        <article className="mt-6 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-h3">{detail.subject || detail.name}</h2>
          <p className="mt-2 text-caption text-text-secondary">
            {detail.name} · {detail.email} · {statusLabel[detail.status]}
            {detail.created_at ? ` · ${formatDate(detail.created_at)}` : ''}
          </p>
          <p className="mt-4 whitespace-pre-wrap text-small text-text-primary">{detail.message}</p>
          <div className="mt-4 flex gap-2">
            {detail.status !== 'read' ? (
              <Button type="button" variant="secondary" onClick={() => void changeStatus('read')}>
                Marcar leído
              </Button>
            ) : null}
            {detail.status !== 'archived' ? (
              <Button type="button" variant="secondary" onClick={() => void changeStatus('archived')}>
                Archivar
              </Button>
            ) : null}
          </div>
        </article>
      ) : null}
    </div>
  )
}

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function report(
  caught: unknown,
  setError: (message: string) => void,
  clear: () => void,
) {
  if (caught instanceof ApiError && caught.status === 401) {
    clear()
    return
  }

  setError(caught instanceof ApiError ? caught.message : 'No se pudo completar la acción.')
}
