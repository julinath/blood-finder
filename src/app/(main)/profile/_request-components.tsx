'use client'

import { useFormStatus } from 'react-dom'
import type { AvailabilityStatus } from '@/types'
import {
  acceptRequest,
  cancelEmergencyRequest,
  cancelRequest,
  completeRequest,
  creditEmergencyDonor,
  declineRequest,
  fulfillEmergencyRequest,
  toggleAvailability,
} from './request-actions'

function AvailabilityButton({ isAvailable }: { isAvailable: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-label={isAvailable ? 'Set as unavailable' : 'Set as available'}
      className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-60 ${
        isAvailable
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
      {pending ? 'Updating…' : isAvailable ? 'Available' : 'Unavailable'}
    </button>
  )
}

export function AvailabilityToggle({
  donorId,
  currentStatus,
}: {
  donorId: string
  currentStatus: AvailabilityStatus
}) {
  const isAvailable = currentStatus === 'AVAILABLE'
  // The action reads the current status server-side and flips it, so a stale
  // tab can never push it the wrong way.
  return (
    <form action={toggleAvailability.bind(null, donorId)}>
      <AvailabilityButton isAvailable={isAvailable} />
    </form>
  )
}

function CancelButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="mt-2 text-xs text-gray-400 hover:text-red-600 transition-colors disabled:opacity-60"
    >
      {pending ? 'Cancelling…' : 'Cancel request'}
    </button>
  )
}

export function CancelRequestButton({ requestId }: { requestId: string }) {
  return (
    <form action={cancelRequest.bind(null, requestId)}>
      <CancelButton />
    </form>
  )
}

function ActionButton({
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
      className={`${className} disabled:opacity-60`}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

export function RequestActions({ requestId }: { requestId: string }) {
  return (
    <div className="flex gap-2 mt-1">
      <form action={acceptRequest.bind(null, requestId)}>
        <ActionButton
          label="✓ গ্রহণ করুন"
          pendingLabel="…"
          className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors font-medium"
        />
      </form>
      <form action={declineRequest.bind(null, requestId)}>
        <ActionButton
          label="ফিরিয়ে দিন"
          pendingLabel="…"
          className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        />
      </form>
    </div>
  )
}

// Shown on an ACCEPTED *sent* request: the REQUESTER (who received the blood)
// confirms the donation happened — the donor never confirms their own
// donations, so the public donation count can't be self-inflated.
export function CompleteRequestButton({
  requestId,
  donorName,
}: {
  requestId: string
  donorName: string
}) {
  const confirmComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      !confirm(
        `"${donorName}" আপনাকে রক্ত দিয়েছেন — নিশ্চিত করছেন? রিকোয়েস্টটি সম্পন্ন হবে এবং রক্তদানটি রক্তদাতার হিসাবে যোগ হবে।`,
      )
    ) {
      e.preventDefault()
    }
  }

  return (
    <form action={completeRequest.bind(null, requestId)}>
      <ActionButton
        label="🩸 রক্ত পেয়েছি — নিশ্চিত করুন"
        pendingLabel="…"
        className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-medium whitespace-nowrap"
        onClick={confirmComplete}
      />
    </form>
  )
}

// Shown beside each offer on the requester's own emergency request: "this
// person donated" — credits the donor's count and closes the request.
export function CreditDonorButton({
  requestId,
  donorUserId,
  donorName,
}: {
  requestId: string
  donorUserId: string
  donorName: string
}) {
  const confirmCredit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      !confirm(
        `"${donorName}" রক্ত দিয়েছেন — নিশ্চিত করছেন? রিকোয়েস্টটি সম্পন্ন হিসেবে বন্ধ হবে এবং রক্তদাতার রক্তদানের হিসাবে যোগ হবে।`,
      )
    ) {
      e.preventDefault()
    }
  }

  return (
    <form action={creditEmergencyDonor.bind(null, requestId, donorUserId)}>
      <ActionButton
        label="✓ ইনি রক্ত দিয়েছেন"
        pendingLabel="…"
        className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors font-medium whitespace-nowrap"
        onClick={confirmCredit}
      />
    </form>
  )
}

export function EmergencyRequestActions({ requestId }: { requestId: string }) {
  return (
    <div className="flex gap-2 mt-1">
      <form action={fulfillEmergencyRequest.bind(null, requestId)}>
        <ActionButton
          label="✓ সম্পন্ন হয়েছে"
          pendingLabel="…"
          className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors font-medium"
        />
      </form>
      <form action={cancelEmergencyRequest.bind(null, requestId)}>
        <ActionButton
          label="বাতিল"
          pendingLabel="…"
          className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        />
      </form>
    </div>
  )
}
