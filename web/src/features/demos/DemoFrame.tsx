import type { ReactNode } from 'react'
import { ProjectCover } from '../../assets/covers/ProjectCover.tsx'
import { LinkButton } from '../../components/ui/LinkButton.tsx'
import { usePageMeta } from '../../seo/usePageMeta.ts'
import type { DemoEntry } from './catalog.ts'

export function DemoFrame({
  demo,
  children,
}: {
  demo: DemoEntry
  children: ReactNode
}) {
  usePageMeta({
    title: `${demo.title} — Ernesto Rodríguez`,
    description: demo.summary,
    path: demo.path,
  })

  return (
    <article>
      <div className="mb-8 h-40 overflow-hidden rounded-xl border border-border shadow-sm">
        <ProjectCover slug={demo.projectSlug} title={demo.title} />
      </div>
      <p className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
        Demo interactiva
      </p>
      <h1 className="mt-3 text-h1 tracking-tight text-balance text-text-primary">
        {demo.title}
      </h1>
      <p className="mt-4 max-w-2xl text-body text-text-secondary">
        {demo.summary}
      </p>
      <p className="mt-3 max-w-2xl text-small text-text-muted">
        Datos ficticios. No hay clientes, paqueterías, mensajes ni entregas
        reales. Es una porción segura del case study para que veas el flujo.
      </p>
      <div className="mt-6">
        <LinkButton to={`/work/${demo.projectSlug}`} variant="secondary">
          Volver al case study
        </LinkButton>
      </div>
      <div className="mt-10">{children}</div>
    </article>
  )
}
