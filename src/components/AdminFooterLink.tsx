import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

// Renders admin-only links in the footer. Admin access is deliberately kept
// out of the navbar; admins use these links or go to /admin directly by URL.
// Rendered on the server so the links never depend on the browser being able
// to read the auth cookie (which proved flaky for aged sessions).
export default async function AdminFooterLink() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()
  if (!data?.is_admin) return null

  return (
    <>
      <Link href="/admin" className="text-gray-500 hover:text-white transition-colors">
        Admin Panel
      </Link>
      {/* TEMPORARY: lab-exam presentation; remove this link, public/presentation/
          and the /presentation redirect in next.config.ts after the exam */}
      <a
        href="/presentation"
        target="_blank"
        rel="noopener"
        className="text-gray-500 hover:text-white transition-colors"
      >
        Presentation
      </a>
    </>
  )
}
