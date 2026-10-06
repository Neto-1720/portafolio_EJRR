import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'
import type { StatusTone } from './labels.ts'

const tones: Record<StatusTone, string> = {
  neutral: 'bg-surface-secondary text-text-primary',
  info: 'bg-accent-soft text-text-primary',
  success: 'bg-success/15 text-text-primary',
  warning: 'bg-warning/15 text-text-primary',
  danger: 'bg-danger/15 text-text-primary',
}

export function StatusBadge({
  children,
  tone,
}: {
  children: ReactNode
  tone: StatusTone
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-caption',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}
