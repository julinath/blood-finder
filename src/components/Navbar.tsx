'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Auth + admin lookup
  useEffect(() => {
    let cancelled = false

    const loadAdmin = async (uid: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', uid)
        .maybeSingle()
      if (!cancelled) setIsAdmin(profile?.is_admin ?? false)
    }

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return
      setUser(data.user)
      if (data.user) loadAdmin(data.user.id)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      setUser(session?.user ?? null)
      if (!session?.user) {
        setIsAdmin(false)
      } else {
        loadAdmin(session.user.id)
      }
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
          <span className="text-2xl" aria-hidden="true">🩸</span>
          Blood Finder
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/">Find Donors</NavLink>
          {user ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/profile">Profile</NavLink>
              {isAdmin && <NavLink href="/admin">Admin</NavLink>}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
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

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3"
        >
          <MobileLink href="/" onClick={closeMenu}>Find Donors</MobileLink>
          {user ? (
            <>
              <MobileLink href="/dashboard" onClick={closeMenu}>Dashboard</MobileLink>
              <MobileLink href="/profile" onClick={closeMenu}>Profile</MobileLink>
              {isAdmin && <MobileLink href="/admin" onClick={closeMenu}>Admin</MobileLink>}
              <button
                onClick={() => {
                  closeMenu()
                  handleLogout()
                }}
                className="text-sm text-red-600 text-left py-1"
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
    <Link href={href} onClick={onClick} className="text-sm text-gray-700 py-1">
      {children}
    </Link>
  )
}
