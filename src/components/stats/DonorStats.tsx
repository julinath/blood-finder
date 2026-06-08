'use client'

import { useMemo, useRef, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { BLOOD_TYPES, BLOOD_TYPE_LABELS } from '@/types'
import { canonicalDistrict, type DonorStatsData } from '@/lib/bdGeo'
import { BD_DISTRICTS } from '@/data/bdDistricts'
import { toBnDigits } from '@/lib/bn'

const MAP_WIDTH = 460
const MAP_HEIGHT = 640

export default function DonorStats({ data }: { data: DonorStatsData }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; count: number } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // District polygons are bundled (no runtime fetch) → project once.
  const { pathGen, features } = useMemo(() => {
    const projection = geoMercator().fitSize([MAP_WIDTH, MAP_HEIGHT], BD_DISTRICTS)
    return { pathGen: geoPath(projection), features: BD_DISTRICTS.features }
  }, [])

  const maxCount = useMemo(() => {
    const counts = Object.values(data.byDistrict).map((d) => d.count)
    return counts.length ? Math.max(...counts) : 0
  }, [data])

  function fillFor(count: number): string {
    if (count <= 0) return '#f3f4f6' // gray-100 — no donors yet
    const t = maxCount > 0 ? count / maxCount : 0
    if (t > 0.66) return '#991b1b' // red-800
    if (t > 0.33) return '#dc2626' // red-600
    if (t > 0.1) return '#f87171' // red-400
    return '#fecaca' // red-200
  }

  const activeDistrict = selected ?? hovered
  const activeStat = activeDistrict ? data.byDistrict[activeDistrict] : null
  const chartGroups = activeStat ? activeStat.byGroup : data.byGroup
  const chartTitle = activeDistrict ?? 'সারা বাংলাদেশ'
  const chartMax = Math.max(1, ...BLOOD_TYPES.map((bt) => chartGroups[bt]))

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Map */}
        <div
          ref={wrapRef}
          className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
          onMouseLeave={() => {
            setHovered(null)
            setTooltip(null)
          }}
        >
          <div className="relative w-full aspect-[460/640]">
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="বাংলাদেশের জেলা-ভিত্তিক রক্তদাতার মানচিত্র"
            >
            {features.map((feature, i) => {
              const name = canonicalDistrict(String(feature.properties?.ADM2_EN ?? ''))
              const count = data.byDistrict[name]?.count ?? 0
              const d = pathGen(feature) ?? undefined
              const isActive = activeDistrict === name
              return (
                <path
                  key={name || i}
                  d={d}
                  fill={fillFor(count)}
                  stroke={isActive ? '#111827' : '#ffffff'}
                  strokeWidth={isActive ? 1.4 : 0.5}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={() => setHovered(name)}
                  onMouseMove={(e) => {
                    const rect = wrapRef.current?.getBoundingClientRect()
                    if (!rect) return
                    setTooltip({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      name,
                      count,
                    })
                  }}
                  onClick={() =>
                    setSelected((cur) => (cur === name ? null : name))
                  }
                />
              )
            })}
            </svg>
          </div>

          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap"
              style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
            >
              <span className="font-semibold">{tooltip.name}</span>
              {' — '}
              {toBnDigits(tooltip.count)} জন donor
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-gray-500">
            <span>কম</span>
            <span className="flex items-center gap-1">
              {['#f3f4f6', '#fecaca', '#f87171', '#dc2626', '#991b1b'].map((c) => (
                <span
                  key={c}
                  className="inline-block w-5 h-3 rounded-sm border border-gray-200"
                  style={{ backgroundColor: c }}
                />
              ))}
            </span>
            <span>বেশি</span>
          </div>
        </div>

        {/* Blood-group distribution chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Blood Group বণ্টন</h3>
              <p className="text-sm text-gray-500">
                {chartTitle} ·{' '}
                {toBnDigits(activeStat ? activeStat.count : data.total)} জন donor
              </p>
            </div>
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-red-600 hover:underline"
              >
                সব দেখুন
              </button>
            )}
          </div>

          <div className="space-y-3">
            {BLOOD_TYPES.map((bt) => {
              const value = chartGroups[bt]
              const pct = Math.round((value / chartMax) * 100)
              return (
                <div key={bt} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-bold text-red-600 shrink-0">
                    {BLOOD_TYPE_LABELS[bt]}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${value > 0 ? Math.max(pct, 4) : 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm text-gray-600 text-right shrink-0 tabular-nums">
                    {toBnDigits(value)}
                  </span>
                </div>
              )
            })}
          </div>

          <p className="text-xs text-gray-400 mt-5">
            💡 ম্যাপে কোনো জেলায় ক্লিক করলে সেই জেলার Blood Group বণ্টন দেখা যাবে।
          </p>
        </div>
      </div>
    </div>
  )
}
