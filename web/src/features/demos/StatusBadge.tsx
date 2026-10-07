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

const dots: Record<StatusTone, string> = {
  neutral: 'bg-text-muted',
  info: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
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
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-caption',
        tones[tone],
      )}
    >
      <span
        className={cn('size-1.5 rounded-full', dots[tone])}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}
