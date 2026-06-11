'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Renders an Admin Panel link in the footer, but only for admins. Admin access
// is deliberately kept out of the navbar; admins use this link or go to /admin
// directly by URL.
export default function AdminFooterLink() {
  const supabase = useMemo(() => createClient(), [])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let cancelled = false

    const check = async (userId: string | undefined) => {
      if (!userId) {
        if (!cancelled) setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle()
      if (!cancelled) setIsAdmin(data?.is_admin ?? false)
    }

    supabase.auth.getUser().then(({ data }) => check(data.user?.id))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) =>
      check(session?.user?.id),
    )

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  if (!isAdmin) return null

  return (
    <>
      <Link href="/admin" className="text-gray-500 hover:text-white transition-colors">
        Admin Panel
      </Link>
      {/* TEMPORARY: lab-exam presentation; remove this link + public/presentation/ after the exam */}
      <a
        href="/presentation/index.html"
        target="_blank"
        rel="noopener"
        className="text-gray-500 hover:text-white transition-colors"
      >
        Presentation
      </a>
    </>
  )
}
