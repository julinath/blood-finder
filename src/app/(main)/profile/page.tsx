import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DonorLocationForm, ProfileForm } from './_components'

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-500 mt-1">Update your personal information</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
        <ProfileForm
          defaults={{
            full_name: profile?.full_name ?? '',
            email: profile?.email ?? user.email ?? '',
            mobile: profile?.mobile ?? '',
            location: profile?.location ?? '',
          }}
        />

        {donor && (
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Donor Location</h3>
            <DonorLocationForm defaultLocation={donor.location ?? ''} />
          </div>
        )}
      </div>
    </div>
  )
}
