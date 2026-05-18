type StatItem = {
  value: string
  label: string
  accent: string
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
      value: donorCount.toLocaleString(),
      label: 'Verified Donors',
      accent: 'text-red-600',
    },
    {
      value: availableCount.toLocaleString(),
      label: 'Available Now',
      accent: 'text-green-600',
    },
    {
      value: '8',
      label: 'Blood Groups Covered',
      accent: 'text-amber-600',
    },
  ]

  return (
    <section className="max-w-6xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl border border-gray-200 px-3 py-5 sm:py-6 text-center shadow-sm"
          >
            <p className={`text-2xl sm:text-3xl font-bold ${item.accent}`}>
              {item.value}
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-tight">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
