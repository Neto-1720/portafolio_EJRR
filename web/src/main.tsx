import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AppErrorBoundary } from './components/feedback/AppErrorBoundary.tsx'
import { router } from './app/router.tsx'
import './index.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('No se encontró el elemento #root.')
}

createRoot(root).render(
  <StrictMode>
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  </StrictMode>,
)
