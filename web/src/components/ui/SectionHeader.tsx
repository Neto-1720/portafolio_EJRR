type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  heading?: 'h1' | 'h2'
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  heading = 'h2',
}: SectionHeaderProps) {
  const TitleTag = heading

  return (
    <header className="max-w-2xl">
      {eyebrow ? (
        <p className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
          {eyebrow}
        </p>
      ) : null}
      <TitleTag
        className={
          heading === 'h1'
            ? 'mt-2 text-h1 tracking-tight text-text-primary'
            : 'mt-2 text-h2 tracking-tight text-text-primary'
        }
      >
        {title}
      </TitleTag>
      {description ? (
        <p className="mt-3 text-body text-text-secondary">{description}</p>
      ) : null}
    </header>
  )
}
