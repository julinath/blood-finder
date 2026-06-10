'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { calculateEligibility } from '@/lib/eligibility'
import { MAX_NOTES_LENGTH } from '@/lib/validation'

export type RequestFormState = { ok: false; message: string } | null

// Creates a blood request after re-validating everything server-side: the
// donor must exist, be approved, be available, be 90-day eligible, and must
// not be the requester themselves. The client UI shows the same rules, but
// only this check is authoritative.
export async function createBloodRequest(
  _prev: RequestFormState,
  formData: FormData,
): Promise<RequestFormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const donorId = ((formData.get('donor_id') as string | null) ?? '').trim()
  if (!donorId) {
    return { ok: false, message: 'কোনো রক্তদাতা নির্বাচন করা হয়নি।' }
  }

  const notes = ((formData.get('notes') as string | null) ?? '').trim()
  if (notes.length > MAX_NOTES_LENGTH) {
    return {
      ok: false,
      message: `নোট সর্বোচ্চ ${MAX_NOTES_LENGTH} অক্ষরের মধ্যে লিখুন।`,
    }
  }

  const { data: donor, error: donorError } = await supabase
    .from('donors')
    .select('id, user_id, availability_status, last_donation_date, is_approved')
    .eq('id', donorId)
    .eq('is_approved', true)
    .maybeSingle()

  if (donorError || !donor) {
    return { ok: false, message: 'রক্তদাতাকে খুঁজে পাওয়া যায়নি বা এখনো অনুমোদিত নন।' }
  }
  if (donor.user_id === user.id) {
    return { ok: false, message: 'নিজের কাছে রিকোয়েস্ট পাঠানো যায় না।' }
  }
  if (donor.availability_status !== 'AVAILABLE') {
    return { ok: false, message: 'এই রক্তদাতা এই মুহূর্তে Available নন।' }
  }
  const eligibility = calculateEligibility(donor.last_donation_date)
  if (!eligibility.isEligible) {
    return {
      ok: false,
      message: `শেষ রক্তদানের পর ৯০ দিন পূর্ণ হয়নি — ইনি আরো ${eligibility.daysRemaining} দিন পরে রক্ত দিতে পারবেন।`,
    }
  }

  const { error: insertError } = await supabase.from('blood_requests').insert({
    requester_id: user.id,
    donor_id: donorId,
    notes: notes || null,
    status: 'PENDING',
  })

  if (insertError) {
    // 23505 = the partial unique index on (requester_id, donor_id) PENDING —
    // a duplicate pending request, also covering the double-submit race.
    if (insertError.code === '23505') {
      return {
        ok: false,
        message: 'এই রক্তদাতার কাছে আপনার একটি রিকোয়েস্ট ইতিমধ্যে অপেক্ষায় আছে।',
      }
    }
    console.error('[request] insert failed:', insertError.message)
    return { ok: false, message: 'রিকোয়েস্ট পাঠানো যায়নি। আবার চেষ্টা করুন।' }
  }

  revalidatePath('/profile')
  redirect('/profile?flash=request-sent')
}
