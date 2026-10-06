import { ExperienceItem } from '../../components/content/ExperienceItem.tsx'
import { Section } from '../../components/ui/Section.tsx'
import { SectionHeader } from '../../components/ui/SectionHeader.tsx'

export function ExperienceSection() {
  return (
    <Section>
      <SectionHeader eyebrow="Experience" title="Experiencia" />
      <div className="mt-6 max-w-3xl">
        <ExperienceItem
          period="Octubre 2024 – Actualidad"
          title="Full Stack Developer"
          company="Teiker Envíos y Soluciones"
          summary="Desarrollo y evolución de una plataforma SaaS B2B enfocada en envíos y operación logística, trabajando de punta a punta en backend, frontend, APIs, integraciones, bases de datos, testing y experiencia de usuario."
        />
        <ExperienceItem
          title="Desarrollador Web y Soporte Técnico"
          company="HackerSoft / Sonne Recolección"
        />
      </div>
    </Section>
  )
}
