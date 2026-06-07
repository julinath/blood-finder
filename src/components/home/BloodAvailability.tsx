import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  BLOOD_TYPES,
  BLOOD_TYPE_LABELS,
  isBloodType,
  type BloodType,
} from '@/types'
import { toBnDigits } from '@/lib/bn'
import SectionHeading from './SectionHeading'
import CountUp from '@/components/ui/CountUp'
import Reveal from '@/components/ui/Reveal'

function emptyCounts(): Record<BloodType, number> {
  return BLOOD_TYPES.reduce(
    (acc, bt) => {
      acc[bt] = 0
      return acc
    },
    {} as Record<BloodType, number>,
  )
}

/**
 * Live "who's available right now" board — one card per blood group showing the
 * count of approved + available donors. Cards deep-link into the filtered donor
 * search; empty groups nudge the visitor to become the first donor.
 */
export default async function BloodAvailability() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('donors')
    .select('blood_type')
    .eq('is_approved', true)
    .eq('availability_status', 'AVAILABLE')

  const counts = emptyCounts()
  if (!error && data) {
    for (const row of data) {
      if (isBloodType(row.blood_type)) counts[row.blood_type] += 1
    }
  }

  const total = BLOOD_TYPES.reduce((sum, bt) => sum + counts[bt], 0)
  const max = Math.max(1, ...BLOOD_TYPES.map((bt) => counts[bt]))

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <SectionHeading
        eyebrow="Browse donors"
        title="রক্তের গ্রুপ অনুযায়ী donor"
        subtitle={
          <>
            এই মুহূর্তে{' '}
            <strong className="text-red-600">{toBnDigits(total)} জন</strong> donor
            available। আপনার গ্রুপে ক্লিক করে সরাসরি তালিকা দেখুন।
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {BLOOD_TYPES.map((bt, i) => {
          const count = counts[bt]
          const has = count > 0
          const pct = has ? Math.max(8, Math.round((count / max) * 100)) : 0
          const href = has
            ? `/donors?blood_type=${encodeURIComponent(bt)}`
            : '/become-donor'

          return (
            <Reveal key={bt} delay={i * 60}>
              <Link
                href={href}
                className="group block h-full bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-red-200 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-600 text-lg font-bold group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {BLOOD_TYPE_LABELS[bt]}
                  </span>
                  <div className="text-right leading-none">
                    <p className="text-2xl font-bold text-gray-900">
                      <CountUp value={count} />
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">জন</p>
                  </div>
                </div>

                {/* heat bar */}
                <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p
                  className={`mt-3 text-xs font-medium flex items-center gap-1 ${
                    has ? 'text-green-600' : 'text-amber-600'
                  }`}
                >
                  {has ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                      Available এখন
                    </>
                  ) : (
                    'এখন কেউ নেই — আপনি হোন'
                  )}
                  <span
                    aria-hidden="true"
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    →
                  </span>
                </p>
              </Link>
            </Reveal>
          )
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/donors"
          className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          সব donor দেখুন
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
