import { createClient } from '@/lib/supabase/server'
import DonorSearch from '@/components/DonorSearch'
import Hero from '@/components/home/Hero'
import StatsStrip from '@/components/home/StatsStrip'
import HowItWorks from '@/components/home/HowItWorks'
import WhyDonate from '@/components/home/WhyDonate'

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
      <DonorSearch />
      <HowItWorks />
      <WhyDonate />
    </>
  )
}
