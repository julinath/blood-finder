import { createClient } from '@/lib/supabase/server'
import { geoMercator, geoPath } from 'd3-geo'
import { BLOOD_TYPES, isBloodType, type BloodType } from '@/types'
import { canonicalDistrict, resolveDistrict, type DistrictStat } from '@/lib/bdGeo'
import { BD_DISTRICTS } from '@/data/bdDistricts'
import { MAP_WIDTH, MAP_HEIGHT } from './mapConfig'
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

// Project the (winding-normalised) district polygons once per server process —
// the geometry never changes, only the donor counts do. Keeping this on the server
// means d3-geo and the ~700KB GeoJSON stay out of the client bundle. Paths are
// rounded to 1 decimal (sub-pixel at render size) to trim the payload we ship.
const projection = geoMercator().fitExtent(
  [
    [8, 8],
    [MAP_WIDTH - 8, MAP_HEIGHT - 8],
  ],
  BD_DISTRICTS,
)
const pathGen = geoPath(projection).digits(1)
const GEOMETRY = BD_DISTRICTS.features.map((feature) => ({
  name: canonicalDistrict(String(feature.properties?.ADM2_EN ?? '')),
  d: pathGen(feature) ?? '',
}))

type DonorRow = {
  district: string | null
  location: string | null
  blood_type: string
  availability_status: string
}

/**
 * Aggregates approved-donor counts by district + blood group for the map and
 * charts, then hands the client the server-projected paths. Degrades to empty
 * stats if the query fails (e.g. before migration).
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

  for (const row of rows) {
    total += 1
    if (isBloodType(row.blood_type)) byGroup[row.blood_type] += 1

    const name = resolveDistrict(row.district, row.location)
    if (name) {
      if (!byDistrict[name]) byDistrict[name] = { count: 0, byGroup: emptyByGroup() }
      byDistrict[name].count += 1
      if (isBloodType(row.blood_type)) byDistrict[name].byGroup[row.blood_type] += 1
    }
  }

  const districts = GEOMETRY.map((geo) => {
    const stat = byDistrict[geo.name]
    return {
      name: geo.name,
      d: geo.d,
      count: stat?.count ?? 0,
      byGroup: stat?.byGroup ?? emptyByGroup(),
    }
  })

  return <DonorStats districts={districts} byGroup={byGroup} total={total} />
}
