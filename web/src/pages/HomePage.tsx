import { AboutSection } from '../features/home/AboutSection.tsx'
import { CertificationsSection } from '../features/home/CertificationsSection.tsx'
import { ContactCta } from '../features/home/ContactCta.tsx'
import { EngineeringSection } from '../features/home/EngineeringSection.tsx'
import { ExperienceSection } from '../features/home/ExperienceSection.tsx'
import { HomeHero } from '../features/home/HomeHero.tsx'
import { SelectedWork } from '../features/home/SelectedWork.tsx'

export function HomePage() {
  return (
    <>
      <HomeHero />
      <SelectedWork />
      <AboutSection />
      <EngineeringSection />
      <ExperienceSection />
      <CertificationsSection />
      <ContactCta />
    </>
  )
}
