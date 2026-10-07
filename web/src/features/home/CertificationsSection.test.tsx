import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CertificationsSection } from './CertificationsSection.tsx'

describe('CertificationsSection', () => {
  it('shows a controlled error when the backend is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('offline'))),
    )

    render(<CertificationsSection />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo conectar con el backend.',
    )
    expect(
      screen.getByRole('heading', { name: 'Certificaciones' }),
    ).toBeVisible()
  })
})
