import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SelectedWork } from './SelectedWork.tsx'

describe('SelectedWork', () => {
  it('keeps showing a loading state while the request is pending', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined)),
    )

    render(<SelectedWork />)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando proyectos')
    expect(screen.getByRole('heading', { name: 'Selected Work' })).toBeVisible()
  })

  it('shows a controlled error when the backend is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('offline'))),
    )

    render(<SelectedWork />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo conectar con el backend.',
    )
    expect(screen.getByRole('heading', { name: 'Selected Work' })).toBeVisible()
  })

  it('shows an empty state when there are no featured projects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      })),
    )

    render(<SelectedWork />)

    expect(
      await screen.findByText('No hay proyectos destacados'),
    ).toBeInTheDocument()
  })
})
