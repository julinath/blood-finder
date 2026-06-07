import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BloodTypeBadge from '@/components/BloodTypeBadge'
import { BLOOD_TYPE_LABELS, type DonorWithProfile } from '@/types'
import { calculateEligibility } from '@/lib/eligibility'

export default async function DonorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('donors')
    .select('*, profile:profiles(full_name, email, mobile, location)')
    .eq('id', id)
    .eq('is_approved', true)
    .maybeSingle()

  if (!data) notFound()
  const donor = data as unknown as DonorWithProfile

  const { data: { user } } = await supabase.auth.getUser()

  const eligibility = calculateEligibility(donor.last_donation_date)
  const lastDonationLabel = donor.last_donation_date
    ? new Date(donor.last_donation_date).toLocaleDateString()
    : 'Never'

  // Readable place, avoiding "Dhaka, Dhaka" when the area equals the district.
  const place =
    donor.district && donor.location && donor.location !== donor.district
      ? `${donor.location}, ${donor.district}`
      : donor.district || donor.location

  const canRequest =
    donor.availability_status === 'AVAILABLE' && eligibility.isEligible

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to search
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 px-8 py-10 text-white">
          <div className="flex items-center gap-5">
            <BloodTypeBadge bloodType={donor.blood_type} size="xl" variant="translucent" />
            <div>
              <h1 className="text-2xl font-bold">
                {donor.profile?.full_name ?? 'Donor'}
              </h1>
              <p className="text-red-100 mt-0.5 flex items-center gap-1.5 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {place}
              </p>
              <div className="mt-2">
                {canRequest ? (
                  <span className="text-xs bg-green-400/30 text-white px-2.5 py-1 rounded-full">
                    Available
                  </span>
                ) : (
                  <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full">
                    {donor.availability_status === 'UNAVAILABLE'
                      ? 'Unavailable'
                      : 'Not yet eligible'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-8 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoTile label="Blood Type" value={BLOOD_TYPE_LABELS[donor.blood_type]} />
            <InfoTile label="District" value={donor.district ?? donor.location} />
            <InfoTile label="Last Donated" value={lastDonationLabel} />
            <InfoTile
              label="Eligibility"
              value={
                eligibility.isEligible
                  ? 'Eligible to donate'
                  : `Eligible in ${eligibility.daysRemaining} day${eligibility.daysRemaining === 1 ? '' : 's'}`
              }
              valueClass={eligibility.isEligible ? 'text-green-600' : 'text-orange-500'}
            />
          </div>

          {/* Contact */}
          {user && donor.profile?.mobile && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <h3 className="font-medium text-gray-700 text-sm">Contact Info</h3>
              <a
                href={`tel:${donor.profile.mobile}`}
                className="flex items-center gap-3 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {donor.profile.mobile}
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-gray-100 pt-4">
            {user ? (
              canRequest ? (
                <Link
                  href={`/request?donor=${donor.id}`}
                  className="w-full block text-center bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Request Blood Donation
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl text-sm font-semibold cursor-not-allowed"
                >
                  {donor.availability_status === 'UNAVAILABLE'
                    ? 'Donor Not Available'
                    : `Eligible in ${'daysRemaining' in eligibility ? eligibility.daysRemaining : 0} day${
                        'daysRemaining' in eligibility && eligibility.daysRemaining === 1 ? '' : 's'
                      }`}
                </button>
              )
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Login to contact this donor or send a request.
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Login to Request
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoTile({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-semibold text-gray-900 ${valueClass ?? ''}`}>{value}</p>
    </div>
  )
}
