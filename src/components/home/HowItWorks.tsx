import SectionHeading from './SectionHeading'
import Reveal from '@/components/ui/Reveal'

const STEPS = [
  {
    num: 1,
    icon: '🔍',
    title: 'Search Donor',
    desc: 'রক্তের গ্রুপ ও এলাকা দিয়ে দ্রুত verified donor খুঁজুন।',
  },
  {
    num: 2,
    icon: '✉️',
    title: 'Send Request',
    desc: 'এক ক্লিকে donor কে রক্তের অনুরোধ পাঠান, কোনো ঝামেলা ছাড়াই।',
  },
  {
    num: 3,
    icon: '❤️',
    title: 'Save a Life',
    desc: 'রক্তদানের মাধ্যমে একজনের জীবন বাঁচানোর অংশ হোন।',
  },
] as const

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <SectionHeading
        eyebrow="How it works"
        title="তিনটি সহজ ধাপে রক্তদাতা খুঁজুন"
        subtitle="Connecting donors and recipients in three simple steps."
      />

      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* connector line behind the cards (desktop only) */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-red-100 via-red-300 to-red-100"
        />
        {STEPS.map((step, i) => (
          <Reveal key={step.num} delay={i * 120}>
            <div className="relative bg-white rounded-2xl border border-gray-200 p-6 text-center hover:border-red-200 hover:shadow-md hover:-translate-y-1 transition-all h-full">
              <div className="relative inline-flex items-center justify-center w-16 h-16 bg-red-50 text-3xl rounded-2xl mb-4">
                {step.icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow">
                  {step.num}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
