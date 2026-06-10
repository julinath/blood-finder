'use client'

import { useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  BLOOD_TYPE_LABELS,
  REPORT_REASON_LABELS,
  type AdminReport,
  type AdminUser,
} from '@/types'
import {
  adminCancelRequest,
  adminUpdateEmergencyStatus,
  approveDonor,
  deleteUser,
  rejectDonor,
  removeDonor,
  resolveReport,
  reviewReport,
  setUserAdmin,
  unapproveDonor,
} from './actions'

// Shared button chrome: ≥44px tap target on touch screens (min-h-11 = 44px),
// denser 36px on sm+ where a pointer is the norm.
const BTN_BASE =
  'inline-flex items-center justify-center whitespace-nowrap min-h-11 sm:min-h-9 px-3.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed'

const TONE = {
  green: 'bg-green-100 text-green-700 hover:bg-green-200',
  red: 'bg-red-100 text-red-700 hover:bg-red-200',
  redSolid: 'bg-red-600 text-white hover:bg-red-700',
  amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  gray: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
} as const

function PendingButton({
  label,
  pendingLabel,
  className,
  onClick,
}: {
  label: string
  pendingLabel: string
  className: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={onClick}
      className={`${BTN_BASE} ${className}`}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

export function DonorApprovalActions({
  donorId,
  donorName,
}: {
  donorId: string
  donorName: string
}) {
  const confirmReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm(`Reject and delete donor record for "${donorName}"? This cannot be undone.`)) {
      e.preventDefault()
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form action={approveDonor.bind(null, donorId)}>
        <PendingButton label="Approve" pendingLabel="Approving…" className={TONE.green} />
      </form>
      <form action={rejectDonor.bind(null, donorId)}>
        <PendingButton
          label="Reject"
          pendingLabel="Rejecting…"
          className={TONE.red}
          onClick={confirmReject}
        />
      </form>
    </div>
  )
}

export function UserAdminToggle({
  userId,
  userName,
  isAdmin,
  isSelf,
}: {
  userId: string
  userName: string
  isAdmin: boolean
  isSelf: boolean
}) {
  if (isSelf) {
    return (
      <span className="text-xs text-gray-400" title="You cannot change your own admin status">
        (you)
      </span>
    )
  }

  const confirmRevoke = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAdmin && !confirm(`Revoke admin access for "${userName}"?`)) {
      e.preventDefault()
    }
  }

  return (
    <form action={setUserAdmin.bind(null, userId, !isAdmin)}>
      <PendingButton
        label={isAdmin ? 'Revoke admin' : 'Make admin'}
        pendingLabel="…"
        className={isAdmin ? TONE.red : TONE.purple}
        onClick={confirmRevoke}
      />
    </form>
  )
}

export function ApprovedDonorActions({
  donorId,
  donorName,
}: {
  donorId: string
  donorName: string
}) {
  const confirmUnapprove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      !confirm(
        `Hide "${donorName}" from public search? They stay registered and can be re-approved later.`,
      )
    ) {
      e.preventDefault()
    }
  }

  const confirmRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      !confirm(
        `Remove the donor record for "${donorName}"? Their user account stays, but the donor listing is deleted. This cannot be undone.`,
      )
    ) {
      e.preventDefault()
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form action={unapproveDonor.bind(null, donorId)}>
        <PendingButton
          label="Unapprove"
          pendingLabel="…"
          className={TONE.amber}
          onClick={confirmUnapprove}
        />
      </form>
      <form action={removeDonor.bind(null, donorId)}>
        <PendingButton
          label="Remove"
          pendingLabel="…"
          className={TONE.red}
          onClick={confirmRemove}
        />
      </form>
    </div>
  )
}

export function DeleteUserButton({
  userId,
  userName,
  isSelf,
  isAdminTarget,
}: {
  userId: string
  userName: string
  isSelf: boolean
  isAdminTarget: boolean
}) {
  if (isSelf) return null
  // Admins must be demoted first — the server action and DB function both
  // refuse, so don't offer a button that can only fail.
  if (isAdminTarget) return null

  const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      !confirm(
        `Delete user "${userName}"?\n\n` +
          'ALL of their data will be PERMANENTLY deleted:\n' +
          '• Profile and account\n' +
          '• Donor record (if any)\n' +
          '• All blood requests\n\n' +
          'This cannot be undone — the data CANNOT be recovered.',
      )
    ) {
      e.preventDefault()
    }
  }

  return (
    <form action={deleteUser.bind(null, userId)}>
      <PendingButton
        label="Delete"
        pendingLabel="Deleting…"
        className={TONE.redSolid}
        onClick={confirmDelete}
      />
    </form>
  )
}

export function AdminCancelRequestButton({ requestId }: { requestId: string }) {
  const confirmCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm('Cancel this blood request?')) e.preventDefault()
  }

  return (
    <form action={adminCancelRequest.bind(null, requestId)}>
      <PendingButton
        label="Cancel"
        pendingLabel="…"
        className={TONE.gray}
        onClick={confirmCancel}
      />
    </form>
  )
}

export function AdminEmergencyActions({
  requestId,
  showExpire = false,
}: {
  requestId: string
  // Offered only for stale OPEN requests (needed-on date passed, or old post).
  showExpire?: boolean
}) {
  const confirmCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm('Cancel this emergency request?')) e.preventDefault()
  }
  const confirmExpire = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      !confirm(
        'Mark this emergency request as expired? It will be removed from the public board.',
      )
    ) {
      e.preventDefault()
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form action={adminUpdateEmergencyStatus.bind(null, requestId, 'FULFILLED')}>
        <PendingButton label="Mark fulfilled" pendingLabel="…" className={TONE.green} />
      </form>
      {showExpire && (
        <form action={adminUpdateEmergencyStatus.bind(null, requestId, 'EXPIRED')}>
          <PendingButton
            label="Mark expired"
            pendingLabel="…"
            className={TONE.amber}
            onClick={confirmExpire}
          />
        </form>
      )}
      <form action={adminUpdateEmergencyStatus.bind(null, requestId, 'CANCELLED')}>
        <PendingButton
          label="Cancel"
          pendingLabel="…"
          className={TONE.gray}
          onClick={confirmCancel}
        />
      </form>
    </div>
  )
}

/* ---------------------------------- Reports ---------------------------------- */

const REPORT_TABS = ['OPEN', 'REVIEWED', 'RESOLVED'] as const
type ReportTab = (typeof REPORT_TABS)[number]

const REPORT_TAB_LABELS: Record<ReportTab, string> = {
  OPEN: 'Open',
  REVIEWED: 'Reviewed',
  RESOLVED: 'Resolved',
}

const REPORT_STATUS_STYLES: Record<ReportTab, string> = {
  OPEN: 'bg-red-100 text-red-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  RESOLVED: 'bg-gray-100 text-gray-500',
}

const REPORT_EMPTY_BY_TAB: Record<ReportTab, string> = {
  OPEN: 'No open reports — the queue is clear.',
  REVIEWED: 'No reports are waiting on follow-up.',
  RESOLVED: 'No reports have been resolved yet.',
}

function ReviewReportButton({ reportId }: { reportId: string }) {
  return (
    <form action={reviewReport.bind(null, reportId)}>
      <PendingButton label="Mark reviewed" pendingLabel="…" className={TONE.blue} />
    </form>
  )
}

function ResolveReportButton({ reportId }: { reportId: string }) {
  return (
    <form action={resolveReport.bind(null, reportId)}>
      <PendingButton label="Mark resolved" pendingLabel="…" className={TONE.gray} />
    </form>
  )
}

export function ReportsSection({ reports }: { reports: AdminReport[] }) {
  const [tab, setTab] = useState<ReportTab>('OPEN')

  const counts = useMemo(() => {
    const c: Record<ReportTab, number> = { OPEN: 0, REVIEWED: 0, RESOLVED: 0 }
    for (const r of reports) {
      if (r.status in c) c[r.status as ReportTab]++
    }
    return c
  }, [reports])

  if (reports.length === 0) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-sm font-medium text-gray-500">No reports have been filed yet.</p>
        <p className="text-xs text-gray-400 mt-1">
          When a user reports a donor or a request, it will appear here for review.
        </p>
      </div>
    )
  }

  const filtered = reports.filter((r) => r.status === tab)

  return (
    <>
      <div className="px-4 sm:px-6 py-3 flex flex-wrap gap-2 border-b border-gray-50">
        {REPORT_TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`inline-flex items-center min-h-11 sm:min-h-9 px-4 rounded-full text-xs font-semibold transition-colors ${
              tab === t
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {REPORT_TAB_LABELS[t]} ({counts[t]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="px-6 py-10 text-sm text-gray-400 text-center">
          {REPORT_EMPTY_BY_TAB[tab]}
        </p>
      ) : (
        <div className="divide-y divide-gray-50">
          {filtered.map((r) => (
            <div key={r.id} className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {REPORT_REASON_LABELS[r.reason] ?? r.reason}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        REPORT_STATUS_STYLES[r.status as ReportTab] ??
                        'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {r.reporter?.full_name ?? 'User'} reported
                    {r.reported ? ` ${r.reported.full_name}` : ''}
                    {r.request
                      ? ` · ${r.request.patient_problem} (${BLOOD_TYPE_LABELS[r.request.blood_type]})`
                      : ''}
                    {' · '}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                  {r.details && (
                    <p className="text-xs text-gray-500 italic mt-1">{r.details}</p>
                  )}
                </div>
                {r.status !== 'RESOLVED' && (
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {r.status === 'OPEN' && <ReviewReportButton reportId={r.id} />}
                    <ResolveReportButton reportId={r.id} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ----------------------------------- Users ----------------------------------- */

const INITIAL_USER_ROWS = 15

export function UsersSection({
  users,
  currentUserId,
}: {
  users: AdminUser[]
  currentUserId: string
}) {
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const q = query.trim().toLowerCase()
  const filtered = q
    ? users.filter(
        (u) =>
          (u.full_name ?? '').toLowerCase().includes(q) ||
          (u.email ?? '').toLowerCase().includes(q),
      )
    : users
  // While searching, show every match; otherwise cap the list until expanded.
  const capped = !q && !showAll && filtered.length > INITIAL_USER_ROWS
  const visible = capped ? filtered.slice(0, INITIAL_USER_ROWS) : filtered

  if (users.length === 0) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-sm font-medium text-gray-500">No users registered yet.</p>
        <p className="text-xs text-gray-400 mt-1">
          New sign-ups will appear here automatically.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="px-4 sm:px-6 py-3 border-b border-gray-50">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          aria-label="Search users by name or email"
          className="w-full sm:max-w-xs h-11 sm:h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 focus:bg-white transition-colors"
        />
      </div>

      {visible.length === 0 ? (
        <p className="px-6 py-10 text-sm text-gray-400 text-center">
          No users match “{query.trim()}”.
        </p>
      ) : (
        <div className="divide-y divide-gray-50">
          {visible.map((u) => (
            <div
              key={u.id}
              className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {u.full_name || '—'}
                  {u.is_admin && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full align-middle">
                      Admin
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {u.email} · joined {new Date(u.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <UserAdminToggle
                  userId={u.id}
                  userName={u.full_name || u.email}
                  isAdmin={u.is_admin}
                  isSelf={u.id === currentUserId}
                />
                <DeleteUserButton
                  userId={u.id}
                  userName={u.full_name || u.email}
                  isSelf={u.id === currentUserId}
                  isAdminTarget={u.is_admin}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {capped && (
        <div className="px-4 sm:px-6 py-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="w-full min-h-11 rounded-xl text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            Show all {filtered.length} users
          </button>
        </div>
      )}
    </>
  )
}
