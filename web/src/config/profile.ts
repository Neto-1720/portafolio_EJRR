function configuredValue(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export const profile = {
  name: 'Ernesto Jahir Rodríguez Ramírez',
  role: 'Full Stack Developer',
  mark: 'ER.',
  email: configuredValue(import.meta.env.VITE_EMAIL),
  github: configuredValue(import.meta.env.VITE_GITHUB_URL),
  linkedin: configuredValue(import.meta.env.VITE_LINKEDIN_URL),
  cvUrl: configuredValue(import.meta.env.VITE_CV_URL),
}
