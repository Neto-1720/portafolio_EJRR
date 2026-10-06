import { ApiError } from '../api.ts'
import {
  isRecord,
  readBoolean,
  readData,
  readDataRecord,
  readNullableString,
  readNumber,
  readString,
} from '../parse.ts'
import { adminRequest } from './http.ts'
import type {
  AdminProject,
  AdminProjectImage,
  AdminProjectListItem,
  DashboardCounts,
} from './types.ts'

export type ProjectInput = {
  title: string
  slug: string
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
  is_featured: boolean
  is_published: boolean
  sort_order: number
  technology_ids: number[]
}

export function getAdminProjects(): Promise<AdminProjectListItem[]> {
  return adminRequest('/api/admin/projects').then((body) =>
    readData(body).map(readProjectListItem),
  )
}

export function getAdminProject(id: number): Promise<AdminProject> {
  return adminRequest(`/api/admin/projects/${id}`).then((body) =>
    readProject(readDataRecord(body)),
  )
}

export function createAdminProject(input: ProjectInput): Promise<AdminProject> {
  return adminRequest('/api/admin/projects', { method: 'POST', body: input }).then(
    (body) => readProject(readDataRecord(body)),
  )
}

export function updateAdminProject(
  id: number,
  input: Partial<ProjectInput>,
): Promise<AdminProject> {
  return adminRequest(`/api/admin/projects/${id}`, {
    method: 'PUT',
    body: input,
  }).then((body) => readProject(readDataRecord(body)))
}

export function patchAdminProject(
  id: number,
  input: Partial<ProjectInput>,
): Promise<AdminProjectListItem> {
  return adminRequest(`/api/admin/projects/${id}`, {
    method: 'PATCH',
    body: input,
  }).then((body) => readProjectListItem(readDataRecord(body)))
}

export function deleteAdminProject(id: number): Promise<void> {
  return adminRequest(`/api/admin/projects/${id}`, { method: 'DELETE' }).then(
    () => undefined,
  )
}

export function uploadProjectImage(
  projectId: number,
  form: FormData,
): Promise<AdminProjectImage> {
  return adminRequest(`/api/admin/projects/${projectId}/images`, {
    method: 'POST',
    form,
  }).then((body) => readImage(readDataRecord(body)))
}

export function updateProjectImage(
  projectId: number,
  imageId: number,
  input: {
    alt_text: string | null
    caption: string | null
    sort_order: number
    is_cover: boolean
  },
): Promise<AdminProjectImage> {
  return adminRequest(`/api/admin/projects/${projectId}/images/${imageId}`, {
    method: 'PATCH',
    body: input,
  }).then((body) => readImage(readDataRecord(body)))
}

export function deleteProjectImage(
  projectId: number,
  imageId: number,
): Promise<void> {
  return adminRequest(`/api/admin/projects/${projectId}/images/${imageId}`, {
    method: 'DELETE',
  }).then(() => undefined)
}

export function getDashboard(): Promise<DashboardCounts> {
  return adminRequest('/api/admin/dashboard').then((body) => {
    const row = readDataRecord(body)

    return {
      projects: readNumber(row.projects),
      published_projects: readNumber(row.published_projects),
      featured_projects: readNumber(row.featured_projects),
      certifications: readNumber(row.certifications),
    }
  })
}

function readProjectListItem(value: unknown): AdminProjectListItem {
  const row = readRow(value)

  return {
    id: readNumber(row.id),
    title: readString(row.title),
    slug: readString(row.slug),
    is_published: readBoolean(row.is_published),
    is_featured: readBoolean(row.is_featured),
    sort_order: readNumber(row.sort_order),
  }
}

function readProject(row: Record<string, unknown>): AdminProject {
  if (!Array.isArray(row.technology_ids) || !Array.isArray(row.images)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    ...readProjectListItem(row),
    subtitle: readNullableString(row.subtitle),
    summary: readString(row.summary),
    context: readNullableString(row.context),
    problem: readNullableString(row.problem),
    solution: readNullableString(row.solution),
    responsibilities: readNullableString(row.responsibilities),
    technical_decisions: readNullableString(row.technical_decisions),
    challenges: readNullableString(row.challenges),
    results: readNullableString(row.results),
    learnings: readNullableString(row.learnings),
    role: readNullableString(row.role),
    period: readNullableString(row.period),
    technology_ids: row.technology_ids.map(readNumber),
    images: row.images.map(readImage),
  }
}

function readImage(value: unknown): AdminProjectImage {
  const row = readRow(value)

  return {
    id: readNumber(row.id),
    path: readString(row.path),
    url: readNullableString(row.url),
    alt_text: readNullableString(row.alt_text),
    caption: readNullableString(row.caption),
    sort_order: readNumber(row.sort_order),
    is_cover: readBoolean(row.is_cover),
  }
}

function readRow(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value
}
