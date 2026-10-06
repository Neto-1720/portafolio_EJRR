type ExperienceItemProps = {
  period: string
  title: string
  company: string
  summary: string
}

export function ExperienceItem({
  period,
  title,
  company,
  summary,
}: ExperienceItemProps) {
  return (
    <article className="relative border-l border-border py-5 pl-6">
      <span
        aria-hidden="true"
        className="absolute top-7 -left-[5px] size-2.5 rounded-full border-2 border-accent bg-surface"
      />
      <p className="font-mono text-caption text-text-muted">{period}</p>
      <h3 className="mt-1 text-h3 break-words text-text-primary">{title}</h3>
      <p className="mt-1 text-small text-text-secondary">{company}</p>
      <p className="mt-2 text-small break-words text-text-secondary">
        {summary}
      </p>
    </article>
  )
}
