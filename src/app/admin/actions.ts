'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile?.is_admin) redirect('/')
  return { supabase, user }
}

// Admin writes are double-guarded (requireAdmin + RLS). The row-count checks
// turn a silently-rejected write into an error flash instead of a false
// success message.
function fail(message: string): never {
  console.error('[admin-actions]', message)
  redirect('/admin?flash=action-failed')
}

export async function approveDonor(donorId: string) {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('donors')
    .update({ is_approved: true })
    .eq('id', donorId)
    .select('id')
  if (error || !data?.length) fail(`approve donor: ${error?.message ?? 'no row updated'}`)
  revalidatePath('/admin')
  revalidatePath('/donors')
  revalidatePath('/')
  redirect('/admin?flash=donor-approved')
}

export async function rejectDonor(donorId: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('donors').delete().eq('id', donorId)
  if (error) fail(`reject donor: ${error.message}`)
  revalidatePath('/admin')
  redirect('/admin?flash=donor-rejected')
}

// Pull an already-approved donor out of public search (e.g. after a report)
// without touching their account — they can be re-approved later.
export async function unapproveDonor(donorId: string) {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('donors')
    .update({ is_approved: false })
    .eq('id', donorId)
    .select('id')
  if (error || !data?.length) fail(`unapprove donor: ${error?.message ?? 'no row updated'}`)
  revalidatePath('/admin')
  revalidatePath('/donors')
  revalidatePath('/')
  redirect('/admin?flash=donor-unapproved')
}

// Delete the donor record entirely; the user account stays.
export async function removeDonor(donorId: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('donors').delete().eq('id', donorId)
  if (error) fail(`remove donor: ${error.message}`)
  revalidatePath('/admin')
  revalidatePath('/donors')
  revalidatePath('/')
  redirect('/admin?flash=donor-removed')
}

export async function setUserAdmin(userId: string, makeAdmin: boolean) {
  const { supabase, user } = await requireAdmin()
  if (user.id === userId && !makeAdmin) {
    redirect('/admin?flash=cannot-self-demote')
  }
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_admin: makeAdmin })
    .eq('id', userId)
    .select('id')
  if (error || !data?.length) fail(`set admin: ${error?.message ?? 'no row updated'}`)
  revalidatePath('/admin')
  redirect(`/admin?flash=${makeAdmin ? 'admin-granted' : 'admin-revoked'}`)
}

export async function resolveReport(reportId: string) {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('reports')
    .update({ status: 'RESOLVED' })
    .eq('id', reportId)
    .select('id')
  if (error || !data?.length) fail(`resolve report: ${error?.message ?? 'no row updated'}`)
  revalidatePath('/admin')
  redirect('/admin?flash=report-resolved')
}

export async function deleteUser(userId: string) {
  const { supabase, user } = await requireAdmin()
  if (user.id === userId) {
    redirect('/admin?flash=cannot-self-delete')
  }
  // Admins must be demoted before they can be deleted — prevents one admin
  // wiping out another in a single click. (Enforced in the DB function too.)
  const { data: target } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle()
  if (target?.is_admin) {
    redirect('/admin?flash=demote-before-delete')
  }
  // SECURITY DEFINER function — deletes from auth.users, which cascades to
  // profiles → donors → requests. RLS alone can't do this (auth schema).
  const { error } = await supabase.rpc('admin_delete_user', {
    target_user_id: userId,
  })
  if (error) fail(`delete user: ${error.message}`)
  revalidatePath('/admin')
  redirect('/admin?flash=user-deleted')
}

export async function adminCancelRequest(requestId: string) {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('blood_requests')
    .update({ status: 'CANCELLED' })
    .eq('id', requestId)
    .select('id')
  if (error || !data?.length) fail(`cancel request: ${error?.message ?? 'no row updated'}`)
  revalidatePath('/admin')
  redirect('/admin?flash=request-cancelled')
}

export async function adminUpdateEmergencyStatus(
  requestId: string,
  status: 'FULFILLED' | 'CANCELLED' | 'EXPIRED',
) {
  const { supabase } = await requireAdmin()
  const { data, error } = await supabase
    .from('emergency_requests')
    .update({ status })
    .eq('id', requestId)
    .select('id')
  if (error || !data?.length) fail(`update emergency: ${error?.message ?? 'no row updated'}`)
  revalidatePath('/admin')
  revalidatePath('/emergency')
  revalidatePath('/')
  redirect(
    `/admin?flash=${
      status === 'FULFILLED'
        ? 'emergency-fulfilled'
        : status === 'EXPIRED'
          ? 'emergency-expired'
          : 'emergency-cancelled'
    }`,
  )
}
