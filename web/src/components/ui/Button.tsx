import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn.ts'

const variants = {
  primary: 'bg-accent text-background hover:bg-accent-hover',
  secondary:
    'border border-border bg-surface text-text-primary hover:bg-surface-elevated',
  ghost: 'text-text-secondary hover:text-text-primary',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
}

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'focus-ring inline-flex h-9 items-center justify-center px-3 text-small transition-colors duration-150 motion-reduce:transition-none',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
