import { Mail } from 'lucide-react'
import { profile } from '../../config/profile.ts'
import { LinkButton } from '../../components/ui/LinkButton.tsx'
import { Section } from '../../components/ui/Section.tsx'

export function ContactCta() {
  return (
    <Section>
      <div className="rounded-xl border border-border bg-surface px-6 py-8 shadow-sm md:px-8">
        <span className="mb-4 grid size-10 place-items-center rounded-lg bg-accent-soft text-accent">
          <Mail className="size-4" aria-hidden="true" />
        </span>
        <h2 className="max-w-xl text-h2 tracking-tight text-text-primary">
          ¿Quieres hablar sobre una oportunidad o proyecto?
        </h2>
        <div className="mt-6">
          <LinkButton to="/contact" variant="primary">
            Contactarme
          </LinkButton>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="focus-ring text-small text-text-secondary hover:text-text-primary"
            >
              Email
            </a>
          ) : null}
          {profile.github ? (
            <a
              href={profile.github}
              className="focus-ring text-small text-text-secondary hover:text-text-primary"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          ) : null}
          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              className="focus-ring text-small text-text-secondary hover:text-text-primary"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          ) : null}
        </div>
      </div>
    </Section>
  )
}
