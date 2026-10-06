import { Button } from '../ui/Button.tsx'

type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="border border-danger/40 bg-surface px-4 py-4">
      <p className="text-small break-words text-text-primary">{message}</p>
      {onRetry ? (
        <Button variant="ghost" className="mt-3 px-0" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
