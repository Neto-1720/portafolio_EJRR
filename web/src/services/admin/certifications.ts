import {
  asBoolean,
  asDateOnly,
  asId,
  asNullableString,
  asRecord,
  asRecords,
  asString,
  raise,
  storagePublicUrl,
} from '../../lib/rows.ts'
import {
  getSupabase,
  storageBaseUrl,
  storageBucket,
} from '../../lib/supabase.ts'
import { ApiError } from '../api.ts'
import { FieldErrors } from './http.ts'
import type { AdminCertification } from './types.ts'
import { validateCertification } from './validate.ts'

export type CertificationInput = {
  name: string
  issuer: string | null
  issued_at: string | null
  hours: string | null
  credential_url: string | null
  image_path: string | null
  sort_order: number
  is_published: boolean
}

const COLUMNS =
  'id,name,issuer,issued_at,hours,credential_url,image_path,sort_order,is_published'

export async function getAdminCertifications(): Promise<AdminCertification[]> {
  const { data, error } = await getSupabase()
    .from('certifications')
    .select(COLUMNS)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

  raise(error)

  return asRecords(data).map(readCertification)
}

export async function createAdminCertification(
  input: CertificationInput,
): Promise<AdminCertification> {
  validateCertification(input)
  const now = new Date().toISOString()
  const { data, error } = await getSupabase()
    .from('certifications')
    .insert({ ...input, created_at: now, updated_at: now })
    .select(COLUMNS)
    .single()

  raise(error)

  return readCertification(asRecord(data))
}

export async function updateAdminCertification(
  id: number,
  input: CertificationInput,
): Promise<AdminCertification> {
  validateCertification(input)
  const { data, error } = await getSupabase()
    .from('certifications')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(COLUMNS)
    .maybeSingle()

  raise(error)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  return readCertification(asRecord(data))
}

export async function deleteAdminCertification(id: number): Promise<void> {
  const current = await getSupabase()
    .from('certifications')
    .select('image_path')
    .eq('id', id)
    .maybeSingle()

  raise(current.error)

  const { error } = await getSupabase()
    .from('certifications')
    .delete()
    .eq('id', id)

  raise(error)

  if (current.data) {
    const path = asNullableString(asRecord(current.data).image_path)
    if (path) {
      await removeStoredPath(path)
    }
  }
}

export async function uploadCertificationImage(
  id: number,
  file: File,
): Promise<AdminCertification> {
  if (file.size === 0) {
    throw new FieldErrors({ image: 'Selecciona una imagen.' })
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new FieldErrors({ image: 'La imagen no puede pasar de 5 MB.' })
  }

  const { ext, contentType } = imageKind(file)
  const current = await getSupabase()
    .from('certifications')
    .select(COLUMNS)
    .eq('id', id)
    .maybeSingle()

  raise(current.error)

  if (!current.data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  const previous = asNullableString(asRecord(current.data).image_path)
  const path = `certifications/${id}/${crypto.randomUUID()}.${ext}`
  const bucket = storageBucket()
  const uploaded = await getSupabase()
    .storage.from(bucket)
    .upload(path, file, { contentType, upsert: false })

  if (uploaded.error) {
    throw new ApiError('No se pudo guardar la imagen.')
  }

  try {
    const { data, error } = await getSupabase()
      .from('certifications')
      .update({ image_path: path, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(COLUMNS)
      .maybeSingle()

    raise(error)

    if (!data) {
      throw new ApiError('No se encontró el recurso.', 404)
    }

    if (previous && previous !== path) {
      await removeStoredPath(previous)
    }

    return readCertification(asRecord(data))
  } catch (error) {
    await getSupabase().storage.from(bucket).remove([path])
    throw error
  }
}

export async function clearCertificationImage(
  id: number,
): Promise<AdminCertification> {
  const current = await getSupabase()
    .from('certifications')
    .select(COLUMNS)
    .eq('id', id)
    .maybeSingle()

  raise(current.error)

  if (!current.data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  const previous = asNullableString(asRecord(current.data).image_path)
  const { data, error } = await getSupabase()
    .from('certifications')
    .update({ image_path: null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(COLUMNS)
    .maybeSingle()

  raise(error)

  if (!data) {
    throw new ApiError('No se encontró el recurso.', 404)
  }

  if (previous) {
    await removeStoredPath(previous)
  }

  return readCertification(asRecord(data))
}

function readCertification(row: Record<string, unknown>): AdminCertification {
  const image_path = asNullableString(row.image_path)

  return {
    id: asId(row.id),
    name: asString(row.name),
    issuer: asNullableString(row.issuer),
    issued_at: asDateOnly(row.issued_at),
    hours: asNullableString(row.hours),
    credential_url: asNullableString(row.credential_url),
    image_path,
    image_url: storagePublicUrl(image_path, storageBaseUrl(), storageBucket()),
    sort_order: asId(row.sort_order),
    is_published: asBoolean(row.is_published),
  }
}

async function removeStoredPath(path: string): Promise<void> {
  if (path.startsWith('/') || /^https?:\/\//.test(path)) {
    return
  }

  const { error } = await getSupabase()
    .storage.from(storageBucket())
    .remove([path])

  if (error) {
    throw new ApiError('No se pudo eliminar la imagen.')
  }
}

function imageKind(file: File): { ext: string; contentType: string } {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  const contentType =
    type === 'image/jpeg' || type === 'image/png' || type === 'image/webp'
      ? type
      : name.endsWith('.png')
        ? 'image/png'
        : name.endsWith('.webp')
          ? 'image/webp'
          : name.endsWith('.jpg') || name.endsWith('.jpeg')
            ? 'image/jpeg'
            : null

  if (!contentType) {
    throw new FieldErrors({ image: 'La imagen debe ser JPG, PNG o WebP.' })
  }

  const ext =
    contentType === 'image/png'
      ? 'png'
      : contentType === 'image/webp'
        ? 'webp'
        : 'jpg'

  return { ext, contentType }
}
