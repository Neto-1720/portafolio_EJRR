import { Award } from 'lucide-react'
import { Card } from '../ui/Card.tsx'
import { LinkButton } from '../ui/LinkButton.tsx'

type CertificationCardProps = {
  name: string
  issuer?: string | null
  issuedAt?: string | null
  href?: string | null
  imageSrc?: string | null
  imageAlt?: string
}

export function CertificationCard({
  name,
  issuer = null,
  issuedAt = null,
  href = null,
  imageSrc = null,
  imageAlt = '',
}: CertificationCardProps) {
  return (
    <Card className="flex h-full flex-col">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="mb-4 h-28 w-full rounded-lg object-cover"
        />
      ) : (
        <span className="mb-4 grid size-10 place-items-center rounded-lg bg-accent-soft text-accent">
          <Award className="size-4" aria-hidden="true" />
        </span>
      )}
      <h3 className="text-h3 break-words text-text-primary">{name}</h3>
      {issuer ? (
        <p className="mt-3 text-small text-text-secondary">{issuer}</p>
      ) : null}
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
