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
        'focus-ring inline-flex h-9 items-center justify-center border border-border px-3 text-small text-text-primary hover:bg-surface',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
