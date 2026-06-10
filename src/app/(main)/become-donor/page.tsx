import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BecomeDonorForm from './_components'
import { displayEmail } from '@/lib/auth-identifier'

export default async function BecomeDonorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check whether they're already a donor, and prefill from their profile so
  // the name/mobile/location they set at registration or /profile show up
  // here automatically — the two stay in sync.
  const [profileRes, donorRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, email, mobile, location, district')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('donors')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  if (donorRes.data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4" aria-hidden="true">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          You are already registered as a donor
        </h2>
        <p className="text-gray-500 mb-6">
          Go to your profile to manage your donor information.
        </p>
        <Link
          href="/profile"
          className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Go to Profile
        </Link>
      </div>
    )
  }

  const meta = user.user_metadata ?? {}
  const fullNameFromMeta =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    ''

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4"
          aria-hidden="true"
        >
          <span className="text-3xl">🩸</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Become a Donor</h1>
        <p className="text-gray-500 mt-2">
          Register to help people in need. Your profile will be reviewed before
          appearing publicly.
        </p>
      </div>

      <BecomeDonorForm
        defaults={{
          full_name: profileRes.data?.full_name || fullNameFromMeta,
          email: displayEmail(profileRes.data?.email ?? user.email ?? ''),
          mobile: profileRes.data?.mobile ?? '',
          location: profileRes.data?.location ?? '',
          district: profileRes.data?.district ?? '',
        }}
      />
    </div>
  )
}
