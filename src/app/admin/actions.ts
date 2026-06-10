'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile?.is_admin) throw new Error('Forbidden')
  return { supabase, user }
}

export async function approveDonor(donorId: string) {
  const { supabase } = await requireAdmin()
  await supabase.from('donors').update({ is_approved: true }).eq('id', donorId)
  revalidatePath('/admin')
  redirect('/admin?flash=donor-approved')
}

export async function rejectDonor(donorId: string) {
  const { supabase } = await requireAdmin()
  await supabase.from('donors').delete().eq('id', donorId)
  revalidatePath('/admin')
  redirect('/admin?flash=donor-rejected')
}

// Pull an already-approved donor out of public search (e.g. after a report)
// without touching their account — they can be re-approved later.
export async function unapproveDonor(donorId: string) {
  const { supabase } = await requireAdmin()
  await supabase.from('donors').update({ is_approved: false }).eq('id', donorId)
  revalidatePath('/admin')
  revalidatePath('/donors')
  revalidatePath('/')
  redirect('/admin?flash=donor-unapproved')
}

// Delete the donor record entirely; the user account stays.
export async function removeDonor(donorId: string) {
  const { supabase } = await requireAdmin()
  await supabase.from('donors').delete().eq('id', donorId)
  revalidatePath('/admin')
  revalidatePath('/donors')
  revalidatePath('/')
  redirect('/admin?flash=donor-removed')
}

export async function setUserAdmin(userId: string, makeAdmin: boolean) {
  const { supabase, user } = await requireAdmin()
  if (user.id === userId && !makeAdmin) {
    throw new Error('You cannot remove your own admin status.')
  }
  await supabase.from('profiles').update({ is_admin: makeAdmin }).eq('id', userId)
  revalidatePath('/admin')
  redirect(`/admin?flash=${makeAdmin ? 'admin-granted' : 'admin-revoked'}`)
}

export async function resolveReport(reportId: string) {
  const { supabase } = await requireAdmin()
  await supabase.from('reports').update({ status: 'RESOLVED' }).eq('id', reportId)
  revalidatePath('/admin')
  redirect('/admin?flash=report-resolved')
}

export async function deleteUser(userId: string) {
  const { supabase, user } = await requireAdmin()
  if (user.id === userId) {
    throw new Error('You cannot delete your own account.')
  }
  // Admins must be demoted before they can be deleted — prevents one admin
  // wiping out another in a single click. (Enforced in the DB function too.)
  const { data: target } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle()
  if (target?.is_admin) {
    throw new Error('Revoke admin access before deleting an admin.')
  }
  // SECURITY DEFINER function — deletes from auth.users, which cascades to
  // profiles → donors → requests. RLS alone can't do this (auth schema).
  const { error } = await supabase.rpc('admin_delete_user', {
    target_user_id: userId,
  })
  if (error) {
    console.error('[admin] delete user failed:', error.message)
    throw new Error('Could not delete user.')
  }
  revalidatePath('/admin')
  redirect('/admin?flash=user-deleted')
}

export async function adminCancelRequest(requestId: string) {
  const { supabase } = await requireAdmin()
  await supabase
    .from('blood_requests')
    .update({ status: 'CANCELLED' })
    .eq('id', requestId)
  revalidatePath('/admin')
  redirect('/admin?flash=request-cancelled')
}

export async function adminUpdateEmergencyStatus(
  requestId: string,
  status: 'FULFILLED' | 'CANCELLED',
) {
  const { supabase } = await requireAdmin()
  await supabase
    .from('emergency_requests')
    .update({ status })
    .eq('id', requestId)
  revalidatePath('/admin')
  revalidatePath('/emergency')
  revalidatePath('/')
  redirect(
    `/admin?flash=${status === 'FULFILLED' ? 'emergency-fulfilled' : 'emergency-cancelled'}`,
  )
}
