import type { Technology } from '../types/portfolio.ts'
import { ApiError, requestJson } from './api.ts'
import { isRecord, readData, readNumber, readString } from './parse.ts'

export async function getTechnologies(
  signal?: AbortSignal,
): Promise<Technology[]> {
  const body = await requestJson('/api/technologies', signal)

  return readData(body).map(readTechnology)
}

export function readTechnology(value: unknown): Technology {
  if (!isRecord(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    id: readNumber(value.id),
    name: readString(value.name),
    slug: readString(value.slug),
    category: readString(value.category),
  }
}
