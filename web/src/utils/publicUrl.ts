export function publicUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  if (
    value.startsWith('https://') ||
    value.startsWith('http://') ||
    value.startsWith('/')
  ) {
    return value
  }

  return null
}

export function imageUrl(
  image: { url?: string | null; path: string } | null | undefined,
): string | null {
  if (!image) {
    return null
  }

  return publicUrl(image.url) ?? publicUrl(image.path)
}
