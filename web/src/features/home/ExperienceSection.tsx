import { useCallback } from 'react'
import { EducationItem } from '../../components/content/EducationItem.tsx'
import { ExperienceItem } from '../../components/content/ExperienceItem.tsx'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getSiteContent } from '../../services/siteContent.ts'

export function ExperienceSection() {
  const load = useCallback((signal: AbortSignal) => getSiteContent(signal), [])
  const { state, retry } = useRemoteData(load)

  return (
    <Section>
      <SectionHeader
        eyebrow="Trayectoria"
        title="Experiencia"
        description="Roles recientes con lo que construí en cada etapa. Editable desde el admin."
      />
      <div className="mt-6 max-w-3xl">
        {state.status === 'loading' ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : null}
        {state.status === 'error' ? (
          <ErrorState message={state.message} onRetry={retry} />
        ) : null}
        {state.status === 'ok'
          ? state.data.experience.map((role) => (
              <ExperienceItem
                key={`${role.company}-${role.period}`}
                period={role.period}
                title={role.title}
                company={role.company}
                bullets={role.bullets}
              />
            ))
          : null}
      </div>

      <div className="mt-12 max-w-3xl">
        <SectionHeader
          eyebrow="Formación académica"
          title="Educación"
          description="Base formal en desarrollo y gestión de software."
        />
        <div className="mt-6">
          {state.status === 'ok'
            ? state.data.education.map((item) => (
                <EducationItem
                  key={`${item.program}-${item.period}`}
                  period={item.period}
                  program={item.program}
                  school={item.school}
                />
              ))
            : null}
        </div>
      </div>
    </Section>
  )
}
