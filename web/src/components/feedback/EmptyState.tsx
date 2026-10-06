type EmptyStateProps = {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-secondary/50 px-5 py-10 text-center">
      <p className="text-small text-text-primary">{title}</p>
      {description ? (
        <p className="mt-2 text-caption text-text-muted">{description}</p>
      ) : null}
    </div>
  )
}
