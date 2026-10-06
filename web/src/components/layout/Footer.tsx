import { site } from '../../config/site.ts'
import { Container } from '../ui/Container.tsx'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-small text-text-primary">{site.name}</p>
          <p className="mt-1 text-caption text-text-secondary">{site.role}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <FooterLink href={site.githubUrl}>GitHub</FooterLink>
          <FooterLink href={site.linkedinUrl}>LinkedIn</FooterLink>
          {site.email ? (
            <a
              href={`mailto:${site.email}`}
              className="focus-ring text-small text-text-secondary hover:text-text-primary"
            >
              Email
            </a>
          ) : (
            <span className="text-small text-text-muted">Email</span>
          )}
        </div>
        <p className="font-mono text-caption text-text-muted">
          © {year} {site.name}
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
    return <span className="text-small text-text-muted">{children}</span>
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
