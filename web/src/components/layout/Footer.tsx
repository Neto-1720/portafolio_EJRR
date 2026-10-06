import { profile } from '../../config/profile.ts'
import { Container } from '../ui/Container.tsx'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-small text-text-primary">{profile.name}</p>
          <p className="mt-1 text-caption text-text-secondary">
            {profile.role}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <FooterLink href={profile.github}>GitHub</FooterLink>
          <FooterLink href={profile.linkedin}>LinkedIn</FooterLink>
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="focus-ring text-small text-text-secondary hover:text-text-primary"
            >
              Email
            </a>
          ) : null}
        </div>
        <p className="font-mono text-caption text-text-muted">
          © {year} {profile.name}
        </p>
      </Container>
    </footer>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string | null
  children: string
}) {
  if (!href) {
    return null
  }

  return (
    <a
      href={href}
      className="focus-ring text-small text-text-secondary hover:text-text-primary"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  )
}
