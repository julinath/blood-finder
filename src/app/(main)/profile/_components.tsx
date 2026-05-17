'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  updateDonorLocation,
  updateProfile,
  type FormState,
} from './actions'

type ProfileDefaults = {
  full_name: string
  email: string
  mobile: string
  location: string
}

export function ProfileSection({
  profile,
  donor,
}: {
  profile: ProfileDefaults
  donor: { location: string } | null
}) {
  const [editing, setEditing] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {editing ? 'Edit Profile' : 'My Profile'}
          </h1>
          <p className="text-gray-500 mt-1">
            {editing ? 'Update your personal information' : 'Your account information'}
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
        {editing ? (
          <ProfileForm
            defaults={profile}
            onCancel={() => setEditing(false)}
            onSaved={() => setEditing(false)}
          />
        ) : (
          <ProfileView profile={profile} />
        )}

        {donor && (
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Donor Location</h3>
            <DonorLocationForm defaultLocation={donor.location} />
          </div>
        )}
      </div>
    </>
  )
}

function ProfileView({ profile }: { profile: ProfileDefaults }) {
  return (
    <dl className="space-y-5">
      <ViewRow label="Full Name" value={profile.full_name || '—'} />
      <ViewRow label="Email" value={profile.email || '—'} />
      <ViewRow
        label="Mobile Number"
        value={
          profile.mobile ? (
            <a
              href={`tel:${profile.mobile}`}
              className="text-red-600 hover:underline"
            >
              {profile.mobile}
            </a>
          ) : (
            <span className="text-gray-400">Not set</span>
          )
        }
      />
      <ViewRow
        label="Location"
        value={profile.location || <span className="text-gray-400">Not set</span>}
      />
    </dl>
  )
}

function ViewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  )
}

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
  onCancel,
  onSaved,
}: {
  defaults: ProfileDefaults
  onCancel?: () => void
  onSaved?: () => void
}) {
  const [state, action] = useActionState<FormState, FormData>(updateProfile, null)

  // When the server action reports success, flip back to view mode. The
  // parent's revalidatePath in the action causes the server to re-render
  // with the new values.
  useEffect(() => {
    if (state?.ok && onSaved) onSaved()
  }, [state, onSaved])

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
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <SaveButton
          pendingText="Saving…"
          className="flex-1 bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Save Changes
        </SaveButton>
      </div>
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
