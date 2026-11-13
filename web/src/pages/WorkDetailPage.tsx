import { useCallback } from 'react'
import { useParams } from 'react-router'
import { TechnologyBadge } from '../components/content/TechnologyBadge.tsx'
import { ErrorState } from '../components/feedback/ErrorState.tsx'
import { LinkButton } from '../components/ui/LinkButton.tsx'
import { demoForProject } from '../features/demos/catalog.ts'
import { CaseStudyHero } from '../features/work/CaseStudyHero.tsx'
import { CaseStudySection } from '../features/work/CaseStudySection.tsx'
import { CaseStudySkeleton } from '../features/work/CaseStudySkeleton.tsx'
import { ProjectGallery } from '../features/work/ProjectGallery.tsx'
import { ProjectOverview } from '../features/work/ProjectOverview.tsx'
import { useRemoteData } from '../hooks/useRemoteData.ts'
import { getProject } from '../services/projects.ts'
import { usePageMeta } from '../seo/usePageMeta.ts'
import type { ProjectDetail } from '../types/portfolio.ts'
import { imageUrl } from '../utils/publicUrl.ts'

export function WorkDetailPage() {
  const { slug = '' } = useParams()
  const load = useCallback(
    (signal: AbortSignal) => getProject(slug, signal),
    [slug],
  )
  const { state, retry } = useRemoteData(load, slug)
  const cover =
    state.status === 'ok'
      ? (state.data.images.find((image) => image.is_cover) ??
        state.data.images[0] ??
        null)
      : null

  usePageMeta({
    title:
      state.status === 'ok'
        ? `${state.data.title} — Ernesto Rodríguez`
        : state.status === 'error' && state.statusCode === 404
          ? 'Proyecto no encontrado — Ernesto Rodríguez'
          : 'Proyecto — Ernesto Rodríguez',
    description:
      state.status === 'ok'
        ? state.data.summary
        : 'Case study de un producto web construido con Laravel, React y TypeScript.',
    path: `/work/${slug}`,
    image: imageUrl(cover),
  })

  if (state.status === 'loading') {
    return <CaseStudySkeleton />
  }

  if (state.status === 'error' && state.statusCode === 404) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-h1 tracking-tight text-text-primary">
          Proyecto no encontrado
        </h1>
        <p className="mt-3 text-body text-text-secondary">
          Puede que no esté publicado o que la dirección haya cambiado.
        </p>
        <div className="mt-8">
          <LinkButton to="/work" variant="primary">
            Volver a proyectos
          </LinkButton>
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <ErrorState message="No se pudo cargar este proyecto." onRetry={retry} />
    )
  }

  return <CaseStudy project={state.data} />
}

function CaseStudy({ project }: { project: ProjectDetail }) {
  const stack =
    project.technologies.length > 0
      ? project.technologies.map((item) => item.name).join(' · ')
      : null

  return (
    <article>
      <CaseStudyHero
        title={project.title}
        subtitle={project.subtitle}
        summary={project.summary}
        role={project.role}
        period={project.period}
        technologies={project.technologies}
        slug={project.slug}
        cover={
          project.images.find((image) => image.is_cover) ??
          project.images[0] ??
          null
        }
      />
      <ProjectOverview
        role={project.role}
        stack={stack}
        context={project.context}
      />
      <Prose title="Problema" text={project.problem} />
      <Prose title="Mi rol" text={project.responsibilities} />
      <Prose title="Solución" text={project.solution} />
      <Prose title="Decisiones técnicas" text={project.technical_decisions} />
      <Prose title="Retos" text={project.challenges} />
      <Prose title="Resultado" text={project.results} />
      <Prose title="Aprendizajes" text={project.learnings} />
      {project.technologies.length > 0 ? (
        <section className="border-t border-border py-10">
          <h2 className="text-h2 tracking-tight text-text-primary">
            Tecnologías
          </h2>
          <ul className="mt-4 flex max-w-2xl flex-wrap gap-2">
            {project.technologies.map((item) => (
              <li key={item.id}>
                <TechnologyBadge name={item.name} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <ProjectGallery images={project.images} title={project.title} />
      <DemoLink slug={project.slug} />
      <RelatedLegacyNote slug={project.slug} />
      <div className="border-t border-border py-10">
        <LinkButton to="/work" variant="secondary">
          Volver a proyectos
        </LinkButton>
      </div>
    </article>
  )
}

function RelatedLegacyNote({ slug }: { slug: string }) {
  if (slug !== 'settings-spa-modernization') {
    return null
  }

  return (
    <section className="border-t border-border py-10">
      <h2 className="text-h2 tracking-tight text-text-primary">
        Demo relacionada
      </h2>
      <p className="mt-4 max-w-2xl text-body text-text-secondary">
        Legacy Platform Modernization ya muestra este tipo de corte: una vista
        clásica junto a una vista de componentes. Este caso no agrega otra demo.
      </p>
      <div className="mt-6">
        <LinkButton to="/demo/legacy" variant="secondary">
          Abrir demo legacy
        </LinkButton>
      </div>
    </section>
  )
}

function DemoLink({ slug }: { slug: string }) {
  const demo = demoForProject(slug)

  if (!demo) {
    return null
  }

  return (
    <section className="border-t border-border py-10">
      <h2 className="text-h2 tracking-tight text-text-primary">
        Demo interactiva
      </h2>
      <p className="mt-4 max-w-2xl text-body text-text-secondary">
        Una porción funcionando de este caso. Usa datos ficticios.
      </p>
      <div className="mt-6">
        <LinkButton to={demo.path} variant="primary">
          Abrir demo
        </LinkButton>
      </div>
    </section>
  )
}

function Prose({ title, text }: { title: string; text: string | null }) {
  if (!text) {
    return null
  }

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

  return (
    <CaseStudySection title={title}>
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={`${title}-${index}`}>{paragraph}</p>
        ))}
      </div>
    </CaseStudySection>
  )
}
