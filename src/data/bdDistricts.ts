import type { FeatureCollection, Geometry } from 'geojson'
import raw from './bd-districts.json'

export type DistrictProps = { ADM2_EN?: string }

/**
 * Bangladesh district polygons, bundled at build time so the map never depends
 * on a runtime fetch (which proved unreliable behind browser/CDN caches).
 * Cast through `unknown` to keep tsc from inferring the giant JSON literal type.
 */
export const BD_DISTRICTS = raw as unknown as FeatureCollection<
  Geometry,
  DistrictProps
>
