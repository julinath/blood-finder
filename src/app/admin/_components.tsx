'use client'

import { useFormStatus } from 'react-dom'
import { approveDonor, rejectDonor } from './actions'

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
