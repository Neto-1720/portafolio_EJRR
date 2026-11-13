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
  clearCertificationImage,
  createAdminCertification,
  deleteAdminCertification,
  getAdminCertifications,
  updateAdminCertification,
  uploadCertificationImage,
  type CertificationInput,
} from '../../services/admin/certifications.ts'
import { FieldErrors } from '../../services/admin/http.ts'
import type { AdminCertification } from '../../services/admin/types.ts'

type Draft = {
  id: number | null
  name: string
  issuer: string
  issued_at: string
  hours: string
  credential_url: string
  image_path: string
  image_url: string | null
  sort_order: string
  is_published: boolean
}

function blank(): Draft {
  return {
    id: null,
    name: '',
    issuer: '',
    issued_at: '',
    hours: '',
    credential_url: '',
    image_path: '',
    image_url: null,
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
    hours: item.hours ?? '',
    credential_url: item.credential_url ?? '',
    image_path: item.image_path ?? '',
    image_url: item.image_url,
    sort_order: String(item.sort_order),
    is_published: item.is_published,
  }
}

function toInput(draft: Draft): CertificationInput {
  return {
    name: draft.name.trim(),
    issuer: emptyToNull(draft.issuer),
    issued_at: emptyToNull(draft.issued_at),
    hours: emptyToNull(draft.hours),
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
  const [uploading, setUploading] = useState(false)

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
        setDraft(fromCertification(created))
      } else {
        const saved = await updateAdminCertification(draft.id, input)
        setRows((current) =>
          (current ?? []).map((row) => (row.id === saved.id ? saved : row)),
        )
        setDraft(fromCertification(saved))
      }
      setNotice('Guardado.')
    } catch (caught) {
      if (caught instanceof FieldErrors) {
        setFields(caught.fields)
        setError(caught.message)
      } else if (caught instanceof ApiError && caught.status === 401) {
        clear()
      } else {
        setError(
          caught instanceof ApiError ? caught.message : 'No se pudo guardar.',
        )
      }
    }
  }

  async function onUpload(file: File | null) {
    if (!file || draft.id === null) {
      return
    }

    setUploading(true)
    setFields({})
    setError('')
    setNotice('')

    try {
      const saved = await uploadCertificationImage(draft.id, file)
      setRows((current) =>
        (current ?? []).map((row) => (row.id === saved.id ? saved : row)),
      )
      setDraft(fromCertification(saved))
      setNotice('Imagen subida.')
    } catch (caught) {
      if (caught instanceof FieldErrors) {
        setFields(caught.fields)
        setError(caught.message)
      } else if (caught instanceof ApiError && caught.status === 401) {
        clear()
      } else {
        setError(
          caught instanceof ApiError
            ? caught.message
            : 'No se pudo subir la imagen.',
        )
      }
    } finally {
      setUploading(false)
    }
  }

  async function onClearImage() {
    if (draft.id === null) {
      return
    }

    setError('')
    setNotice('')

    try {
      const saved = await clearCertificationImage(draft.id)
      setRows((current) =>
        (current ?? []).map((row) => (row.id === saved.id ? saved : row)),
      )
      setDraft(fromCertification(saved))
      setNotice('Imagen eliminada.')
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        clear()
      } else {
        setError(
          caught instanceof ApiError
            ? caught.message
            : 'No se pudo eliminar la imagen.',
        )
      }
    }
  }

  async function remove(id: number) {
    setError('')
    try {
      await deleteAdminCertification(id)
      setRows((current) => (current ?? []).filter((row) => row.id !== id))
      if (draft.id === id) {
        setDraft(blank())
      }
      setConfirmId(null)
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        clear()
      } else {
        setError(
          caught instanceof ApiError ? caught.message : 'No se pudo eliminar.',
        )
      }
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-h2">Certificaciones</h1>
      <p className="mt-2 text-body text-text-secondary">
        Crea o edita cursos, publícalos y sube la imagen del certificado (JPG,
        PNG o WebP, máx. 5 MB). Lo publicado aparece en el Home.
      </p>
      {notice ? (
        <p className="mt-4 text-small text-success" role="status">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
        {list.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt=""
                  className="size-12 rounded-md border border-border object-contain bg-surface-secondary"
                />
              ) : (
                <span className="grid size-12 place-items-center rounded-md border border-border bg-surface-secondary text-caption text-text-muted">
                  —
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-small">{item.name}</p>
                <p className="text-caption text-text-secondary">
                  {item.is_published ? 'Publicada' : 'Oculta'}
                  {item.hours ? ` · ${item.hours}` : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-3 text-small">
              <button
                type="button"
                className="focus-ring text-accent"
                onClick={() => setDraft(fromCertification(item))}
              >
                Editar
              </button>
              {confirmId === item.id ? (
                <button
                  type="button"
                  className="focus-ring text-danger"
                  onClick={() => void remove(item.id)}
                >
                  Confirmar
                </button>
              ) : (
                <button
                  type="button"
                  className="focus-ring text-text-muted"
                  onClick={() => setConfirmId(item.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <form
        className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-5"
        onSubmit={(event) => void onSubmit(event)}
      >
        <h2 className="text-h3">{draft.id === null ? 'Nueva' : 'Editar'}</h2>
        <Field label="Nombre" htmlFor="cert-name" error={fields.name}>
          <input
            id="cert-name"
            className={adminField}
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
          />
        </Field>
        <Field label="Emisor" htmlFor="cert-issuer" error={fields.issuer}>
          <input
            id="cert-issuer"
            className={adminField}
            value={draft.issuer}
            onChange={(event) =>
              setDraft({ ...draft, issuer: event.target.value })
            }
          />
        </Field>
        <Field label="Fecha" htmlFor="cert-date" error={fields.issued_at}>
          <input
            id="cert-date"
            className={adminField}
            type="date"
            value={draft.issued_at}
            onChange={(event) =>
              setDraft({ ...draft, issued_at: event.target.value })
            }
          />
        </Field>
        <Field label="Horas" htmlFor="cert-hours" error={fields.hours}>
          <input
            id="cert-hours"
            className={adminField}
            placeholder="9 h"
            value={draft.hours}
            onChange={(event) =>
              setDraft({ ...draft, hours: event.target.value })
            }
          />
        </Field>
        <Field
          label="URL de credencial"
          htmlFor="cert-url"
          error={fields.credential_url}
        >
          <input
            id="cert-url"
            className={adminField}
            value={draft.credential_url}
            onChange={(event) =>
              setDraft({ ...draft, credential_url: event.target.value })
            }
          />
        </Field>
        <Field label="Orden" htmlFor="cert-order" error={fields.sort_order}>
          <input
            id="cert-order"
            className={adminField}
            inputMode="numeric"
            value={draft.sort_order}
            onChange={(event) =>
              setDraft({ ...draft, sort_order: event.target.value })
            }
          />
        </Field>
        <label className="flex items-center gap-2 text-small">
          <input
            type="checkbox"
            checked={draft.is_published}
            onChange={(event) =>
              setDraft({ ...draft, is_published: event.target.checked })
            }
          />
          Publicada
        </label>

        <div className="space-y-3 rounded-lg border border-border bg-surface-secondary/40 p-4">
          <p className="text-small text-text-primary">Imagen del certificado</p>
          {draft.image_url ? (
            <img
              src={draft.image_url}
              alt="Vista previa del certificado"
              className="max-h-48 w-full rounded-md border border-border object-contain bg-surface"
            />
          ) : (
            <p className="text-caption text-text-muted">
              Sin imagen. Guarda la certificación y luego súbela aquí.
            </p>
          )}
          <Field label="Archivo" htmlFor="cert-file" error={fields.image}>
            <input
              id="cert-file"
              className={adminField}
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              disabled={draft.id === null || uploading}
              onChange={(event) =>
                void onUpload(event.target.files?.[0] ?? null)
              }
            />
          </Field>
          {draft.id === null ? (
            <p className="text-caption text-text-muted">
              Primero guarda la ficha; después puedes subir la imagen.
            </p>
          ) : null}
          {draft.image_url ? (
            <Button
              type="button"
              variant="secondary"
              disabled={uploading}
              onClick={() => void onClearImage()}
            >
              Quitar imagen
            </Button>
          ) : null}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={uploading}>
            Guardar
          </Button>
          {draft.id !== null ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDraft(blank())}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
