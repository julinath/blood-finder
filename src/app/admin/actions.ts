'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
  return supabase
}

export async function approveDonor(donorId: string) {
  const supabase = await requireAdmin()
  await supabase.from('donors').update({ is_approved: true }).eq('id', donorId)
  revalidatePath('/admin')
}

export async function rejectDonor(donorId: string) {
  const supabase = await requireAdmin()
  await supabase.from('donors').delete().eq('id', donorId)
  revalidatePath('/admin')
}
