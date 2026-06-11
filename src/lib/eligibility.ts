export const DONATION_ELIGIBILITY_DAYS = 90

const DAY_MS = 24 * 60 * 60 * 1000

export type Eligibility =
  | { isEligible: true; daysRemaining: 0 }
  | { isEligible: false; daysRemaining: number; eligibleOn: Date }

export function calculateEligibility(lastDonationDate: string | null): Eligibility {
  if (!lastDonationDate) return { isEligible: true, daysRemaining: 0 }

  const last = new Date(lastDonationDate)
  const eligibleOn = new Date(last.getTime() + DONATION_ELIGIBILITY_DAYS * DAY_MS)
  const now = Date.now()

  if (eligibleOn.getTime() <= now) return { isEligible: true, daysRemaining: 0 }

  const daysRemaining = Math.ceil((eligibleOn.getTime() - now) / DAY_MS)
  return { isEligible: false, daysRemaining, eligibleOn }
}

/** Returns today's date as YYYY-MM-DD in UTC. */
export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export const MIN_DONOR_AGE = 18
export const MAX_DONOR_AGE = 65
export const MIN_DONOR_WEIGHT_KG = 45

export type FitnessCheck = { fit: boolean; reasons: string[] }

/**
 * Combined donation-fitness verdict from age, weight and the 90-day gap rule.
 * Missing (null) age/weight is not counted against the donor — older records
 * predate those fields — but the rest of the rules still apply.
 */
export function checkDonorFitness(input: {
  age: number | null
  weight_kg: number | null
  last_donation_date: string | null
}): FitnessCheck {
  const reasons: string[] = []

  if (input.age !== null && (input.age < MIN_DONOR_AGE || input.age > MAX_DONOR_AGE)) {
    reasons.push(`বয়স ${MIN_DONOR_AGE}–${MAX_DONOR_AGE} এর বাইরে`)
  }
  if (input.weight_kg !== null && input.weight_kg < MIN_DONOR_WEIGHT_KG) {
    reasons.push(`ওজন ${MIN_DONOR_WEIGHT_KG} কেজির কম`)
  }

  const eligibility = calculateEligibility(input.last_donation_date)
  if (!eligibility.isEligible) {
    reasons.push(
      `শেষ রক্তদানের পর ${DONATION_ELIGIBILITY_DAYS} দিন হয়নি (আরো ${eligibility.daysRemaining} দিন বাকি)`,
    )
  }

  return { fit: reasons.length === 0, reasons }
}
