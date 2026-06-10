export const MIN_PASSWORD_LENGTH = 6
export const MAX_NOTES_LENGTH = 500

/** Bangladesh mobile: 11 digits starting with 01, third digit 3–9. */
const BD_MOBILE_RE = /^01[3-9]\d{8}$/

/** HTML `pattern` attribute for BD mobile inputs — keep in sync with BD_MOBILE_RE. */
export const BD_MOBILE_PATTERN = '01[3-9][0-9]{8}'

export function normalizeMobile(value: string): string {
  return value.replace(/[\s-]/g, '')
}

export function isValidBangladeshMobile(value: string): boolean {
  return BD_MOBILE_RE.test(normalizeMobile(value))
}
