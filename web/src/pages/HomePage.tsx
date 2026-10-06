import { CertificationCard } from '../components/content/CertificationCard.tsx'
import { ExperienceItem } from '../components/content/ExperienceItem.tsx'
import { ProjectCard } from '../components/content/ProjectCard.tsx'
import { EmptyState } from '../components/feedback/EmptyState.tsx'
import { ErrorState } from '../components/feedback/ErrorState.tsx'
import { LoadingState } from '../components/feedback/LoadingState.tsx'
import { Skeleton } from '../components/feedback/Skeleton.tsx'
import { Badge } from '../components/ui/Badge.tsx'
import { Divider } from '../components/ui/Divider.tsx'
import { Section } from '../components/ui/Section.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { Stack } from '../components/ui/Stack.tsx'
import { HealthStatus } from '../features/health/HealthStatus.tsx'

const longSummary =
  'Texto de ejemplo, deliberadamente largo, para revisar el corte de la tarjeta, el salto de línea y que un párrafo extenso no rompa la columna en pantallas estrechas ni empuje el borde del contenedor.'

export function HomePage() {
  return (
    <Stack gap="lg">
      <Section>
        <SectionHeader
          heading="h1"
          eyebrow="Portfolio"
          title="Inicio"
          description="Placeholder. La home final todavía no está construida. Abajo hay una muestra temporal de componentes."
        />
        <div className="mt-4">
          <Badge>Muestra</Badge>
        </div>
      </Section>
      <Divider />
      <Section>
        <SectionHeader title="Tarjetas" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ProjectCard
            title="SaaS Logistics Platform"
            summary={longSummary}
            technologies={['Laravel', 'React', 'TypeScript', 'PostgreSQL']}
            href="/work/saas-logistics-platform"
            coverImage={{
              src: '/preview-frame.svg',
              alt: '',
            }}
          />
          <ProjectCard
            title="White-Label Tracking Portal con un título largo para probar el quiebre"
            summary="Tarjeta sin imagen de portada."
            technologies={['React', 'TypeScript']}
            href="/work/white-label-tracking"
            coverImage={null}
          />
        </div>
      </Section>
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          <CertificationCard
            name="React para principiantes"
            issuer={null}
            issuedAt={null}
            href="/about"
          />
          <ExperienceItem
            period="Periodo"
            title="Full Stack Developer"
            company="Empresa"
            summary="Línea de ejemplo para el ritmo vertical del ítem. No es la sección de experiencia final."
          />
        </div>
      </Section>
      <Section>
        <SectionHeader title="Estados" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <LoadingState />
          <ErrorState message="No se pudo cargar esta muestra." />
          <EmptyState
            title="No hay elementos"
            description="Estado vacío de ejemplo."
          />
          <Skeleton className="h-24 w-full" />
        </div>
      </Section>
      <Section id="engineering">
        <SectionHeader
          title="Engineering"
          description="Esta sección vivirá en la home más adelante."
        />
      </Section>
      <HealthStatus />
    </Stack>
  )
}
