'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type NavbarViewer = { id: string; email: string; name: string; isDonor: boolean }

export default function Navbar({ initialViewer }: { initialViewer: NavbarViewer | null }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => createClient(), [])
  // The server-rendered viewer is the source of truth; client auth events only
  // layer on top for instant feedback after login/logout. Never let a failed
  // client-side cookie read downgrade a server-confirmed session.
  const [viewer, setViewer] = useState<NavbarViewer | null>(initialViewer)
  const [menuOpen, setMenuOpen] = useState(false)

  // Re-sync when the server re-renders the layout with a different user
  // (login, logout, account switch — all go through router.refresh()).
  // Setting state during render is React's sanctioned "derive from props"
  // pattern and avoids a visible one-frame flicker.
  const [syncedViewerId, setSyncedViewerId] = useState(initialViewer?.id ?? null)
  const serverViewerId = initialViewer?.id ?? null
  if (serverViewerId !== syncedViewerId) {
    setSyncedViewerId(serverViewerId)
    setViewer(initialViewer)
  }

  // Instant UI on explicit auth events. INITIAL_SESSION is deliberately
  // ignored when empty — that's the case where the browser can't read the
  // cookie even though the server-side session is valid.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setViewer(null)
      } else if (session?.user && event === 'SIGNED_IN') {
        setViewer((current) =>
          current?.id === session.user.id
            ? current
            : // Donor status is unknown until the server re-renders; assume not a
              // donor so the CTA stays usable, then router.refresh() corrects it.
              { id: session.user.id, email: session.user.email ?? '', name: '', isDonor: false },
        )
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [supabase])

  // Refresh the display name on route change so a profile edit shows up in the
  // avatar without a hard reload. A failed read keeps the server-provided name.
  const viewerId = viewer?.id ?? null
  useEffect(() => {
    if (!viewerId) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', viewerId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data?.full_name) return
        setViewer((current) =>
          current && current.id === viewerId ? { ...current, name: data.full_name } : current,
        )
      })
    return () => {
      cancelled = true
    }
  }, [supabase, viewerId, pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const closeMenu = () => setMenuOpen(false)

  const user = viewer
  const fullName = viewer?.name ?? ''
  const initial = (fullName || user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
          <span className="text-2xl" aria-hidden="true">🩸</span>
          Blood Finder
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLink href="/">Home</NavLink>
          <Link
            href="/emergency"
            className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors flex items-center gap-1"
          >
            <span aria-hidden="true">🚑</span> Emergency
          </Link>
          <NavLink href="/donors">Find Donors</NavLink>
          <NavLink href="/about">About Us</NavLink>
          {user ? (
            <>
              <BecomeDonorButton isDonor={user.isDonor} />
              <Link
                href="/profile"
                aria-label="My profile"
                title={fullName || 'My profile'}
                className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold hover:bg-red-700 transition-colors"
              >
                {initial}
              </Link>
            </>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <Link
                href="/register"
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile: profile circle + hamburger. Both hit areas are ≥44px —
            the avatar keeps its 36px visual inside a larger touch target. */}
        <div className="lg:hidden flex items-center gap-1">
          {user && (
            <Link
              href="/profile"
              aria-label="My profile"
              onClick={closeMenu}
              className="w-11 h-11 flex items-center justify-center"
            >
              <span className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                {initial}
              </span>
            </Link>
          )}
          <button
            type="button"
            className="p-3 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3"
        >
          <MobileLink href="/" onClick={closeMenu}>Home</MobileLink>
          <Link
            href="/emergency"
            onClick={closeMenu}
            className="text-sm text-red-600 font-semibold py-2.5 flex items-center gap-1"
          >
            <span aria-hidden="true">🚑</span> Emergency
          </Link>
          <MobileLink href="/donors" onClick={closeMenu}>Find Donors</MobileLink>
          <MobileLink href="/about" onClick={closeMenu}>About Us</MobileLink>
          {user ? (
            <>
              {user.isDonor ? (
                <span
                  aria-disabled="true"
                  className="bg-gray-100 text-gray-400 text-sm font-medium py-2.5 px-4 rounded-lg text-center cursor-not-allowed select-none"
                >
                  Become a Donor
                  <span className="block text-xs font-normal mt-0.5">আপনি ইতিমধ্যে রক্তদাতা</span>
                </span>
              ) : (
                <Link
                  href="/become-donor"
                  onClick={closeMenu}
                  className="bg-red-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg text-center hover:bg-red-700 transition-colors"
                >
                  Become a Donor
                </Link>
              )}
              <MobileLink href="/profile" onClick={closeMenu}>My Profile</MobileLink>
              <button
                onClick={() => {
                  closeMenu()
                  handleLogout()
                }}
                className="text-sm text-red-600 text-left py-2.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileLink href="/login" onClick={closeMenu}>Login</MobileLink>
              <MobileLink href="/register" onClick={closeMenu}>Register</MobileLink>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

// Desktop CTA: active red button for non-donors, disabled grey for donors.
function BecomeDonorButton({ isDonor }: { isDonor: boolean }) {
  if (isDonor) {
    return (
      <span
        aria-disabled="true"
        title="আপনি ইতিমধ্যে রক্তদাতা হিসেবে নিবন্ধিত"
        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed select-none"
      >
        Become a Donor
      </span>
    )
  }
  return (
    <Link
      href="/become-donor"
      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
    >
      Become a Donor
    </Link>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  )
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link href={href} onClick={onClick} className="text-sm text-gray-700 py-2.5">
      {children}
    </Link>
  )
}
