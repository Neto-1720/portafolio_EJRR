import {
  asDateOnly,
  asId,
  asNullableString,
  asRecords,
  asString,
  raise,
  storagePublicUrl,
} from '../lib/rows.ts'
import {
  bindSignal,
  getSupabase,
  storageBaseUrl,
  storageBucket,
} from '../lib/supabase.ts'
import type { Certification } from '../types/portfolio.ts'

export async function getCertifications(
  signal?: AbortSignal,
): Promise<Certification[]> {
  const { data, error } = await bindSignal(
    getSupabase()
      .from('certifications')
      .select('id,name,issuer,issued_at,hours,credential_url,image_path')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('issued_at', { ascending: false, nullsFirst: false })
      .order('id', { ascending: true }),
    signal,
  )

  raise(error, signal)

  return asRecords(data).map((row) => {
    const image_path = asNullableString(row.image_path)

    return {
      id: asId(row.id),
      name: asString(row.name),
      issuer: asNullableString(row.issuer),
      issued_at: asDateOnly(row.issued_at),
      hours: asNullableString(row.hours),
      credential_url: asNullableString(row.credential_url),
      image_path,
      image_url: storagePublicUrl(
        image_path,
        storageBaseUrl(),
        storageBucket(),
      ),
    }
  })
}
