import { Link } from 'react-router'
import { TechnologyBadge } from './TechnologyBadge.tsx'

type ProjectCardImage = {
  src: string
  alt: string
}

type ProjectCardProps = {
  title: string
  summary: string
  technologies: string[]
  href: string
  coverImage?: ProjectCardImage | null
}

export function ProjectCard({
  title,
  summary,
  technologies,
  href,
  coverImage = null,
}: ProjectCardProps) {
  return (
    <article className="min-w-0 border border-border bg-surface transition-colors duration-150 hover:border-text-muted/50 motion-reduce:transition-none">
      <Link to={href} aria-label={title} className="focus-ring block h-full">
        <div className="flex aspect-[16/10] items-end border-b border-border bg-surface-elevated">
          {coverImage ? (
            <img
              src={coverImage.src}
              alt={coverImage.alt}
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="p-4 font-mono text-caption text-text-muted">
              Sin imagen
            </p>
          )}
        </div>
        <div className="space-y-4 p-5">
          <h3 className="text-h3 break-words text-text-primary">{title}</h3>
          <p className="line-clamp-3 text-small break-words text-text-secondary">
            {summary}
          </p>
          {technologies.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {technologies.map((name) => (
                <li key={name}>
                  <TechnologyBadge name={name} />
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-small text-text-primary">Ver proyecto</p>
        </div>
      </Link>
    </article>
  )
}
