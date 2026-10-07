import type { ReactNode } from 'react'
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
      <p className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
        Interactive demo
      </p>
      <h1 className="mt-3 text-h1 tracking-tight text-balance text-text-primary">
        {demo.title}
      </h1>
      <p className="mt-4 max-w-2xl text-body text-text-secondary">
        {demo.summary}
      </p>
      <p className="mt-3 max-w-2xl text-small text-text-muted">
        Fictional data. No real customers, carriers, messages, or deliveries.
      </p>
      <div className="mt-6">
        <LinkButton to={`/work/${demo.projectSlug}`} variant="secondary">
          Back to case study
        </LinkButton>
      </div>
      <div className="mt-10">{children}</div>
    </article>
  )
}
