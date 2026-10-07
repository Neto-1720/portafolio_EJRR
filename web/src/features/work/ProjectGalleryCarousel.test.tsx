import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { ProjectImage } from '../../types/portfolio.ts'
import { ProjectGallery } from './ProjectGallery.tsx'

function image(
  partial: Partial<ProjectImage> & Pick<ProjectImage, 'id'>,
): ProjectImage {
  return {
    path: 'projects/example/missing.webp',
    url: null,
    alt_text: null,
    caption: null,
    sort_order: partial.id,
    is_cover: false,
    ...partial,
  }
}

describe('ProjectGallery', () => {
  it('keeps the placeholder when there are no usable screenshots', () => {
    render(
      <ProjectGallery
        title="Settings SPA Modernization"
        images={[image({ id: 1, is_cover: true })]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument()
    expect(screen.getByText('Settings SPA Modernization')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Imagen siguiente' }),
    ).not.toBeInTheDocument()
  })

  it('shows one real screenshot with its caption and alt text', () => {
    render(
      <ProjectGallery
        title="Settings SPA Modernization"
        images={[
          image({
            id: 1,
            url: '/projects/settings-spa/01-overview.webp',
            alt_text: 'Vista general de ajustes',
            caption: 'Módulos en una sola navegación',
            is_cover: true,
          }),
        ]}
      />,
    )

    const shot = screen.getByRole('img', { name: 'Vista general de ajustes' })
    expect(shot).toHaveAttribute(
      'src',
      '/projects/settings-spa/01-overview.webp',
    )
    expect(shot).toHaveAttribute('loading', 'lazy')
    expect(
      screen.getByText('Módulos en una sola navegación'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Imagen siguiente' }),
    ).not.toBeInTheDocument()
  })

  it('moves between screenshots with buttons and the keyboard', async () => {
    const user = userEvent.setup()
    render(
      <ProjectGallery
        title="SaaS Logistics Platform"
        images={[
          image({
            id: 1,
            url: '/projects/logistics/cover.webp',
            alt_text: 'Portada operativa',
            is_cover: true,
          }),
          image({
            id: 2,
            path: '/projects/logistics/02-detail.webp',
            caption: 'Detalle del módulo',
          }),
        ]}
      />,
    )

    expect(
      screen.getByRole('img', { name: 'Portada operativa' }),
    ).toHaveAttribute('loading', 'lazy')
    await user.click(screen.getByRole('button', { name: 'Imagen siguiente' }))
    const detail = screen.getByRole('img', {
      name: 'SaaS Logistics Platform, imagen 2',
    })
    expect(detail).toHaveAttribute('src', '/projects/logistics/02-detail.webp')
    expect(detail).toHaveAttribute('loading', 'lazy')
    expect(screen.getByText('Detalle del módulo')).toBeInTheDocument()

    const carousel = screen.getByRole('region', {
      name: 'Capturas de SaaS Logistics Platform',
    })
    carousel.focus()
    await user.keyboard('{ArrowLeft}')
    expect(
      screen.getByRole('img', { name: 'Portada operativa' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Imagen 1' })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })
})
