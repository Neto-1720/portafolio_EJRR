import { CircleCheck, FilePlus, MapPin, Package, Truck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState, type CSSProperties, type KeyboardEvent } from 'react'
import { demos } from '../../features/demos/catalog.ts'
import { DemoFrame } from '../../features/demos/DemoFrame.tsx'
import { fieldClass, FilterField } from '../../features/demos/FilterField.tsx'

const demo = demos[2]

const brands = [
  {
    id: 'acme',
    name: 'Acme',
    mark: 'AC',
    accent: '#a85410',
    accentDark: '#e0893a',
    message: 'Acme published a new scan for this shipment.',
  },
  {
    id: 'nova',
    name: 'Nova',
    mark: 'NV',
    accent: '#1d4e89',
    accentDark: '#9ec0ea',
    message: 'Nova is showing this tracking page under its own brand.',
  },
  {
    id: 'northstar',
    name: 'Northstar',
    mark: 'NS',
    accent: '#3d6b4f',
    accentDark: '#8fbfa0',
    message: 'Northstar reused the same tracking layout with its colors.',
  },
] as const

const steps: {
  id: string
  label: string
  icon: LucideIcon
}[] = [
  { id: 'created', label: 'Created', icon: FilePlus },
  { id: 'picked_up', label: 'Picked up', icon: Package },
  { id: 'in_transit', label: 'In transit', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for delivery', icon: MapPin },
  { id: 'delivered', label: 'Delivered', icon: CircleCheck },
]

type BrandId = (typeof brands)[number]['id']
type StepId =
  'created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered'

export function TrackingDemoPage() {
  const [brandId, setBrandId] = useState<BrandId>('acme')
  const [stepId, setStepId] = useState<StepId>('in_transit')
  const brand = brands.find((item) => item.id === brandId) ?? brands[0]
  const currentIndex = steps.findIndex((step) => step.id === stepId)
  const style = {
    '--brand': brand.accent,
    '--brand-dark': brand.accentDark,
  } as CSSProperties

  return (
    <DemoFrame demo={demo}>
      <div className="grid gap-6">
        <div
          role="radiogroup"
          aria-label="Brand"
          className="flex flex-wrap gap-2"
          onKeyDown={(event) => moveBrand(event, brandId, setBrandId)}
        >
          {brands.map((item) => {
            const selected = item.id === brand.id
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={
                  selected
                    ? 'focus-ring h-10 rounded-md bg-text-primary px-4 text-small text-background'
                    : 'focus-ring h-10 rounded-md border border-border bg-surface px-4 text-small text-text-primary'
                }
                onClick={() => setBrandId(item.id)}
              >
                {item.name}
              </button>
            )
          })}
        </div>
        <div className="max-w-xs">
          <FilterField id="tracking-status" label="Current status">
            <select
              id="tracking-status"
              className={fieldClass}
              value={stepId}
              onChange={(event) => setStepId(event.target.value as StepId)}
            >
              {steps.map((step) => (
                <option key={step.id} value={step.id}>
                  {step.label}
                </option>
              ))}
            </select>
          </FilterField>
        </div>
        <section
          style={style}
          className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
          aria-label={`${brand.name} tracking`}
        >
          <div
            className="h-1.5"
            style={{
              background: 'light-dark(var(--brand), var(--brand-dark))',
            }}
          />
          <div className="grid gap-8 p-6 md:grid-cols-[auto_minmax(0,1fr)] md:p-8">
            <div
              aria-hidden="true"
              className="grid size-16 place-items-center rounded-xl font-mono text-h3"
              style={{
                color: 'light-dark(var(--brand), var(--brand-dark))',
                background:
                  'light-dark(color-mix(in srgb, var(--brand) 16%, white), color-mix(in srgb, var(--brand-dark) 22%, transparent))',
              }}
            >
              {brand.mark}
            </div>
            <div>
              <p className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
                {brand.name}
              </p>
              <h2 className="mt-2 font-mono text-h2 tracking-tight text-text-primary">
                ABC123456
              </h2>
              <p className="mt-3 max-w-xl text-body text-text-secondary">
                {brand.message}
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
                    Current status
                  </dt>
                  <dd className="mt-1 text-body text-text-primary">
                    {steps[currentIndex]?.label}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
                    Estimated delivery
                  </dt>
                  <dd className="mt-1 text-body text-text-primary">
                    {stepId === 'delivered' ? 'Delivered' : '18 Oct 2026'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <ol className="grid gap-0 border-t border-border sm:grid-cols-5">
            {steps.map((step, index) => {
              const state =
                index < currentIndex
                  ? 'Done'
                  : index === currentIndex
                    ? 'Current'
                    : 'Upcoming'
              return (
                <li
                  key={step.id}
                  className="border-b border-border px-4 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
                  aria-current={index === currentIndex ? 'step' : undefined}
                >
                  <step.icon
                    className={
                      index === currentIndex
                        ? 'size-4 text-accent'
                        : 'size-4 text-text-muted'
                    }
                    aria-hidden="true"
                  />
                  <p className="mt-2 font-mono text-caption text-text-muted uppercase">
                    {state}
                  </p>
                  <p className="mt-1 text-small text-text-primary">
                    {step.label}
                  </p>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </DemoFrame>
  )
}

function moveBrand(
  event: KeyboardEvent<HTMLDivElement>,
  current: BrandId,
  setBrandId: (id: BrandId) => void,
) {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
    return
  }

  event.preventDefault()
  const index = brands.findIndex((item) => item.id === current)
  const direction = event.key === 'ArrowRight' ? 1 : -1
  const next = brands[(index + direction + brands.length) % brands.length]
  if (next) {
    setBrandId(next.id)
  }
}
