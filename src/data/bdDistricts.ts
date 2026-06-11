// SERVER-ONLY: bd-districts.json is ~700 KB. Import this module only from
// server components (the map is projected to SVG paths server-side) — pulling
// it into a 'use client' file would ship the whole GeoJSON to every phone.
import type { FeatureCollection, Geometry, Position } from 'geojson'
import { geoArea } from 'd3-geo'
import raw from './bd-districts.json'

export type DistrictProps = { ADM2_EN?: string }

/**
 * Reverse a polygon's rings when d3-geo would read them as the globe's complement.
 *
 * The bundled shapefile export is wound clockwise, which d3-geo interprets on the
 * sphere as "the whole planet minus this district". That quietly breaks the map two
 * ways: `fitSize()` frames the entire globe (collapsing Bangladesh to a single dot),
 * and each polygon draws as a world-spanning shape that blankets the SVG. Rewinding
 * makes every polygon the small region it should be, so a plain `fitSize()` projection
 * just works. A polygon whose spherical area exceeds a hemisphere (2π) is inverted.
 */
function rewindRings(rings: Position[][]): Position[][] {
  return geoArea({ type: 'Polygon', coordinates: rings }) > 2 * Math.PI
    ? rings.map((ring) => [...ring].reverse())
    : rings
}

const collection = raw as unknown as FeatureCollection<Geometry, DistrictProps>
for (const feature of collection.features) {
  const geometry = feature.geometry
  if (geometry?.type === 'Polygon') {
    geometry.coordinates = rewindRings(geometry.coordinates)
  } else if (geometry?.type === 'MultiPolygon') {
    geometry.coordinates = geometry.coordinates.map(rewindRings)
  }
}

/**
 * Bangladesh district polygons, bundled at build time so the map never depends on a
 * runtime fetch (which proved unreliable behind browser/CDN caches). Ring winding is
 * normalised above so d3-geo projects them correctly.
 */
export const BD_DISTRICTS = collection
