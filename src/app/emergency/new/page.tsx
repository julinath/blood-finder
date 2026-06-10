import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewEmergencyForm from './_components'

export default async function NewEmergencyRequestPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Prefill contact + district from the profile so repeat requesters don't retype.
  const { data: profile } = await supabase
    .from('profiles')
    .select('mobile, district')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4"
          aria-hidden="true"
        >
          <span className="text-3xl">🚑</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">রক্তের রিকোয়েস্ট দিন</h1>
        <p className="text-gray-500 mt-2 text-sm">
          আপনার এলাকার রক্তদাতারা এই রিকোয়েস্ট দেখতে পাবেন এবং এগিয়ে আসবেন।
        </p>
      </div>

      <NewEmergencyForm
        defaults={{
          district: profile?.district ?? '',
          contact_phone: profile?.mobile ?? '',
        }}
      />
    </div>
  )
}
