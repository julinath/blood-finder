'use client'

import { useState, useEffect, Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BloodTypeBadge from '@/components/BloodTypeBadge'
import { type BloodType } from '@/types'
import { MAX_NOTES_LENGTH } from '@/lib/validation'

type DonorPreview = {
  id: string
  blood_type: BloodType
  location: string
  profile: { full_name: string } | null
}

function RequestForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const donorId = searchParams.get('donor')
  const supabase = useMemo(() => createClient(), [])

  const [donor, setDonor] = useState<DonorPreview | null>(null)
  const [donorLoading, setDonorLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (cancelled) return
      if (!auth.user) {
        router.push('/login')
        return
      }

      if (!donorId) {
        setDonorLoading(false)
        return
      }

      const { data } = await supabase
        .from('donors')
        .select('id, blood_type, location, profile:profiles(full_name)')
        .eq('id', donorId)
        .eq('is_approved', true)
        .maybeSingle()

      if (cancelled) return
      setDonor((data as unknown as DonorPreview) ?? null)
      setDonorLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [donorId, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!donorId) {
      setError('No donor selected.')
      return
    }
    if (notes.length > MAX_NOTES_LENGTH) {
      setError(`Notes must be ${MAX_NOTES_LENGTH} characters or fewer.`)
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: existing } = await supabase
      .from('blood_requests')
      .select('id')
      .eq('requester_id', user.id)
      .eq('donor_id', donorId)
      .eq('status', 'PENDING')
      .limit(1)
      .maybeSingle()

    if (existing) {
      setError('You already have a pending request to this donor.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('blood_requests').insert({
      requester_id: user.id,
      donor_id: donorId,
      notes: notes.trim() || null,
      status: 'PENDING',
    })

    if (insertError) {
      setError('Failed to send request. Please try again.')
      setLoading(false)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4" aria-hidden="true">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
        <p className="text-gray-500 mb-6">
          The donor will be notified. You can track the status in your profile.
        </p>
        <button
          onClick={() => router.push('/profile')}
          className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Go to Profile
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Request Blood Donation</h1>
        <p className="text-gray-500 mt-2">Send a donation request to this donor.</p>
      </div>

      {donorLoading ? (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6 animate-pulse h-20" />
      ) : donor ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <BloodTypeBadge bloodType={donor.blood_type} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {donor.profile?.full_name ?? 'Donor'}
            </p>
            <p className="text-sm text-gray-500">{donor.location}</p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-6">
          {donorId ? 'Donor not found or not approved.' : 'No donor selected.'}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3"
            >
              {error}
            </div>
          )}

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1.5">
              Additional Notes (optional)
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              maxLength={MAX_NOTES_LENGTH}
              placeholder="Any medical urgency or details..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
            <span className="block text-xs text-gray-400 mt-1 text-right">
              {notes.length}/{MAX_NOTES_LENGTH}
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !donor}
            aria-busy={loading}
            className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending…' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function RequestPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-400">
          Loading…
        </div>
      }
    >
      <RequestForm />
    </Suspense>
  )
}
