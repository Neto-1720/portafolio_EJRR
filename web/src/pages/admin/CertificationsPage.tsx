import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Field } from '../../features/admin/fields.tsx'
import { adminField, emptyToNull } from '../../features/admin/form.ts'
import { useAuth } from '../../features/admin/useAuth.ts'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { ApiError } from '../../services/api.ts'
import {
  createAdminCertification,
  deleteAdminCertification,
  getAdminCertifications,
  updateAdminCertification,
  type CertificationInput,
} from '../../services/admin/certifications.ts'
import { FieldErrors } from '../../services/admin/http.ts'
import type { AdminCertification } from '../../services/admin/types.ts'

type Draft = {
  id: number | null
  name: string
  issuer: string
  issued_at: string
  credential_url: string
  image_path: string
  sort_order: string
  is_published: boolean
}

function blank(): Draft {
  return {
    id: null,
    name: '',
    issuer: '',
    issued_at: '',
    credential_url: '',
    image_path: '',
    sort_order: '0',
    is_published: false,
  }
}

function fromCertification(item: AdminCertification): Draft {
  return {
    id: item.id,
    name: item.name,
    issuer: item.issuer ?? '',
    issued_at: item.issued_at ?? '',
    credential_url: item.credential_url ?? '',
    image_path: item.image_path ?? '',
    sort_order: String(item.sort_order),
    is_published: item.is_published,
  }
}

function toInput(draft: Draft): CertificationInput {
  return {
    name: draft.name.trim(),
    issuer: emptyToNull(draft.issuer),
    issued_at: emptyToNull(draft.issued_at),
    credential_url: emptyToNull(draft.credential_url),
    image_path: emptyToNull(draft.image_path),
    sort_order: Number(draft.sort_order),
    is_published: draft.is_published,
  }
}

export function CertificationsPage() {
  const { clear } = useAuth()
  const load = useCallback((signal: AbortSignal) => {
    signal.throwIfAborted()
    return getAdminCertifications()
  }, [])
  const { state, retry } = useRemoteData(load)
  const [rows, setRows] = useState<AdminCertification[] | null>(null)
  const [draft, setDraft] = useState<Draft>(blank)
  const [fields, setFields] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'Certificaciones — Admin'
  }, [])

  if (state.status === 'ok' && rows === null) {
    setRows(state.data)
  }

  if (state.status === 'loading') {
    return <LoadingState label="Cargando certificaciones" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={retry} />
  }

  const list = rows ?? state.data

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setFields({})
    setNotice('')
    setError('')

    try {
      const input = toInput(draft)
      if (draft.id === null) {
        const created = await createAdminCertification(input)
        setRows((current) => [...(current ?? []), created])
        setDraft(blank())
      } else {
        const saved = await updateAdminCertification(draft.id, input)
        setRows((current) => (current ?? []).map((row) => (row.id === saved.id ? saved : row)))
      }
      setNotice('Guardado.')
    } catch (caught) {
      if (caught instanceof FieldErrors) {
        setFields(caught.fields)
        setError(caught.message)
      } else if (caught instanceof ApiError && caught.status === 401) {
        clear()
      } else {
        setError(caught instanceof ApiError ? caught.message : 'No se pudo guardar.')
      }
    }
  }

  async function remove(id: number) {
    setError('')
    try {
      await deleteAdminCertification(id)
      setRows((current) => (current ?? []).filter((row) => row.id !== id))
      if (draft.id === id) setDraft(blank())
      setConfirmId(null)
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) clear()
      else setError(caught instanceof ApiError ? caught.message : 'No se pudo eliminar.')
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-h2">Certificaciones</h1>
      {notice ? <p className="mt-4 text-small text-success" role="status">{notice}</p> : null}
      {error ? <p className="mt-4 text-small text-danger" role="alert">{error}</p> : null}
      <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
        {list.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-small">{item.name}</p>
              <p className="text-caption text-text-secondary">
                {item.is_published ? 'Publicada' : 'Oculta'}
              </p>
            </div>
            <div className="flex gap-3 text-small">
              <button type="button" className="focus-ring text-accent" onClick={() => setDraft(fromCertification(item))}>
                Editar
              </button>
              {confirmId === item.id ? (
                <button type="button" className="focus-ring text-danger" onClick={() => void remove(item.id)}>
                  Confirmar
                </button>
              ) : (
                <button type="button" className="focus-ring text-text-muted" onClick={() => setConfirmId(item.id)}>
                  Eliminar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <form className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-5" onSubmit={(event) => void onSubmit(event)}>
        <h2 className="text-h3">{draft.id === null ? 'Nueva' : 'Editar'}</h2>
        <Field label="Nombre" htmlFor="cert-name" error={fields.name}>
          <input id="cert-name" className={adminField} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        </Field>
        <Field label="Emisor" htmlFor="cert-issuer" error={fields.issuer}>
          <input id="cert-issuer" className={adminField} value={draft.issuer} onChange={(event) => setDraft({ ...draft, issuer: event.target.value })} />
        </Field>
        <Field label="Fecha" htmlFor="cert-date" error={fields.issued_at}>
          <input id="cert-date" className={adminField} type="date" value={draft.issued_at} onChange={(event) => setDraft({ ...draft, issued_at: event.target.value })} />
        </Field>
        <Field label="URL de credencial" htmlFor="cert-url" error={fields.credential_url}>
          <input id="cert-url" className={adminField} value={draft.credential_url} onChange={(event) => setDraft({ ...draft, credential_url: event.target.value })} />
        </Field>
        <Field label="Ruta de imagen" htmlFor="cert-image" error={fields.image_path}>
          <input id="cert-image" className={adminField} value={draft.image_path} onChange={(event) => setDraft({ ...draft, image_path: event.target.value })} />
        </Field>
        <Field label="Orden" htmlFor="cert-order" error={fields.sort_order}>
          <input id="cert-order" className={adminField} inputMode="numeric" value={draft.sort_order} onChange={(event) => setDraft({ ...draft, sort_order: event.target.value })} />
        </Field>
        <label className="flex items-center gap-2 text-small">
          <input type="checkbox" checked={draft.is_published} onChange={(event) => setDraft({ ...draft, is_published: event.target.checked })} />
          Publicada
        </label>
        <div className="flex gap-2">
          <Button type="submit">Guardar</Button>
          {draft.id !== null ? (
            <Button type="button" variant="secondary" onClick={() => setDraft(blank())}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
