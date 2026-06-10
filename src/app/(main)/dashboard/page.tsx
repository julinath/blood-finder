import { redirect } from 'next/navigation'

// The dashboard merged into /profile — keep old links and bookmarks working.
export default function DashboardPage() {
  redirect('/profile')
}
