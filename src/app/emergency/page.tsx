import Link from 'next/link'
import EmergencyFeed from './_components'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'জরুরি রক্তের রিকোয়েস্ট | Blood Finder',
  description:
    'এই মুহূর্তে যেসব রোগী জরুরি রক্তের অপেক্ষায় আছে তাদের তালিকা — আপনার এলাকায় কারো রক্ত লাগলে এগিয়ে আসুন।',
}

export default async function EmergencyPage() {
  // Viewer context is resolved on the server (reliable for every session type)
  // and handed to the client feed: their own id (to tag their cards), filter
  // prefills (their blood group + district), and which requests they already
  // offered on.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialFilters = { blood_type: '', district: '' }
  let offeredRequestIds: string[] = []
  if (user) {
    const [{ data: profile }, { data: donor }, { data: offers }] = await Promise.all([
      supabase.from('profiles').select('district').eq('id', user.id).maybeSingle(),
      supabase.from('donors').select('blood_type').eq('user_id', user.id).maybeSingle(),
      supabase.from('emergency_offers').select('request_id').eq('donor_id', user.id),
    ])
    initialFilters = {
      blood_type: (donor?.blood_type as string) ?? '',
      district: (profile?.district as string) ?? '',
    }
    offeredRequestIds = (offers ?? []).map((o) => o.request_id as string)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          জরুরি রক্তের রিকোয়েস্ট
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          এই মুহূর্তে যেসব রোগী জরুরি রক্তের অপেক্ষায় আছে তাদের তালিকা। আপনার
          এলাকায় কারো রক্ত লাগলে এগিয়ে আসুন।
        </p>
        {/* Requester path — made explicit so visitors instantly understand
            this is where you ASK for blood, not just browse. */}
        <div className="mt-6 max-w-xl mx-auto bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <p className="text-sm text-gray-700">
            রোগীর জন্য জরুরি রক্ত দরকার? এক মিনিটেই রিকোয়েস্ট পোস্ট করুন —
            আপনার এলাকার রক্তদাতারা সাথে সাথে দেখতে পাবেন।
          </p>
          <Link
            href="/emergency/new"
            className="inline-block mt-3 bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            + রক্তের রিকোয়েস্ট দিন
          </Link>
        </div>
      </div>

      <EmergencyFeed
        viewerId={user?.id ?? null}
        initialFilters={initialFilters}
        offeredRequestIds={offeredRequestIds}
      />
    </div>
  )
}
