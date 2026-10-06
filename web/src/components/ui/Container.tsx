import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

type ContainerProps = {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-5xl px-5 md:px-8', className)}>
      {children}
    </div>
  )
}
