'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  updateDonorLocation,
  updateProfile,
  type FormState,
} from './actions'

function FeedbackBanner({ state }: { state: FormState }) {
  if (!state) return null
  return (
    <div
      role="status"
      className={`text-sm rounded-xl px-4 py-3 border ${
        state.ok
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-red-50 border-red-200 text-red-700'
      }`}
    >
      {state.message}
    </div>
  )
}

function SaveButton({
  pendingText,
  children,
  className,
}: {
  pendingText: string
  children: React.ReactNode
  className: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`${className} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {pending ? pendingText : children}
    </button>
  )
}

export function ProfileForm({
  defaults,
}: {
  defaults: {
    full_name: string
    email: string
    mobile: string
    location: string
  }
}) {
  const [state, action] = useActionState<FormState, FormData>(updateProfile, null)

  return (
    <form action={action} className="space-y-4">
      <FeedbackBanner state={state} />
      <Field label="Full Name">
        <input
          name="full_name"
          type="text"
          defaultValue={defaults.full_name}
          required
          minLength={2}
          className={inputClass}
        />
      </Field>
      <Field label="Email" hint="Email cannot be changed">
        <input
          type="email"
          value={defaults.email}
          disabled
          aria-disabled="true"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
        />
      </Field>
      <Field label="Mobile Number" hint="11 digits starting with 01">
        <input
          name="mobile"
          type="tel"
          inputMode="numeric"
          pattern="01[3-9][0-9]{8}"
          defaultValue={defaults.mobile}
          placeholder="01XXXXXXXXX"
          className={inputClass}
        />
      </Field>
      <Field label="Location">
        <input
          name="location"
          type="text"
          defaultValue={defaults.location}
          placeholder="e.g. Dhaka"
          className={inputClass}
        />
      </Field>
      <SaveButton
        pendingText="Saving…"
        className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
      >
        Save Changes
      </SaveButton>
    </form>
  )
}

export function DonorLocationForm({ defaultLocation }: { defaultLocation: string }) {
  const [state, action] = useActionState<FormState, FormData>(
    updateDonorLocation,
    null,
  )

  return (
    <form action={action} className="space-y-3">
      <FeedbackBanner state={state} />
      <div className="flex gap-3">
        <input
          name="donor_location"
          type="text"
          defaultValue={defaultLocation}
          required
          placeholder="Donor location"
          className={`flex-1 ${inputClass}`}
        />
        <SaveButton
          pendingText="…"
          className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          Update
        </SaveButton>
      </div>
    </form>
  )
}

const inputClass =
  'w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  )
}
