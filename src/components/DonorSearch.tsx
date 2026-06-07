'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import BloodTypeBadge from '@/components/BloodTypeBadge'
import {
  BLOOD_TYPES,
  BLOOD_TYPE_LABELS,
  type DonorCard,
} from '@/types'
import { DISTRICTS } from '@/lib/districts'
import { calculateEligibility } from '@/lib/eligibility'

const PREVIEW_LIMIT = 6
const FULL_LIMIT = 60

type Filters = { blood_type: string; district: string; location: string }

const EMPTY_FILTERS: Filters = { blood_type: '', district: '', location: '' }

/** Build a readable place string, avoiding "Dhaka, Dhaka" when area == district. */
function placeOf(donor: DonorCard): string {
  if (donor.district && donor.location && donor.location !== donor.district) {
    return `${donor.location}, ${donor.district}`
  }
  return donor.district || donor.location || '—'
}

export default function DonorSearch({ preview = false }: { preview?: boolean }) {
  const supabase = useMemo(() => createClient(), [])
  const max = preview ? PREVIEW_LIMIT : FULL_LIMIT
  const [donors, setDonors] = useState<DonorCard[]>([])
  // Start in the loading/searched state so the initial fetch (below) renders
  // the skeleton immediately instead of the "enter criteria" placeholder.
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  const search = useCallback(
    async (currentFilters: Filters) => {
      setLoading(true)

      let query = supabase
        .from('donors')
        .select('*, profile:profiles(full_name, location)')
        .eq('is_approved', true)
        .eq('availability_status', 'AVAILABLE')

      if (currentFilters.blood_type) {
        query = query.eq('blood_type', currentFilters.blood_type)
      }
      if (currentFilters.district) {
        query = query.eq('district', currentFilters.district)
      }
      const location = currentFilters.location.trim()
      if (location) query = query.ilike('location', `%${location}%`)

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(max)

      if (error) {
        console.error('[donor-search] query failed:', error.message)
        setDonors([])
      } else {
        setDonors((data ?? []) as unknown as DonorCard[])
      }
      setLoading(false)
    },
    [supabase, max],
  )

  // Auto-load all available donors on first visit. Inlined here (rather than
  // calling `search()`) so the effect itself doesn't synchronously setState.
  useEffect(() => {
    let cancelled = false
    supabase
      .from('donors')
      .select('*, profile:profiles(full_name, location)')
      .eq('is_approved', true)
      .eq('availability_status', 'AVAILABLE')
      .order('created_at', { ascending: false })
      .limit(max)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('[donor-search] initial load failed:', error.message)
          setDonors([])
        } else {
          setDonors((data ?? []) as unknown as DonorCard[])
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [supabase, max])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    search(filters)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-10">
      {/* Search Form — hidden in the home "featured" preview, shown on /donors */}
      {!preview && (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <label className="flex-1">
            <span className="sr-only">Blood type</span>
            <select
              value={filters.blood_type}
              onChange={(e) => setFilters((f) => ({ ...f, blood_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Any Blood Type</option>
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
              onChange={(e) => setFilters((f) => ({ ...f, district: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Any District</option>
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1">
            <span className="sr-only">Area</span>
            <input
              type="text"
              placeholder="এলাকা / Area (e.g. Mohakhali)"
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="bg-red-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors whitespace-nowrap disabled:opacity-60"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>
      )}

      {/* Results */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-5 h-36 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && donors.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No donors found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-1">Try changing your filters.</p>
        </div>
      )}

      {!loading && donors.length > 0 && (
        <div>
          {!preview && (
            <p className="text-sm text-gray-500 mb-4">
              {donors.length === FULL_LIMIT ? `${FULL_LIMIT}+` : donors.length} donor
              {donors.length !== 1 ? 's' : ''} found
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {donors.map((donor) => {
              const eligibility = calculateEligibility(donor.last_donation_date)
              return (
                <Link
                  key={donor.id}
                  href={`/donor/${donor.id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-red-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <BloodTypeBadge bloodType={donor.blood_type} size="md" variant="soft" />
                    {eligibility.isEligible ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                        Available
                      </span>
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                        In {eligibility.daysRemaining}d
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                    {donor.profile?.full_name ?? 'Donor'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{placeOf(donor)}</span>
                  </p>
                  {donor.last_donation_date && (
                    <p className="text-xs text-gray-400 mt-2">
                      Last donated:{' '}
                      {new Date(donor.last_donation_date).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>

          {preview && (
            <div className="text-center mt-8">
              <Link
                href="/donors"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Browse all donors
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
