import { Card } from '../ui/Card.tsx'
import { LinkButton } from '../ui/LinkButton.tsx'

type CertificationCardProps = {
  name: string
  issuer?: string | null
  issuedAt?: string | null
  href?: string
}

export function CertificationCard({
  name,
  issuer = null,
  issuedAt = null,
  href,
}: CertificationCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <h3 className="text-h3 break-words text-text-primary">{name}</h3>
      <p className="mt-3 text-small text-text-secondary">
        {issuer ?? 'Emisor no indicado'}
      </p>
      {issuedAt ? (
        <p className="mt-1 font-mono text-caption text-text-muted">
          {issuedAt}
        </p>
      ) : null}
      {href ? (
        <LinkButton to={href} variant="ghost" className="mt-5 w-fit px-3">
          Ver detalle
        </LinkButton>
      ) : null}
    </Card>
  )
}
