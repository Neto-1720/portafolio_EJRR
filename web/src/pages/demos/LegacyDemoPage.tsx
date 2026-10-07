import {
  ArrowRightLeft,
  Columns2,
  Loader,
  PanelsTopLeft,
  Smartphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { cn } from '../../utils/cn.ts'
import { demos } from '../../features/demos/catalog.ts'
import { DemoFrame } from '../../features/demos/DemoFrame.tsx'
import {
  fieldClass,
  FilterField,
  FilterSelect,
} from '../../features/demos/FilterField.tsx'
import { StatusBadge } from '../../features/demos/StatusBadge.tsx'
import type { StatusTone } from '../../features/demos/labels.ts'

const demo = demos[4]

const rows = [
  {
    name: 'Guide list',
    area: 'Operations',
    state: 'Live',
    updated: 'Mar 2024',
  },
  { name: 'Quote form', area: 'Sales', state: 'Partial', updated: 'Jun 2024' },
  {
    name: 'Tracking page',
    area: 'Customer',
    state: 'Live',
    updated: 'Aug 2024',
  },
  { name: 'Support inbox', area: 'Care', state: 'Queued', updated: 'Oct 2024' },
]

const states = [
  { value: 'Live', label: 'Live' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Queued', label: 'Queued' },
]

const differences: {
  title: string
  text: string
  icon: LucideIcon
}[] = [
  {
    title: 'Componentization',
    text: 'The modern view is a set of small pieces. The legacy view is one table with its controls beside it.',
    icon: PanelsTopLeft,
  },
  {
    title: 'SPA navigation',
    text: 'Switching presentation stays on this page. A classic server screen would reload the document.',
    icon: ArrowRightLeft,
  },
  {
    title: 'Loading states',
    text: 'The modern view shows a skeleton while it prepares. The legacy view appears at once.',
    icon: Loader,
  },
  {
    title: 'Responsive UI',
    text: 'The modern cards stack on a narrow screen. The legacy table keeps a horizontal scroll.',
    icon: Smartphone,
  },
]

const tones: Record<string, StatusTone> = {
  Live: 'success',
  Partial: 'warning',
  Queued: 'neutral',
}

export function LegacyDemoPage() {
  const [mode, setMode] = useState<'legacy' | 'modern'>('legacy')
  const [preparing, setPreparing] = useState(false)
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const visible = rows.filter((row) => {
    const matchesSearch = row.name
      .toLowerCase()
      .includes(search.trim().toLowerCase())
    const matchesState = state === '' || row.state === state
    return matchesSearch && matchesState
  })

  useEffect(() => {
    if (!preparing) {
      return
    }

    const timeout = window.setTimeout(() => setPreparing(false), 400)
    return () => window.clearTimeout(timeout)
  }, [preparing])

  function choose(next: 'legacy' | 'modern') {
    if (next === mode) {
      return
    }

    setMode(next)
    setPreparing(next === 'modern')
  }

  return (
    <DemoFrame demo={demo}>
      <div
        role="tablist"
        aria-label="Presentation"
        className="flex w-fit gap-1 rounded-lg border border-border bg-surface p-1"
        onKeyDown={(event) => {
          if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
            return
          }
          event.preventDefault()
          choose(mode === 'legacy' ? 'modern' : 'legacy')
        }}
      >
        <Tab selected={mode === 'legacy'} onClick={() => choose('legacy')}>
          Legacy
        </Tab>
        <Tab selected={mode === 'modern'} onClick={() => choose('modern')}>
          Modern
        </Tab>
      </div>
      <form
        className="mt-6 grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <FilterField id="legacy-search" label="Search">
          <input
            id="legacy-search"
            className={fieldClass}
            value={search}
            placeholder="Screen"
            onChange={(event) => setSearch(event.target.value)}
          />
        </FilterField>
        <FilterField id="legacy-state" label="State">
          <FilterSelect
            id="legacy-state"
            value={state}
            allLabel="All states"
            options={states}
            onChange={(event) => setState(event.target.value)}
          />
        </FilterField>
      </form>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-caption text-text-secondary">
        <Columns2 className="size-3.5 text-accent" aria-hidden="true" />
        {mode === 'legacy'
          ? 'Before · classic table'
          : 'After · component view'}
      </p>
      <div className="mt-6">
        {mode === 'legacy' ? <LegacyTable rows={visible} /> : null}
        {mode === 'modern' && preparing ? (
          <div
            role="status"
            aria-label="Cargando vista moderna"
            className="grid gap-4 md:grid-cols-2"
          >
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        ) : null}
        {mode === 'modern' && !preparing ? (
          <ModernCards rows={visible} />
        ) : null}
      </div>
      <section
        className="mt-10 border-t border-border pt-8"
        aria-label="Differences"
      >
        <h2 className="text-h2 tracking-tight text-text-primary">
          Differences
        </h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          {differences.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-surface px-5 py-4 shadow-sm"
            >
              <dt className="flex items-center gap-2 text-small text-text-primary">
                <item.icon className="size-4 text-accent" aria-hidden="true" />
                {item.title}
              </dt>
              <dd className="mt-2 text-small text-text-secondary">
                {item.text}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </DemoFrame>
  )
}

function Tab({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={cn(
        'focus-ring h-9 rounded-md px-4 text-small',
        selected ? 'bg-text-primary text-background' : 'text-text-secondary',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function LegacyTable({ rows: visible }: { rows: typeof rows }) {
  return (
    <div className="overflow-x-auto border border-[#ced4da] bg-white text-[#212529]">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <caption className="border-b border-[#ced4da] bg-[#f8f9fa] px-3 py-2 text-left text-sm">
          Screen inventory
        </caption>
        <thead className="bg-[#e9ecef]">
          <tr>
            {['Screen', 'Area', 'State', 'Updated'].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="border border-[#ced4da] px-3 py-2 font-semibold"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td colSpan={4} className="border border-[#ced4da] px-3 py-3">
                No rows.
              </td>
            </tr>
          ) : (
            visible.map((row) => (
              <tr key={row.name}>
                <td className="border border-[#ced4da] px-3 py-2">
                  {row.name}
                </td>
                <td className="border border-[#ced4da] px-3 py-2">
                  {row.area}
                </td>
                <td className="border border-[#ced4da] px-3 py-2">
                  {row.state}
                </td>
                <td className="border border-[#ced4da] px-3 py-2">
                  {row.updated}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function ModernCards({ rows: visible }: { rows: typeof rows }) {
  if (visible.length === 0) {
    return (
      <p className="text-small text-text-secondary">
        No screens match these filters.
      </p>
    )
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {visible.map((row) => (
        <li
          key={row.name}
          className="rounded-xl border border-border bg-surface px-5 py-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-h3 text-text-primary">{row.name}</h3>
            <StatusBadge tone={tones[row.state] ?? 'neutral'}>
              {row.state}
            </StatusBadge>
          </div>
          <p className="mt-2 text-small text-text-secondary">{row.area}</p>
          <p className="mt-3 font-mono text-caption text-text-muted">
            Updated {row.updated}
          </p>
        </li>
      ))}
    </ul>
  )
}
