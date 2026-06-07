'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createEmergencyRequest, type FormState } from './actions'
import { BLOOD_TYPES, BLOOD_TYPE_LABELS } from '@/types'
import { DISTRICTS } from '@/lib/districts'

type Defaults = {
  district: string
  contact_phone: string
}

const FIELD_CLASS =
  'w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'

export default function NewEmergencyForm({ defaults }: { defaults: Defaults }) {
  const [state, action] = useActionState<FormState, FormData>(
    createEmergencyRequest,
    null,
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <form action={action} className="space-y-5" noValidate>
        {state && !state.ok && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3"
          >
            {state.message}
          </div>
        )}

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            রোগীর সমস্যা / অপারেশন
          </span>
          <input
            name="patient_problem"
            type="text"
            required
            placeholder="যেমন: টিউমার অপারেশন, ডেলিভারি, থ্যালাসেমিয়া"
            className={FIELD_CLASS}
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              Blood Group
            </span>
            <select
              name="blood_type"
              required
              defaultValue=""
              className={`${FIELD_CLASS} bg-white`}
            >
              <option value="">নির্বাচন করুন</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {BLOOD_TYPE_LABELS[bt]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              কত ব্যাগ লাগবে
            </span>
            <input
              name="units_needed"
              type="number"
              min={1}
              max={20}
              defaultValue={1}
              required
              className={FIELD_CLASS}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              হিমোগ্লোবিন <span className="text-gray-400">(optional)</span>
            </span>
            <input
              name="hemoglobin"
              type="number"
              step="0.1"
              min={1}
              max={25}
              placeholder="যেমন 8.5"
              className={FIELD_CLASS}
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              কবে লাগবে <span className="text-gray-400">(optional)</span>
            </span>
            <input name="needed_on" type="date" className={FIELD_CLASS} />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              Urgency
            </span>
            <select
              name="urgency"
              defaultValue="URGENT"
              className={`${FIELD_CLASS} bg-white`}
            >
              <option value="URGENT">জরুরি (এখনই)</option>
              <option value="HIGH">দ্রুত</option>
              <option value="NORMAL">সাধারণ</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            হাসপাতাল / স্থান
          </span>
          <input
            name="hospital"
            type="text"
            required
            placeholder="যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল, মহাখালী"
            className={FIELD_CLASS}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1.5">
            যোগাযোগ মোবাইল
          </span>
          <input
            name="contact_phone"
            type="tel"
            inputMode="numeric"
            required
            defaultValue={defaults.contact_phone}
            placeholder="01XXXXXXXXX"
            className={FIELD_CLASS}
          />
          <span className="block text-xs text-gray-400 mt-1">
            যে donor সাহায্য করতে চাইবে শুধু সে-ই এই নম্বর দেখতে পাবে।
          </span>
        </label>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
          ⚠️ নিরাপত্তার জন্য: donor কে সরাসরি হাসপাতালের কেবিন/ওয়ার্ডে আসতে বলুন।
          কখনো টাকার বিনিময়ে রক্ত চাইবেন না — এটি বেআইনি।
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
      {pending ? 'পোস্ট হচ্ছে…' : 'রিকোয়েস্ট পোস্ট করুন'}
    </button>
  )
}
