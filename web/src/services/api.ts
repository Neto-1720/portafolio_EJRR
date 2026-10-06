import type { HealthResponse } from '../types/health.ts'

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function apiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_URL

  if (!baseUrl) {
    throw new ApiError('Falta VITE_API_URL.')
  }

  return `${baseUrl.replace(/\/$/, '')}${path}`
}

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  let response: Response

  try {
    response = await fetch(apiUrl('/api/health'), {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    throw new ApiError('No se pudo conectar con el backend.')
  }

  if (!response.ok) {
    throw new ApiError('El backend respondió con un error.')
  }

  const body: unknown = await response.json()

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
