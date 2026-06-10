import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BloodTypeBadge from '@/components/BloodTypeBadge'
import StatusBadge from '@/components/StatusBadge'
import {
  BLOOD_TYPE_LABELS,
  EMERGENCY_STATUS_STYLES,
  REPORT_REASON_LABELS,
  SEX_LABELS,
  type AdminReport,
  type AdminRequest,
  type AdminUser,
  type EmergencyRequest,
  type PendingDonor,
} from '@/types'
import { checkDonorFitness } from '@/lib/eligibility'
import {
  AdminCancelRequestButton,
  AdminEmergencyActions,
  ApprovedDonorActions,
  DeleteUserButton,
  DonorApprovalActions,
  ResolveReportButton,
  UserAdminToggle,
} from './_components'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile?.is_admin) redirect('/profile')

  const [
    pendingDonorsRes,
    approvedDonorsRes,
    allRequestsRes,
    allUsersRes,
    reportsRes,
    emergenciesRes,
  ] = await Promise.all([
      supabase
        .from('donors')
        .select('*, profile:profiles(full_name, email, mobile)')
        .eq('is_approved', false)
        .order('created_at', { ascending: false }),
      supabase
        .from('donors')
        .select('*, profile:profiles(full_name, email, mobile)')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('blood_requests')
        .select(
          '*, requester:profiles(full_name), donor:donors(blood_type, location, profile:profiles(full_name))'
        )
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('profiles')
        .select('id, full_name, email, is_admin, created_at')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('reports')
        .select(
          'id, reason, details, status, created_at, reporter:profiles!reports_reporter_id_fkey(full_name), reported:profiles!reports_reported_user_id_fkey(full_name), request:emergency_requests!reports_request_id_fkey(patient_problem, blood_type)'
        )
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('emergency_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20),
    ])

  const pendingDonors = (pendingDonorsRes.data ?? []) as PendingDonor[]
  const approvedDonors = (approvedDonorsRes.data ?? []) as PendingDonor[]
  const allRequests = (allRequestsRes.data ?? []) as AdminRequest[]
  const allUsers = (allUsersRes.data ?? []) as AdminUser[]
  const reports = (reportsRes.data ?? []) as unknown as AdminReport[]
  const emergencies = (emergenciesRes.data ?? []) as EmergencyRequest[]
  const openEmergencies = emergencies.filter((r) => r.status === 'OPEN').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage donors, requests, and users.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending Donors" value={pendingDonors.length} accent="amber" />
        <StatCard label="Open Emergencies" value={openEmergencies} accent="red" />
        <StatCard label="Recent Requests" value={allRequests.length} accent="blue" />
        <StatCard label="Total Users" value={allUsers.length} accent="green" />
      </div>

      {/* Pending Donors */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Pending Donor Approvals</h2>
        </div>
        {pendingDonors.length === 0 ? (
          <Empty text="No pending approvals." />
        ) : (
          <div className="divide-y divide-gray-50">
            {pendingDonors.map((donor) => {
              const fitness = checkDonorFitness({
                age: donor.age,
                weight_kg: donor.weight_kg,
                last_donation_date: donor.last_donation_date,
              })
              return (
                <div key={donor.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4 min-w-0">
                      <BloodTypeBadge bloodType={donor.blood_type} size="sm" variant="soft" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {donor.profile?.full_name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {donor.profile?.email ?? ''}
                          {donor.profile?.mobile ? ` · ${donor.profile.mobile}` : ''}
                          {donor.location ? ` · ${donor.location}` : ''}
                        </p>
                      </div>
                    </div>
                    <DonorApprovalActions
                      donorId={donor.id}
                      donorName={donor.profile?.full_name ?? 'this donor'}
                    />
                  </div>

                  {/* Fitness facts the admin judges approval by */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    {donor.sex && <span>{SEX_LABELS[donor.sex]}</span>}
                    {donor.age != null && <span>বয়স: {donor.age}</span>}
                    {donor.weight_kg != null && <span>ওজন: {donor.weight_kg} কেজি</span>}
                    <span>
                      শেষ রক্তদান:{' '}
                      {donor.last_donation_date
                        ? new Date(donor.last_donation_date).toLocaleDateString()
                        : 'কখনো দেননি'}
                    </span>
                    {donor.health_conditions && (
                      <span className="text-amber-700">
                        রোগ: {donor.health_conditions}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    {fitness.fit ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                        ✓ রক্তদানের উপযুক্ত
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                        ⚠ Not eligible — {fitness.reasons.join(' · ')}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Approved Donors */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Approved Donors</h2>
          <span className="text-xs text-gray-400">
            Showing latest {approvedDonors.length}
          </span>
        </div>
        {approvedDonors.length === 0 ? (
          <Empty text="No approved donors yet." />
        ) : (
          <div className="divide-y divide-gray-50">
            {approvedDonors.map((donor) => (
              <div
                key={donor.id}
                className="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <BloodTypeBadge bloodType={donor.blood_type} size="sm" variant="soft" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {donor.profile?.full_name ?? 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {donor.profile?.email ?? ''}
                      {donor.profile?.mobile ? ` · ${donor.profile.mobile}` : ''}
                      {donor.location ? ` · ${donor.location}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <span
                    className={`flex items-center gap-1.5 text-xs font-medium ${
                      donor.availability_status === 'AVAILABLE'
                        ? 'text-green-700'
                        : 'text-gray-400'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        donor.availability_status === 'AVAILABLE'
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    />
                    {donor.availability_status === 'AVAILABLE'
                      ? 'Available'
                      : 'Unavailable'}
                  </span>
                  <ApprovedDonorActions
                    donorId={donor.id}
                    donorName={donor.profile?.full_name ?? 'this donor'}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reports */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Reports</h2>
          <span className="text-xs text-gray-400">
            {reports.filter((r) => r.status === 'OPEN').length} open
          </span>
        </div>
        {reports.length === 0 ? (
          <Empty text="No reports." />
        ) : (
          <div className="divide-y divide-gray-50">
            {reports.map((r) => (
              <div
                key={r.id}
                className="px-6 py-4 flex flex-wrap items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {REPORT_REASON_LABELS[r.reason] ?? r.reason}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {r.reporter?.full_name ?? 'User'} reported
                    {r.reported ? ` ${r.reported.full_name}` : ''}
                    {r.request
                      ? ` · ${r.request.patient_problem} (${BLOOD_TYPE_LABELS[r.request.blood_type]})`
                      : ''}
                    {' · '}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                  {r.details && (
                    <p className="text-xs text-gray-500 italic mt-1">{r.details}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      r.status === 'OPEN'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {r.status}
                  </span>
                  {r.status === 'OPEN' && <ResolveReportButton reportId={r.id} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Requests */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Blood Requests</h2>
        </div>
        {allRequests.length === 0 ? (
          <Empty text="No requests yet." />
        ) : (
          <div className="divide-y divide-gray-50">
            {allRequests.map((req) => (
              <div
                key={req.id}
                className="px-6 py-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {req.requester?.full_name ?? 'User'}
                    {' → '}
                    {req.donor?.profile?.full_name ?? 'Donor'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {req.donor?.blood_type
                      ? BLOOD_TYPE_LABELS[req.donor.blood_type]
                      : ''}
                    {' · '}
                    {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <StatusBadge status={req.status} />
                  {(req.status === 'PENDING' || req.status === 'ACCEPTED') && (
                    <AdminCancelRequestButton requestId={req.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Emergency Requests */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Emergency Requests</h2>
          <span className="text-xs text-gray-400">{openEmergencies} open</span>
        </div>
        {emergencies.length === 0 ? (
          <Empty text="No emergency requests." />
        ) : (
          <div className="divide-y divide-gray-50">
            {emergencies.map((req) => (
              <div
                key={req.id}
                className="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {req.patient_problem}{' '}
                    <span className="text-red-600 font-bold">
                      {BLOOD_TYPE_LABELS[req.blood_type]}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {req.requester_name} · {req.units_needed} ব্যাগ · {req.hospital},{' '}
                    {req.district} · {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${EMERGENCY_STATUS_STYLES[req.status]}`}
                  >
                    {req.status}
                  </span>
                  {req.status === 'OPEN' && (
                    <AdminEmergencyActions requestId={req.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Users</h2>
          <span className="text-xs text-gray-400">
            Showing latest {allUsers.length}
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {allUsers.map((u) => (
            <div
              key={u.id}
              className="px-6 py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {u.full_name || '—'}
                </p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-3 whitespace-nowrap">
                {u.is_admin && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
                <UserAdminToggle
                  userId={u.id}
                  userName={u.full_name || u.email}
                  isAdmin={u.is_admin}
                  isSelf={u.id === user.id}
                />
                <DeleteUserButton
                  userId={u.id}
                  userName={u.full_name || u.email}
                  isSelf={u.id === user.id}
                  isAdminTarget={u.is_admin}
                />
                <span className="text-xs text-gray-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: 'amber' | 'blue' | 'green' | 'red'
}) {
  const colors: Record<typeof accent, string> = {
    amber: 'text-amber-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
      <p className={`text-3xl font-bold ${colors[accent]}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="px-6 py-8 text-sm text-gray-400 text-center">{text}</p>
}
