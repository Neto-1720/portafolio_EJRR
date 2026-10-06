import { Outlet } from 'react-router'
import { Container } from '../ui/Container.tsx'
import { Footer } from './Footer.tsx'
import { Navbar } from './Navbar.tsx'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <a
        href="#contenido"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-30 focus:bg-surface focus:px-3 focus:py-2 focus:text-small"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="flex-1">
        <Container className="py-10 md:py-14">
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
