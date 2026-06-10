'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isBloodType } from '@/types'
import { isDistrict } from '@/lib/districts'
import { isValidBangladeshMobile, normalizeMobile } from '@/lib/validation'

export type FormState = { ok: false; message: string } | null

const URGENCIES = ['URGENT', 'HIGH', 'NORMAL'] as const
const MAX_UNITS = 20

function field(formData: FormData, name: string): string {
  return ((formData.get(name) as string | null) ?? '').trim()
}

export async function createEmergencyRequest(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const patient_problem = field(formData, 'patient_problem')
  if (!patient_problem) {
    return { ok: false, message: 'রোগীর সমস্যা / অপারেশনের নাম লিখুন।' }
  }

  const blood_type = field(formData, 'blood_type')
  if (!isBloodType(blood_type)) {
    return { ok: false, message: 'সঠিক blood group নির্বাচন করুন।' }
  }

  const district = field(formData, 'district')
  if (!isDistrict(district)) {
    return { ok: false, message: 'District (জেলা) নির্বাচন করুন।' }
  }

  const hospital = field(formData, 'hospital')
  if (!hospital) {
    return { ok: false, message: 'হাসপাতাল / স্থানের নাম লিখুন।' }
  }

  const units_needed = Number.parseInt(field(formData, 'units_needed'), 10)
  if (!Number.isInteger(units_needed) || units_needed < 1 || units_needed > MAX_UNITS) {
    return { ok: false, message: `কত ব্যাগ রক্ত লাগবে লিখুন (১–${MAX_UNITS})।` }
  }

  const hemoglobinRaw = field(formData, 'hemoglobin')
  let hemoglobin: number | null = null
  if (hemoglobinRaw) {
    const value = Number.parseFloat(hemoglobinRaw)
    if (!Number.isFinite(value) || value < 1 || value > 25) {
      return { ok: false, message: 'হিমোগ্লোবিন একটি বৈধ সংখ্যা হতে হবে (যেমন 8.5)।' }
    }
    hemoglobin = value
  }

  const neededOnRaw = field(formData, 'needed_on')
  let needed_on: string | null = null
  if (neededOnRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(neededOnRaw)) {
      return { ok: false, message: 'কবে রক্ত লাগবে — তারিখটি সঠিক নয়।' }
    }
    needed_on = neededOnRaw
  }

  const urgencyRaw = field(formData, 'urgency') || 'URGENT'
  const urgency = (URGENCIES as readonly string[]).includes(urgencyRaw)
    ? urgencyRaw
    : 'URGENT'

  const contact_phone = normalizeMobile(field(formData, 'contact_phone'))
  if (!isValidBangladeshMobile(contact_phone)) {
    return { ok: false, message: 'যোগাযোগের মোবাইল নম্বর সঠিক নয় (01XXXXXXXXX)।' }
  }

  // Snapshot the requester's display name — the public feed must show it even
  // to visitors who can't read the requester's profile row.
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()
  const meta = user.user_metadata ?? {}
  const requester_name =
    (profile?.full_name && profile.full_name.trim()) ||
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    'একজন'

  // NOTE: we deliberately do NOT write contact_phone/district onto the
  // requester's profile — an emergency's contact + location are per-case (often
  // a relative's number and the patient's district), not the user's own home
  // values. The phone is snapshotted into emergency_contacts below; the name is
  // snapshotted onto the request row.

  const { data: created, error: requestError } = await supabase
    .from('emergency_requests')
    .insert({
      requester_id: user.id,
      requester_name,
      patient_problem,
      blood_type,
      units_needed,
      hemoglobin,
      needed_on,
      district,
      hospital,
      urgency,
      status: 'OPEN',
    })
    .select('id')
    .single()

  if (requestError || !created) {
    console.error('[emergency] request insert failed:', requestError?.message)
    return { ok: false, message: 'রিকোয়েস্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।' }
  }

  const { error: contactError } = await supabase
    .from('emergency_contacts')
    .insert({ request_id: created.id, contact_phone })

  if (contactError) {
    console.error('[emergency] contact insert failed:', contactError.message)
    // Don't leave a contactless request on the public board — cancel it so a
    // retry doesn't create duplicates. (RLS: requester may update own rows.)
    await supabase
      .from('emergency_requests')
      .update({ status: 'CANCELLED' })
      .eq('id', created.id)
      .eq('requester_id', user.id)
    return { ok: false, message: 'যোগাযোগের তথ্য সংরক্ষণ হয়নি। আবার চেষ্টা করুন।' }
  }

  revalidatePath('/emergency')
  revalidatePath('/')
  redirect('/emergency?flash=emergency-posted')
}
