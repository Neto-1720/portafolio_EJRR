import { ApiError } from './api.ts'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function readData(body: unknown): unknown[] {
  if (!isRecord(body) || !Array.isArray(body.data)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return body.data
}

export function readDataRecord(body: unknown): Record<string, unknown> {
  if (!isRecord(body) || !isRecord(body.data)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return body.data
}

export function readString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value
}

export function readNullableString(value: unknown): string | null {
  if (value === null) {
    return null
  }

  return readString(value)
}

export function readNumber(value: unknown): number {
  if (typeof value !== 'number') {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value
}

export function readBoolean(value: unknown): boolean {
  if (typeof value !== 'boolean') {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value
}
