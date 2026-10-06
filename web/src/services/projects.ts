import type {
  ProjectDetail,
  ProjectImage,
  ProjectListItem,
} from '../types/portfolio.ts'
import { ApiError, requestJson } from './api.ts'
import {
  isRecord,
  readBoolean,
  readData,
  readDataRecord,
  readNullableString,
  readNumber,
  readString,
} from './parse.ts'
import { readTechnology } from './technologies.ts'

export function getFeaturedProjects(
  signal?: AbortSignal,
): Promise<ProjectListItem[]> {
  return fetchProjectList('/api/projects?featured=1', signal)
}

export function getProjects(signal?: AbortSignal): Promise<ProjectListItem[]> {
  return fetchProjectList('/api/projects', signal)
}

async function fetchProjectList(
  path: string,
  signal?: AbortSignal,
): Promise<ProjectListItem[]> {
  const body = await requestJson(path, signal)

  return readData(body).map(readProjectListItem)
}

export async function getProject(
  slug: string,
  signal?: AbortSignal,
): Promise<ProjectDetail> {
  const body = await requestJson(
    `/api/projects/${encodeURIComponent(slug)}`,
    signal,
  )

  return readProjectDetail(readDataRecord(body))
}

function readProjectListItem(value: unknown): ProjectListItem {
  const record = readProjectBase(value)

  return {
    ...record,
    is_featured: readBoolean(record.is_featured),
    cover_image:
      record.cover_image === null ? null : readProjectImage(record.cover_image),
  }
}

function readProjectDetail(record: Record<string, unknown>): ProjectDetail {
  const base = readProjectBase(record)

  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    subtitle: base.subtitle,
    summary: base.summary,
    context: readNullableString(record.context),
    problem: readNullableString(record.problem),
    solution: readNullableString(record.solution),
    responsibilities: readNullableString(record.responsibilities),
    technical_decisions: readNullableString(record.technical_decisions),
    challenges: readNullableString(record.challenges),
    results: readNullableString(record.results),
    learnings: readNullableString(record.learnings),
    role: base.role,
    period: base.period,
    technologies: base.technologies,
    images: readImages(record.images),
  }
}

function readProjectBase(value: unknown) {
  if (!isRecord(value) || !Array.isArray(value.technologies)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    id: readNumber(value.id),
    slug: readString(value.slug),
    title: readString(value.title),
    subtitle: readNullableString(value.subtitle),
    summary: readString(value.summary),
    role: readNullableString(value.role),
    period: readNullableString(value.period),
    technologies: value.technologies.map(readTechnology),
    is_featured: value.is_featured,
    cover_image: value.cover_image,
  }
}

function readImages(value: unknown): ProjectImage[] {
  if (!Array.isArray(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value.map(readProjectImage)
}

function readProjectImage(value: unknown): ProjectImage {
  if (!isRecord(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    id: readNumber(value.id),
    path: readString(value.path),
    url: 'url' in value ? readNullableString(value.url) : null,
    alt_text: readNullableString(value.alt_text),
    caption: readNullableString(value.caption),
    sort_order: readNumber(value.sort_order),
    is_cover: readBoolean(value.is_cover),
  }
}
