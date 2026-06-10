import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  BLOOD_TYPE_LABELS,
  URGENCY_LABELS,
  URGENCY_STYLES,
  type EmergencyRequest,
} from '@/types'
import { toBnDigits } from '@/lib/bn'
import SectionHeading from './SectionHeading'
import Reveal from '@/components/ui/Reveal'

const PREVIEW_COLUMNS =
  'id, requester_name, patient_problem, blood_type, units_needed, hemoglobin, needed_on, district, hospital, urgency, status, created_at'

const PREVIEW_LIMIT = 3

export default async function EmergencyPreview() {
  const supabase = await createClient()

  // Gracefully degrades to the empty state if the migration hasn't run yet —
  // but never silently: keep the error visible in the server logs.
  const { data, error } = await supabase
    .from('emergency_requests')
    .select(PREVIEW_COLUMNS)
    .eq('status', 'OPEN')
    .order('created_at', { ascending: false })
    .limit(PREVIEW_LIMIT)

  if (error) {
    console.error('[EmergencyPreview] failed to load emergency requests:', error)
  }

  const requests = (error ? [] : (data ?? [])) as unknown as EmergencyRequest[]

  return (
    <section className="max-w-6xl mx-auto px-4 pt-16 pb-2">
      <SectionHeading
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
            </span>
            Live · Emergency
          </span>
        }
        title="ইমার্জেন্সি রক্তের রিকোয়েস্ট"
        subtitle="এই মুহূর্তে যেসব রোগী জরুরি রক্তের জন্য অপেক্ষা করছেন।"
        className="mb-6"
      />

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">এই মুহূর্তে কোনো জরুরি রিকোয়েস্ট নেই।</p>
          <Link
            href="/emergency/new"
            className="inline-block mt-4 bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            রক্তের রিকোয়েস্ট দিন
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {requests.map((request, i) => (
              <Reveal key={request.id} delay={i * 100}>
                <Link
                  href="/emergency"
                  className="relative bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-red-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all block h-full"
                >
                  {/* soft "live" pulse — opacity-only, removed under reduced motion */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-red-400/35 opacity-0 animate-live-ring"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${URGENCY_STYLES[request.urgency]}`}
                    >
                      {URGENCY_LABELS[request.urgency]}
                    </span>
                    <span className="text-xl font-extrabold text-red-600">
                      {BLOOD_TYPE_LABELS[request.blood_type]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {request.patient_problem}
                  </h3>
                  <p className="text-sm text-gray-600">
                    প্রয়োজন:{' '}
                    <strong className="text-gray-800">
                      {toBnDigits(request.units_needed)} ব্যাগ
                    </strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    স্থান:{' '}
                    <strong className="text-gray-800">
                      {request.hospital}, {request.district}
                    </strong>
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/emergency"
              className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              সব রিকোয়েস্ট দেখুন
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
