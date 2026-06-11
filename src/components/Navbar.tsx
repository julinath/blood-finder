'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  // Auth subscription — runs once.
  useEffect(() => {
    let cancelled = false

    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setUser(data.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      setUser(session?.user ?? null)
      if (!session?.user) setFullName('')
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  // Refresh the display name on user/route change so a profile edit shows up
  // in the avatar without a hard reload.
  useEffect(() => {
    if (!user) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setFullName(data?.full_name ?? '')
      })
    return () => {
      cancelled = true
    }
  }, [supabase, user, pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const closeMenu = () => setMenuOpen(false)

  const initial = (fullName || user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
          <span className="text-2xl" aria-hidden="true">🩸</span>
          Blood Finder
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/emergency"
            className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors flex items-center gap-1"
          >
            <span aria-hidden="true">🚑</span> Emergency
          </Link>
          <NavLink href="/donors">Find Donors</NavLink>
          <NavLink href="/about">About Us</NavLink>
          {user ? (
            <Link
              href="/profile"
              aria-label="My profile"
              title={fullName || 'My profile'}
              className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold hover:bg-red-700 transition-colors"
            >
              {initial}
            </Link>
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
        <div className="md:hidden flex items-center gap-1">
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
          className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3"
        >
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
