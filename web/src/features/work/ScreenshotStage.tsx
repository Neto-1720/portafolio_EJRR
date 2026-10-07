type ScreenshotStageProps = {
  src: string
  alt: string
  priority?: boolean
  onError?: () => void
}

export function ScreenshotStage({
  src,
  alt,
  priority = false,
  onError,
}: ScreenshotStageProps) {
  return (
    <div className="relative flex aspect-[2/1] items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-secondary p-3 shadow-sm sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={onError}
        className="relative max-h-full max-w-full rounded-lg object-contain shadow-md"
      />
    </div>
  )
}
