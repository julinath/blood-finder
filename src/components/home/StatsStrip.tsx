import { BLOOD_TYPES } from '@/types'
import { DISTRICTS } from '@/lib/districts'
import CountUp from '@/components/ui/CountUp'
import Reveal from '@/components/ui/Reveal'

type StatItem = {
  value: number
  suffix?: string
  label: string
  icon: string
  accent: string
  iconBg: string
}

export default function StatsStrip({
  donorCount,
  availableCount,
}: {
  donorCount: number
  availableCount: number
}) {
  const items: StatItem[] = [
    {
      value: donorCount,
      label: 'মোট রক্তদাতা',
      icon: '🩸',
      accent: 'text-red-600',
      iconBg: 'bg-red-50',
    },
    {
      value: availableCount,
      label: 'এখন Available',
      icon: '✅',
      accent: 'text-green-600',
      iconBg: 'bg-green-50',
    },
    {
      value: DISTRICTS.length,
      label: 'জেলা · সারা দেশ',
      icon: '📍',
      accent: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      value: BLOOD_TYPES.length,
      label: 'Blood Group',
      icon: '🧬',
      accent: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
  ]

  return (
    <section className="max-w-6xl mx-auto px-4 pt-4 pb-2 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 80}>
            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3">
              <span
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-xl shrink-0 ${item.iconBg}`}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <div>
                <p className={`text-2xl sm:text-3xl font-bold leading-none ${item.accent}`}>
                  <CountUp value={item.value} />
                  {item.suffix}
                </p>
                <p className="text-xs text-gray-500 mt-1.5 leading-tight">
                  {item.label}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
