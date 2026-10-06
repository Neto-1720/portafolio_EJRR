import { Card } from '../ui/Card.tsx'

type CertificationCardProps = {
  name: string
  issuer?: string | null
  issuedAt?: string | null
}

export function CertificationCard({
  name,
  issuer = null,
  issuedAt = null,
}: CertificationCardProps) {
  return (
    <Card>
      <h3 className="text-h3 break-words text-text-primary">{name}</h3>
      <p className="mt-2 text-small text-text-secondary">
        {issuer ?? 'Emisor no indicado'}
      </p>
      {issuedAt ? (
        <p className="mt-1 font-mono text-caption text-text-muted">
          {issuedAt}
        </p>
      ) : null}
    </Card>
  )
}
