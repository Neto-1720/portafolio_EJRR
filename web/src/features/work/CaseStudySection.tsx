import type { ReactNode } from 'react'

type CaseStudySectionProps = {
  title: string
  children: ReactNode
}

export function CaseStudySection({ title, children }: CaseStudySectionProps) {
  return (
    <section className="border-t border-border py-10">
      <h2 className="text-h2 tracking-tight text-text-primary">{title}</h2>
      <div className="mt-4 max-w-2xl text-body break-words text-text-secondary">
        {children}
      </div>
    </section>
  )
}
