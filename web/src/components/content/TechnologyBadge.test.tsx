import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TechnologyBadge } from './TechnologyBadge.tsx'

describe('TechnologyBadge', () => {
  it('shows the technology name', () => {
    render(<TechnologyBadge name="Laravel" />)

    expect(screen.getByText('Laravel')).toBeInTheDocument()
  })
})
