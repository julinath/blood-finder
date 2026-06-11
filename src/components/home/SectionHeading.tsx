type Tone = 'red' | 'amber'

const EYEBROW_TONE: Record<Tone, string> = {
  red: 'text-red-600',
  amber: 'text-amber-600',
}

/**
 * Shared centered section header (eyebrow + title + optional subtitle) used
 * across the home page so every section reads consistently.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = 'red',
  className = 'mb-10',
}: {
  eyebrow: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <div className={`text-center ${className}`}>
      <p
        className={`text-xs uppercase tracking-wider font-semibold mb-2 ${EYEBROW_TONE[tone]}`}
      >
        {eyebrow}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  )
}
