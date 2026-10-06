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
        'inline-flex items-center border border-border px-2 py-0.5 text-caption text-text-secondary',
        className,
      )}
    >
      {children}
    </span>
  )
}
