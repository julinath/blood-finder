import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: donor } = await supabase.from('donors').select('location').eq('user_id', user.id).single()

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-500 mt-1">Update your personal information</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
        {/* Profile Info Form */}
        <form action={async (formData: FormData) => {
          'use server'
          const { createClient } = await import('@/lib/supabase/server')
          const supabase = await createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          await supabase.from('profiles').update({
            full_name: formData.get('full_name') as string,
            mobile: formData.get('mobile') as string,
            location: formData.get('location') as string,
          }).eq('id', user.id)

          revalidatePath('/profile')
          revalidatePath('/dashboard')
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              name="full_name"
              type="text"
              defaultValue={profile?.full_name ?? ''}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={profile?.email ?? ''}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
            <input
              name="mobile"
              type="tel"
              defaultValue={profile?.mobile ?? ''}
              placeholder="01XXXXXXXXX"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input
              name="location"
              type="text"
              defaultValue={profile?.location ?? ''}
              placeholder="e.g. Dhaka"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Save Changes
          </button>
        </form>

        {/* Update Donor Location */}
        {donor && (
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Donor Location</h3>
            <form action={async (formData: FormData) => {
              'use server'
              const { createClient } = await import('@/lib/supabase/server')
              const supabase = await createClient()
              const { data: { user } } = await supabase.auth.getUser()
              if (!user) return
              await supabase.from('donors').update({
                location: formData.get('donor_location') as string,
              }).eq('user_id', user.id)
              revalidatePath('/profile')
              revalidatePath('/dashboard')
            }} className="flex gap-3">
              <input
                name="donor_location"
                type="text"
                defaultValue={donor?.location ?? ''}
                placeholder="Donor location"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Update
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
