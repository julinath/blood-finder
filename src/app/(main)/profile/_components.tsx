'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import {
  updateDonorDetails,
  updateProfile,
  type FormState,
} from './actions'
import { DISTRICTS } from '@/lib/districts'
import { SEXES, SEX_LABELS, isSex } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { BD_MOBILE_PATTERN } from '@/lib/validation'
import { Field, FIELD_CLASS } from '@/components/ui/form'
import { formatBnDate } from '@/lib/bn'

type ProfileDefaults = {
  full_name: string
  email: string
  mobile: string
  location: string
  district: string
}

type DonorDefaults = {
  location: string
  district: string
  sex: string
  age: string
  weight_kg: string
  last_donation_date: string
  health_conditions: string
}

export function ProfileSection({ profile }: { profile: ProfileDefaults }) {
  const [editing, setEditing] = useState(false)

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-gray-900">Personal Information</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      <div className="p-6">
        {editing ? (
          <ProfileForm
            defaults={profile}
            onCancel={() => setEditing(false)}
            onSaved={() => setEditing(false)}
          />
        ) : (
          <ProfileView profile={profile} />
        )}
      </div>
    </section>
  )
}

function ProfileView({ profile }: { profile: ProfileDefaults }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
        label="District"
        value={profile.district || <span className="text-gray-400">Not set</span>}
      />
      <ViewRow
        label="Area"
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
      <Field label="Mobile Number" hint="01 দিয়ে শুরু, মোট ১১ সংখ্যা">
        <input
          name="mobile"
          type="tel"
          inputMode="numeric"
          pattern={BD_MOBILE_PATTERN}
          defaultValue={defaults.mobile}
          placeholder="01XXXXXXXXX"
          className={inputClass}
        />
      </Field>
      <Field label="District (জেলা)">
        <select
          name="district"
          defaultValue={defaults.district}
          className={`${inputClass} bg-white`}
        >
          <option value="">জেলা নির্বাচন করুন</option>
          {DISTRICTS.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </Field>
      <Field label="এলাকা / Area">
        <input
          name="location"
          type="text"
          defaultValue={defaults.location}
          placeholder="যেমন: মহাখালী, বনানী"
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

export function DonorDetailsSection({ donor }: { donor: DonorDefaults }) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Donor Details</h3>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-700 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      {editing ? (
        <DonorDetailsForm donor={donor} onDone={() => setEditing(false)} />
      ) : (
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <ViewRow
            label="District"
            value={donor.district || <span className="text-gray-400">Not set</span>}
          />
          <ViewRow
            label="Area"
            value={donor.location || <span className="text-gray-400">Not set</span>}
          />
          <ViewRow
            label="Sex"
            value={
              isSex(donor.sex) ? SEX_LABELS[donor.sex] : (
                <span className="text-gray-400">Not set</span>
              )
            }
          />
          <ViewRow
            label="Age"
            value={donor.age || <span className="text-gray-400">Not set</span>}
          />
          <ViewRow
            label="Weight"
            value={
              donor.weight_kg ? (
                `${donor.weight_kg} kg`
              ) : (
                <span className="text-gray-400">Not set</span>
              )
            }
          />
          <ViewRow
            label="Last Donation"
            value={
              donor.last_donation_date ? (
                formatBnDate(donor.last_donation_date)
              ) : (
                <span className="text-gray-400">Never</span>
              )
            }
          />
          <div className="col-span-2 sm:col-span-3">
            <ViewRow
              label="রোগ / Health Conditions"
              value={
                donor.health_conditions || (
                  <span className="text-gray-400">নেই (None)</span>
                )
              }
            />
          </div>
        </dl>
      )}
    </div>
  )
}

function DonorDetailsForm({
  donor,
  onDone,
}: {
  donor: DonorDefaults
  onDone: () => void
}) {
  const [state, action] = useActionState<FormState, FormData>(
    updateDonorDetails,
    null,
  )

  useEffect(() => {
    if (state?.ok) onDone()
  }, [state, onDone])

  return (
    <form action={action} className="space-y-4">
      <FeedbackBanner state={state} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="District (জেলা)">
          <select
            name="donor_district"
            defaultValue={donor.district}
            required
            className={`${inputClass} bg-white`}
          >
            <option value="">জেলা নির্বাচন করুন</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </Field>
        <Field label="এলাকা / Area">
          <input
            name="donor_location"
            type="text"
            defaultValue={donor.location}
            placeholder="যেমন: মহাখালী, বনানী"
            className={inputClass}
          />
        </Field>
        <Field label="Sex (লিঙ্গ)">
          <select
            name="sex"
            defaultValue={donor.sex}
            required
            className={`${inputClass} bg-white`}
          >
            <option value="">নির্বাচন করুন</option>
            {SEXES.map((sex) => (
              <option key={sex} value={sex}>
                {SEX_LABELS[sex]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Age (বয়স)">
          <input
            name="age"
            type="number"
            required
            min={16}
            max={70}
            inputMode="numeric"
            defaultValue={donor.age}
            className={inputClass}
          />
        </Field>
        <Field label="Weight (ওজন, কেজি)">
          <input
            name="weight_kg"
            type="number"
            required
            min={30}
            max={250}
            inputMode="numeric"
            defaultValue={donor.weight_kg}
            className={inputClass}
          />
        </Field>
        <Field label="Last Donation Date" hint="আগে রক্ত না দিলে খালি রাখুন">
          <input
            name="last_donation_date"
            type="date"
            defaultValue={donor.last_donation_date}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="কোনো রোগ আছে কি?" hint="না থাকলে খালি রাখুন">
        <textarea
          name="health_conditions"
          rows={2}
          maxLength={500}
          defaultValue={donor.health_conditions}
          placeholder="যেমন: ডায়াবেটিস, উচ্চ রক্তচাপ"
          className={inputClass}
        />
      </Field>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onDone}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <SaveButton
          pendingText="Saving…"
          className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          Save Details
        </SaveButton>
      </div>
    </form>
  )
}

export function SignOutButton() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [pending, setPending] = useState(false)

  const handleSignOut = async () => {
    setPending(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      aria-busy={pending}
      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-60 whitespace-nowrap"
    >
      {pending ? 'Signing out…' : 'Sign Out'}
    </button>
  )
}

const inputClass = FIELD_CLASS
