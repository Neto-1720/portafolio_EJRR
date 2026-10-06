import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  children: ReactNode
}

export function IconButton({
  label,
  children,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'focus-ring inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-3 text-small text-text-primary shadow-sm hover:bg-surface-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
