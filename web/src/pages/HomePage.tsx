import { HealthStatus } from '../features/health/HealthStatus.tsx'

export function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-medium">Inicio</h1>
      <p className="text-neutral-600">
        Base técnica del portafolio. Las pantallas finales todavía no están.
      </p>
      <HealthStatus />
    </section>
  )
}
