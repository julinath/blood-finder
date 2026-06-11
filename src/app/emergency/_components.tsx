'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  BLOOD_TYPES,
  BLOOD_TYPE_LABELS,
  URGENCY_LABELS,
  URGENCY_STYLES,
  type EmergencyRequest,
} from '@/types'
import { DISTRICTS } from '@/lib/districts'
import { formatBnDate, toBnDigits } from '@/lib/bn'
import { offerHelp } from './offer-actions'

// Explicit column list — `contact_phone` lives in a separate, RLS-protected table.
const FEED_COLUMNS =
  'id, requester_id, requester_name, patient_problem, blood_type, units_needed, hemoglobin, needed_on, district, hospital, urgency, status, created_at'

const FEED_LIMIT = 60

// Viewer context (id, filter prefills from their donor record + profile, and
// which requests they already offered on) arrives from the SERVER page — the
// browser can't always read the auth cookie, the server always can. An A+
// donor in Dhaka first wants the requests they can actually help with; manual
// filter changes are never clobbered, and the empty state offers a one-tap
// reset to the full board.
export default function EmergencyFeed({
  viewerId,
  initialFilters,
  offeredRequestIds,
}: {
  viewerId: string | null
  initialFilters: { blood_type: string; district: string }
  offeredRequestIds: string[]
}) {
  const supabase = useMemo(() => createClient(), [])
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(initialFilters)
  const offeredIds = useMemo(() => new Set(offeredRequestIds), [offeredRequestIds])

  // Refetch whenever the filters change. Mirrors DonorSearch: the query is built
  // synchronously but state is set only inside the promise resolution.
  useEffect(() => {
    let cancelled = false
    let query = supabase
      .from('emergency_requests')
      .select(FEED_COLUMNS)
      .eq('status', 'OPEN')
    if (filters.blood_type) query = query.eq('blood_type', filters.blood_type)
    if (filters.district) query = query.eq('district', filters.district)

    query
      .order('created_at', { ascending: false })
      .limit(FEED_LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('[emergency-feed] load failed:', error.message)
          setRequests([])
        } else {
          setRequests((data ?? []) as unknown as EmergencyRequest[])
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [supabase, filters.blood_type, filters.district])

  // Filter changes happen in event handlers, where flipping the loading skeleton
  // on is allowed (unlike inside an effect body).
  const handleBloodType = (value: string) => {
    setLoading(true)
    setFilters((f) => ({ ...f, blood_type: value }))
  }
  const handleDistrict = (value: string) => {
    setLoading(true)
    setFilters((f) => ({ ...f, district: value }))
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex-1">
            <span className="sr-only">Blood group</span>
            <select
              value={filters.blood_type}
              onChange={(e) => handleBloodType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">সব Blood Group</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {BLOOD_TYPE_LABELS[bt]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1">
            <span className="sr-only">District</span>
            <select
              value={filters.district}
              onChange={(e) => handleDistrict(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">সব District</option>
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-5 h-56 animate-pulse"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            এই মুহূর্তে কোনো জরুরি রিকোয়েস্ট নেই।
          </p>
          {filters.blood_type || filters.district ? (
            // The district auto-prefills from the viewer's profile, so an
            // empty local feed needs a one-tap way out to the full board.
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                setFilters({ blood_type: '', district: '' })
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:underline"
            >
              ফিল্টার মুছে সব জেলার রিকোয়েস্ট দেখুন →
            </button>
          ) : (
            <p className="text-gray-400 text-sm mt-1">
              কারো রক্ত লাগলে উপরের “রক্তের রিকোয়েস্ট দিন” বাটন থেকে পোস্ট করুন।
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              isOwn={request.requester_id === viewerId}
              alreadyOffered={offeredIds.has(request.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function RequestCard({
  request,
  isOwn,
  alreadyOffered,
}: {
  request: EmergencyRequest
  isOwn: boolean
  alreadyOffered: boolean
}) {
  const router = useRouter()
  const [offeredNow, setOfferedNow] = useState(false)
  const [offering, setOffering] = useState(false)
  const [error, setError] = useState('')
  const [needsMobile, setNeedsMobile] = useState(false)

  const offered = offeredNow || alreadyOffered

  // The offer is recorded by a server action (cookie-authenticated on the
  // server), so it works even when the browser can't read the auth cookie.
  const handleOffer = async () => {
    setError('')
    setNeedsMobile(false)
    setOffering(true)

    const result = await offerHelp(request.id)
    setOffering(false)

    if (result.ok) {
      setOfferedNow(true)
      return
    }
    if (result.code === 'auth') {
      router.push('/login')
    } else if (result.code === 'needs-mobile') {
      setNeedsMobile(true)
    } else {
      setError(
        result.code === 'closed'
          ? 'রিকোয়েস্টটি ইতিমধ্যে বন্ধ হয়ে গেছে — পেজটি রিফ্রেশ করুন।'
          : 'সাড়া পাঠানো যায়নি। আবার চেষ্টা করুন।',
      )
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex flex-col">
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

      <h3 className="text-lg font-bold text-gray-900 mb-3">
        {request.patient_problem}
      </h3>

      <div className="space-y-1.5 text-sm text-gray-600 mb-4">
        <div className="flex flex-wrap justify-between gap-x-3">
          {request.hemoglobin != null && (
            <span>
              হিমোগ্লোবিন:{' '}
              <strong className="text-gray-800">
                {toBnDigits(request.hemoglobin)}
              </strong>
            </span>
          )}
          <span className={request.hemoglobin != null ? '' : 'ml-auto'}>
            প্রয়োজন:{' '}
            <strong className="text-gray-800">
              {toBnDigits(request.units_needed)} ব্যাগ
            </strong>
          </span>
        </div>
        {request.needed_on && (
          <div>
            তারিখ:{' '}
            <strong className="text-gray-800">
              {formatBnDate(request.needed_on)}
            </strong>
          </div>
        )}
        <div>
          স্থান:{' '}
          <strong className="text-gray-800">
            {request.hospital}, {request.district}
          </strong>
        </div>
        <div>
          রিকোয়েস্ট দিয়েছেন:{' '}
          <strong className="text-gray-800">{request.requester_name}</strong>
        </div>
      </div>

      <div className="mt-auto">
        {isOwn ? (
          <span className="block text-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl py-2.5">
            আপনার দেওয়া রিকোয়েস্ট
          </span>
        ) : offered ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
            <p className="text-sm font-semibold text-green-700">
              ✅ ধন্যবাদ! আপনার সাড়া পৌঁছে গেছে।
            </p>
            <p className="text-xs text-green-600 mt-1">
              রিকোয়েস্টকারী আপনার নম্বর দেখতে পাবেন এবং প্রয়োজনে আপনাকে কল
              করবেন।
            </p>
          </div>
        ) : (
          <button
            onClick={handleOffer}
            disabled={offering}
            aria-busy={offering}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {offering ? 'অপেক্ষা করুন…' : '🩸 আমি রক্ত দিতে পারবো'}
          </button>
        )}
        {needsMobile && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2 text-center">
            সাড়া দিতে আগে আপনার মোবাইল নম্বর দরকার —{' '}
            <Link href="/profile" className="font-semibold underline">
              প্রোফাইলে নম্বর যোগ করুন
            </Link>
          </p>
        )}
        {error && (
          <p className="text-xs text-red-600 mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
