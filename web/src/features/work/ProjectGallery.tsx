import type { ProjectImage } from '../../types/portfolio.ts'
import { imageUrl } from '../../utils/publicUrl.ts'
import { ImagePlaceholder } from './ImagePlaceholder.tsx'
import { ProjectGalleryCarousel } from './ProjectGalleryCarousel.tsx'

type ProjectGalleryProps = {
  images: ProjectImage[]
  title: string
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const slides = images.filter((image) => imageUrl(image))

  return (
    <section className="border-t border-border py-10">
      <h2 className="text-h2 tracking-tight text-text-primary">Gallery</h2>
      <div className="mt-6 max-w-3xl">
        {slides.length > 0 ? (
          <ProjectGalleryCarousel images={slides} title={title} />
        ) : (
          <ImagePlaceholder label={title} large />
        )}
      </div>
    </section>
  )
}
