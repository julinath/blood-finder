'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isBloodType, type BloodType } from '@/types'
import { isDistrict } from '@/lib/districts'
import { isValidBangladeshMobile, normalizeMobile } from '@/lib/validation'

export type FormState = { ok: false; message: string } | null

export async function registerAsDonor(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const blood_type = ((formData.get('blood_type') as string | null) ?? '').trim()
  if (!isBloodType(blood_type)) {
    return { ok: false, message: 'Please select a valid blood type.' }
  }

  const district = ((formData.get('district') as string | null) ?? '').trim()
  if (!isDistrict(district)) {
    return { ok: false, message: 'District (জেলা) নির্বাচন করুন।' }
  }

  // Area is optional extra detail; fall back to the district so the NOT NULL
  // `location` column always has a value.
  const area = ((formData.get('location') as string | null) ?? '').trim()
  const location = area || district

  const mobileRaw = ((formData.get('mobile') as string | null) ?? '').trim()
  const mobile = mobileRaw ? normalizeMobile(mobileRaw) : ''
  if (mobile && !isValidBangladeshMobile(mobile)) {
    return {
      ok: false,
      message: 'Mobile must be 11 digits starting with 01 (e.g. 01712345678).',
    }
  }

  // Belt-and-braces: the page also guards this, but a stale tab could resubmit.
  const { data: existingDonor } = await supabase
    .from('donors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (existingDonor) {
    redirect('/dashboard?flash=donor-pending')
  }

  // Pull existing profile so the upsert keeps a name the user already set and
  // satisfies `full_name NOT NULL` even if the trigger row is unusually blank.
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('full_name, mobile, location')
    .eq('id', user.id)
    .maybeSingle()

  const meta = user.user_metadata ?? {}
  const fullNameFromMeta =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    ''

  // Sync donor's mobile + location back into the profile so /profile shows
  // them and the two records don't drift apart.
  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? '',
      full_name:
        existingProfile?.full_name && existingProfile.full_name.trim() !== ''
          ? existingProfile.full_name
          : fullNameFromMeta,
      mobile: mobile || existingProfile?.mobile || null,
      location,
      district,
    },
    { onConflict: 'id' },
  )

  if (profileError) {
    console.error('[become-donor] profile sync failed:', profileError.message)
    return {
      ok: false,
      message: 'Could not save your profile. Please try again.',
    }
  }

  const { error: donorError } = await supabase.from('donors').insert({
    user_id: user.id,
    blood_type: blood_type satisfies BloodType,
    location,
    district,
    availability_status: 'AVAILABLE',
    is_approved: false,
  })

  if (donorError) {
    console.error('[become-donor] donor insert failed:', donorError.message)
    return { ok: false, message: 'Something went wrong. Please try again.' }
  }

  // Critical: revalidate /profile so the user immediately sees the new
  // mobile + location when they navigate there. Without this, the cached
  // page renders the pre-submit (empty) values.
  revalidatePath('/profile')
  revalidatePath('/dashboard')
  revalidatePath('/become-donor')
  redirect('/dashboard?flash=donor-pending')
}
