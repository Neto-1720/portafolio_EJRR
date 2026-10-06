import { cn } from '../../utils/cn.ts'

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-elevated motion-reduce:animate-none',
        className,
      )}
    />
  )
}
