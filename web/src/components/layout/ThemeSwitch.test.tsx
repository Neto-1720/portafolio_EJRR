import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ThemeSwitch } from './ThemeSwitch.tsx'

describe('ThemeSwitch', () => {
  it('toggles night mode on the document', async () => {
    const user = userEvent.setup()
    document.documentElement.dataset.theme = 'light'

    render(<ThemeSwitch />)
    const toggle = screen.getByRole('switch', { name: 'Activar modo nocturno' })

    expect(toggle).toHaveAttribute('aria-checked', 'false')
    await user.click(toggle)

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    expect(window.localStorage.getItem('portfolio-theme')).toBe('dark')
  })
})
