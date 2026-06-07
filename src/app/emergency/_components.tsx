'use client'

import { useEffect, useMemo, useState } from 'react'
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

// Explicit column list — `contact_phone` lives in a separate, RLS-protected table.
const FEED_COLUMNS =
  'id, requester_id, requester_name, patient_problem, blood_type, units_needed, hemoglobin, needed_on, district, hospital, urgency, status, created_at'

const FEED_LIMIT = 60

/** Bangladesh local number (01XXXXXXXXX) → WhatsApp international (8801XXXXXXXXX). */
function toWhatsApp(phone: string): string {
  return '880' + phone.replace(/^0/, '')
}

export default function EmergencyFeed() {
  const supabase = useMemo(() => createClient(), [])
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [filters, setFilters] = useState({ blood_type: '', district: '' })
  // request_id -> revealed contact phone, for requests this viewer already offered on.
  const [revealed, setRevealed] = useState<Record<string, string>>({})

  // Identify the viewer and prefill the district filter from their profile
  // ("আমার এলাকা") so donors immediately see needs near them. setState only
  // happens in the async resolution (never synchronously in the effect body).
  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) return
      const user = data.user
      setUserId(user?.id ?? null)
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('district')
        .eq('id', user.id)
        .maybeSingle()
      // Don't clobber a district the visitor already chose manually.
      if (!cancelled && profile?.district) {
        setFilters((f) => (f.district ? f : { ...f, district: profile.district as string }))
      }
    })
    return () => {
      cancelled = true
    }
  }, [supabase])

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

  // Seed already-offered cards with their revealed contact so the reveal
  // persists across reloads (RLS lets a prior offerer read the contact while
  // the request is OPEN). setState only happens in the async resolution.
  useEffect(() => {
    if (!userId || requests.length === 0) return
    let cancelled = false
    const ids = requests.map((r) => r.id)
    ;(async () => {
      const { data: offers } = await supabase
        .from('emergency_offers')
        .select('request_id')
        .eq('donor_id', userId)
        .in('request_id', ids)
      const offeredIds = (offers ?? []).map((o) => o.request_id as string)
      if (offeredIds.length === 0) {
        if (!cancelled) setRevealed({})
        return
      }
      const { data: contacts } = await supabase
        .from('emergency_contacts')
        .select('request_id, contact_phone')
        .in('request_id', offeredIds)
      if (cancelled) return
      const map: Record<string, string> = {}
      for (const c of contacts ?? []) {
        map[c.request_id as string] = c.contact_phone as string
      }
      setRevealed(map)
    })()
    return () => {
      cancelled = true
    }
  }, [supabase, userId, requests])

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
          <p className="text-gray-400 text-lg">
            এই মুহূর্তে কোনো জরুরি রিকোয়েস্ট নেই।
          </p>
          <p className="text-gray-400 text-sm mt-1">
            ফিল্টার পরিবর্তন করে আবার দেখুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              isOwn={request.requester_id === userId}
              revealedPhone={revealed[request.id] ?? null}
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
  revealedPhone,
}: {
  request: EmergencyRequest
  isOwn: boolean
  revealedPhone: string | null
}) {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [phone, setPhone] = useState<string | null>(null)
  const [offering, setOffering] = useState(false)
  const [error, setError] = useState('')

  // Phone from this session's tap, or seeded from a prior offer (persists reload).
  const effectivePhone = phone ?? revealedPhone

  const handleOffer = async () => {
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    setOffering(true)

    // Record the offer (idempotent — ignore the unique-violation on re-click).
    const { error: offerError } = await supabase
      .from('emergency_offers')
      .insert({ request_id: request.id, donor_id: user.id })
    if (offerError && offerError.code !== '23505') {
      console.error('[emergency-offer] failed:', offerError.message)
      setError('আবার চেষ্টা করুন।')
      setOffering(false)
      return
    }

    // Now that an offer exists, RLS lets us read the contact number.
    const { data: contact, error: contactError } = await supabase
      .from('emergency_contacts')
      .select('contact_phone')
      .eq('request_id', request.id)
      .maybeSingle()

    if (contactError || !contact) {
      console.error('[emergency-offer] contact read failed:', contactError?.message)
      setError('যোগাযোগের নম্বর পাওয়া যায়নি।')
      setOffering(false)
      return
    }

    setPhone(contact.contact_phone)
    setOffering(false)
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
        ) : effectivePhone ? (
          <div className="space-y-2">
            <a
              href={`tel:${effectivePhone}`}
              className="flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              📞 {effectivePhone}
            </a>
            <a
              href={`https://wa.me/${toWhatsApp(effectivePhone)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              WhatsApp এ যোগাযোগ করুন
            </a>
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
        {error && (
          <p className="text-xs text-red-600 mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
