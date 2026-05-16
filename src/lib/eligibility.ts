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
