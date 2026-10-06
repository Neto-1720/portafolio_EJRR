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
        'flex items-end rounded-xl border border-border bg-surface-secondary p-5',
        large ? 'aspect-[16/9]' : 'aspect-[16/10]',
      )}
    >
      <p className="font-mono text-caption break-words text-text-secondary">
        {label}
      </p>
    </div>
  )
}
