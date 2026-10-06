type EmptyStateProps = {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-border px-4 py-8 text-center">
      <p className="text-small text-text-primary">{title}</p>
      {description ? (
        <p className="mt-2 text-caption text-text-muted">{description}</p>
      ) : null}
    </div>
  )
}
