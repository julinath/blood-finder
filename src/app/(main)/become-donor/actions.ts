'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isBloodType, isSex, type BloodType } from '@/types'
import { isDistrict } from '@/lib/districts'
import { isValidBangladeshMobile, normalizeMobile } from '@/lib/validation'
import { todayIsoDate } from '@/lib/eligibility'

export type FormState = { ok: false; message: string } | null

export async function registerAsDonor(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const full_name = ((formData.get('full_name') as string | null) ?? '').trim()
  if (full_name.length < 2) {
    return { ok: false, message: 'পুরো নাম লিখুন (Full name is required).' }
  }

  const blood_type = ((formData.get('blood_type') as string | null) ?? '').trim()
  if (!isBloodType(blood_type)) {
    return { ok: false, message: 'Please select a valid blood group.' }
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
  const mobile = normalizeMobile(mobileRaw)
  if (!mobile || !isValidBangladeshMobile(mobile)) {
    return {
      ok: false,
      message:
        'Mobile number আবশ্যক — 11 digits starting with 01 (e.g. 01712345678).',
    }
  }

  const sex = ((formData.get('sex') as string | null) ?? '').trim()
  if (!isSex(sex)) {
    return { ok: false, message: 'লিঙ্গ (Sex) নির্বাচন করুন।' }
  }

  // Wider than the 18–65 donation rule on purpose: out-of-range applicants can
  // still submit, and the admin panel flags them "Not eligible" with the reason.
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
      return {
        ok: false,
        message: 'শেষ রক্তদানের তারিখ ভবিষ্যতের হতে পারে না।',
      }
    }
    last_donation_date = lastDonationRaw
  }

  const health_conditions =
    ((formData.get('health_conditions') as string | null) ?? '')
      .trim()
      .slice(0, 500) || null

  // Belt-and-braces: the page also guards this, but a stale tab could resubmit.
  const { data: existingDonor } = await supabase
    .from('donors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (existingDonor) {
    redirect('/profile?flash=donor-pending')
  }

  // Sync the donor's name, mobile + location back into the profile so /profile
  // shows them and the two records don't drift apart.
  const { error: profileError } = await supabase.from('profiles').upsert(
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
    last_donation_date,
    sex,
    age,
    weight_kg,
    health_conditions,
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
  revalidatePath('/become-donor')
  redirect('/profile?flash=donor-pending')
}
