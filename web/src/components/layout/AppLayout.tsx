import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { LoadingState } from '../feedback/LoadingState.tsx'
import { Container } from '../ui/Container.tsx'
import { PersonJsonLd } from '../../seo/PersonJsonLd.tsx'
import { Footer } from './Footer.tsx'
import { Navbar } from './Navbar.tsx'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <PersonJsonLd />
      <a href="#contenido" className="skip-link focus-ring">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className="flex-1">
        <Container className="py-14 md:py-20">
          <Suspense fallback={<LoadingState label="Cargando" />}>
            <Outlet />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
