import { useCallback } from 'react'
import { ProjectCard } from '../components/content/ProjectCard.tsx'
import { EmptyState } from '../components/feedback/EmptyState.tsx'
import { ErrorState } from '../components/feedback/ErrorState.tsx'
import { LoadingState } from '../components/feedback/LoadingState.tsx'
import { Section } from '../components/ui/Section.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { useRemoteData } from '../hooks/useRemoteData.ts'
import { usePageMeta } from '../seo/usePageMeta.ts'
import { getProjects } from '../services/projects.ts'
import { imageUrl } from '../utils/publicUrl.ts'

function coverImage(
  image: { url?: string | null; path: string; alt_text: string | null } | null,
  title: string,
) {
  const src = imageUrl(image)

  if (!src || !image) {
    return null
  }

  return { src, alt: image.alt_text?.trim() || title }
}

export function WorkPage() {
  usePageMeta({
    title: 'Proyectos — Ernesto Rodríguez',
    description:
      'Case studies de SaaS, APIs REST e integraciones con Laravel, React y TypeScript: problema, solución y resultado.',
    path: '/work',
  })
  const load = useCallback((signal: AbortSignal) => getProjects(signal), [])
  const { state, retry } = useRemoteData(load)

  return (
    <Section>
      <SectionHeader
        heading="h1"
        eyebrow="Trabajo"
        title="Proyectos publicados"
        description="Cada caso explica el problema de negocio, la decisión técnica, lo que construí y el resultado. Hay capturas anonimizadas y, en varios, una demo interactiva con datos ficticios."
      />
      <div className="mt-8">
        {state.status === 'loading' ? (
          <LoadingState label="Cargando proyectos" />
        ) : null}
        {state.status === 'error' ? (
          <ErrorState message={state.message} onRetry={retry} />
        ) : null}
        {state.status === 'ok' && state.data.length === 0 ? (
          <EmptyState title="No hay proyectos publicados" />
        ) : null}
        {state.status === 'ok' && state.data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {state.data.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                summary={project.summary}
                technologies={project.technologies.map((item) => item.name)}
                href={`/work/${project.slug}`}
                cta="Ver caso"
                coverImage={coverImage(project.cover_image, project.title)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  )
}
