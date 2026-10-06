import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/work', label: 'Proyectos', end: false },
  { to: '/about', label: 'Acerca de', end: false },
  { to: '/contact', label: 'Contacto', end: false },
]

export function AppLayout() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200">
        <nav
          className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4"
          aria-label="Principal"
        >
          <span className="text-sm font-medium">Portfolio</span>
          <ul className="flex flex-wrap gap-4 text-sm">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    isActive ? 'underline' : 'text-neutral-600'
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
