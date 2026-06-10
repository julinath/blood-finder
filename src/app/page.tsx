import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/home/Hero'
import StatsStrip from '@/components/home/StatsStrip'
import EmergencyPreview from '@/components/home/EmergencyPreview'
import CallToDonate from '@/components/home/CallToDonate'
import DonationGuide from '@/components/home/DonationGuide'
import Misconceptions from '@/components/home/Misconceptions'
import HowItWorks from '@/components/home/HowItWorks'
import WhyDonate from '@/components/home/WhyDonate'
import BloodAvailability from '@/components/home/BloodAvailability'
import SectionHeading from '@/components/home/SectionHeading'
import DonorMapSection from '@/components/stats/DonorMapSection'

// Stats are cheap aggregations — refresh once a minute, not on every visit.
export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  // Count by `id` (not `*`) — anonymous visitors only have column-level
  // SELECT grants on the public donor columns, so `*` would be rejected.
  const [donorRes, availableRes] = await Promise.all([
    supabase
      .from('donors')
      .select('id', { count: 'exact', head: true })
      .eq('is_approved', true),
    supabase
      .from('donors')
      .select('id', { count: 'exact', head: true })
      .eq('is_approved', true)
      .eq('availability_status', 'AVAILABLE'),
  ])

  const donorCount = donorRes.count ?? 0
  const availableCount = availableRes.count ?? 0

  return (
    <>
      {/* 1 — Hero + 2 — live stats (the single home for the numbers) */}
      <Hero />
      <StatsStrip donorCount={donorCount} availableCount={availableCount} />

      {/* 3 — urgent: live emergency requests */}
      <EmergencyPreview />

      {/* 4 — how the platform works */}
      <HowItWorks />

      {/* 5 — interactive blood-group availability board */}
      <BloodAvailability />

      {/* 6 — interactive map (centerpiece) */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Live Data"
          title="বাংলাদেশে রক্তদাতার চিত্র"
          subtitle="কোন জেলায় কতজন রক্তদাতা — ইন্টারেক্টিভ ম্যাপে দেখুন।"
        />
        <DonorMapSection />
      </section>

      {/* 7-9 — awareness → myth-busting → who can donate (right before CTA) */}
      <WhyDonate />
      <Misconceptions />
      <DonationGuide />

      {/* 10 — closing call to action */}
      <CallToDonate />
    </>
  )
}
