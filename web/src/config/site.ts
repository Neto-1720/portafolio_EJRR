export const site = {
  name: 'Ernesto Jahir Rodríguez Ramírez',
  role: 'Full Stack Developer',
  mark: 'ER.',
  cvPath: '/cv.pdf',
  githubUrl: import.meta.env.VITE_GITHUB_URL || null,
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || null,
  email: import.meta.env.VITE_EMAIL || null,
}

export const navItems = [
  { to: '/work', label: 'Work', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/#engineering', label: 'Engineering', end: false },
  { to: '/contact', label: 'Contact', end: false },
] as const
