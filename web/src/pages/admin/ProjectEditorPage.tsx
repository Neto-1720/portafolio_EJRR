import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Field } from '../../features/admin/fields.tsx'
import { adminField, emptyToNull } from '../../features/admin/form.ts'
import { useAuth } from '../../features/admin/useAuth.ts'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { ApiError } from '../../services/api.ts'
import { FieldErrors } from '../../services/admin/http.ts'
import {
  createAdminProject,
  deleteProjectImage,
  getAdminProject,
  updateAdminProject,
  updateProjectImage,
  uploadProjectImage,
  type ProjectInput,
} from '../../services/admin/projects.ts'
import type { AdminProject, AdminProjectImage } from '../../services/admin/types.ts'
import { getTechnologies } from '../../services/technologies.ts'
import type { Technology } from '../../types/portfolio.ts'
import { imageUrl } from '../../utils/publicUrl.ts'

type FormState = {
  title: string
  slug: string
  subtitle: string
  summary: string
  context: string
  problem: string
  solution: string
  responsibilities: string
  technical_decisions: string
  challenges: string
  results: string
  learnings: string
  role: string
  period: string
  is_featured: boolean
  is_published: boolean
  sort_order: string
  technology_ids: number[]
}

const textFields: { key: 'context' | 'problem' | 'solution' | 'responsibilities' | 'technical_decisions' | 'challenges' | 'results' | 'learnings'; label: string }[] = [
  { key: 'context', label: 'Contexto' },
  { key: 'problem', label: 'Problema' },
  { key: 'solution', label: 'Solución' },
  { key: 'responsibilities', label: 'Responsabilidades' },
  { key: 'technical_decisions', label: 'Decisiones técnicas' },
  { key: 'challenges', label: 'Retos' },
  { key: 'results', label: 'Resultados' },
  { key: 'learnings', label: 'Aprendizajes' },
]

function emptyForm(): FormState {
  return {
    title: '',
    slug: '',
    subtitle: '',
    summary: '',
    context: '',
    problem: '',
    solution: '',
    responsibilities: '',
    technical_decisions: '',
    challenges: '',
    results: '',
    learnings: '',
    role: '',
    period: '',
    is_featured: false,
    is_published: false,
    sort_order: '0',
    technology_ids: [],
  }
}

function toForm(project: AdminProject): FormState {
  return {
    title: project.title,
    slug: project.slug,
    subtitle: project.subtitle ?? '',
    summary: project.summary,
    context: project.context ?? '',
    problem: project.problem ?? '',
    solution: project.solution ?? '',
    responsibilities: project.responsibilities ?? '',
    technical_decisions: project.technical_decisions ?? '',
    challenges: project.challenges ?? '',
    results: project.results ?? '',
    learnings: project.learnings ?? '',
    role: project.role ?? '',
    period: project.period ?? '',
    is_featured: project.is_featured,
    is_published: project.is_published,
    sort_order: String(project.sort_order),
    technology_ids: project.technology_ids,
  }
}

function toInput(form: FormState): ProjectInput {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    subtitle: emptyToNull(form.subtitle),
    summary: form.summary.trim(),
    context: emptyToNull(form.context),
    problem: emptyToNull(form.problem),
    solution: emptyToNull(form.solution),
    responsibilities: emptyToNull(form.responsibilities),
    technical_decisions: emptyToNull(form.technical_decisions),
    challenges: emptyToNull(form.challenges),
    results: emptyToNull(form.results),
    learnings: emptyToNull(form.learnings),
    role: emptyToNull(form.role),
    period: emptyToNull(form.period),
    is_featured: form.is_featured,
    is_published: form.is_published,
    sort_order: Number(form.sort_order),
    technology_ids: form.technology_ids,
  }
}

export function ProjectEditorPage() {
  const { id = 'new' } = useParams()
  const navigate = useNavigate()
  const { clear } = useAuth()
  const load = useCallback(
    async (signal: AbortSignal) => {
      const technologies = await getTechnologies(signal)
      const project = id === 'new' ? null : await getAdminProject(Number(id))
      return { project, technologies }
    },
    [id],
  )
  const { state, retry } = useRemoteData(load, id)
  const [synced, setSynced] = useState('')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [images, setImages] = useState<AdminProjectImage[]>([])
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [fields, setFields] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    document.title = id === 'new' ? 'Nuevo proyecto — Admin' : 'Editar proyecto — Admin'
  }, [id])

  if (state.status === 'ok' && synced !== id) {
    setSynced(id)
    setTechnologies(state.data.technologies)
    setForm(state.data.project ? toForm(state.data.project) : emptyForm())
    setImages(state.data.project?.images ?? [])
    setFields({})
    setNotice('')
    setError('')
  }

  if (state.status === 'loading' || (state.status === 'ok' && synced !== id)) {
    return <LoadingState label="Cargando proyecto" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={retry} />
  }

  const projectId = state.data.project?.id ?? null

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setNotice('')
    setError('')
    setFields({})

    try {
      const input = toInput(form)
      if (projectId === null) {
        const created = await createAdminProject(input)
        navigate(`/admin/projects/${created.id}`, { replace: true })
        return
      }

      const saved = await updateAdminProject(projectId, input)
      setForm(toForm(saved))
      setImages(saved.images)
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
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="max-w-3xl" onSubmit={(event) => void onSubmit(event)}>
      <Link to="/admin/projects" className="focus-ring text-small text-text-secondary">
        Volver
      </Link>
      <h1 className="mt-3 text-h2">{projectId === null ? 'Nuevo proyecto' : 'Editar proyecto'}</h1>
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

      <section className="mt-8 space-y-4 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-h3">Basic</h2>
        <Field label="Título" htmlFor="title" error={fields.title}>
          <input id="title" className={adminField} value={form.title} onChange={(event) => update('title', event.target.value)} />
        </Field>
        <Field label="Slug" htmlFor="slug" error={fields.slug}>
          <input id="slug" className={adminField} value={form.slug} onChange={(event) => update('slug', event.target.value)} />
        </Field>
        <Field label="Subtítulo" htmlFor="subtitle" error={fields.subtitle}>
          <input id="subtitle" className={adminField} value={form.subtitle} onChange={(event) => update('subtitle', event.target.value)} />
        </Field>
        <Field label="Resumen" htmlFor="summary" error={fields.summary}>
          <textarea id="summary" className={adminField} rows={4} value={form.summary} onChange={(event) => update('summary', event.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Rol" htmlFor="role" error={fields.role}>
            <input id="role" className={adminField} value={form.role} onChange={(event) => update('role', event.target.value)} />
          </Field>
          <Field label="Periodo" htmlFor="period" error={fields.period}>
            <input id="period" className={adminField} value={form.period} onChange={(event) => update('period', event.target.value)} />
          </Field>
        </div>
      </section>

      <section className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-h3">Case Study</h2>
        {textFields.map((field) => (
          <Field key={field.key} label={field.label} htmlFor={field.key} error={fields[field.key]}>
            <textarea
              id={field.key}
              className={adminField}
              rows={5}
              value={form[field.key]}
              onChange={(event) => update(field.key, event.target.value)}
            />
          </Field>
        ))}
      </section>

      <section className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-h3">Technologies</h2>
        {fields.technology_ids ? (
          <p className="mt-2 text-caption text-danger" role="alert">
            {fields.technology_ids}
          </p>
        ) : null}
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {technologies.map((technology) => (
            <li key={technology.id}>
              <label className="flex items-center gap-2 text-small">
                <input
                  type="checkbox"
                  checked={form.technology_ids.includes(technology.id)}
                  onChange={(event) => {
                    update(
                      'technology_ids',
                      event.target.checked
                        ? [...form.technology_ids, technology.id]
                        : form.technology_ids.filter((item) => item !== technology.id),
                    )
                  }}
                />
                {technology.name}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-h3">Publication</h2>
        <label className="flex items-center gap-2 text-small">
          <input type="checkbox" checked={form.is_published} onChange={(event) => update('is_published', event.target.checked)} />
          Publicado
        </label>
        <label className="flex items-center gap-2 text-small">
          <input type="checkbox" checked={form.is_featured} onChange={(event) => update('is_featured', event.target.checked)} />
          Destacado
        </label>
        <Field label="Orden" htmlFor="sort_order" error={fields.sort_order}>
          <input id="sort_order" className={adminField} inputMode="numeric" value={form.sort_order} onChange={(event) => update('sort_order', event.target.value)} />
        </Field>
      </section>

      {projectId !== null ? (
        <ImageManager
          projectId={projectId}
          images={images}
          onChange={setImages}
          onAuthError={clear}
        />
      ) : null}

      <Button className="mt-6" type="submit" disabled={pending}>
        {pending ? 'Guardando…' : 'Guardar'}
      </Button>
    </form>
  )
}

function ImageManager({
  projectId,
  images,
  onChange,
  onAuthError,
}: {
  projectId: number
  images: AdminProjectImage[]
  onChange: (images: AdminProjectImage[]) => void
  onAuthError: () => void
}) {
  const [error, setError] = useState('')

  async function upload(files: File[]) {
    setError('')
    let current = images

    try {
      for (const file of files) {
        const form = new FormData()
        form.set('image', file)
        form.set('sort_order', String(current.length))
        form.set('is_cover', current.length === 0 ? '1' : '0')
        const image = await uploadProjectImage(projectId, form)
        current = image.is_cover
          ? [...current.map((item) => ({ ...item, is_cover: false })), image]
          : [...current, image]
        onChange(current)
      }
    } catch (caught) {
      report(caught, setError, onAuthError)
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const ordered = [...images].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    const current = ordered[index]
    const neighbor = ordered[index + direction]
    if (!current || !neighbor) return

    const currentOrder = index
    const neighborOrder = index + direction
    setError('')

    try {
      const savedCurrent = await updateProjectImage(projectId, current.id, {
        alt_text: current.alt_text,
        caption: current.caption,
        sort_order: neighborOrder,
        is_cover: current.is_cover,
      })
      const savedNeighbor = await updateProjectImage(projectId, neighbor.id, {
        alt_text: neighbor.alt_text,
        caption: neighbor.caption,
        sort_order: currentOrder,
        is_cover: neighbor.is_cover,
      })
      onChange(
        images.map((item) => {
          if (item.id === savedCurrent.id) return savedCurrent
          if (item.id === savedNeighbor.id) return savedNeighbor
          return item
        }),
      )
    } catch (caught) {
      report(caught, setError, onAuthError)
    }
  }

  async function saveMeta(image: AdminProjectImage, patch: Partial<AdminProjectImage>) {
    setError('')
    const next = { ...image, ...patch }
    try {
      const saved = await updateProjectImage(projectId, image.id, {
        alt_text: next.alt_text,
        caption: next.caption,
        sort_order: next.sort_order,
        is_cover: next.is_cover,
      })
      onChange(
        images.map((item) => {
          if (item.id === saved.id) return saved
          if (saved.is_cover) return { ...item, is_cover: false }
          return item
        }),
      )
    } catch (caught) {
      report(caught, setError, onAuthError)
    }
  }

  async function remove(imageId: number) {
    setError('')
    try {
      await deleteProjectImage(projectId, imageId)
      onChange(images.filter((item) => item.id !== imageId))
    } catch (caught) {
      report(caught, setError, onAuthError)
    }
  }

  return (
    <section className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-5">
      <h2 className="text-h3">Images</h2>
      <Field label="Subir imágenes" htmlFor="image-file">
        <input
          id="image-file"
          className={adminField}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => {
            const files = [...(event.target.files ?? [])]
            event.target.value = ''
            if (files.length > 0) void upload(files)
          }}
        />
      </Field>
      {error ? (
        <p className="text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="space-y-4">
        {[...images]
          .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
          .map((image, index, ordered) => {
          const src = imageUrl(image)
          return (
            <li key={image.id} className="rounded-md border border-border p-3">
              {src ? (
                <img src={src} alt={image.alt_text ?? ''} className="mb-3 h-32 w-full rounded-md object-cover" />
              ) : (
                <p className="mb-3 text-small text-text-secondary">Sin archivo público todavía.</p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Alt" htmlFor={`alt-${image.id}`}>
                  <input
                    id={`alt-${image.id}`}
                    className={adminField}
                    defaultValue={image.alt_text ?? ''}
                    onBlur={(event) => void saveMeta(image, { alt_text: emptyToNull(event.target.value) })}
                  />
                </Field>
                <Field label="Caption" htmlFor={`caption-${image.id}`}>
                  <input
                    id={`caption-${image.id}`}
                    className={adminField}
                    defaultValue={image.caption ?? ''}
                    onBlur={(event) => void saveMeta(image, { caption: emptyToNull(event.target.value) })}
                  />
                </Field>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-small">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={image.is_cover}
                    onChange={(event) => void saveMeta(image, { is_cover: event.target.checked })}
                  />
                  Portada
                </label>
                {ordered.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="focus-ring text-text-secondary disabled:opacity-40"
                      disabled={index === 0}
                      onClick={() => void move(index, -1)}
                    >
                      Mover arriba
                    </button>
                    <button
                      type="button"
                      className="focus-ring text-text-secondary disabled:opacity-40"
                      disabled={index === ordered.length - 1}
                      onClick={() => void move(index, 1)}
                    >
                      Mover abajo
                    </button>
                  </>
                ) : null}
                <button type="button" className="focus-ring text-danger" onClick={() => void remove(image.id)}>
                  Eliminar imagen
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function report(
  caught: unknown,
  setError: (message: string) => void,
  onAuthError: () => void,
) {
  if (caught instanceof FieldErrors) {
    setError(Object.values(caught.fields)[0] ?? caught.message)
    return
  }

  if (caught instanceof ApiError && caught.status === 401) {
    onAuthError()
    return
  }

  setError(caught instanceof ApiError ? caught.message : 'No se pudo actualizar la imagen.')
}
