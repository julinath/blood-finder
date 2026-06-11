'use client'

import { useEffect, useRef, useState } from 'react'

// Keep in sync with CountUp so counters and the reveal fade start together.
const IO_THRESHOLD = 0.15

/**
 * Fades + slides its children up the first time they scroll into view.
 * Wraps server-rendered content; `delay` (ms) staggers grid items.
 * Reduced motion is handled in globals.css (.reveal is forced visible).
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: IO_THRESHOLD },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
