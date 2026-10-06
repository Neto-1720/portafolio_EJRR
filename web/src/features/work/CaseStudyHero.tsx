import { TechnologyBadge } from '../../components/content/TechnologyBadge.tsx'
import { LinkButton } from '../../components/ui/LinkButton.tsx'
import type { ProjectImage, Technology } from '../../types/portfolio.ts'
import { imageUrl } from '../../utils/publicUrl.ts'
import { ImagePlaceholder } from './ImagePlaceholder.tsx'

type CaseStudyHeroProps = {
  title: string
  subtitle: string | null
  summary: string
  role: string | null
  period: string | null
  technologies: Technology[]
  cover: ProjectImage | null
}

export function CaseStudyHero({
  title,
  subtitle,
  summary,
  role,
  period,
  technologies,
  cover,
}: CaseStudyHeroProps) {
  const coverSrc = imageUrl(cover)

  return (
    <header className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
      <div>
        <p className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
          Work
        </p>
        <h1 className="mt-3 text-h1 tracking-tight text-balance text-text-primary">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-h3 text-text-primary">{subtitle}</p>
        ) : null}
        <p className="mt-4 max-w-xl text-body text-text-secondary">{summary}</p>
        {role || period ? (
          <p className="mt-4 font-mono text-caption text-text-muted">
            {[role, period].filter(Boolean).join(' · ')}
          </p>
        ) : null}
        {technologies.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {technologies.map((item) => (
              <li key={item.id}>
                <TechnologyBadge name={item.name} />
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-8">
          <LinkButton to="/work" variant="secondary">
            Back to Work
          </LinkButton>
        </div>
      </div>
      {coverSrc ? (
        <img
          src={coverSrc}
          alt={cover?.alt_text ?? ''}
          className="aspect-[16/10] w-full rounded-xl object-cover"
        />
      ) : (
        <ImagePlaceholder label={cover?.alt_text ?? title} large />
      )}
    </header>
  )
}
