import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button.tsx'

describe('Button', () => {
  it('renders its label and stays a button', () => {
    render(<Button>Guardar</Button>)

    expect(screen.getByRole('button', { name: 'Guardar' })).toHaveAttribute(
      'type',
      'button',
    )
  })

  it('can submit a form and be disabled', () => {
    render(
      <Button type="submit" disabled>
        Enviar
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Enviar' })
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toBeDisabled()
  })
})
