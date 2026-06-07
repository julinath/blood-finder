'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { registerAsDonor, type FormState } from './actions'
import { BLOOD_TYPES, BLOOD_TYPE_LABELS } from '@/types'
import { DISTRICTS } from '@/lib/districts'

type Defaults = {
  mobile: string
  location: string
  district: string
}

const FIELD_CLASS =
  'w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'

export default function BecomeDonorForm({ defaults }: { defaults: Defaults }) {
  const [state, action] = useActionState<FormState, FormData>(
    registerAsDonor,
    null,
  )
  const prefilledFromProfile = Boolean(
    defaults.mobile || defaults.location || defaults.district,
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <form action={action} className="space-y-5" noValidate>
        {state && !state.ok && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3"
          >
            {state.message}
          </div>
        )}

        {prefilledFromProfile && (
          <p
            role="status"
            className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
          >
            Pre-filled from your profile — edit if needed.
          </p>
        )}

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            Blood Type
          </span>
          <select
            name="blood_type"
            required
            defaultValue=""
            className={`${FIELD_CLASS} bg-white`}
          >
            <option value="">Select blood type</option>
            {BLOOD_TYPES.map((bt) => (
              <option key={bt} value={bt}>
                {BLOOD_TYPE_LABELS[bt]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            District (জেলা)
          </span>
          <select
            name="district"
            required
            defaultValue={defaults.district}
            className={`${FIELD_CLASS} bg-white`}
          >
            <option value="">জেলা নির্বাচন করুন</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <span className="block text-xs text-gray-400 mt-1">
            আপনার জেলার রোগীরা আপনাকে সহজে খুঁজে পাবে।
          </span>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            এলাকা / Area <span className="text-gray-400">(optional)</span>
          </span>
          <input
            name="location"
            type="text"
            defaultValue={defaults.location}
            placeholder="যেমন: মহাখালী, বনানী"
            className={FIELD_CLASS}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            Mobile Number
          </span>
          <input
            name="mobile"
            type="tel"
            inputMode="numeric"
            defaultValue={defaults.mobile}
            placeholder="01XXXXXXXXX"
            className={FIELD_CLASS}
          />
          <span className="block text-xs text-gray-400 mt-1">
            Optional. 11 digits starting with 01.
          </span>
        </label>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Your profile will be reviewed by an admin before it becomes visible
          to others.
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
    >
      {pending ? 'Submitting…' : 'Register as Donor'}
    </button>
  )
}
