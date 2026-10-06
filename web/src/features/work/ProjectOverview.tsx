type ProjectOverviewProps = {
  role: string | null
  stack: string | null
  context: string | null
}

export function ProjectOverview({
  role,
  stack,
  context,
}: ProjectOverviewProps) {
  const items = [
    role ? { label: 'Role', value: role } : null,
    stack ? { label: 'Stack', value: stack } : null,
    context ? { label: 'Context', value: context } : null,
  ].filter((item) => item !== null)

  if (items.length === 0) {
    return null
  }

  return (
    <section className="border-t border-border py-10" aria-label="Overview">
      <h2 className="text-h2 tracking-tight text-text-primary">Overview</h2>
      <dl className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-surface px-5 py-5 shadow-sm"
          >
            <dt className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
              {item.label}
            </dt>
            <dd className="mt-2 text-small break-words text-text-primary">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
