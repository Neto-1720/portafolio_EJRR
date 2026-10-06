import type { ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn.ts'

export const fieldClass =
  'focus-ring h-10 w-full rounded-md border border-border bg-surface px-3 text-small text-text-primary'

export function FilterField({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0 flex-1">
      <label
        htmlFor={id}
        className="font-mono text-mono-label tracking-wide text-text-muted uppercase"
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

type LabeledOption = { value: string; label: string }

type FilterSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly LabeledOption[]
  allLabel: string
}

export function FilterSelect({
  options,
  allLabel,
  className,
  ...props
}: FilterSelectProps) {
  return (
    <select className={cn(fieldClass, className)} {...props}>
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
