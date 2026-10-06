import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { navItems, site } from '../../config/site.ts'
import { cn } from '../../utils/cn.ts'
import { Container } from '../ui/Container.tsx'
import { IconButton } from '../ui/IconButton.tsx'

export function Navbar() {
  const location = useLocation()
  const locationKey = `${location.pathname}${location.hash}`
  const [open, setOpen] = useState(false)
  const [trackedLocation, setTrackedLocation] = useState(locationKey)

  if (trackedLocation !== locationKey) {
    setTrackedLocation(locationKey)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Link
            to="/"
            className="focus-ring text-small font-medium tracking-wide text-text-primary"
          >
            {site.mark}
          </Link>
          <nav className="hidden md:block" aria-label="Principal">
            <NavList />
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <ProfileLinks />
          </div>
          <IconButton
            className="md:hidden"
            label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="navegacion-movil"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? 'Cerrar' : 'Menú'}
          </IconButton>
        </div>
        {open ? (
          <nav
            id="navegacion-movil"
            aria-label="Principal"
            className="border-t border-border py-4 md:hidden"
          >
            <NavList stacked />
            <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
              <ProfileLinks />
            </div>
          </nav>
        ) : null}
      </Container>
    </header>
  )
}

function NavList({ stacked = false }: { stacked?: boolean }) {
  return (
    <ul className={cn('flex gap-5', stacked && 'flex-col gap-3')}>
      {navItems.map((item) => (
        <li key={item.label}>
          {item.to.includes('#') ? (
            <Link
              to={item.to}
              className="focus-ring text-small text-text-secondary hover:text-text-primary"
            >
              {item.label}
            </Link>
          ) : (
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'focus-ring text-small hover:text-text-primary',
                  isActive ? 'text-text-primary' : 'text-text-secondary',
                )
              }
            >
              {item.label}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  )
}

function ProfileLinks() {
  return (
    <>
      <OptionalLink href={site.githubUrl}>GitHub</OptionalLink>
      <OptionalLink href={site.linkedinUrl}>LinkedIn</OptionalLink>
      <a
        href={site.cvPath}
        className="focus-ring text-small text-text-secondary hover:text-text-primary"
      >
        CV
      </a>
    </>
  )
}

function OptionalLink({
  href,
  children,
}: {
  href: string | null
  children: string
}) {
  if (!href) {
    return <span className="text-small text-text-muted">{children}</span>
  }

  return (
    <a
      href={href}
      className="focus-ring text-small text-text-secondary hover:text-text-primary"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  )
}
