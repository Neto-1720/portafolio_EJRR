import { useParams } from 'react-router'
import { LinkButton } from '../components/ui/LinkButton.tsx'
import { Section } from '../components/ui/Section.tsx'
import { SectionHeader } from '../components/ui/SectionHeader.tsx'
import { Stack } from '../components/ui/Stack.tsx'

export function WorkDetailPage() {
  const { slug } = useParams()

  return (
    <Section>
      <Stack>
        <SectionHeader
          heading="h1"
          eyebrow="Work"
          title="Detalle de proyecto"
          description="Placeholder de la ruta de un caso. El contenido final todavía no está."
        />
        <p className="font-mono text-small break-all text-text-secondary">
          {slug}
        </p>
        <LinkButton to="/work" variant="ghost" className="w-fit px-0">
          Volver al listado
        </LinkButton>
      </Stack>
    </Section>
  )
}
