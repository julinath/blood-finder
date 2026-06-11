'use server'

import { createClient } from '@/lib/supabase/server'

export type OfferResult =
  | { ok: true }
  | { ok: false; code: 'auth' | 'needs-mobile' | 'closed' | 'failed' }

// "আমি রক্ত দিতে পারবো" — runs on the server so it works for every session
// (browser-side cookie reads are unreliable for aged/OAuth sessions). RLS
// additionally enforces donor_id = auth.uid() and that the request is OPEN.
export async function offerHelp(requestId: string): Promise<OfferResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, code: 'auth' }

  // Donor-first privacy: offering does NOT reveal the requester's phone.
  // The requester sees the donor's number and calls them — so a donor must
  // have a mobile on file before offering.
  const { data: profile } = await supabase
    .from('profiles')
    .select('mobile')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile?.mobile) return { ok: false, code: 'needs-mobile' }

  const { error } = await supabase
    .from('emergency_offers')
    .insert({ request_id: requestId, donor_id: user.id })

  // 23505 = already offered (unique index) — treat as success, the offer exists.
  if (error && error.code !== '23505') {
    // 42501 = RLS rejected the insert — the request is no longer OPEN.
    return { ok: false, code: error.code === '42501' ? 'closed' : 'failed' }
  }
  return { ok: true }
}
