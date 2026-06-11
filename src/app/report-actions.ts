'use server'

import { createClient } from '@/lib/supabase/server'
import type { ReportReason } from '@/types'

export type ReportResult = { ok: true } | { ok: false; code: 'auth' | 'failed' }

// Files an abuse/no-show report into the admin queue. Runs on the server so it
// works for every session (browser-side cookie reads are unreliable for
// aged/OAuth sessions). RLS enforces reporter_id = auth.uid() and that the
// reporter is actually involved in the reported request.
export async function submitReport(input: {
  requestId?: string
  reportedUserId?: string
  reason: ReportReason
  details: string
}): Promise<ReportResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, code: 'auth' }

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    request_id: input.requestId ?? null,
    reported_user_id: input.reportedUserId ?? null,
    reason: input.reason,
    details: input.details.trim().slice(0, 300) || null,
  })
  if (error) {
    console.error('[report] failed:', error.message)
    return { ok: false, code: 'failed' }
  }
  return { ok: true }
}
