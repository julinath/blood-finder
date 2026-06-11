'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitReport } from '@/app/report-actions'
import { REPORT_REASON_LABELS, type ReportReason } from '@/types'

/**
 * Reusable "report a problem" control. Pass `requestId` to report an emergency
 * request (e.g. fake/paid request) and/or `reportedUserId` to report a person
 * (e.g. a no-show donor). Writes to the RLS-protected `reports` table, which
 * feeds the admin queue — it never deletes or rates anyone publicly.
 */
export default function ReportButton({
  requestId,
  reportedUserId,
}: {
  requestId?: string
  reportedUserId?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason>(
    reportedUserId ? 'NO_SHOW' : 'FAKE_REQUEST',
  )
  const [details, setDetails] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  // Submission runs as a server action (cookie-authenticated on the server),
  // so it works even when the browser can't read the auth cookie.
  const submit = async () => {
    setError('')
    setBusy(true)
    const result = await submitReport({ requestId, reportedUserId, reason, details })
    setBusy(false)
    if (!result.ok) {
      if (result.code === 'auth') {
        router.push('/login')
        return
      }
      setError('আবার চেষ্টা করুন।')
      return
    }
    setDone(true)
    setOpen(false)
  }

  if (done) {
    return <span className="text-xs text-green-600">✓ রিপোর্ট করা হয়েছে</span>
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-gray-400 hover:text-red-600 transition-colors"
      >
        ⚠ রিপোর্ট
      </button>
    )
  }

  return (
    <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value as ReportReason)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {Object.entries(REPORT_REASON_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={2}
        maxLength={300}
        placeholder="বিস্তারিত (optional)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? 'পাঠানো হচ্ছে…' : 'রিপোর্ট পাঠান'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200"
        >
          বাতিল
        </button>
      </div>
    </div>
  )
}
