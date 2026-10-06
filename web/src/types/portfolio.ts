export type Technology = {
  id: number
  name: string
  slug: string
  category: string
}

export type ProjectImage = {
  id: number
  path: string
  alt_text: string | null
  caption: string | null
  sort_order: number
  is_cover: boolean
}

export type ProjectListItem = {
  id: number
  slug: string
  title: string
  subtitle: string | null
  summary: string
  role: string | null
  period: string | null
  is_featured: boolean
  cover_image: ProjectImage | null
  technologies: Technology[]
}

export type ProjectDetail = {
  id: number
  slug: string
  title: string
  subtitle: string | null
  summary: string
  context: string | null
  problem: string | null
  solution: string | null
  responsibilities: string | null
  technical_decisions: string | null
  challenges: string | null
  results: string | null
  learnings: string | null
  role: string | null
  period: string | null
  technologies: Technology[]
  images: ProjectImage[]
}

export type Certification = {
  id: number
  name: string
  issuer: string | null
  issued_at: string | null
  credential_url: string | null
  image_path: string | null
}
