'use client'

import { useFormStatus } from 'react-dom'
import {
  adminCancelRequest,
  adminUpdateEmergencyStatus,
  approveDonor,
  deleteUser,
  rejectDonor,
  removeDonor,
  resolveReport,
  setUserAdmin,
  unapproveDonor,
} from './actions'

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
      className={`${className} disabled:opacity-60 disabled:cursor-not-allowed`}
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
    <div className="flex gap-2">
      <form action={approveDonor.bind(null, donorId)}>
        <PendingButton
          label="Approve"
          pendingLabel="Approving…"
          className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium transition-colors"
        />
      </form>
      <form action={rejectDonor.bind(null, donorId)}>
        <PendingButton
          label="Reject"
          pendingLabel="Rejecting…"
          className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium transition-colors"
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
        className={
          isAdmin
            ? 'text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium transition-colors'
            : 'text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 font-medium transition-colors'
        }
        onClick={confirmRevoke}
      />
    </form>
  )
}

export function ResolveReportButton({ reportId }: { reportId: string }) {
  return (
    <form action={resolveReport.bind(null, reportId)}>
      <PendingButton
        label="Mark resolved"
        pendingLabel="…"
        className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-medium transition-colors"
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
    <div className="flex gap-2">
      <form action={unapproveDonor.bind(null, donorId)}>
        <PendingButton
          label="Unapprove"
          pendingLabel="…"
          className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-200 font-medium transition-colors"
          onClick={confirmUnapprove}
        />
      </form>
      <form action={removeDonor.bind(null, donorId)}>
        <PendingButton
          label="Remove"
          pendingLabel="…"
          className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-medium transition-colors"
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
        `Permanently delete "${userName}"? Their account, donor record and all requests will be removed. This cannot be undone.`,
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
        className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 font-medium transition-colors"
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
        className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-medium transition-colors"
        onClick={confirmCancel}
      />
    </form>
  )
}

export function AdminEmergencyActions({ requestId }: { requestId: string }) {
  const confirmCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!confirm('Cancel this emergency request?')) e.preventDefault()
  }

  return (
    <div className="flex gap-2">
      <form action={adminUpdateEmergencyStatus.bind(null, requestId, 'FULFILLED')}>
        <PendingButton
          label="Mark fulfilled"
          pendingLabel="…"
          className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium transition-colors"
        />
      </form>
      <form action={adminUpdateEmergencyStatus.bind(null, requestId, 'CANCELLED')}>
        <PendingButton
          label="Cancel"
          pendingLabel="…"
          className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          onClick={confirmCancel}
        />
      </form>
    </div>
  )
}
