'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isValidBangladeshMobile, normalizeMobile } from '@/lib/validation'

export type FormState = { ok: boolean; message: string } | null

export async function updateProfile(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: 'You are not signed in.' }

  const full_name = ((formData.get('full_name') as string | null) ?? '').trim()
  if (!full_name) return { ok: false, message: 'Full name is required.' }

  const mobileRaw = ((formData.get('mobile') as string | null) ?? '').trim()
  const mobile = mobileRaw ? normalizeMobile(mobileRaw) : null
  if (mobile && !isValidBangladeshMobile(mobile)) {
    return { ok: false, message: 'Mobile must be 11 digits starting with 01.' }
  }

  const location =
    ((formData.get('location') as string | null) ?? '').trim() || null

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, mobile, location })
    .eq('id', user.id)

  if (error) return { ok: false, message: 'Could not save profile. Please try again.' }

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { ok: true, message: 'Profile updated.' }
}

export async function updateDonorLocation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: 'You are not signed in.' }

  const location = ((formData.get('donor_location') as string | null) ?? '').trim()
  if (!location) return { ok: false, message: 'Donor location is required.' }

  const { error } = await supabase
    .from('donors')
    .update({ location })
    .eq('user_id', user.id)

  if (error) return { ok: false, message: 'Could not update donor location.' }

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { ok: true, message: 'Donor location updated.' }
}
