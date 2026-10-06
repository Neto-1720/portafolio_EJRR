export const adminField =
  'focus-ring w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-text-primary'

export function emptyToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}
