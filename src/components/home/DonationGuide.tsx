import SectionHeading from './SectionHeading'
import Reveal from '@/components/ui/Reveal'

const CRITERIA = [
  '১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ মানুষ রক্ত দিতে পারবেন।',
  'শারীরিক ও মানসিকভাবে সম্পূর্ণ সুস্থ ব্যক্তিরাই রক্ত দিতে পারবেন।',
  'আপনার ওজন অবশ্যই ৫০ কেজি বা তার বেশি হতে হবে।',
  'প্রতি ৪ মাস অন্তর নিরাপদে রক্ত দেওয়া যায়।',
] as const

const TIPS = [
  'রক্তদানের আগের রাতে ভালোভাবে ঘুমান এবং পর্যাপ্ত পানি পান করুন।',
  'খালি পেটে রক্ত দেবেন না — হালকা কিছু খেয়ে আসুন।',
  'রক্তদানের পর ১০–১৫ মিনিট বিশ্রাম নিন এবং বেশি করে পানি ও তরল খাবার খান।',
  'রক্তদানের পরপরই ভারী ব্যায়াম এড়িয়ে চলুন এবং কিছুক্ষণ ধূমপান থেকে বিরত থাকুন।',
] as const

export default function DonationGuide() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <SectionHeading
        eyebrow="Eligibility"
        title="রক্তদানের আগে যা জানা দরকার"
        subtitle="আপনি কি রক্ত দিতে পারবেন? কীভাবে প্রস্তুতি নেবেন — সহজ গাইড।"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* কারা রক্তদান করতে পারবেন? */}
        <Reveal>
          <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm h-full">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span aria-hidden="true">🩸</span> কারা রক্তদান করতে পারবেন?
            </h3>
            <ul className="space-y-4">
              {CRITERIA.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                  <span className="text-green-600 mt-0.5 shrink-0" aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* রক্তদানের আগে ও পরে */}
        <Reveal delay={120}>
          <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm h-full">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span aria-hidden="true">📋</span> রক্তদানের আগে ও পরে
            </h3>
            <ul className="space-y-4">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                  <span className="text-red-600 mt-0.5 shrink-0" aria-hidden="true">
                    •
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
