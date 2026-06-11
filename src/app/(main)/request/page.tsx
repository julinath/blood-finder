import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BloodTypeBadge from '@/components/BloodTypeBadge'
import { calculateEligibility } from '@/lib/eligibility'
import type { BloodType } from '@/types'
import { RequestForm } from './_components'

type DonorPreview = {
  id: string
  user_id: string
  blood_type: BloodType
  location: string
  availability_status: string
  last_donation_date: string | null
  profile: { full_name: string } | null
}

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ donor?: string }>
}) {
  const { donor: donorId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let donor: DonorPreview | null = null
  if (donorId) {
    const { data } = await supabase
      .from('donors')
      .select(
        'id, user_id, blood_type, location, availability_status, last_donation_date, profile:profiles(full_name)',
      )
      .eq('id', donorId)
      .eq('is_approved', true)
      .maybeSingle()
    donor = (data as unknown as DonorPreview) ?? null
  }

  // Same rules the server action enforces — surfaced up front so the user
  // isn't invited to submit a request that will be rejected.
  let blocker: string | null = null
  if (donor) {
    if (donor.user_id === user.id) {
      blocker = 'এটি আপনার নিজের রক্তদাতা প্রোফাইল — নিজের কাছে রিকোয়েস্ট পাঠানো যায় না।'
    } else if (donor.availability_status !== 'AVAILABLE') {
      blocker = 'এই রক্তদাতা এই মুহূর্তে Available নন।'
    } else {
      const eligibility = calculateEligibility(donor.last_donation_date)
      if (!eligibility.isEligible) {
        blocker = `শেষ রক্তদানের পর ৯০ দিন পূর্ণ হয়নি — ইনি আরো ${eligibility.daysRemaining} দিন পরে রক্ত দিতে পারবেন।`
      }
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Request Blood Donation</h1>
        <p className="text-gray-500 mt-2">
          রক্তদাতার কাছে রক্তদানের অনুরোধ পাঠান — রাজি হলে প্রোফাইলে জানতে পারবেন।
        </p>
      </div>

      {donor ? (
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
          {donorId
            ? 'রক্তদাতাকে খুঁজে পাওয়া যায়নি বা এখনো অনুমোদিত নন।'
            : 'কোনো রক্তদাতা নির্বাচন করা হয়নি — আগে রক্তদাতা খুঁজুন।'}
        </div>
      )}

      {blocker && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-6">
          {blocker}
        </div>
      )}

      <RequestForm donorId={donor?.id ?? null} disabled={!donor || Boolean(blocker)} />
    </div>
  )
}
