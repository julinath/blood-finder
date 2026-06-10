'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isValidBangladeshMobile, normalizeMobile } from '@/lib/validation'
import { isDistrict } from '@/lib/districts'
import { isSex } from '@/types'
import { todayIsoDate } from '@/lib/eligibility'

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

  const districtRaw = ((formData.get('district') as string | null) ?? '').trim()
  if (districtRaw && !isDistrict(districtRaw)) {
    return { ok: false, message: 'Please select a valid district.' }
  }
  const district = districtRaw || null

  // Upsert (not update) so we self-heal if the row is missing — e.g. legacy
  // users who signed up before `handle_new_user` existed, or a Google OAuth
  // user whose trigger insert raced with a stale session.
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? '',
      full_name,
      mobile,
      location,
      district,
    },
    { onConflict: 'id' },
  )

  if (error) {
    console.error('[updateProfile] upsert failed:', error.message)
    return { ok: false, message: 'Could not save profile. Please try again.' }
  }

  // Keep the donor record's location/district in sync so search matching uses
  // the same values the user just set on their profile.
  const { data: donor } = await supabase
    .from('donors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (donor) {
    // Mirror district even when cleared (null) so profile and donor stay in
    // sync — otherwise a removed district would leave donor search matching the
    // old one. donors.location is NOT NULL, so only overwrite it when provided.
    const donorUpdate: { location?: string; district: string | null } = { district }
    if (location) donorUpdate.location = location
    await supabase.from('donors').update(donorUpdate).eq('user_id', user.id)
  }

  revalidatePath('/profile')
  return { ok: true, message: 'Profile updated.' }
}

export async function updateDonorDetails(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: 'You are not signed in.' }

  const districtRaw = ((formData.get('donor_district') as string | null) ?? '').trim()
  if (!isDistrict(districtRaw)) {
    return { ok: false, message: 'Please select a valid district.' }
  }

  // Area is optional; fall back to the district so NOT NULL `location` holds.
  const area = ((formData.get('donor_location') as string | null) ?? '').trim()
  const location = area || districtRaw

  const sex = ((formData.get('sex') as string | null) ?? '').trim()
  if (!isSex(sex)) {
    return { ok: false, message: 'লিঙ্গ (Sex) নির্বাচন করুন।' }
  }

  // Matches become-donor: out-of-range values are accepted and flagged
  // "Not eligible" in the admin panel instead of being rejected here.
  const age = Number.parseInt(
    ((formData.get('age') as string | null) ?? '').trim(),
    10,
  )
  if (!Number.isInteger(age) || age < 16 || age > 70) {
    return { ok: false, message: 'বয়স ১৬ থেকে ৭০ এর মধ্যে দিন।' }
  }

  const weight_kg = Number.parseInt(
    ((formData.get('weight_kg') as string | null) ?? '').trim(),
    10,
  )
  if (!Number.isInteger(weight_kg) || weight_kg < 30 || weight_kg > 250) {
    return { ok: false, message: 'ওজন ৩০ থেকে ২৫০ কেজির মধ্যে দিন।' }
  }

  const lastDonationRaw = (
    (formData.get('last_donation_date') as string | null) ?? ''
  ).trim()
  let last_donation_date: string | null = null
  if (lastDonationRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastDonationRaw)) {
      return { ok: false, message: 'শেষ রক্তদানের তারিখটি সঠিক নয়।' }
    }
    if (lastDonationRaw > todayIsoDate()) {
      return { ok: false, message: 'শেষ রক্তদানের তারিখ ভবিষ্যতের হতে পারে না।' }
    }
    last_donation_date = lastDonationRaw
  }

  const health_conditions =
    ((formData.get('health_conditions') as string | null) ?? '')
      .trim()
      .slice(0, 500) || null

  const { error } = await supabase
    .from('donors')
    .update({
      location,
      district: districtRaw,
      sex,
      age,
      weight_kg,
      last_donation_date,
      health_conditions,
    })
    .eq('user_id', user.id)

  if (error) return { ok: false, message: 'Could not update donor details.' }

  // Mirror onto the profile so the two records stay aligned.
  await supabase
    .from('profiles')
    .update({ location, district: districtRaw })
    .eq('id', user.id)

  revalidatePath('/profile')
  return { ok: true, message: 'Donor details updated.' }
}
