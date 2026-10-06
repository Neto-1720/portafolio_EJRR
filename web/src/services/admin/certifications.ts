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
import type { AdminCertification } from './types.ts'

export type CertificationInput = {
  name: string
  issuer: string | null
  issued_at: string | null
  credential_url: string | null
  image_path: string | null
  sort_order: number
  is_published: boolean
}

export function getAdminCertifications(): Promise<AdminCertification[]> {
  return adminRequest('/api/admin/certifications').then((body) =>
    readData(body).map(readCertification),
  )
}

export function createAdminCertification(
  input: CertificationInput,
): Promise<AdminCertification> {
  return adminRequest('/api/admin/certifications', {
    method: 'POST',
    body: input,
  }).then((body) => readCertification(readDataRecord(body)))
}

export function updateAdminCertification(
  id: number,
  input: CertificationInput,
): Promise<AdminCertification> {
  return adminRequest(`/api/admin/certifications/${id}`, {
    method: 'PUT',
    body: input,
  }).then((body) => readCertification(readDataRecord(body)))
}

export function deleteAdminCertification(id: number): Promise<void> {
  return adminRequest(`/api/admin/certifications/${id}`, {
    method: 'DELETE',
  }).then(() => undefined)
}

function readCertification(value: unknown): AdminCertification {
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
    sort_order: readNumber(value.sort_order),
    is_published: readBoolean(value.is_published),
  }
}
