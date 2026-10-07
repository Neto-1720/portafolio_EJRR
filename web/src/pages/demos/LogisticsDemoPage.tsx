import { CircleCheck, Package, TriangleAlert, Truck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { EmptyState } from '../../components/feedback/EmptyState.tsx'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { demos } from '../../features/demos/catalog.ts'
import { DemoFrame } from '../../features/demos/DemoFrame.tsx'
import {
  fieldClass,
  FilterField,
  FilterSelect,
} from '../../features/demos/FilterField.tsx'
import { formatDate } from '../../features/demos/format.ts'
import {
  labelFor,
  shipmentStatuses,
  toneFor,
} from '../../features/demos/labels.ts'
import { StatusBadge } from '../../features/demos/StatusBadge.tsx'
import { useDemoQuery } from '../../features/demos/useDemoQuery.ts'
import { getDemoShipments } from '../../services/demos.ts'

const demo = demos[0]

export function LogisticsDemoPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [carrier, setCarrier] = useState('')
  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (status) params.set('status', status)
    if (carrier) params.set('carrier', carrier)
    return params.toString()
  }, [search, status, carrier])
  const load = useCallback(
    (signal: AbortSignal) => getDemoShipments(query, signal),
    [query],
  )
  const { state, refreshing, retry } = useDemoQuery(load, query)

  return (
    <DemoFrame demo={demo}>
      <form
        className="grid gap-4 sm:grid-cols-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <FilterField id="shipment-search" label="Search">
          <input
            id="shipment-search"
            className={fieldClass}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tracking, customer, city"
          />
        </FilterField>
        <FilterField id="shipment-status" label="Status">
          <FilterSelect
            id="shipment-status"
            value={status}
            allLabel="All statuses"
            options={shipmentStatuses}
            onChange={(event) => setStatus(event.target.value)}
          />
        </FilterField>
        <FilterField id="shipment-carrier" label="Carrier">
          <FilterSelect
            id="shipment-carrier"
            value={carrier}
            allLabel="All carriers"
            options={(state.status === 'ok' ? state.data.carriers : []).map(
              (item) => ({ value: item, label: item }),
            )}
            onChange={(event) => setCarrier(event.target.value)}
          />
        </FilterField>
      </form>

      {state.status === 'loading' ? <ShipmentSkeleton /> : null}
      {state.status === 'error' ? (
        <div className="mt-8">
          <ErrorState message="No se pudo cargar esta demo." onRetry={retry} />
        </div>
      ) : null}
      {state.status === 'ok' ? (
        <div className="mt-8" aria-busy={refreshing}>
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
              <Truck className="size-4" aria-hidden="true" />
            </span>
            <p className="text-small text-text-secondary">
              Operational view of the fictional shipments in this portfolio.
            </p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              label="Total shipments"
              value={state.data.total}
              icon={Package}
            />
            <Kpi label="In transit" value={state.data.inTransit} icon={Truck} />
            <Kpi
              label="Delivered"
              value={state.data.delivered}
              icon={CircleCheck}
            />
            <Kpi
              label="Exceptions"
              value={state.data.exceptions}
              icon={TriangleAlert}
            />
          </dl>
          <p className="mt-3 text-caption text-text-muted">
            Counts follow the current filters.
          </p>
          {state.data.shipments.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No shipments"
                description="Nothing matches these filters."
              />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
              <table className="w-full min-w-[46rem] text-left text-small">
                <caption className="sr-only">Fictional shipments</caption>
                <thead className="border-b border-border text-caption text-text-muted">
                  <tr>
                    {[
                      'Tracking number',
                      'Customer',
                      'Origin',
                      'Destination',
                      'Carrier',
                      'Status',
                      'Estimated delivery',
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-4 py-3 font-medium"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.data.shipments.map((shipment) => (
                    <tr
                      key={shipment.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-caption text-text-primary">
                        {shipment.tracking_number}
                      </td>
                      <td className="px-4 py-3">{shipment.customer}</td>
                      <td className="px-4 py-3">{shipment.origin}</td>
                      <td className="px-4 py-3">{shipment.destination}</td>
                      <td className="px-4 py-3">{shipment.carrier}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          tone={toneFor(shipmentStatuses, shipment.status)}
                        >
                          {labelFor(shipmentStatuses, shipment.status)}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(shipment.estimated_delivery)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </DemoFrame>
  )
}

function Kpi({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: LucideIcon
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-5 py-4 shadow-sm">
      <dt className="flex items-center gap-2 font-mono text-mono-label tracking-wide text-text-muted uppercase">
        <Icon className="size-3.5 text-accent" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 text-h2 tabular-nums text-text-primary">{value}</dd>
    </div>
  )
}

function ShipmentSkeleton() {
  return (
    <div className="mt-8 space-y-4" role="status" aria-label="Cargando demo">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  )
}
