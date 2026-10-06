import { Button } from '../ui/Button.tsx'

type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-danger/30 bg-surface px-5 py-4 shadow-sm"
    >
      <p className="text-small break-words text-text-primary">{message}</p>
      {onRetry ? (
        <Button variant="ghost" className="mt-3 px-0" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
