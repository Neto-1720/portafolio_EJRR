type TechnologyBadgeProps = {
  name: string
}

export function TechnologyBadge({ name }: TechnologyBadgeProps) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full bg-surface-secondary px-2.5 py-0.5 font-mono text-caption break-words text-text-primary">
      {name}
    </span>
  )
}
