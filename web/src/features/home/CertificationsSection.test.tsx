import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CertificationsSection,
  CertificationsSkeleton,
} from './CertificationsSection.tsx'

describe('CertificationsSection', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'public-anon-key')
    vi.stubEnv('VITE_SUPABASE_STORAGE_BUCKET', 'portfolio')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        if (init?.signal?.aborted) {
          throw new DOMException('The operation was aborted.', 'AbortError')
        }

        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url

        if (!url.includes('/rest/v1/certifications')) {
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        }

        return new Response(
          JSON.stringify([
            {
              id: 1,
              name: 'AI-powered QA',
              issuer: 'Udemy',
              issued_at: '2026-10-01',
              hours: '9 h',
              credential_url: null,
              image_path: null,
            },
            {
              id: 2,
              name: 'React para principiantes',
              issuer: 'Udemy',
              issued_at: '2026-09-01',
              hours: '2.5 h',
              credential_url: null,
              image_path: null,
            },
            {
              id: 3,
              name: 'Usa Laravel para consumir APIs y servicios HTTP',
              issuer: 'Udemy',
              issued_at: '2026-08-01',
              hours: '6 h',
              credential_url: null,
              image_path: null,
            },
            {
              id: 4,
              name: 'Laravel de alto nivel',
              issuer: 'Udemy',
              issued_at: '2026-03-01',
              hours: '17 h',
              credential_url: null,
              image_path: null,
            },
          ]),
          {
            status: 200,
            headers: {
              'content-type': 'application/json',
              'content-range': '0-3/*',
            },
          },
        )
      }),
    )
  })

  it('renders the certifications from Supabase', async () => {
    render(<CertificationsSection />)

    expect(
      await screen.findByRole('heading', { name: 'Certificaciones' }),
    ).toBeVisible()
    expect(
      await screen.findByRole('heading', { level: 3, name: 'AI-powered QA' }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'React para principiantes',
      }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Usa Laravel para consumir APIs y servicios HTTP',
      }),
    ).toBeVisible()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Laravel de alto nivel',
      }),
    ).toBeVisible()
    expect(screen.getByText('Octubre de 2026')).toBeVisible()
    expect(screen.getByText('9 h')).toBeVisible()
    expect(screen.getAllByText('Udemy')).toHaveLength(4)
    expect(
      screen.queryByText('No hay certificaciones publicadas'),
    ).not.toBeInTheDocument()
  })

  it('exposes a skeleton loading state', () => {
    render(<CertificationsSkeleton />)

    expect(
      screen.getByRole('status', { name: 'Cargando certificaciones' }),
    ).toBeInTheDocument()
  })
})
