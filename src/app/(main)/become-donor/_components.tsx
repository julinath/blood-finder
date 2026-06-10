'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { registerAsDonor, type FormState } from './actions'
import { BLOOD_TYPES, BLOOD_TYPE_LABELS, SEXES, SEX_LABELS } from '@/types'
import { DISTRICTS } from '@/lib/districts'

type Defaults = {
  full_name: string
  email: string
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
    defaults.full_name || defaults.mobile || defaults.location || defaults.district,
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
            আপনার প্রোফাইল থেকে পূরণ করা হয়েছে — প্রয়োজনে বদলে নিন। এখানে যা
            সেভ করবেন তা প্রোফাইলেও আপডেট হবে।
          </p>
        )}

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name (পুরো নাম)
          </span>
          <input
            name="full_name"
            type="text"
            required
            minLength={2}
            defaultValue={defaults.full_name}
            placeholder="আপনার পুরো নাম"
            className={FIELD_CLASS}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </span>
          <input
            type="email"
            value={defaults.email}
            disabled
            aria-disabled="true"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
          />
          <span className="block text-xs text-gray-400 mt-1">
            আপনার অ্যাকাউন্টের ইমেইল — পরিবর্তন করা যায় না।
          </span>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            Blood Group (রক্তের গ্রুপ)
          </span>
          <select
            name="blood_type"
            required
            defaultValue=""
            className={`${FIELD_CLASS} bg-white`}
          >
            <option value="">Select blood group</option>
            {BLOOD_TYPES.map((bt) => (
              <option key={bt} value={bt}>
                {BLOOD_TYPE_LABELS[bt]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            Last Donation Date (শেষ রক্তদানের তারিখ){' '}
            <span className="text-gray-400">(optional)</span>
          </span>
          <input
            name="last_donation_date"
            type="date"
            className={FIELD_CLASS}
          />
          <span className="block text-xs text-gray-400 mt-1">
            আগে কখনো রক্ত না দিয়ে থাকলে খালি রাখুন।
          </span>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            Mobile Number (মোবাইল নম্বর)
          </span>
          <input
            name="mobile"
            type="tel"
            inputMode="numeric"
            required
            pattern="01[3-9][0-9]{8}"
            defaultValue={defaults.mobile}
            placeholder="01XXXXXXXXX"
            className={FIELD_CLASS}
          />
          <span className="block text-xs text-gray-400 mt-1">
            আবশ্যক — রক্তের প্রয়োজনে রোগীরা এই নম্বরে যোগাযোগ করবে। 11 digits
            starting with 01.
          </span>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              Sex (লিঙ্গ)
            </span>
            <select
              name="sex"
              required
              defaultValue=""
              className={`${FIELD_CLASS} bg-white`}
            >
              <option value="">নির্বাচন করুন</option>
              {SEXES.map((sex) => (
                <option key={sex} value={sex}>
                  {SEX_LABELS[sex]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              Age (বয়স)
            </span>
            <input
              name="age"
              type="number"
              required
              min={16}
              max={70}
              inputMode="numeric"
              placeholder="যেমন: 25"
              className={FIELD_CLASS}
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              Weight (ওজন, কেজি)
            </span>
            <input
              name="weight_kg"
              type="number"
              required
              min={30}
              max={250}
              inputMode="numeric"
              placeholder="যেমন: 60"
              className={FIELD_CLASS}
            />
          </label>
        </div>

        <p className="text-xs text-gray-400 -mt-2">
          রক্তদানের যোগ্যতা: বয়স ১৮–৬৫ ও ওজন কমপক্ষে ৪৫ কেজি। এর বাইরে হলেও
          আবেদন জমা দিতে পারবেন — admin যাচাই করে সিদ্ধান্ত নেবেন।
        </p>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            কোনো রোগ আছে কি?{' '}
            <span className="text-gray-400">(optional)</span>
          </span>
          <textarea
            name="health_conditions"
            rows={2}
            maxLength={500}
            placeholder="যেমন: ডায়াবেটিস, উচ্চ রক্তচাপ — কোনো রোগ না থাকলে খালি রাখুন"
            className={FIELD_CLASS}
          />
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
