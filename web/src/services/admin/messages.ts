import { ApiError } from '../api.ts'
import {
  isRecord,
  readData,
  readNullableString,
  readNumber,
  readString,
} from '../parse.ts'
import { adminRequest } from './http.ts'
import type { AdminMessage } from './types.ts'

export function getAdminMessages(): Promise<AdminMessage[]> {
  return adminRequest('/api/admin/messages').then((body) =>
    readData(body).map(readMessage),
  )
}

function readMessage(value: unknown): AdminMessage {
  if (!isRecord(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    id: readNumber(value.id),
    name: readString(value.name),
    email: readString(value.email),
    subject: readNullableString(value.subject),
    message: readString(value.message),
    created_at: readNullableString(value.created_at),
  }
}
