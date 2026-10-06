import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../../utils/cn.ts'

const variants = {
  primary: 'bg-text-primary text-background shadow-sm hover:bg-text-primary/88',
  secondary:
    'border border-border bg-surface text-text-primary shadow-sm hover:bg-surface-secondary',
  ghost: 'text-text-secondary hover:bg-accent-soft hover:text-text-primary',
}

type LinkButtonProps = {
  to: string
  children: ReactNode
  variant?: keyof typeof variants
  className?: string
}

export function LinkButton({
  to,
  children,
  variant = 'secondary',
  className,
}: LinkButtonProps) {
  const classNames = cn(
    'focus-ring inline-flex h-10 items-center justify-center rounded-md px-4 text-small transition duration-150 motion-reduce:transition-none',
    variants[variant],
    className,
  )
  const external = to.startsWith('http') || to.startsWith('mailto:')

  if (external) {
    return (
      <a href={to} className={classNames} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={classNames}>
      {children}
    </Link>
  )
}
