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
