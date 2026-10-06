import type { HealthResponse } from '../types/health.ts'

export class ApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function apiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_URL

  if (!baseUrl) {
    throw new ApiError('Falta VITE_API_URL.')
  }

  return `${baseUrl.replace(/\/$/, '')}${path}`
}

export async function requestJson(
  path: string,
  signal?: AbortSignal,
): Promise<unknown> {
  let response: Response

  try {
    response = await fetch(apiUrl(path), {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new ApiError('No se pudo conectar con el backend.')
  }

  if (response.status === 404) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  if (!response.ok) {
    throw new ApiError('El backend respondió con un error.', response.status)
  }

  try {
    return (await response.json()) as unknown
  } catch {
    throw new ApiError('La respuesta del backend no es JSON válido.')
  }
}

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const body = await requestJson('/api/health', signal)

  if (!isHealthResponse(body)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return body
}

function isHealthResponse(body: unknown): body is HealthResponse {
  return (
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    typeof body.status === 'string'
  )
}
