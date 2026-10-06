import { profile } from '../config/profile.ts'
import { Section } from '../components/ui/Section.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'

const links = [
  profile.email
    ? { href: `mailto:${profile.email}`, label: profile.email }
    : null,
  profile.linkedin ? { href: profile.linkedin, label: 'LinkedIn' } : null,
  profile.github ? { href: profile.github, label: 'GitHub' } : null,
].filter((item) => item !== null)

export function ContactPage() {
  return (
    <Section>
      <SectionHeader
        heading="h1"
        eyebrow="Contact"
        title="Contacto"
        description="¿Quieres hablar sobre una oportunidad o proyecto?"
      />
      {links.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {links.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="focus-ring text-body text-text-primary hover:text-accent"
                {...(item.href.startsWith('http')
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 max-w-xl text-body text-text-secondary">
          El correo y las redes se mostrarán aquí cuando estén configurados.
        </p>
      )}
    </Section>
  )
}
