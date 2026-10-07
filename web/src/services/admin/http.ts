import { ApiError, apiUrl } from '../api.ts'
import { isRecord } from '../parse.ts'

export class FieldErrors extends ApiError {
  readonly fields: Record<string, string>

  constructor(fields: Record<string, string>) {
    super('Revisa los campos marcados.', 422)
    this.name = 'FieldErrors'
    this.fields = fields
  }
}

let csrfReady = false

export async function ensureCsrf(): Promise<void> {
  if (csrfReady) {
    return
  }

  const response = await fetch(apiUrl('/sanctum/csrf-cookie'), {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new ApiError('No se pudo preparar la sesión.', response.status)
  }

  csrfReady = true
}

export function resetCsrf(): void {
  csrfReady = false
}

export async function adminRequest(
  path: string,
  options: { method?: string; body?: unknown; form?: FormData } = {},
): Promise<unknown> {
  await ensureCsrf()

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...csrfHeaders(),
  }
  let body: BodyInit | undefined

  if (options.form) {
    body = options.form
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(options.body)
  }

  const response = await fetch(apiUrl(path), {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers,
    body,
  })

  if (response.status === 204) {
    return null
  }

  const payload = await readBody(response)

  if (response.status === 422) {
    throw new FieldErrors(readFieldErrors(payload))
  }

  if (response.status === 401) {
    resetCsrf()
    throw new ApiError('La sesión expiró.', 401)
  }

  if (!response.ok) {
    throw new ApiError('No se pudo completar la acción.', response.status)
  }

  return payload
}

export function csrfHeaders(): Record<string, string> {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith('XSRF-TOKEN='))

  if (!cookie) {
    return {}
  }

  return {
    'X-XSRF-TOKEN': decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)),
  }
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null
  }

  try {
    return (await response.json()) as unknown
  } catch {
    return null
  }
}

function readFieldErrors(payload: unknown): Record<string, string> {
  if (!isRecord(payload) || !isRecord(payload.errors)) {
    return {}
  }

  const fields: Record<string, string> = {}

  for (const [key, value] of Object.entries(payload.errors)) {
    if (Array.isArray(value) && typeof value[0] === 'string') {
      fields[key] = value[0]
    }
  }

  return fields
}
