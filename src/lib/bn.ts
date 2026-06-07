// Render Western digits (0-9) as Bangla numerals (০-৯) for display.
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const

export function toBnDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)])
}

/** Format an ISO date (YYYY-MM-DD) as Bangla-numeral DD/MM/YYYY (no timezone shift). */
export function formatBnDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return toBnDigits(iso)
  return toBnDigits(`${d}/${m}/${y}`)
}
