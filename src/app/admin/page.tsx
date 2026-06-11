import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BloodTypeBadge from '@/components/BloodTypeBadge'
import StatusBadge from '@/components/StatusBadge'
import { formatBnDate } from '@/lib/bn'
import { checkDonorFitness, todayIsoDate } from '@/lib/eligibility'
import {
  BLOOD_TYPE_LABELS,
  EMERGENCY_STATUS_STYLES,
  SEX_LABELS,
  URGENCY_LABELS,
  URGENCY_STYLES,
  type AdminReport,
  type AdminRequest,
  type AdminUser,
  type EmergencyRequest,
  type PendingDonor,
} from '@/types'
import {
  AdminCancelRequestButton,
  AdminEmergencyActions,
  ApprovedDonorActions,
  DonorApprovalActions,
  ReportsSection,
  UsersSection,
} from './_components'

// An OPEN emergency counts as stale once its needed-on date has passed, or —
// when no date was given — once the post is over a week old.
const STALE_OPEN_AFTER_MS = 7 * 24 * 60 * 60 * 1000

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
        .select('id, full_name, email, is_admin, created_at', { count: 'exact' })
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

  const totalUsers = allUsersRes.count ?? allUsers.length
  const openReports = reports.filter((r) => r.status === 'OPEN').length
  const openEmergencies = emergencies.filter((r) => r.status === 'OPEN').length

  const today = todayIsoDate()
  // Posts created before this instant (7 days ago) count as old.
  const staleBeforeMs =
    new Date(`${today}T00:00:00Z`).getTime() - STALE_OPEN_AFTER_MS
  const isStaleOpen = (req: EmergencyRequest) =>
    req.status === 'OPEN' &&
    (req.needed_on
      ? req.needed_on < today
      : new Date(req.created_at).getTime() < staleBeforeMs)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider font-semibold text-red-600 mb-1">
          Admin · Operations
        </p>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">
          Manage donors, reports, emergencies, and users.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatCard label="Pending donors" value={pendingDonors.length} accent="amber" />
        <StatCard label="Open reports" value={openReports} accent="blue" />
        <StatCard label="Open emergencies" value={openEmergencies} accent="red" />
        <StatCard label="Total users" value={totalUsers} accent="green" />
      </div>

      {/* Pending Donors — amber treatment: this is the action queue */}
      <section className="bg-white rounded-2xl border border-amber-200 shadow-sm mb-6">
        <SectionHeader
          dotClass="bg-amber-500"
          title="Pending Donor Approvals"
          subtitle="New donors waiting for review before they appear in public search."
          badge={`${pendingDonors.length} waiting`}
          badgeClass="bg-amber-100 text-amber-700"
          className="border-amber-100 bg-amber-50/70"
        />
        {pendingDonors.length === 0 ? (
          <Empty
            title="No donors waiting for approval."
            hint="New donor registrations will show up here for review."
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {pendingDonors.map((donor) => {
              const fitness = checkDonorFitness({
                age: donor.age,
                weight_kg: donor.weight_kg,
                last_donation_date: donor.last_donation_date,
              })
              return (
                <div key={donor.id} className="px-4 sm:px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
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
        <SectionHeader
          dotClass="bg-green-500"
          title="Approved Donors"
          subtitle="Live in public search. Unapprove to hide, or remove the record entirely."
          badge={`latest ${approvedDonors.length}`}
          badgeClass="bg-green-100 text-green-700"
        />
        {approvedDonors.length === 0 ? (
          <Empty
            title="No approved donors yet."
            hint="Approve pending donors above to publish them in public search."
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {approvedDonors.map((donor) => (
              <div
                key={donor.id}
                className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
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
                <div className="flex flex-wrap items-center gap-3">
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
        <SectionHeader
          dotClass="bg-blue-500"
          title="Reports"
          subtitle="Safety and abuse reports filed by users."
          badge={`${openReports} open`}
          badgeClass={
            openReports > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
          }
        />
        <ReportsSection reports={reports} />
      </section>

      {/* Recent Requests */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <SectionHeader
          dotClass="bg-gray-400"
          title="Recent Blood Requests"
          subtitle="Direct requests between users and donors."
          badge={`latest ${allRequests.length}`}
        />
        {allRequests.length === 0 ? (
          <Empty
            title="No blood requests yet."
            hint="When a user requests blood from a donor, it will appear here."
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {allRequests.map((req) => (
              <div
                key={req.id}
                className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3"
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
                <div className="flex flex-wrap items-center gap-2 shrink-0">
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
        <SectionHeader
          dotClass="bg-red-500"
          title="Emergency Requests"
          subtitle="Public emergency board posts. Expire stale ones to keep the board honest."
          badge={`${openEmergencies} open`}
          badgeClass={
            openEmergencies > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
          }
        />
        {emergencies.length === 0 ? (
          <Empty
            title="No emergency requests yet."
            hint="Posts from the public emergency board will appear here."
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {emergencies.map((req) => (
              <div key={req.id} className="px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {req.patient_problem}{' '}
                        <span className="text-red-600 font-bold">
                          {BLOOD_TYPE_LABELS[req.blood_type]}
                        </span>
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${URGENCY_STYLES[req.urgency]}`}
                      >
                        {URGENCY_LABELS[req.urgency]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {req.requester_name} · {req.units_needed} ব্যাগ · {req.hospital},{' '}
                      {req.district}
                      {req.needed_on
                        ? ` · প্রয়োজন: ${formatBnDate(req.needed_on)}`
                        : ''}
                      {' · posted '}
                      {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${EMERGENCY_STATUS_STYLES[req.status]}`}
                    >
                      {req.status}
                    </span>
                    {req.status === 'OPEN' && (
                      <AdminEmergencyActions
                        requestId={req.id}
                        showExpire={isStaleOpen(req)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <SectionHeader
          dotClass="bg-purple-500"
          title="Users"
          subtitle="Every registered account. Grant admin carefully."
          badge={`${totalUsers} total`}
        />
        <UsersSection users={allUsers} currentUserId={user.id} />
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
  const dot: Record<typeof accent, string> = {
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  }
  const num: Record<typeof accent, string> = {
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot[accent]}`} aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 truncate">
          {label}
        </p>
      </div>
      <p className={`mt-1.5 text-2xl sm:text-3xl font-bold tabular-nums ${value > 0 ? num[accent] : 'text-gray-400'}`}>
        {value}
      </p>
    </div>
  )
}

function SectionHeader({
  dotClass,
  title,
  subtitle,
  badge,
  badgeClass = 'bg-gray-100 text-gray-500',
  className = 'border-gray-100',
}: {
  dotClass: string
  title: string
  subtitle?: string
  badge?: string
  badgeClass?: string
  className?: string
}) {
  return (
    <div
      className={`px-4 sm:px-6 py-4 border-b rounded-t-2xl flex flex-wrap items-center justify-between gap-x-3 gap-y-1 ${className}`}
    >
      <div className="min-w-0">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full shrink-0 ${dotClass}`} aria-hidden="true" />
          {title}
        </h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {badge && (
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badgeClass}`}
        >
          {badge}
        </span>
      )}
    </div>
  )
}

function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="px-6 py-10 text-center">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}
