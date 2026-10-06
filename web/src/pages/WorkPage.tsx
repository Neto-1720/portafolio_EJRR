import { LinkButton } from '../components/ui/LinkButton.tsx'
import { Section } from '../components/ui/Section.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { Stack } from '../components/ui/Stack.tsx'

export function WorkPage() {
  return (
    <Section>
      <Stack>
        <SectionHeader
          heading="h1"
          eyebrow="Work"
          title="Proyectos"
          description="El listado de case studies todavía no está."
        />
        <LinkButton to="/work/ejemplo" variant="ghost" className="w-fit px-0">
          Abrir una ruta de detalle
        </LinkButton>
      </Stack>
    </Section>
  )
}
