import { ApiError } from '../api.ts'
import {
  isRecord,
  readDataRecord,
  readNumber,
  readString,
} from '../parse.ts'
import { adminRequest } from './http.ts'
import type { AdminUser } from './types.ts'

export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    const body = await adminRequest('/api/user')
    return readUser(readDataRecord(body))
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 419)) {
      return null
    }

    throw error
  }
}

export async function login(email: string, password: string): Promise<AdminUser> {
  await adminRequest('/api/login', {
    method: 'POST',
    body: { email, password },
  })
  const user = await getCurrentUser()

  if (!user) {
    throw new ApiError('No se pudo iniciar la sesión.')
  }

  return user
}

export async function logout(): Promise<void> {
  await adminRequest('/api/logout', { method: 'POST' })
}

function readUser(row: Record<string, unknown>): AdminUser {
  if (!isRecord(row)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    id: readNumber(row.id),
    name: readString(row.name),
    email: readString(row.email),
  }
}
