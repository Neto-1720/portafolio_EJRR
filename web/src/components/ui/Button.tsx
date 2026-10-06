import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn.ts'

const variants = {
  primary: 'bg-text-primary text-background shadow-sm hover:bg-text-primary/88',
  secondary:
    'border border-border bg-surface text-text-primary shadow-sm hover:bg-surface-secondary',
  ghost: 'text-text-secondary hover:bg-accent-soft hover:text-text-primary',
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
        'focus-ring inline-flex h-10 items-center justify-center rounded-md px-4 text-small transition duration-150 motion-reduce:transition-none',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
