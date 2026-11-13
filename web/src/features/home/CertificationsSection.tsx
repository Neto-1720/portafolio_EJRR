import { useCallback } from 'react'
import { CertificationCard } from '../../components/content/CertificationCard.tsx'
import { EmptyState } from '../../components/feedback/EmptyState.tsx'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getCertifications } from '../../services/certifications.ts'

export function CertificationsSection() {
  const load = useCallback(
    (signal: AbortSignal) => getCertifications(signal),
    [],
  )
  const { state, retry } = useRemoteData(load)

  return (
    <Section>
      <SectionHeader
        eyebrow="Cursos"
        title="Certificaciones"
        description="Cursos recientes que refuerzan lo que aplico en producto: calidad asistida por IA, React y Laravel. Las fichas y las imágenes se administran desde el panel."
      />
      <div className="mt-8">
        {state.status === 'loading' ? <CertificationsSkeleton /> : null}
        {state.status === 'error' ? (
          <ErrorState message={state.message} onRetry={retry} />
        ) : null}
        {state.status === 'ok' && state.data.length === 0 ? (
          <EmptyState
            title="No hay certificaciones publicadas"
            description="Cuando publiques certificaciones en el admin aparecerán aquí."
          />
        ) : null}
        {state.status === 'ok' && state.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {state.data.map((item, index) => (
              <CertificationCard
                key={item.id}
                id={String(item.id)}
                name={item.name}
                issuer={item.issuer}
                issuedAt={formatIssuedAt(item.issued_at)}
                hours={item.hours}
                href={item.credential_url}
                imageSrc={item.image_url}
                imageAlt={`Certificado ${item.name}`}
                className="animate-cert-in"
                style={{ animationDelay: `${index * 70}ms` }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  )
}

export function CertificationsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando certificaciones"
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function formatIssuedAt(value: string | null): string | null {
  if (!value) {
    return null
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return value
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const formatted = new Intl.DateTimeFormat('es-MX', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
