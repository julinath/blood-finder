import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileSection } from './_components'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, donorRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, email, mobile, location')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('donors')
      .select('location')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const profile = profileRes.data
  const donor = donorRes.data

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <ProfileSection
        profile={{
          full_name: profile?.full_name ?? '',
          email: profile?.email ?? user.email ?? '',
          mobile: profile?.mobile ?? '',
          location: profile?.location ?? '',
        }}
        donor={donor ? { location: donor.location ?? '' } : null}
      />
    </div>
  )
}
