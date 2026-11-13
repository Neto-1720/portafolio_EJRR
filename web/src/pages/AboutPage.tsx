import { Monogram } from '../assets/branding/Monogram.tsx'
import { profile } from '../config/profile.ts'
import { TechnologyBadge } from '../components/content/TechnologyBadge.tsx'
import { Section } from '../components/ui/Section.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { aboutCopy } from '../features/home/engineering.ts'
import { usePageMeta } from '../seo/usePageMeta.ts'

const focus = ['Laravel', 'React', 'TypeScript', 'REST APIs', 'PostgreSQL']

export function AboutPage() {
  usePageMeta({
    title: 'Acerca de — Ernesto Rodríguez',
    description:
      'Quién soy como Full Stack Developer: Laravel, React, TypeScript, SaaS en producción, APIs e integraciones.',
    path: '/about',
  })

  return (
    <Section>
      <SectionHeader
        heading="h1"
        eyebrow="Acerca de"
        title="Quién soy y cómo trabajo"
        description="Full Stack con ownership de módulos en producción: del modelo de datos a la interfaz, pasando por integraciones y documentación."
      />
      <div className="mt-6 flex max-w-2xl items-start gap-4">
        <Monogram size={44} />
        <div className="space-y-4">
          {aboutCopy.map((paragraph) => (
            <p key={paragraph} className="text-body text-text-secondary">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-10 max-w-2xl">
        <h2 className="text-h3 tracking-tight text-text-primary">
          En qué me enfoco hoy
        </h2>
        <p className="mt-3 text-body text-text-secondary">
          Productos SaaS de operación (logística y atención), SPAs que conviven
          con Laravel, canales de aviso (correo y WhatsApp) y portales
          white-label. Si el problema es “hay que modernizar sin tumbar
          producción” o “hay que integrar un canal sin duplicar el dominio”, es
          el tipo de trabajo que ya documenté en los case studies.
        </p>
      </div>
      <ul className="mt-8 flex flex-wrap gap-2">
        {focus.map((item) => (
          <li key={item}>
            <TechnologyBadge name={item} />
          </li>
        ))}
      </ul>
      {profile.cvUrl ? (
        <a
          href={profile.cvUrl}
          className="focus-ring mt-8 inline-flex h-10 items-center justify-center rounded-md bg-text-primary px-4 text-small text-background shadow-sm hover:bg-text-primary/88"
        >
          Descargar CV
        </a>
      ) : null}
    </Section>
  )
}
