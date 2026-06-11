'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BLOOD_TYPES, BLOOD_TYPE_LABELS, type BloodType } from '@/types'
import { type MapDistrict } from '@/lib/bdGeo'
import { MAP_WIDTH, MAP_HEIGHT } from './mapConfig'
import { toBnDigits } from '@/lib/bn'

type ViewBox = [number, number, number, number]
const FULL_VIEW: ViewBox = [0, 0, MAP_WIDTH, MAP_HEIGHT]

export default function DonorStats({
  districts,
  byGroup,
  total,
}: {
  districts: MapDistrict[]
  byGroup: Record<BloodType, number>
  total: number
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; count: number } | null>(null)
  const [view, setView] = useState<ViewBox>(FULL_VIEW)
  const wrapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<ViewBox>(FULL_VIEW)
  const rafRef = useRef(0)

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const maxCount = useMemo(
    () => districts.reduce((max, d) => Math.max(max, d.count), 0),
    [districts],
  )
  const byName = useMemo(() => {
    const map: Record<string, MapDistrict> = {}
    for (const d of districts) map[d.name] = d
    return map
  }, [districts])

  function fillFor(count: number): string {
    if (count <= 0) return '#f3f4f6' // gray-100 — no donors yet
    const t = maxCount > 0 ? count / maxCount : 0
    if (t > 0.66) return '#991b1b' // red-800
    if (t > 0.33) return '#dc2626' // red-600
    if (t > 0.1) return '#f87171' // red-400
    return '#fecaca' // red-200
  }

  // Smoothly ease the SVG viewBox toward a target — used to zoom into a district.
  function animateView(target: ViewBox) {
    cancelAnimationFrame(rafRef.current)
    const from = viewRef.current
    let start: number | null = null
    const dur = 520
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (now: number) => {
      if (start === null) start = now
      const p = Math.min(1, (now - start) / dur)
      const e = ease(p)
      const cur: ViewBox = [
        from[0] + (target[0] - from[0]) * e,
        from[1] + (target[1] - from[1]) * e,
        from[2] + (target[2] - from[2]) * e,
        from[3] + (target[3] - from[3]) * e,
      ]
      viewRef.current = cur
      setView(cur)
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }

  // Frame a district's bounding box, keeping the map's aspect ratio and clamping
  // both the zoom level and the pan so we never show empty space past the edges.
  function zoomToBBox(b: DOMRect) {
    const PAD = 26
    const aspect = MAP_WIDTH / MAP_HEIGHT
    let w = b.width + PAD * 2
    let h = b.height + PAD * 2
    if (w / h > aspect) h = w / aspect
    else w = h * aspect
    const MAX_ZOOM = 4.5
    const minW = MAP_WIDTH / MAX_ZOOM
    if (w < minW) {
      w = minW
      h = minW / aspect
    }
    if (w > MAP_WIDTH) {
      w = MAP_WIDTH
      h = MAP_HEIGHT
    }
    let x = b.x + b.width / 2 - w / 2
    let y = b.y + b.height / 2 - h / 2
    x = Math.max(0, Math.min(x, MAP_WIDTH - w))
    y = Math.max(0, Math.min(y, MAP_HEIGHT - h))
    animateView([x, y, w, h])
  }

  function resetView() {
    setSelected(null)
    animateView(FULL_VIEW)
  }

  function handleDistrictClick(name: string, el: SVGPathElement) {
    if (selected === name) {
      resetView()
    } else {
      setSelected(name)
      zoomToBBox(el.getBBox())
    }
  }

  const activeDistrict = selected ?? hovered
  const activeStat = activeDistrict ? byName[activeDistrict] : null
  const chartGroups = activeStat ? activeStat.byGroup : byGroup
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
              viewBox={view.join(' ')}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="বাংলাদেশের জেলা-ভিত্তিক রক্তদাতার মানচিত্র"
            >
              {districts.map((dist) => {
                const isActive = activeDistrict === dist.name
                const dimmed = selected !== null && selected !== dist.name
                return (
                  <path
                    key={dist.name}
                    d={dist.d}
                    fill={fillFor(dist.count)}
                    fillOpacity={dimmed ? 0.3 : 1}
                    stroke={isActive ? '#111827' : '#ffffff'}
                    strokeWidth={isActive ? 1.6 : 0.6}
                    vectorEffect="non-scaling-stroke"
                    className="cursor-pointer transition-[fill,fill-opacity,stroke] duration-300"
                    onMouseEnter={() => setHovered(dist.name)}
                    onMouseMove={(e) => {
                      const rect = wrapRef.current?.getBoundingClientRect()
                      if (!rect) return
                      setTooltip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        name: dist.name,
                        count: dist.count,
                      })
                    }}
                    onClick={(e) => handleDistrictClick(dist.name, e.currentTarget)}
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
              {toBnDigits(tooltip.count)} জন রক্তদাতা
            </div>
          )}

          {/* Zoom-out control — only while a district is focused */}
          {selected && (
            <button
              onClick={resetView}
              className="absolute top-6 right-6 z-10 flex items-center gap-1 bg-white/90 backdrop-blur border border-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-white hover:border-gray-300 transition-colors"
            >
              <span aria-hidden="true">⤢</span> পুরো ম্যাপ
            </button>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-500">
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
                {toBnDigits(activeStat ? activeStat.count : total)} জন রক্তদাতা
              </p>
            </div>
            {selected && (
              <button
                onClick={resetView}
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

          <p className="text-xs text-gray-500 mt-5">
            💡 ম্যাপে কোনো জেলায় ক্লিক করলে zoom হয়ে সেই জেলার Blood Group বণ্টন দেখা যাবে।
          </p>
        </div>
      </div>
    </div>
  )
}
