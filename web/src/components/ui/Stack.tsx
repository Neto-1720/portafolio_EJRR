import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

const gaps = {
  sm: 'gap-3',
  md: 'gap-6',
  lg: 'gap-10',
}

type StackProps = {
  children: ReactNode
  gap?: keyof typeof gaps
  className?: string
}

export function Stack({ children, gap = 'md', className }: StackProps) {
  return (
    <div className={cn('flex flex-col', gaps[gap], className)}>{children}</div>
  )
}
