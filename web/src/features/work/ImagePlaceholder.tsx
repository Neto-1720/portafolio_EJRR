import { Frame } from 'lucide-react'
import { cn } from '../../utils/cn.ts'

type ImagePlaceholderProps = {
  label: string
  large?: boolean
}

export function ImagePlaceholder({
  label,
  large = false,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'relative flex items-end overflow-hidden rounded-xl border border-border bg-surface-secondary p-5',
        large ? 'aspect-[16/9]' : 'aspect-[16/10]',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <div className="relative">
        <span className="mb-3 grid size-9 place-items-center rounded-lg border border-border bg-surface text-accent">
          <Frame className="size-4" aria-hidden="true" />
        </span>
        <p className="font-mono text-caption break-words text-text-secondary">
          {label}
        </p>
      </div>
    </div>
  )
}
