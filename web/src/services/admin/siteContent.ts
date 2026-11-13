import { asNullableString, asRecord, raise } from '../../lib/rows.ts'
import { getSupabase } from '../../lib/supabase.ts'
import { ApiError } from '../api.ts'
import { defaults, type SiteContent } from '../siteContent.ts'
import { FieldErrors } from './http.ts'

export type SiteContentInput = {
  hero_eyebrow: string | null
  hero_body: string | null
  hero_body_secondary: string | null
  about_title: string | null
  about_description: string | null
  about_paragraphs: string[]
  work_description: string | null
  contact_description: string | null
  experience_json: string
  education_json: string
}

const COLUMNS =
  'id,hero_eyebrow,hero_body,hero_body_secondary,about_title,about_description,about_paragraphs,work_description,contact_description,experience,education'

export async function getAdminSiteContent(): Promise<SiteContent> {
  const { data, error } = await getSupabase()
    .from('site_content')
    .select(COLUMNS)
    .eq('id', 1)
    .maybeSingle()

  raise(error)

  if (!data) {
    return defaults()
  }

  return {
    ...defaults(),
    hero_eyebrow: asNullableString(asRecord(data).hero_eyebrow),
    hero_body: asNullableString(asRecord(data).hero_body),
    hero_body_secondary: asNullableString(asRecord(data).hero_body_secondary),
    about_title: asNullableString(asRecord(data).about_title),
    about_description: asNullableString(asRecord(data).about_description),
    about_paragraphs: Array.isArray(asRecord(data).about_paragraphs)
      ? (asRecord(data).about_paragraphs as string[]).filter(
          (item) => typeof item === 'string',
        )
      : [],
    work_description: asNullableString(asRecord(data).work_description),
    contact_description: asNullableString(asRecord(data).contact_description),
    experience: Array.isArray(asRecord(data).experience)
      ? (asRecord(data).experience as SiteContent['experience'])
      : [],
    education: Array.isArray(asRecord(data).education)
      ? (asRecord(data).education as SiteContent['education'])
      : [],
  }
}

export async function saveAdminSiteContent(
  input: SiteContentInput,
): Promise<SiteContent> {
  let experience: unknown
  let education: unknown

  try {
    experience = JSON.parse(input.experience_json || '[]')
  } catch {
    throw new FieldErrors({
      experience_json: 'El JSON de experiencia no es válido.',
    })
  }

  try {
    education = JSON.parse(input.education_json || '[]')
  } catch {
    throw new FieldErrors({
      education_json: 'El JSON de educación no es válido.',
    })
  }

  if (!Array.isArray(experience)) {
    throw new FieldErrors({
      experience_json: 'La experiencia debe ser un arreglo JSON.',
    })
  }

  if (!Array.isArray(education)) {
    throw new FieldErrors({
      education_json: 'La educación debe ser un arreglo JSON.',
    })
  }

  const now = new Date().toISOString()
  const payload = {
    id: 1,
    hero_eyebrow: input.hero_eyebrow,
    hero_body: input.hero_body,
    hero_body_secondary: input.hero_body_secondary,
    about_title: input.about_title,
    about_description: input.about_description,
    about_paragraphs: input.about_paragraphs,
    work_description: input.work_description,
    contact_description: input.contact_description,
    experience,
    education,
    updated_at: now,
  }

  const { data, error } = await getSupabase()
    .from('site_content')
    .upsert(payload)
    .select(COLUMNS)
    .single()

  raise(error)

  if (!data) {
    throw new ApiError('No se pudo guardar el contenido.')
  }

  return getAdminSiteContent()
}

export function seedSiteContentInput(): SiteContentInput {
  const base = defaults()

  return {
    hero_eyebrow: base.hero_eyebrow,
    hero_body: base.hero_body,
    hero_body_secondary: base.hero_body_secondary,
    about_title: base.about_title,
    about_description: base.about_description,
    about_paragraphs: base.about_paragraphs,
    work_description: base.work_description,
    contact_description: base.contact_description,
    experience_json: JSON.stringify(base.experience, null, 2),
    education_json: JSON.stringify(base.education, null, 2),
  }
}
