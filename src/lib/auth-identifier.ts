import { isValidBangladeshMobile, normalizeMobile } from './validation'

// Supabase Auth only understands emails, but many users in Bangladesh don't
// use one. Mobile-number accounts sign up with a synthetic email derived from
// the number; the UI accepts "email or mobile" everywhere and hides the
// synthetic address.
export const MOBILE_AUTH_DOMAIN = 'mobile.bloodfinder.app'

export function mobileToAuthEmail(mobile: string): string {
  return `${normalizeMobile(mobile)}@${MOBILE_AUTH_DOMAIN}`
}

export function isMobileAuthEmail(email: string): boolean {
  return email.endsWith(`@${MOBILE_AUTH_DOMAIN}`)
}

/** Synthetic addresses are an implementation detail — never show them. */
export function displayEmail(email: string): string {
  return isMobileAuthEmail(email) ? '' : email
}

export type AuthIdentifier =
  | { kind: 'email'; email: string }
  | { kind: 'mobile'; email: string; mobile: string }

/**
 * Interpret a login/register identifier as either an email address or a
 * Bangladesh mobile number. Returns null when it's neither.
 */
export function parseAuthIdentifier(raw: string): AuthIdentifier | null {
  const value = raw.trim()
  if (!value) return null

  const asMobile = normalizeMobile(value)
  if (isValidBangladeshMobile(asMobile)) {
    return { kind: 'mobile', email: mobileToAuthEmail(asMobile), mobile: asMobile }
  }

  // Loose email shape check — Supabase does the authoritative validation.
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { kind: 'email', email: value }
  }

  return null
}
