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
    title: 'About — Ernesto Rodríguez',
    description:
      'Experiencia de Ernesto Rodríguez como Full Stack Developer en productos web, Laravel, React y TypeScript.',
    path: '/about',
  })

  return (
    <Section>
      <SectionHeader
        heading="h1"
        eyebrow="About"
        title="Acerca de"
        description={aboutCopy[0]}
      />
      <div className="mt-6 flex max-w-2xl items-start gap-4">
        <Monogram size={44} />
        <div className="space-y-4">
          <p className="text-body text-text-secondary">{aboutCopy[1]}</p>
          <p className="text-body text-text-secondary">
            Prefiero sistemas claros: responsabilidades separadas, interfaces
            predecibles y cambios que se puedan revisar.
          </p>
        </div>
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
