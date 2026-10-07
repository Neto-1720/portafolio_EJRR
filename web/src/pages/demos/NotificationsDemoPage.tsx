import { ArrowRight, Mail, MessageCircle } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { EmptyState } from '../../components/feedback/EmptyState.tsx'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { demos } from '../../features/demos/catalog.ts'
import { DemoFrame } from '../../features/demos/DemoFrame.tsx'
import { FilterField, FilterSelect } from '../../features/demos/FilterField.tsx'
import { formatTimestamp } from '../../features/demos/format.ts'
import {
  labelFor,
  notificationChannels,
  notificationStatuses,
  toneFor,
} from '../../features/demos/labels.ts'
import { StatusBadge } from '../../features/demos/StatusBadge.tsx'
import { useDemoQuery } from '../../features/demos/useDemoQuery.ts'
import {
  getDemoNotifications,
  simulateDemoNotification,
} from '../../services/demos.ts'

const demo = demos[1]

export function NotificationsDemoPage() {
  const [channel, setChannel] = useState('')
  const [status, setStatus] = useState('')
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (channel) params.set('channel', channel)
    if (status) params.set('status', status)
    return params.toString()
  }, [channel, status])
  const load = useCallback(
    (signal: AbortSignal) => getDemoNotifications(query, signal),
    [query],
  )
  const { state, refreshing, retry } = useDemoQuery(load, query)

  async function simulate(id: number) {
    setPendingId(id)
    setNotice(null)
    setActionError(null)

    try {
      const updated = await simulateDemoNotification(id)
      setNotice(
        `${updated.recipient} marked as sent. No email or WhatsApp was sent.`,
      )
      retry()
    } catch {
      setActionError('No se pudo simular el envío.')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <DemoFrame demo={demo}>
      <ol
        aria-label="Delivery flow"
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        {['Event', 'Service', 'Queue', 'Delivery'].map((step, index, list) => (
          <li key={step} className="inline-flex items-center gap-2">
            <span className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-caption text-text-secondary shadow-sm">
              {step}
            </span>
            {index < list.length - 1 ? (
              <ArrowRight
                className="size-3.5 text-text-muted"
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <FilterField id="notice-channel" label="Channel">
          <FilterSelect
            id="notice-channel"
            value={channel}
            allLabel="All channels"
            options={notificationChannels}
            onChange={(event) => setChannel(event.target.value)}
          />
        </FilterField>
        <FilterField id="notice-status" label="Status">
          <FilterSelect
            id="notice-status"
            value={status}
            allLabel="All statuses"
            options={notificationStatuses}
            onChange={(event) => setStatus(event.target.value)}
          />
        </FilterField>
      </form>
      {notice ? (
        <p className="mt-4 text-small text-text-secondary" role="status">
          {notice}
        </p>
      ) : null}
      {actionError ? (
        <p className="mt-4 text-small text-danger" role="alert">
          {actionError}
        </p>
      ) : null}
      {state.status === 'loading' ? (
        <div className="mt-8" role="status" aria-label="Cargando demo">
          <Skeleton className="h-64" />
        </div>
      ) : null}
      {state.status === 'error' ? (
        <div className="mt-8">
          <ErrorState message="No se pudo cargar esta demo." onRetry={retry} />
        </div>
      ) : null}
      {state.status === 'ok' ? (
        <div className="mt-8" aria-busy={refreshing}>
          {state.data.length === 0 ? (
            <EmptyState
              title="No notifications"
              description="Nothing matches these filters."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
              <table className="w-full min-w-[42rem] text-left text-small">
                <caption className="sr-only">Fictional notifications</caption>
                <thead className="border-b border-border text-caption text-text-muted">
                  <tr>
                    {[
                      'Event',
                      'Channel',
                      'Recipient',
                      'Status',
                      'Sent at',
                      'Action',
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
                  {state.data.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-caption">
                        {item.event}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          {item.channel === 'whatsapp' ? (
                            <MessageCircle
                              className="size-3.5 text-accent"
                              aria-hidden="true"
                            />
                          ) : (
                            <Mail
                              className="size-3.5 text-accent"
                              aria-hidden="true"
                            />
                          )}
                          {labelFor(notificationChannels, item.channel)}
                        </span>
                      </td>
                      <td className="px-4 py-3 break-all">{item.recipient}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          tone={toneFor(notificationStatuses, item.status)}
                        >
                          {labelFor(notificationStatuses, item.status)}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        {formatTimestamp(item.sent_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="secondary"
                          className="h-9 px-3"
                          disabled={pendingId === item.id}
                          onClick={() => void simulate(item.id)}
                        >
                          {pendingId === item.id ? 'Sending…' : 'Simulate send'}
                        </Button>
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
