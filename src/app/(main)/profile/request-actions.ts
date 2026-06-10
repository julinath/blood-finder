'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { SupabaseClient, User } from '@supabase/supabase-js'

// Every action here is invoked from a <form action={...}> on /profile and
// reports its outcome via `?flash=<key>` (see components/Flash.tsx).
// RLS already confines each write to the caller's own rows; the explicit
// auth + ownership filters below are defense-in-depth, and the row-count
// checks make sure a silently-rejected write shows an error instead of a
// false success message.

async function requireUser(): Promise<{ supabase: SupabaseClient; user: User }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

function fail(message: string): never {
  console.error('[profile-actions]', message)
  redirect('/profile?flash=action-failed')
}

export async function toggleAvailability(donorId: string) {
  const { supabase, user } = await requireUser()

  // Read the current status server-side so a stale tab can't flip it the
  // wrong way, and confirm the donor record belongs to the caller.
  const { data: donor, error: readError } = await supabase
    .from('donors')
    .select('availability_status')
    .eq('id', donorId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (readError || !donor) fail(`availability read failed: ${readError?.message ?? 'not owner'}`)

  const newStatus = donor.availability_status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE'
  const { error } = await supabase
    .from('donors')
    .update({ availability_status: newStatus })
    .eq('id', donorId)
    .eq('user_id', user.id)
  if (error) fail(`availability update failed: ${error.message}`)

  revalidatePath('/profile')
  redirect(
    `/profile?flash=${newStatus === 'AVAILABLE' ? 'availability-on' : 'availability-off'}`,
  )
}

export async function cancelRequest(requestId: string) {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from('blood_requests')
    .update({ status: 'CANCELLED' })
    .eq('id', requestId)
    .eq('requester_id', user.id)
    .eq('status', 'PENDING')
    .select('id')
  if (error || !data?.length) fail(`cancel request failed: ${error?.message ?? 'no matching pending request'}`)
  revalidatePath('/profile')
  redirect('/profile?flash=request-cancelled')
}

// Looks up the caller's own donor record — receiving-side actions may only
// touch requests addressed to that record.
async function ownDonorId(supabase: SupabaseClient, user: User): Promise<string> {
  const { data: donor, error } = await supabase
    .from('donors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error || !donor) fail(`donor lookup failed: ${error?.message ?? 'no donor record'}`)
  return donor.id
}

// Accepting only signals "yes, contact me — I'm willing." The donation itself
// is recorded later via completeRequest, once blood has actually been given.
export async function acceptRequest(requestId: string) {
  const { supabase, user } = await requireUser()
  const donorId = await ownDonorId(supabase, user)
  const { data, error } = await supabase
    .from('blood_requests')
    .update({ status: 'ACCEPTED' })
    .eq('id', requestId)
    .eq('donor_id', donorId)
    .eq('status', 'PENDING')
    .select('id')
  if (error || !data?.length) fail(`accept failed: ${error?.message ?? 'no matching pending request'}`)
  revalidatePath('/profile')
  redirect('/profile?flash=request-accepted')
}

export async function declineRequest(requestId: string) {
  const { supabase, user } = await requireUser()
  const donorId = await ownDonorId(supabase, user)
  const { data, error } = await supabase
    .from('blood_requests')
    .update({ status: 'CANCELLED' })
    .eq('id', requestId)
    .eq('donor_id', donorId)
    .eq('status', 'PENDING')
    .select('id')
  if (error || !data?.length) fail(`decline failed: ${error?.message ?? 'no matching pending request'}`)
  revalidatePath('/profile')
  redirect('/profile?flash=request-declined')
}

// The donor confirms the donation happened. A single DB function flips the
// request to COMPLETED and inserts the donation record atomically — the
// on-insert trigger then bumps donation_count and last_donation_date.
export async function completeRequest(requestId: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.rpc('complete_blood_request', {
    p_request_id: requestId,
  })
  if (error) fail(`complete request failed: ${error.message}`)
  revalidatePath('/profile')
  redirect('/profile?flash=request-completed')
}

// ---- Emergency requests (the public needs board) ----

export async function fulfillEmergencyRequest(requestId: string) {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from('emergency_requests')
    .update({ status: 'FULFILLED' })
    .eq('id', requestId)
    .eq('requester_id', user.id)
    .eq('status', 'OPEN')
    .select('id')
  if (error || !data?.length) fail(`fulfill emergency failed: ${error?.message ?? 'no matching open request'}`)
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
  const { supabase } = await requireUser()
  const { error } = await supabase.rpc('record_emergency_donation', {
    p_request_id: requestId,
    p_donor_user_id: donorUserId,
  })
  if (error) fail(`credit donor failed: ${error.message}`)
  revalidatePath('/profile')
  revalidatePath('/emergency')
  revalidatePath('/')
  redirect('/profile?flash=donation-credited')
}

export async function cancelEmergencyRequest(requestId: string) {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from('emergency_requests')
    .update({ status: 'CANCELLED' })
    .eq('id', requestId)
    .eq('requester_id', user.id)
    .eq('status', 'OPEN')
    .select('id')
  if (error || !data?.length) fail(`cancel emergency failed: ${error?.message ?? 'no matching open request'}`)
  revalidatePath('/profile')
  revalidatePath('/emergency')
  revalidatePath('/')
  redirect('/profile?flash=emergency-cancelled')
}
