export function siteOrigin(): string | null {
  const value = import.meta.env.VITE_SITE_URL?.trim()

  if (!value) {
    return null
  }

  return value.replace(/\/$/, '')
}

export function absoluteUrl(path: string): string | null {
  const origin = siteOrigin()

  if (!origin) {
    return null
  }

  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}
