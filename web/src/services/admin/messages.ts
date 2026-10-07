import { ApiError } from '../api.ts'
import {
  isRecord,
  readData,
  readDataRecord,
  readNullableString,
  readNumber,
  readString,
} from '../parse.ts'
import { adminRequest } from './http.ts'
import type {
  AdminMessageDetail,
  AdminMessageSummary,
  MessageStatus,
} from './types.ts'

export function getAdminMessages(): Promise<AdminMessageSummary[]> {
  return adminRequest('/api/admin/messages').then((body) =>
    readData(body).map(readSummary),
  )
}

export function getAdminMessage(id: number): Promise<AdminMessageDetail> {
  return adminRequest(`/api/admin/messages/${id}`).then((body) =>
    readDetail(readDataRecord(body)),
  )
}

export function updateAdminMessageStatus(
  id: number,
  status: MessageStatus,
): Promise<AdminMessageDetail> {
  return adminRequest(`/api/admin/messages/${id}`, {
    method: 'PATCH',
    body: { status },
  }).then((body) => readDetail(readDataRecord(body)))
}

function readSummary(value: unknown): AdminMessageSummary {
  if (!isRecord(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    id: readNumber(value.id),
    name: readString(value.name),
    email: readString(value.email),
    subject: readNullableString(value.subject),
    status: readStatus(value.status),
    created_at: readNullableString(value.created_at),
  }
}

function readDetail(row: Record<string, unknown>): AdminMessageDetail {
  return {
    ...readSummary(row),
    message: readString(row.message),
  }
}

function readStatus(value: unknown): MessageStatus {
  if (value === 'new' || value === 'read' || value === 'archived') {
    return value
  }

  throw new ApiError('La respuesta del backend no tiene el formato esperado.')
}
