import type { ProjectImage } from '../../types/portfolio.ts'
import { imageUrl } from '../../utils/publicUrl.ts'
import { ImagePlaceholder } from './ImagePlaceholder.tsx'

type ProjectGalleryProps = {
  images: ProjectImage[]
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  if (images.length === 0) {
    return null
  }

  const [primary, ...rest] = images

  return (
    <section className="border-t border-border py-10">
      <h2 className="text-h2 tracking-tight text-text-primary">Gallery</h2>
      <div className="mt-6 space-y-4">
        {primary ? <GalleryFigure image={primary} large /> : null}
        {rest.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {rest.map((image) => (
              <GalleryFigure key={image.id} image={image} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function GalleryFigure({
  image,
  large = false,
}: {
  image: ProjectImage
  large?: boolean
}) {
  const src = imageUrl(image)
  const label = image.alt_text ?? 'Sin imagen'

  return (
    <figure>
      {src ? (
        <img
          src={src}
          alt={image.alt_text ?? ''}
          loading="lazy"
          decoding="async"
          className={
            large
              ? 'aspect-[16/9] w-full rounded-xl object-cover'
              : 'aspect-[16/10] w-full rounded-xl object-cover'
          }
        />
      ) : (
        <ImagePlaceholder label={label} large={large} />
      )}
      {image.caption ? (
        <figcaption className="mt-2 text-caption break-words text-text-muted">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
