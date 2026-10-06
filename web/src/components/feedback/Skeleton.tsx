import { cn } from '../../utils/cn.ts'

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-surface-secondary motion-reduce:animate-none',
        className,
      )}
    />
  )
}
