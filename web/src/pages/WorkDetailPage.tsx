import { useCallback } from 'react'
import { useParams } from 'react-router'
import { TechnologyBadge } from '../components/content/TechnologyBadge.tsx'
import { EmptyState } from '../components/feedback/EmptyState.tsx'
import { ErrorState } from '../components/feedback/ErrorState.tsx'
import { LoadingState } from '../components/feedback/LoadingState.tsx'
import { LinkButton } from '../components/ui/LinkButton.tsx'
import { Section } from '../components/ui/Section.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { useRemoteData } from '../hooks/useRemoteData.ts'
import { getProject } from '../services/projects.ts'

export function WorkDetailPage() {
  const { slug = '' } = useParams()
  const load = useCallback(
    (signal: AbortSignal) => getProject(slug, signal),
    [slug],
  )
  const { state, retry } = useRemoteData(load, slug)

  if (state.status === 'loading') {
    return (
      <Section>
        <LoadingState label="Cargando proyecto" />
      </Section>
    )
  }

  if (state.status === 'error' && state.statusCode === 404) {
    return (
      <Section>
        <EmptyState
          title="No se encontró este proyecto"
          description="Puede que no esté publicado o que la dirección haya cambiado."
        />
        <div className="mt-6">
          <LinkButton to="/work" variant="ghost" className="w-fit px-3">
            Volver al listado
          </LinkButton>
        </div>
      </Section>
    )
  }

  if (state.status === 'error') {
    return (
      <Section>
        <ErrorState message={state.message} onRetry={retry} />
      </Section>
    )
  }

  const project = state.data

  return (
    <Section>
      <SectionHeader
        heading="h1"
        eyebrow="Work"
        title={project.title}
        description={project.summary}
      />
      {project.technologies.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((item) => (
            <li key={item.id}>
              <TechnologyBadge name={item.name} />
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-8 text-body text-text-secondary">
        Case study completo próximamente.
      </p>
      <div className="mt-8">
        <LinkButton to="/work" variant="ghost" className="w-fit px-3">
          Volver al listado
        </LinkButton>
      </div>
    </Section>
  )
}
