import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ProjectImage } from '../../types/portfolio.ts'
import { imageUrl } from '../../utils/publicUrl.ts'
import { ImagePlaceholder } from './ImagePlaceholder.tsx'
import { ScreenshotStage } from './ScreenshotStage.tsx'

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
  const [playing, setPlaying] = useState(true)
  const [hold, setHold] = useState(false)
  const current = Math.min(index, Math.max(slides.length - 1, 0))
  const slide = slides[current]

  useEffect(() => {
    if (!playing || hold || slides.length < 2) {
      return
    }

    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (media?.matches) {
      return
    }

    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % slides.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [playing, hold, slides.length])

  if (!slide) {
    return <ImagePlaceholder label={title} large />
  }

  const src = imageUrl(slide)
  const alt = altText(slide, title, current)
  const showControls = slides.length > 1

  function go(next: number) {
    const count = slides.length
    setIndex(((next % count) + count) % count)
  }

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Capturas de ${title}`}
      tabIndex={0}
      className="focus-ring max-w-full rounded-xl outline-none"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(event) => {
        const next = event.relatedTarget
        if (next instanceof Node && event.currentTarget.contains(next)) {
          return
        }
        setHold(false)
      }}
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
      {src && !failed.includes(slide.id) ? (
        <ScreenshotStage
          src={src}
          alt={alt}
          onError={() => setFailed((ids) => [...ids, slide.id])}
        />
      ) : (
        <ImagePlaceholder label={alt} large />
      )}
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
              className="focus-ring inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-text-primary shadow-sm"
              aria-label="Imagen anterior"
              onClick={() => go(current - 1)}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="focus-ring inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-text-primary shadow-sm"
              aria-label="Imagen siguiente"
              onClick={() => go(current + 1)}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="focus-ring inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-text-primary shadow-sm"
              aria-label={playing ? 'Pausar carrusel' : 'Reanudar carrusel'}
              aria-pressed={!playing}
              onClick={() => setPlaying((value) => !value)}
            >
              {playing ? (
                <Pause className="size-4" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
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
