// Post-auth "return here" helpers.
//
// `next` carries the page a user was trying to reach when they were bounced to
// login/register (e.g. a signed-out visitor clicking "Become a Donor"). After
// they authenticate we send them back there instead of always landing on
// /profile. Only same-origin relative paths are allowed — anything else (an
// absolute URL or protocol-relative //evil.com) is rejected to avoid
// open-redirect abuse.
export function safeNextPath(value: string | null | undefined): string | null {
  if (!value) return null
  return value.startsWith('/') && !value.startsWith('//') ? value : null
}

// Append a flash key to a path, respecting any query string it already carries.
export function withFlash(path: string, flash: string): string {
  return `${path}${path.includes('?') ? '&' : '?'}flash=${flash}`
}
