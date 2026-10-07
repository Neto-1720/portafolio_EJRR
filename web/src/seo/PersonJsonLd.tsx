import { profile } from '../config/profile.ts'
import { siteOrigin } from './siteUrl.ts'

export function PersonJsonLd() {
  const sameAs = [profile.github, profile.linkedin].filter(
    (url): url is string => url !== null,
  )
  const url = siteOrigin()
  const data: {
    '@context': string
    '@type': string
    name: string
    jobTitle: string
    url?: string
    sameAs?: string[]
  } = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
  }

  if (url) {
    data.url = url
  }

  if (sameAs.length > 0) {
    data.sameAs = sameAs
  }

  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}
