import { useCallback, useEffect } from 'react'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getDashboard } from '../../services/admin/projects.ts'

const cards = [
  { key: 'projects', label: 'Projects' },
  { key: 'published_projects', label: 'Published Projects' },
  { key: 'featured_projects', label: 'Featured Projects' },
  { key: 'certifications', label: 'Certifications' },
] as const

export function DashboardPage() {
  const load = useCallback((signal: AbortSignal) => {
    signal.throwIfAborted()
    return getDashboard()
  }, [])
  const { state, retry } = useRemoteData(load)

  useEffect(() => {
    document.title = 'Admin — Ernesto Rodríguez'
  }, [])

  if (state.status === 'loading') {
    return <LoadingState label="Cargando dashboard" />
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={retry} />
  }

  return (
    <div>
      <h1 className="text-h2">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.key}
            className="rounded-lg border border-border bg-surface p-5 shadow-sm"
          >
            <p className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
              {card.label}
            </p>
            <p className="mt-2 text-h2">{state.data[card.key]}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
