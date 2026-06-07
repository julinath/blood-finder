import SectionHeading from './SectionHeading'
import CountUp from '@/components/ui/CountUp'
import Reveal from '@/components/ui/Reveal'

const FACTS = [
  {
    num: 2,
    unit: 'সেকেন্ড',
    desc: 'প্রতি ২ সেকেন্ডে দেশের কোথাও না কোথাও কারো রক্তের প্রয়োজন হয়।',
  },
  {
    num: 3,
    unit: 'জীবন',
    desc: '১ ব্যাগ রক্তদান বাঁচাতে পারে পর্যন্ত ৩টি মূল্যবান জীবন।',
  },
  {
    num: 10,
    unit: 'মিনিট',
    desc: 'একব্যাগ রক্ত দিতে সময় লাগে মাত্র ১০–১৫ মিনিট — খুবই সহজ ও নিরাপদ।',
  },
] as const

export default function WhyDonate() {
  return (
    <section className="bg-red-50/60 border-y border-red-100">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <SectionHeading
          eyebrow="Why donate"
          title="কেন রক্তদান গুরুত্বপূর্ণ?"
          subtitle="একটি ছোট্ট সিদ্ধান্ত — একটি জীবন। আপনার রক্ত হতে পারে কারো বাঁচার আশা।"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {FACTS.map((fact, i) => (
            <Reveal key={fact.unit} delay={i * 100}>
              <div className="bg-white rounded-2xl border border-red-100 p-6 text-center h-full hover:shadow-md transition-shadow">
                <p className="text-4xl font-bold text-red-600 mb-3">
                  <CountUp value={fact.num} /> {fact.unit}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{fact.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="bg-white rounded-2xl border border-red-100 p-7 max-w-3xl mx-auto text-center shadow-sm">
            <p className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-3">
              আমাদের লক্ষ্য
            </p>
            <p className="text-gray-700 leading-relaxed text-base">
              বাংলাদেশের প্রতিটি জরুরি মুহূর্তে দ্রুত ও নিরাপদ রক্তদাতা খুঁজে পেতে
              সাহায্য করা — এবং রক্তদানকে সবার জন্য সহজ, স্বচ্ছ ও বিশ্বাসযোগ্য করে
              তোলা।
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
