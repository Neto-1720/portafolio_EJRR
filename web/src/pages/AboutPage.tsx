import { Section } from '../components/ui/Section.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'

export function AboutPage() {
  return (
    <Section>
      <SectionHeader
        heading="h1"
        eyebrow="About"
        title="Acerca de"
        description="Esta página todavía es un placeholder."
      />
    </Section>
  )
}
