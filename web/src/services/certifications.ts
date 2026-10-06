import type { Certification } from '../types/portfolio.ts'
import { ApiError, requestJson } from './api.ts'
import {
  isRecord,
  readData,
  readNullableString,
  readNumber,
  readString,
} from './parse.ts'

export async function getCertifications(
  signal?: AbortSignal,
): Promise<Certification[]> {
  const body = await requestJson('/api/certifications', signal)

  return readData(body).map(readCertification)
}

function readCertification(value: unknown): Certification {
  if (!isRecord(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    id: readNumber(value.id),
    name: readString(value.name),
    issuer: readNullableString(value.issuer),
    issued_at: readNullableString(value.issued_at),
    credential_url: readNullableString(value.credential_url),
    image_path: readNullableString(value.image_path),
  }
}
