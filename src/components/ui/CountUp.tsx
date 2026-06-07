'use client'

import { useEffect, useRef, useState } from 'react'
import { toBnDigits } from '@/lib/bn'

/**
 * Counts up from 0 to `value` the first time it scrolls into view. Renders
 * Bengali digits by default; pass `bn={false}` for Western numerals.
 */
export default function CountUp({
  value,
  bn = true,
  duration = 1100,
  suffix = '',
}: {
  value: number
  bn?: boolean
  duration?: number
  suffix?: string
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const run = () => {
      if (started.current) return
      started.current = true
      let raf = 0
      let startTs: number | null = null
      const tick = (ts: number) => {
        if (startTs === null) startTs = ts
        const progress = Math.min(1, (ts - startTs) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * value))
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration])

  const text = bn ? toBnDigits(display) : display.toLocaleString()
  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  )
}
