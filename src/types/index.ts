export type BloodType = 'A_POS' | 'A_NEG' | 'B_POS' | 'B_NEG' | 'AB_POS' | 'AB_NEG' | 'O_POS' | 'O_NEG'
export type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE'
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'COMPLETED'

export interface Profile {
  id: string
  full_name: string
  email: string
  mobile: string | null
  location: string | null
  is_admin: boolean
  created_at: string
}

export interface Donor {
  id: string
  user_id: string
  blood_type: BloodType
  location: string
  availability_status: AvailabilityStatus
  last_donation_date: string | null
  is_approved: boolean
  created_at: string
}

export interface BloodRequest {
  id: string
  requester_id: string
  donor_id: string
  status: RequestStatus
  notes: string | null
  created_at: string
}

export interface DonationRecord {
  id: string
  donor_id: string
  requester_id: string
  request_id: string
  donation_date: string
  created_at: string
}

// ---- Query-specific joined types (mirror the select strings used in pages) ----

export type DonorCard = Donor & {
  profile: Pick<Profile, 'full_name'> & { location: string | null } | null
}

export type DonorWithProfile = Donor & {
  profile: Pick<Profile, 'full_name' | 'email' | 'mobile' | 'location'> | null
}

export type SentRequest = BloodRequest & {
  donor: {
    blood_type: BloodType
    location: string
    profile: { full_name: string } | null
  } | null
}

export type ReceivedRequest = BloodRequest & {
  requester: { full_name: string; mobile: string | null } | null
}

export type AdminRequest = BloodRequest & {
  requester: { full_name: string } | null
  donor: {
    blood_type: BloodType
    location: string
    profile: { full_name: string } | null
  } | null
}

export type PendingDonor = Donor & {
  profile: { full_name: string; email: string; mobile: string | null } | null
}

export type DonationHistoryRecord = DonationRecord & {
  requester: { full_name: string } | null
}

export type AdminUser = Pick<Profile, 'id' | 'full_name' | 'email' | 'is_admin' | 'created_at'>

// ---- Display constants ----

export const BLOOD_TYPES: readonly BloodType[] = [
  'A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG',
] as const

export const BLOOD_TYPE_LABELS: Record<BloodType, string> = {
  A_POS: 'A+',
  A_NEG: 'A-',
  B_POS: 'B+',
  B_NEG: 'B-',
  AB_POS: 'AB+',
  AB_NEG: 'AB-',
  O_POS: 'O+',
  O_NEG: 'O-',
}

export const REQUEST_STATUS_STYLES: Record<RequestStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  COMPLETED: 'bg-blue-100 text-blue-700',
}

export function isBloodType(value: unknown): value is BloodType {
  return typeof value === 'string' && value in BLOOD_TYPE_LABELS
}
