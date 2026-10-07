import { Boxes, Cable, Layers } from 'lucide-react'

const rows = [
  { name: 'Quote', state: 'Ready' },
  { name: 'Guide', state: 'Queued' },
  { name: 'Track', state: 'Live' },
]

const tags = ['Laravel', 'React', 'TypeScript']

export function ProductPanels() {
  return (
    <div aria-hidden="true" className="grid min-w-0 gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:col-span-2">
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-accent">
            <Boxes className="size-4" />
          </span>
          <p className="font-mono text-caption tracking-wide uppercase">
            Product surface
          </p>
        </div>
        <ul className="mt-4 space-y-2">
          {rows.map((row) => (
            <li
              key={row.name}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-secondary px-3 py-2"
            >
              <span className="text-small text-text-primary">{row.name}</span>
              <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-caption text-text-secondary">
                {row.state}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-border bg-surface-secondary p-4">
        <span className="grid size-8 place-items-center rounded-lg bg-surface text-accent">
          <Layers className="size-4" />
        </span>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-caption text-text-primary"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
        <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-accent">
          <Cable className="size-4" />
        </span>
        <p className="mt-3 font-mono text-caption text-text-secondary">
          API · Queue · UI
        </p>
      </div>
    </div>
  )
}
