import { type BloodType } from '@/types'
import { DISTRICTS } from '@/lib/districts'

// The GeoJSON (`ADM2_EN`) uses some older district spellings; map them to our
// canonical names from `DISTRICTS`. Names not listed here already match.
const GEO_NAME_ALIASES: Record<string, string> = {
  Barisal: 'Barishal',
  Bogra: 'Bogura',
  Brahamanbaria: 'Brahmanbaria',
  Chittagong: 'Chattogram',
  Comilla: 'Cumilla',
  Jessore: 'Jashore',
  Maulvibazar: 'Moulvibazar',
  Nawabganj: 'Chapai Nawabganj',
  Netrakona: 'Netrokona',
}

/** Normalize a GeoJSON district name to our canonical `DISTRICTS` spelling. */
export function canonicalDistrict(geoName: string): string {
  return GEO_NAME_ALIASES[geoName] ?? geoName
}

// Common spellings that appear in free-text `location` strings, mapped to canonical.
const LOCATION_ALIASES: Record<string, string> = {
  chittagong: 'Chattogram',
  comilla: 'Cumilla',
  barisal: 'Barishal',
  bogra: 'Bogura',
  jessore: 'Jashore',
  maulvibazar: 'Moulvibazar',
  nawabganj: 'Chapai Nawabganj',
  netrakona: 'Netrokona',
}

/**
 * Resolve a donor's district for the map: prefer the structured `district`,
 * otherwise scan the free-text `location` for a known district name/alias.
 * Lets donors who registered before the district dropdown still colour the map.
 */
export function resolveDistrict(
  district: string | null,
  location: string | null,
): string | null {
  if (district) return canonicalDistrict(district)
  if (!location) return null
  const hay = location.toLowerCase()
  for (const [alias, canon] of Object.entries(LOCATION_ALIASES)) {
    if (hay.includes(alias)) return canon
  }
  for (const d of DISTRICTS) {
    if (hay.includes(d.toLowerCase())) return d
  }
  return null
}

/** Static asset path (kept out of the JS bundle, fetched at runtime). */
export const BD_GEOJSON_URL = '/bd-districts.json'

export type DistrictStat = { count: number; byGroup: Record<BloodType, number> }

export type DonorStatsData = {
  total: number
  available: number
  byDistrict: Record<string, DistrictStat>
  byGroup: Record<BloodType, number>
}
