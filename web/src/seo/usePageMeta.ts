import { useEffect } from 'react'
import { absoluteUrl, siteOrigin } from './siteUrl.ts'

type PageMeta = {
  title: string
  description: string
  path: string
  image?: string | null
}

function meta(attribute: 'name' | 'property', key: string) {
  return document.head.querySelector(`meta[${attribute}="${key}"]`)
}

function upsertMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
) {
  let element = meta(attribute, key)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }

  element.setAttribute('content', content)
}

function removeMeta(attribute: 'name' | 'property', key: string) {
  meta(attribute, key)?.remove()
}

function canonicalLink() {
  return document.head.querySelector('link[rel="canonical"]')
}

export function usePageMeta({ title, description, path, image }: PageMeta) {
  useEffect(() => {
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('name', 'twitter:card', 'summary')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)

    const canonical = absoluteUrl(path)

    if (canonical) {
      let link = canonicalLink()

      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.append(link)
      }

      link.setAttribute('href', canonical)
      upsertMeta('property', 'og:url', canonical)
    } else {
      canonicalLink()?.remove()
      removeMeta('property', 'og:url')
    }

    const imageUrl = absoluteImage(image)

    if (imageUrl) {
      upsertMeta('property', 'og:image', imageUrl)
    } else {
      removeMeta('property', 'og:image')
    }
  }, [title, description, path, image])
}

export function useNoIndex() {
  useEffect(() => {
    upsertMeta('name', 'robots', 'noindex')

    return () => {
      removeMeta('name', 'robots')
    }
  }, [])
}

function absoluteImage(image: string | null | undefined) {
  if (!image) {
    return null
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  if (image.startsWith('/') && siteOrigin()) {
    return absoluteUrl(image)
  }

  return null
}
