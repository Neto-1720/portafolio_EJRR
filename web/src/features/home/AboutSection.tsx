import { useCallback } from 'react'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getSiteContent } from '../../services/siteContent.ts'

export function AboutSection() {
  const load = useCallback((signal: AbortSignal) => getSiteContent(signal), [])
  const { state, retry } = useRemoteData(load)

  return (
    <Section id="about">
      <SectionHeader
        eyebrow="Acerca de"
        title={
          state.status === 'ok'
            ? (state.data.about_title ?? 'Cómo enfoco el trabajo')
            : 'Cómo enfoco el trabajo'
        }
        description={
          state.status === 'ok'
            ? (state.data.about_description ?? undefined)
            : undefined
        }
      />
      <div className="mt-6 max-w-2xl space-y-4">
        {state.status === 'loading' ? (
          <>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </>
        ) : null}
        {state.status === 'error' ? (
          <ErrorState message={state.message} onRetry={retry} />
        ) : null}
        {state.status === 'ok'
          ? state.data.about_paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-body text-text-secondary">
                {paragraph}
              </p>
            ))
          : null}
      </div>
    </Section>
  )
}
