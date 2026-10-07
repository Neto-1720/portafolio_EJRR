import { Component, type ReactNode } from 'react'

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  failed: boolean
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-text-primary">
        <div className="max-w-md text-center">
          <h1 className="text-h1 tracking-tight">Algo salió mal</h1>
          <p className="mt-3 text-body text-text-secondary">
            No se pudo mostrar esta pantalla. Vuelve al inicio e inténtalo de
            nuevo.
          </p>
          <a
            href="/"
            className="focus-ring mt-8 inline-flex h-10 items-center justify-center rounded-md bg-text-primary px-4 text-small text-background shadow-sm"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }
}
