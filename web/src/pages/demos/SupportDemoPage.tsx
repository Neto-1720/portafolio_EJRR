import { useCallback, useState } from 'react'
import { EmptyState } from '../../components/feedback/EmptyState.tsx'
import { ErrorState } from '../../components/feedback/ErrorState.tsx'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { cn } from '../../utils/cn.ts'
import { demos } from '../../features/demos/catalog.ts'
import { DemoFrame } from '../../features/demos/DemoFrame.tsx'
import { fieldClass, FilterField } from '../../features/demos/FilterField.tsx'
import { formatTimestamp } from '../../features/demos/format.ts'
import {
  conversationStatuses,
  labelFor,
  senderLabels,
  toneFor,
} from '../../features/demos/labels.ts'
import { StatusBadge } from '../../features/demos/StatusBadge.tsx'
import { useDemoQuery } from '../../features/demos/useDemoQuery.ts'
import {
  getDemoConversation,
  getDemoConversations,
  updateDemoConversationStatus,
  type DemoConversationDetail,
} from '../../services/demos.ts'

const demo = demos[3]

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

export function SupportDemoPage() {
  const [search, setSearch] = useState('')
  const [panel, setPanel] = useState<'list' | 'thread'>('list')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const query = search.trim()
    ? `search=${encodeURIComponent(search.trim())}`
    : ''
  const loadList = useCallback(
    (signal: AbortSignal) => getDemoConversations(query, signal),
    [query],
  )
  const list = useDemoQuery(loadList, query)
  const visible = list.state.status === 'ok' ? list.state.data : []
  const activeId = visible.some((item) => item.id === selectedId)
    ? selectedId
    : null
  const loadDetail = useCallback(
    (signal: AbortSignal) =>
      activeId === null
        ? Promise.resolve(null)
        : getDemoConversation(activeId, signal),
    [activeId],
  )
  const detail = useDemoQuery(loadDetail, String(activeId ?? 'none'), false)
  const [override, setOverride] = useState<DemoConversationDetail | null>(null)
  const conversation =
    override && override.id === activeId
      ? override
      : detail.state.status === 'ok'
        ? detail.state.data
        : null

  async function changeStatus(status: string) {
    if (activeId === null || !conversation) {
      return
    }

    setSaving(true)
    setActionError(null)
    setNotice(null)

    try {
      const updated = await updateDemoConversationStatus(activeId, status)
      setOverride(updated)
      setNotice(
        `Status set to ${labelFor(conversationStatuses, updated.status)}.`,
      )
      list.retry()
    } catch {
      setActionError('No se pudo cambiar el estado.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DemoFrame demo={demo}>
      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)_14rem] lg:items-start lg:gap-4">
        <section
          className={cn(panel === 'thread' && 'max-lg:hidden')}
          aria-label="Conversations"
        >
          <FilterField id="desk-search" label="Search">
            <input
              id="desk-search"
              className={fieldClass}
              value={search}
              placeholder="Customer"
              onChange={(event) => setSearch(event.target.value)}
            />
          </FilterField>
          <div className="mt-4">
            {list.state.status === 'loading' ? (
              <div role="status" aria-label="Cargando demo">
                <Skeleton className="h-64" />
              </div>
            ) : null}
            {list.state.status === 'error' ? (
              <ErrorState
                message="No se pudo cargar esta demo."
                onRetry={list.retry}
              />
            ) : null}
            {list.state.status === 'ok' && visible.length === 0 ? (
              <EmptyState
                title="No conversations"
                description="Nothing matches this search."
              />
            ) : null}
            {list.state.status === 'ok' && visible.length > 0 ? (
              <ul
                className="max-h-[32rem] space-y-2 overflow-y-auto"
                aria-busy={list.refreshing}
              >
                {visible.map((item) => {
                  const selected = item.id === activeId
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={cn(
                          'focus-ring w-full rounded-xl border px-4 py-3 text-left',
                          selected
                            ? 'border-accent bg-accent-soft'
                            : 'border-border bg-surface shadow-sm',
                        )}
                        aria-current={selected ? 'true' : undefined}
                        onClick={() => {
                          setSelectedId(item.id)
                          setOverride(null)
                          setPanel('thread')
                          setNotice(null)
                          setActionError(null)
                        }}
                      >
                        <span className="flex items-start gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-secondary font-mono text-caption text-text-primary">
                            {initials(item.customer_name)}
                          </span>
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-small text-text-primary">
                                {item.customer_name}
                              </span>
                              <StatusBadge
                                tone={toneFor(
                                  conversationStatuses,
                                  item.status,
                                )}
                              >
                                {labelFor(conversationStatuses, item.status)}
                              </StatusBadge>
                            </span>
                            <span className="mt-1 block truncate text-caption text-text-muted">
                              {item.preview ?? 'No messages'}
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
        </section>
        <section
          className={cn(
            'mt-4 rounded-xl border border-border bg-surface p-5 shadow-sm lg:mt-0',
            panel === 'list' && 'max-lg:hidden',
          )}
          aria-label="Thread"
        >
          <button
            type="button"
            className="focus-ring mb-4 text-small text-accent lg:hidden"
            onClick={() => setPanel('list')}
          >
            Back to conversations
          </button>
          {activeId === null ? (
            <EmptyState
              title="Select a conversation"
              description="The thread opens here."
            />
          ) : null}
          {activeId !== null && detail.state.status === 'loading' ? (
            <Skeleton className="h-64" />
          ) : null}
          {activeId !== null && detail.state.status === 'error' ? (
            <ErrorState
              message="No se pudo cargar la conversación."
              onRetry={detail.retry}
            />
          ) : null}
          {conversation ? (
            <div>
              <h2 className="text-h3 text-text-primary">
                {conversation.customer_name}
              </h2>
              <ol className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto">
                {conversation.messages.map((message) => (
                  <li
                    key={message.id}
                    className="rounded-lg border border-border bg-surface-secondary px-4 py-3"
                  >
                    <p className="font-mono text-caption tracking-wide text-text-muted uppercase">
                      {senderLabels[message.sender_type] ?? message.sender_type}
                    </p>
                    <p className="mt-1 text-small text-text-primary">
                      {message.content}
                    </p>
                    <p className="mt-2 text-caption text-text-muted">
                      <time dateTime={message.sent_at ?? undefined}>
                        {formatTimestamp(message.sent_at)}
                      </time>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>
        <section
          className={cn(
            'mt-4 rounded-xl border border-border bg-surface p-5 shadow-sm lg:mt-0',
            panel === 'list' && 'max-lg:hidden',
          )}
          aria-label="Conversation details"
        >
          <h2 className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
            Details
          </h2>
          {conversation ? (
            <dl className="mt-4 space-y-4 text-small">
              <div>
                <dt className="text-text-muted">Customer</dt>
                <dd className="mt-1 break-words text-text-primary">
                  {conversation.customer_name}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Identifier</dt>
                <dd className="mt-1 break-all text-text-primary">
                  {conversation.customer_identifier ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Assigned</dt>
                <dd className="mt-1 text-text-primary">
                  {conversation.assigned_to ?? '—'}
                </dd>
              </div>
              <div>
                <dt>
                  <label htmlFor="desk-status" className="text-text-muted">
                    Status
                  </label>
                </dt>
                <dd className="mt-1">
                  <select
                    id="desk-status"
                    className={fieldClass}
                    value={conversation.status}
                    disabled={saving}
                    onChange={(event) => void changeStatus(event.target.value)}
                  >
                    {conversationStatuses.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <StatusBadge
                      tone={toneFor(conversationStatuses, conversation.status)}
                    >
                      {labelFor(conversationStatuses, conversation.status)}
                    </StatusBadge>
                  </div>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-small text-text-muted">
              Details appear with the selected conversation.
            </p>
          )}
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
        </section>
      </div>
    </DemoFrame>
  )
}
