import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState.tsx'
import { ErrorState } from './ErrorState.tsx'
import { LoadingState } from './LoadingState.tsx'

describe('feedback states', () => {
  it('shows a loading status', () => {
    render(<LoadingState label="Cargando proyectos" />)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando proyectos')
  })

  it('shows an error and a retry action', () => {
    const onRetry = vi.fn()
    render(
      <ErrorState
        message="No se pudo conectar con el backend."
        onRetry={onRetry}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No se pudo conectar con el backend.',
    )
    screen.getByRole('button', { name: 'Reintentar' }).click()
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('shows an empty state', () => {
    render(
      <EmptyState
        title="No hay proyectos destacados"
        description="Cuando haya casos publicados, aparecerán aquí."
      />,
    )

    expect(screen.getByText('No hay proyectos destacados')).toBeInTheDocument()
  })
})
