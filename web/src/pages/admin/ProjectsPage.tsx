import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { useAuth } from '../../features/admin/useAuth.ts'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { ApiError } from '../../services/api.ts'
import {
  deleteAdminProject,
  getAdminProjects,
  patchAdminProject,
} from '../../services/admin/projects.ts'
import type { AdminProjectListItem } from '../../services/admin/types.ts'

export function ProjectsPage() {
  const { clear } = useAuth()
  const load = useCallback((signal: AbortSignal) => {
    signal.throwIfAborted()
    return getAdminProjects()
  }, [])
  const { state, retry } = useRemoteData(load)
  const [rows, setRows] = useState<AdminProjectListItem[] | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Proyectos — Admin'
  }, [])

  if (state.status === 'ok' && rows === null) {
    setRows(state.data)
  }

  async function togglePublished(project: AdminProjectListItem) {
    setError('')
    try {
      const updated = await patchAdminProject(project.id, {
        is_published: !project.is_published,
      })
      setRows((current) =>
        (current ?? []).map((row) => (row.id === updated.id ? { ...row, ...updated } : row)),
      )
    } catch (caught) {
      handleError(caught, setError, clear)
    }
  }

  async function remove(id: number) {
    setError('')
    try {
      await deleteAdminProject(id)
      setRows((current) => (current ?? []).filter((row) => row.id !== id))
      setConfirmId(null)
    } catch (caught) {
      handleError(caught, setError, clear)
    }
  }

  if (state.status === 'loading') {
    return <LoadingState label="Cargando proyectos" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={retry} />
  }

  const list = rows ?? state.data

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-h2">Proyectos</h1>
        <Link
          to="/admin/projects/new"
          className="focus-ring inline-flex h-10 items-center rounded-md bg-text-primary px-4 text-small text-background"
        >
          Nuevo
        </Link>
      </div>
      {error ? (
        <p className="mt-4 text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[40rem] text-left text-small">
          <thead className="border-b border-border text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Publicado</th>
              <th className="px-4 py-3 font-medium">Destacado</th>
              <th className="px-4 py-3 font-medium">Orden</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map((project) => (
              <tr key={project.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{project.title}</td>
                <td className="px-4 py-3">{project.is_published ? 'Sí' : 'No'}</td>
                <td className="px-4 py-3">{project.is_featured ? 'Sí' : 'No'}</td>
                <td className="px-4 py-3">{project.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/admin/projects/${project.id}`}
                      className="focus-ring text-accent"
                    >
                      Editar
                    </Link>
                    {project.is_published ? (
                      <a
                        href={`/work/${project.slug}`}
                        className="focus-ring text-text-secondary"
                      >
                        Ver público
                      </a>
                    ) : null}
                    <button
                      type="button"
                      className="focus-ring text-text-secondary"
                      onClick={() => void togglePublished(project)}
                    >
                      {project.is_published ? 'Despublicar' : 'Publicar'}
                    </button>
                    {confirmId === project.id ? (
                      <button
                        type="button"
                        className="focus-ring text-danger"
                        onClick={() => void remove(project.id)}
                      >
                        Confirmar eliminación
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="focus-ring text-text-muted"
                        onClick={() => setConfirmId(project.id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function handleError(
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
