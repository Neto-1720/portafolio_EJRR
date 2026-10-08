import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ContactPage } from './ContactPage.tsx'

describe('ContactPage', () => {
  it('shows the unavailable notice instead of the form', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(
        'Contacto temporalmente no disponible. Puedes contactarme por LinkedIn.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Mensaje')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Enviar mensaje' }),
    ).not.toBeInTheDocument()
  })
})
