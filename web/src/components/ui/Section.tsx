import type { ReactNode } from 'react'
import { cn } from '../../utils/cn.ts'

type SectionProps = {
  children: ReactNode
  id?: string
  className?: string
}

export function Section({ children, id, className }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 first:pt-0', className)}>
      {children}
    </section>
  )
}
