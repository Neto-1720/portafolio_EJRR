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
    <article className="min-w-0 rounded-xl border border-border bg-surface p-3 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link
        to={href}
        aria-label={title}
        className="focus-ring block rounded-lg"
      >
        <div className="flex aspect-[16/10] items-end overflow-hidden rounded-lg bg-surface-secondary">
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
        <div className="space-y-4 px-2 pt-4 pb-2">
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
          <p className="text-small text-text-secondary">Ver proyecto</p>
        </div>
      </Link>
    </article>
  )
}
