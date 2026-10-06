type TechnologyBadgeProps = {
  name: string
}

export function TechnologyBadge({ name }: TechnologyBadgeProps) {
  return (
    <span className="inline-flex max-w-full items-center border border-border bg-background px-2 py-0.5 font-mono text-caption break-words text-text-secondary">
      {name}
    </span>
  )
}
