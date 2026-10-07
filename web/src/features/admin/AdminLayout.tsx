import { Suspense, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { LoadingState } from '../../components/feedback/LoadingState.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { ThemeSwitch } from '../../components/layout/ThemeSwitch.tsx'
import { cn } from '../../utils/cn.ts'
import { useAuth } from './useAuth.ts'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/projects', label: 'Proyectos', end: false },
  { to: '/admin/certifications', label: 'Certificaciones', end: false },
  { to: '/admin/messages', label: 'Mensajes', end: false },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [tracked, setTracked] = useState(location.pathname)

  if (tracked !== location.pathname) {
    setTracked(location.pathname)
    setOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <a href="#contenido" className="skip-link focus-ring">
        Saltar al contenido
      </a>
      <div className="flex min-h-screen">
        <aside
          id="admin-nav"
          className={cn(
            'fixed inset-y-0 left-0 z-30 w-60 border-r border-border bg-surface p-5 md:static',
            open ? 'block' : 'hidden md:block',
          )}
        >
          <p className="font-mono text-mono-label tracking-wide text-text-muted uppercase">
            Admin
          </p>
          <nav className="mt-6" aria-label="Administración">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      cn(
                        'focus-ring block rounded-md px-3 py-2 text-small',
                        isActive
                          ? 'bg-accent-soft text-text-primary'
                          : 'text-text-secondary hover:bg-surface-secondary',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-text-primary/20 md:hidden"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-8">
            <Button
              variant="secondary"
              className="md:hidden"
              aria-expanded={open}
              aria-controls="admin-nav"
              onClick={() => setOpen((current) => !current)}
            >
              {open ? 'Cerrar menú' : 'Abrir menú'}
            </Button>
            <p className="hidden text-small text-text-secondary md:block">
              {user?.name}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <ThemeSwitch />
              <Button variant="ghost" onClick={() => void logout()}>
                Salir
              </Button>
            </div>
          </header>
          <main id="contenido" className="min-w-0 px-4 py-8 md:px-8">
            <Suspense fallback={<LoadingState label="Cargando" />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
