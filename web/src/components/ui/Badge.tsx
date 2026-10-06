import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

type BadgeProps = {
  children: ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-surface-secondary px-2.5 py-0.5 text-caption text-text-primary',
        className,
      )}
    >
      {children}
    </span>
  )
}
