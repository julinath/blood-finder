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

  /*
   * Section order is intent-first for a mobile-only audience:
   * 1. Hero          — headline + blood-type quick search ABOVE the CTA buttons,
   *                    so "I need blood NOW" has a tap target within the first
   *                    viewport on a 390×844 phone.
   * 2. Emergency     — live urgent requests: the second most time-critical intent.
   * 3. Availability  — the interactive per-group board, directly after Emergency
   *                    (it answers "is my group available right now?").
   * 4. StatsStrip    — trust/scale numbers as a bridge from action to explanation.
   * 5. HowItWorks    — first-time visitors who scrolled past the actions.
   * 6. DonorMap      — the data centerpiece; exploratory, so it can sit mid-page.
   * 7-9. WhyDonate → Misconceptions → DonationGuide — awareness funnel that
   *                    warms up the "I want to donate" intent…
   * 10. CallToDonate — …closed by the donate CTA.
   */
  return (
    <>
      {/* 1 — hero: search-first (quick search lives inside, above the fold) */}
      <Hero />

      {/* 2 — urgent: live emergency requests */}
      <EmergencyPreview />

      {/* 3 — interactive blood-group availability board */}
      <BloodAvailability />

      {/* 4 — live stats (the single home for the numbers) */}
      <StatsStrip donorCount={donorCount} availableCount={availableCount} />

      {/* 5 — how the platform works */}
      <HowItWorks />

      {/* 6 — interactive map (data centerpiece) */}
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
