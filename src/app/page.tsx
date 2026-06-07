import { createClient } from '@/lib/supabase/server'
import DonorSearch from '@/components/DonorSearch'
import Hero from '@/components/home/Hero'
import StatsStrip from '@/components/home/StatsStrip'
import EmergencyPreview from '@/components/home/EmergencyPreview'
import CallToDonate from '@/components/home/CallToDonate'
import DonationGuide from '@/components/home/DonationGuide'
import Misconceptions from '@/components/home/Misconceptions'
import HowItWorks from '@/components/home/HowItWorks'
import WhyDonate from '@/components/home/WhyDonate'
import DonorMapSection from '@/components/stats/DonorMapSection'

// Stats are cheap aggregations — refresh once a minute, not on every visit.
export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  const [donorRes, availableRes] = await Promise.all([
    supabase
      .from('donors')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', true),
    supabase
      .from('donors')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', true)
      .eq('availability_status', 'AVAILABLE'),
  ])

  return (
    <>
      <Hero />
      <StatsStrip
        donorCount={donorRes.count ?? 0}
        availableCount={availableRes.count ?? 0}
      />

      <EmergencyPreview />

      {/* Browse donors preview section */}
      <section className="max-w-6xl mx-auto px-4 pt-14 pb-2">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-2">
            Browse donors
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Featured Donors
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            A glimpse of verified donors — search the full list any time.
          </p>
        </div>
      </section>
      <DonorSearch preview />

      <CallToDonate />
      <HowItWorks />
      <DonationGuide />
      <Misconceptions />

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-2">
            Live Data
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            বাংলাদেশে রক্তদাতার চিত্র
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            কোন জেলায় কতজন রক্তদাতা — ইন্টারেক্টিভ ম্যাপে দেখুন।
          </p>
        </div>
        <DonorMapSection />
      </section>

      <WhyDonate />
    </>
  )
}
