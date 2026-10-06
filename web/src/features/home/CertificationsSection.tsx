import { useCallback } from 'react'
import { CertificationCard } from '../../components/content/CertificationCard.tsx'
import { EmptyState } from '../../components/feedback/EmptyState.tsx'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'
import { useRemoteData } from '../../hooks/useRemoteData.ts'
import { getCertifications } from '../../services/certifications.ts'
import { publicUrl } from '../../utils/publicUrl.ts'

export function CertificationsSection() {
  const load = useCallback(
    (signal: AbortSignal) => getCertifications(signal),
    [],
  )
  const { state, retry } = useRemoteData(load)

  return (
    <Section>
      <SectionHeader eyebrow="Learning" title="Certificaciones" />
      <div className="mt-8">
        {state.status === 'loading' ? (
          <LoadingState label="Cargando certificaciones" />
        ) : null}
        {state.status === 'error' ? (
          <ErrorState message={state.message} onRetry={retry} />
        ) : null}
        {state.status === 'ok' && state.data.length === 0 ? (
          <EmptyState title="No hay certificaciones publicadas" />
        ) : null}
        {state.status === 'ok' && state.data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {state.data.map((item) => (
              <CertificationCard
                key={item.id}
                name={item.name}
                issuer={item.issuer}
                issuedAt={formatIssuedAt(item.issued_at)}
                href={publicUrl(item.credential_url)}
                imageSrc={publicUrl(item.image_path)}
                imageAlt={item.name}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  )
}

function formatIssuedAt(value: string | null): string | null {
  if (!value) {
    return null
  }

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('es-MX', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}
