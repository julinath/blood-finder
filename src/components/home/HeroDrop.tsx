import { BLOOD_TYPE_LABELS } from '@/types'

// Blood-type pills that gently float around the drop.
const FLOATERS = [
  { type: 'O_POS', pos: 'top-4 left-2', delay: '0s' },
  { type: 'A_POS', pos: 'top-12 right-4', delay: '1.2s' },
  { type: 'B_POS', pos: 'bottom-24 left-6', delay: '0.6s' },
  { type: 'AB_POS', pos: 'bottom-14 right-8', delay: '1.8s' },
] as const

const DROP_PATH =
  'M100 14 C100 14 36 92 36 132 a64 64 0 1 0 128 0 C164 92 100 14 100 14 Z'

/**
 * The hero centrepiece — a "living" blood drop: red liquid with animated wave
 * surface, rising bubbles, a glass highlight, pulse rings and a heartbeat (ECG)
 * line beneath. Pure SVG + CSS; honours prefers-reduced-motion via globals.css.
 */
export default function HeroDrop() {
  return (
    <div className="relative h-80 sm:h-96 hidden md:block animate-fade-up">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* pulse rings */}
        <span className="absolute w-72 h-72 rounded-full border border-red-200/80 animate-pulse-ring" />
        <span
          className="absolute w-72 h-72 rounded-full border border-red-200/80 animate-pulse-ring"
          style={{ animationDelay: '1.3s' }}
        />

        {/* living blood drop */}
        <svg
          viewBox="0 0 200 200"
          className="relative w-60 h-60 sm:w-64 sm:h-64"
          style={{ filter: 'drop-shadow(0 18px 30px rgba(220,38,38,0.35))' }}
          role="img"
          aria-label="রক্তের জীবন্ত ফোঁটা"
        >
          <defs>
            <clipPath id="heroDropClip">
              <path d={DROP_PATH} />
            </clipPath>
            <linearGradient id="heroGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#ffe4e6" />
            </linearGradient>
            <linearGradient id="heroLiquidA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ef4444" />
              <stop offset="1" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="heroLiquidB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f87171" />
              <stop offset="1" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          <g clipPath="url(#heroDropClip)">
            {/* empty glass above the liquid */}
            <rect x="0" y="0" width="200" height="200" fill="url(#heroGlass)" />

            {/* back wave (slower, lighter) */}
            <path
              className="hero-wave hero-wave-b"
              d="M-60 90 q 30 -12 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 V200 H-60 Z"
              fill="url(#heroLiquidB)"
              opacity="0.7"
            />
            {/* front wave */}
            <path
              className="hero-wave hero-wave-a"
              d="M-60 82 q 30 -8 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 V200 H-60 Z"
              fill="url(#heroLiquidA)"
            />

            {/* rising bubbles */}
            <circle className="hero-bubble" style={{ animationDelay: '0s' }} cx="84" cy="184" r="3" fill="#fff" opacity="0.5" />
            <circle className="hero-bubble" style={{ animationDelay: '1.2s' }} cx="112" cy="190" r="4" fill="#fff" opacity="0.45" />
            <circle className="hero-bubble" style={{ animationDelay: '2s' }} cx="122" cy="176" r="2.5" fill="#fff" opacity="0.5" />
            <circle className="hero-bubble" style={{ animationDelay: '0.6s' }} cx="96" cy="192" r="2" fill="#fff" opacity="0.4" />
          </g>

          {/* glass highlight + outline */}
          <ellipse
            cx="74"
            cy="98"
            rx="9"
            ry="20"
            fill="#fff"
            opacity="0.25"
            transform="rotate(-25 74 98)"
          />
          <path d={DROP_PATH} fill="none" stroke="#f87171" strokeWidth="2.5" />
        </svg>

        {/* floating blood-type pills */}
        {FLOATERS.map((f) => (
          <span
            key={f.type}
            className={`absolute ${f.pos} bg-white text-red-600 font-bold text-sm px-3 py-1.5 rounded-xl shadow-md border border-red-100 animate-float-slow`}
            style={{ animationDelay: f.delay }}
          >
            {BLOOD_TYPE_LABELS[f.type]}
          </span>
        ))}
      </div>

      {/* heartbeat / ECG line */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center">
        <svg
          viewBox="0 0 240 44"
          className="w-64 h-9"
          fill="none"
          aria-hidden="true"
        >
          <polyline
            points="0,24 60,24 78,24 86,9 96,38 106,24 130,24 150,24 158,15 166,32 174,24 240,24"
            stroke="#fca5a5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
          <polyline
            className="hero-ecg"
            points="0,24 60,24 78,24 86,9 96,38 106,24 130,24 150,24 158,15 166,32 174,24 240,24"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
