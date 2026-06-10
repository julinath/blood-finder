export type BloodType = 'A_POS' | 'A_NEG' | 'B_POS' | 'B_NEG' | 'AB_POS' | 'AB_NEG' | 'O_POS' | 'O_NEG'
export type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE'
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'COMPLETED'
export type Sex = 'MALE' | 'FEMALE' | 'OTHER'

export interface Profile {
  id: string
  full_name: string
  email: string
  mobile: string | null
  location: string | null
  district: string | null
  is_admin: boolean
  created_at: string
}

export interface Donor {
  id: string
  user_id: string
  blood_type: BloodType
  location: string
  district: string | null
  availability_status: AvailabilityStatus
  last_donation_date: string | null
  sex: Sex | null
  age: number | null
  weight_kg: number | null
  health_conditions: string | null
  donation_count: number
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

// ---- Emergency request board ----

export type EmergencyStatus = 'OPEN' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED'
export type EmergencyUrgency = 'URGENT' | 'HIGH' | 'NORMAL'
export type OfferStatus = 'OFFERED' | 'CONFIRMED' | 'DONATED' | 'DECLINED'

export interface EmergencyRequest {
  id: string
  requester_id: string
  requester_name: string
  patient_problem: string
  blood_type: BloodType
  units_needed: number
  hemoglobin: number | null
  needed_on: string | null
  district: string
  hospital: string
  urgency: EmergencyUrgency
  status: EmergencyStatus
  created_at: string
}

export interface EmergencyOffer {
  id: string
  request_id: string
  donor_id: string
  status: OfferStatus
  created_at: string
}

export const URGENCY_LABELS: Record<EmergencyUrgency, string> = {
  URGENT: 'জরুরি রক্ত দরকার',
  HIGH: 'দ্রুত প্রয়োজন',
  NORMAL: 'রক্ত প্রয়োজন',
}

export const URGENCY_STYLES: Record<EmergencyUrgency, string> = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH: 'bg-amber-100 text-amber-700',
  NORMAL: 'bg-gray-100 text-gray-600',
}

export const EMERGENCY_STATUS_STYLES: Record<EmergencyStatus, string> = {
  OPEN: 'bg-red-100 text-red-700',
  FULFILLED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  EXPIRED: 'bg-gray-100 text-gray-500',
}

// An emergency offer joined with the offering donor's profile (requester's view).
export type EmergencyOfferWithDonor = EmergencyOffer & {
  donor: { full_name: string; mobile: string | null } | null
}

// ---- Reports (safety / abuse) ----

export type ReportReason =
  | 'NO_SHOW'
  | 'ASKED_FOR_PAYMENT'
  | 'FAKE_REQUEST'
  | 'ABUSIVE'
  | 'OTHER'

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  NO_SHOW: 'ডোনার আসেনি (No-show)',
  ASKED_FOR_PAYMENT: 'টাকা চেয়েছে (Paid donor)',
  FAKE_REQUEST: 'ভুয়া রিকোয়েস্ট (Fake request)',
  ABUSIVE: 'খারাপ আচরণ (Abusive)',
  OTHER: 'অন্যান্য (Other)',
}

export type AdminReport = {
  id: string
  reason: ReportReason
  details: string | null
  status: string
  created_at: string
  reporter: { full_name: string } | null
  reported: { full_name: string } | null
  request: { patient_problem: string; blood_type: BloodType } | null
}

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

export const SEXES: readonly Sex[] = ['MALE', 'FEMALE', 'OTHER'] as const

export const SEX_LABELS: Record<Sex, string> = {
  MALE: 'পুরুষ (Male)',
  FEMALE: 'মহিলা (Female)',
  OTHER: 'অন্যান্য (Other)',
}

export function isSex(value: unknown): value is Sex {
  return typeof value === 'string' && value in SEX_LABELS
}
