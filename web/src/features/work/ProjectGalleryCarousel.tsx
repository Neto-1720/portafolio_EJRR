import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { ProjectImage } from '../../types/portfolio.ts'
import { imageUrl } from '../../utils/publicUrl.ts'
import { ImagePlaceholder } from './ImagePlaceholder.tsx'

type ProjectGalleryCarouselProps = {
  images: ProjectImage[]
  title: string
}

export function ProjectGalleryCarousel({
  images,
  title,
}: ProjectGalleryCarouselProps) {
  const slides = images.filter((image) => imageUrl(image))
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState<number[]>([])
  const current = Math.min(index, Math.max(slides.length - 1, 0))
  const slide = slides[current]

  if (!slide) {
    return <ImagePlaceholder label={title} large />
  }

  const src = imageUrl(slide)
  const alt = altText(slide, title, current)
  const showControls = slides.length > 1

  function go(next: number) {
    setIndex(Math.min(Math.max(next, 0), slides.length - 1))
  }

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Capturas de ${title}`}
      tabIndex={0}
      className="focus-ring max-w-full rounded-xl outline-none"
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          go(current + 1)
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          go(current - 1)
        }
      }}
      onTouchStart={(event) => {
        const touch = event.changedTouches[0]
        if (touch) {
          event.currentTarget.dataset.touchX = String(touch.clientX)
        }
      }}
      onTouchEnd={(event) => {
        const start = Number(event.currentTarget.dataset.touchX)
        const touch = event.changedTouches[0]
        delete event.currentTarget.dataset.touchX
        if (!touch || Number.isNaN(start)) {
          return
        }
        const delta = touch.clientX - start
        if (delta > 48) {
          go(current - 1)
        }
        if (delta < -48) {
          go(current + 1)
        }
      }}
    >
      <figure className="overflow-hidden rounded-xl border border-border bg-surface-secondary">
        {src && !failed.includes(slide.id) ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full bg-surface-secondary object-contain"
            onError={() => setFailed((ids) => [...ids, slide.id])}
          />
        ) : (
          <ImagePlaceholder label={alt} large />
        )}
      </figure>
      <p className="sr-only" aria-live="polite">
        {alt}
        {slide.caption ? `. ${slide.caption}` : ''}
      </p>
      {slide.caption ? (
        <p className="mt-3 text-caption break-words text-text-muted">
          {slide.caption}
        </p>
      ) : null}
      {showControls ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              className="focus-ring inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-text-primary shadow-sm disabled:opacity-40"
              aria-label="Imagen anterior"
              disabled={current === 0}
              onClick={() => go(current - 1)}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="focus-ring inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-text-primary shadow-sm disabled:opacity-40"
              aria-label="Imagen siguiente"
              disabled={current === slides.length - 1}
              onClick={() => go(current + 1)}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Indicadores"
          >
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={
                  itemIndex === current
                    ? 'focus-ring size-2.5 rounded-full bg-accent'
                    : 'focus-ring size-2.5 rounded-full bg-border'
                }
                aria-label={`Imagen ${itemIndex + 1}`}
                aria-current={itemIndex === current ? 'true' : undefined}
                onClick={() => go(itemIndex)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function altText(image: ProjectImage, title: string, index: number): string {
  const explicit = image.alt_text?.trim()
  return explicit ? explicit : `${title}, imagen ${index + 1}`
}
