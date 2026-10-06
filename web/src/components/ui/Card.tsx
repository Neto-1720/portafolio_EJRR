import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-5 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}
