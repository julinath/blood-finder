import { createClient } from '@/lib/supabase/server'
import { BLOOD_TYPES, isBloodType, type BloodType } from '@/types'
import {
  resolveDistrict,
  type DistrictStat,
  type DonorStatsData,
} from '@/lib/bdGeo'
import DonorStats from './DonorStats'

function emptyByGroup(): Record<BloodType, number> {
  return BLOOD_TYPES.reduce(
    (acc, bt) => {
      acc[bt] = 0
      return acc
    },
    {} as Record<BloodType, number>,
  )
}

type DonorRow = {
  district: string | null
  location: string | null
  blood_type: string
  availability_status: string
}

/**
 * Aggregates approved-donor counts by district + blood group for the map and
 * charts. Degrades to empty stats if the query fails (e.g. before migration).
 */
export default async function DonorMapSection() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('donors')
    .select('district, location, blood_type, availability_status')
    .eq('is_approved', true)

  const rows = (error ? [] : (data ?? [])) as DonorRow[]

  const byDistrict: Record<string, DistrictStat> = {}
  const byGroup = emptyByGroup()
  let total = 0
  let available = 0

  for (const row of rows) {
    total += 1
    if (row.availability_status === 'AVAILABLE') available += 1
    if (isBloodType(row.blood_type)) byGroup[row.blood_type] += 1

    const name = resolveDistrict(row.district, row.location)
    if (name) {
      if (!byDistrict[name]) byDistrict[name] = { count: 0, byGroup: emptyByGroup() }
      byDistrict[name].count += 1
      if (isBloodType(row.blood_type)) byDistrict[name].byGroup[row.blood_type] += 1
    }
  }

  const stats: DonorStatsData = { total, available, byDistrict, byGroup }

  return <DonorStats data={stats} />
}
