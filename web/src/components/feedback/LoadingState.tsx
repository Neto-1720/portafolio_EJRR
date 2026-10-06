import { Skeleton } from './Skeleton.tsx'

type LoadingStateProps = {
  label?: string
}

export function LoadingState({ label = 'Cargando' }: LoadingStateProps) {
  return (
    <div role="status" className="space-y-3">
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <p className="text-caption text-text-muted">{label}</p>
    </div>
  )
}
