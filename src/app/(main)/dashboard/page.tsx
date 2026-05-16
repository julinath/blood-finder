import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BloodTypeBadge from '@/components/BloodTypeBadge'
import StatusBadge from '@/components/StatusBadge'
import {
  BLOOD_TYPE_LABELS,
  type Donor,
  type DonationHistoryRecord,
  type ReceivedRequest,
  type SentRequest,
} from '@/types'
import {
  AvailabilityToggle,
  CancelRequestButton,
  RequestActions,
} from './_components'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, donorRes, sentRequestsRes] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    supabase.from('donors').select('*').eq('user_id', user.id).maybeSingle(),
    supabase
      .from('blood_requests')
      .select('*, donor:donors(blood_type, location, profile:profiles(full_name))')
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const profile = profileRes.data
  const donor = donorRes.data as Donor | null
  const sentRequests = (sentRequestsRes.data ?? []) as SentRequest[]

  let receivedRequests: ReceivedRequest[] = []
  let donationHistory: DonationHistoryRecord[] = []

  if (donor) {
    const [received, history] = await Promise.all([
      supabase
        .from('blood_requests')
        .select('*, requester:profiles(full_name, mobile)')
        .eq('donor_id', donor.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('donation_records')
        .select('*, requester:profiles(full_name)')
        .eq('donor_id', donor.id)
        .order('donation_date', { ascending: false }),
    ])
    receivedRequests = (received.data ?? []) as ReceivedRequest[]
    donationHistory = (history.data ?? []) as DonationHistoryRecord[]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
          </p>
        </div>
        {!donor && (
          <Link
            href="/become-donor"
            className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Become a Donor
          </Link>
        )}
      </div>

      {/* Donor Status Card */}
      {donor && (
        <div
          className={`rounded-2xl border p-6 mb-8 ${
            donor.is_approved
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <BloodTypeBadge bloodType={donor.blood_type} size="lg" />
              <div>
                <p className="font-semibold text-gray-900">Your Donor Profile</p>
                <p className="text-sm text-gray-500">{donor.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  donor.is_approved
                    ? 'bg-green-200 text-green-800'
                    : 'bg-amber-200 text-amber-800'
                }`}
              >
                {donor.is_approved ? 'Approved' : 'Pending Approval'}
              </span>
              {donor.is_approved && (
                <AvailabilityToggle
                  donorId={donor.id}
                  currentStatus={donor.availability_status}
                />
              )}
            </div>
          </div>
          {!donor.is_approved && (
            <p className="text-sm text-amber-700 mt-4 bg-amber-100 rounded-xl px-4 py-2.5">
              Your donor profile is under review. It will appear in search results
              once approved by an admin.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sent Requests */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Requests I Sent</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {sentRequests.length === 0 ? (
              <EmptyState text="No requests sent yet." />
            ) : (
              sentRequests.map((req) => (
                <div key={req.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {req.donor?.profile?.full_name ?? 'Donor'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {req.donor?.blood_type
                          ? BLOOD_TYPE_LABELS[req.donor.blood_type]
                          : ''}
                        {req.donor?.location ? ` · ${req.donor.location}` : ''}
                      </p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  {req.notes && (
                    <p className="text-xs text-gray-500 italic mt-2">{req.notes}</p>
                  )}
                  {req.status === 'PENDING' && (
                    <CancelRequestButton requestId={req.id} />
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Received Requests (donor only) */}
        {donor && (
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Requests I Received</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {receivedRequests.length === 0 ? (
                <EmptyState text="No requests received yet." />
              ) : (
                receivedRequests.map((req) => (
                  <div key={req.id} className="px-6 py-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {req.requester?.full_name ?? 'User'}
                        </p>
                        {req.requester?.mobile && (
                          <a
                            href={`tel:${req.requester.mobile}`}
                            className="text-xs text-red-600 hover:underline"
                          >
                            {req.requester.mobile}
                          </a>
                        )}
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    {req.notes && (
                      <p className="text-xs text-gray-500 italic mb-2">{req.notes}</p>
                    )}
                    {req.status === 'PENDING' && (
                      <RequestActions requestId={req.id} donorId={donor.id} />
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>

      {/* Donation History */}
      {donor && donationHistory.length > 0 && (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Donation History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {donationHistory.map((record) => (
              <div
                key={record.id}
                className="px-6 py-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Donated to {record.requester?.full_name ?? 'User'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(record.donation_date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="px-6 py-8 text-sm text-gray-400 text-center">{text}</p>
}
