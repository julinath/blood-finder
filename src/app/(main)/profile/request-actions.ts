'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { todayIsoDate } from '@/lib/eligibility'
import type { AvailabilityStatus } from '@/types'

export async function toggleAvailability(donorId: string, currentStatus: AvailabilityStatus) {
  const supabase = await createClient()
  const newStatus: AvailabilityStatus =
    currentStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE'
  await supabase
    .from('donors')
    .update({ availability_status: newStatus })
    .eq('id', donorId)
  revalidatePath('/profile')
  redirect(
    `/profile?flash=${newStatus === 'AVAILABLE' ? 'availability-on' : 'availability-off'}`,
  )
}

export async function cancelRequest(requestId: string) {
  const supabase = await createClient()
  await supabase
    .from('blood_requests')
    .update({ status: 'CANCELLED' })
    .eq('id', requestId)
  revalidatePath('/profile')
  redirect('/profile?flash=request-cancelled')
}

export async function acceptRequest(requestId: string, donorId: string) {
  const supabase = await createClient()

  const { data: req } = await supabase
    .from('blood_requests')
    .select('requester_id')
    .eq('id', requestId)
    .maybeSingle()

  if (!req) return

  const today = todayIsoDate()

  await supabase
    .from('blood_requests')
    .update({ status: 'ACCEPTED' })
    .eq('id', requestId)

  await supabase.from('donation_records').insert({
    donor_id: donorId,
    requester_id: req.requester_id,
    request_id: requestId,
    donation_date: today,
  })

  await supabase
    .from('donors')
    .update({ last_donation_date: today })
    .eq('id', donorId)

  revalidatePath('/profile')
  redirect('/profile?flash=request-accepted')
}

export async function declineRequest(requestId: string) {
  const supabase = await createClient()
  await supabase
    .from('blood_requests')
    .update({ status: 'CANCELLED' })
    .eq('id', requestId)
  revalidatePath('/profile')
  redirect('/profile?flash=request-declined')
}

// ---- Emergency requests (the public needs board) ----
// RLS confines these updates to the requester's own rows.

export async function fulfillEmergencyRequest(requestId: string) {
  const supabase = await createClient()
  await supabase
    .from('emergency_requests')
    .update({ status: 'FULFILLED' })
    .eq('id', requestId)
  revalidatePath('/profile')
  revalidatePath('/emergency')
  revalidatePath('/')
  redirect('/profile?flash=emergency-fulfilled')
}

// The requester marks WHO actually donated: the DB function records the
// donation (bumping the donor's public donation_count) and closes the request
// in one permission-checked step.
export async function creditEmergencyDonor(
  requestId: string,
  donorUserId: string,
) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('record_emergency_donation', {
    p_request_id: requestId,
    p_donor_user_id: donorUserId,
  })
  if (error) {
    console.error('[emergency] credit donor failed:', error.message)
  }
  revalidatePath('/profile')
  revalidatePath('/emergency')
  revalidatePath('/')
  redirect('/profile?flash=donation-credited')
}

export async function cancelEmergencyRequest(requestId: string) {
  const supabase = await createClient()
  await supabase
    .from('emergency_requests')
    .update({ status: 'CANCELLED' })
    .eq('id', requestId)
  revalidatePath('/profile')
  revalidatePath('/emergency')
  revalidatePath('/')
  redirect('/profile?flash=emergency-cancelled')
}
