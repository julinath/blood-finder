import Link from 'next/link'
import { BLOOD_TYPES, BLOOD_TYPE_LABELS } from '@/types'

/**
 * Blood-group chips that deep-link into the donor search pre-filtered by type.
 * `DonorSearch` reads the `blood_type` query param and applies it on load.
 */
export default function BloodTypeQuickSearch({
  className = '',
}: {
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-500 mb-2">
        কোন গ্রুপ খুঁজছেন? এক ক্লিকে donor দেখুন —
      </p>
      <div className="flex flex-wrap gap-2">
        {BLOOD_TYPES.map((bt) => (
          <Link
            key={bt}
            href={`/donors?blood_type=${encodeURIComponent(bt)}`}
            className="min-w-11 px-3 py-1.5 rounded-xl border border-red-200 bg-white text-red-600 text-sm font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-sm"
          >
            {BLOOD_TYPE_LABELS[bt]}
          </Link>
        ))}
      </div>
    </div>
  )
}
