type ExperienceItemProps = {
  period: string
  title: string
  summary: string
}

export function ExperienceItem({
  period,
  title,
  summary,
}: ExperienceItemProps) {
  return (
    <article className="grid gap-2 border-t border-border py-5 md:grid-cols-[9rem_1fr] md:gap-8">
      <p className="font-mono text-caption text-text-muted">{period}</p>
      <div className="min-w-0">
        <h3 className="text-h3 break-words text-text-primary">{title}</h3>
        <p className="mt-2 text-small break-words text-text-secondary">
          {summary}
        </p>
      </div>
    </article>
  )
}
