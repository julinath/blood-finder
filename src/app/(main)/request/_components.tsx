'use client'

import { useActionState, useState } from 'react'
import { MAX_NOTES_LENGTH } from '@/lib/validation'
import { FIELD_CLASS } from '@/components/ui/form'
import { createBloodRequest, type RequestFormState } from './actions'

export function RequestForm({
  donorId,
  disabled,
}: {
  donorId: string | null
  disabled: boolean
}) {
  const [state, formAction, pending] = useActionState<RequestFormState, FormData>(
    createBloodRequest,
    null,
  )
  const [notes, setNotes] = useState('')

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <form action={formAction} className="space-y-5" noValidate>
        {state && !state.ok && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3"
          >
            {state.message}
          </div>
        )}

        <input type="hidden" name="donor_id" value={donorId ?? ''} />

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            অতিরিক্ত তথ্য (ঐচ্ছিক)
          </span>
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            maxLength={MAX_NOTES_LENGTH}
            placeholder="রোগীর অবস্থা, হাসপাতাল, কবে লাগবে — যা জানালে রক্তদাতার সুবিধা হয়…"
            className={`${FIELD_CLASS} resize-none`}
          />
          <span className="block text-xs text-gray-400 mt-1 text-right">
            {notes.length}/{MAX_NOTES_LENGTH}
          </span>
        </label>

        <button
          type="submit"
          disabled={pending || disabled}
          aria-busy={pending}
          className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'পাঠানো হচ্ছে…' : 'রিকোয়েস্ট পাঠান'}
        </button>
      </form>
    </div>
  )
}
