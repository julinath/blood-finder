import { BLOOD_TYPE_LABELS, type BloodType } from '@/types'

type Size = 'sm' | 'md' | 'lg' | 'xl'
type Variant = 'solid' | 'soft' | 'translucent'

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'w-11 h-11 rounded-xl text-sm',
  md: 'w-12 h-12 rounded-xl text-lg',
  lg: 'w-14 h-14 rounded-xl text-xl',
  xl: 'w-20 h-20 rounded-2xl text-3xl',
}

const VARIANT_CLASSES: Record<Variant, string> = {
  solid: 'bg-red-600 text-white',
  soft: 'bg-red-100 text-red-600',
  translucent: 'bg-white/20 text-white',
}

export default function BloodTypeBadge({
  bloodType,
  size = 'md',
  variant = 'solid',
}: {
  bloodType: BloodType
  size?: Size
  variant?: Variant
}) {
  return (
    <div
      className={`inline-flex items-center justify-center font-bold ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`}
      aria-label={`Blood type ${BLOOD_TYPE_LABELS[bloodType]}`}
    >
      {BLOOD_TYPE_LABELS[bloodType]}
    </div>
  )
}
