import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('border border-border bg-surface p-5', className)}>
      {children}
    </div>
  )
}
