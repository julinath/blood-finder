import SectionHeading from './SectionHeading'
import Reveal from '@/components/ui/Reveal'

const MYTHS = [
  {
    myth: 'রক্ত দিতে অনেক ব্যথা লাগে।',
    truth:
      'রক্ত দিতে তেমন ব্যথা লাগে না — শুধু সুই ফোটানোর মুহূর্তে সামান্য অস্বস্তি হয়, ব্যস এটুকুই।',
  },
  {
    myth: 'রক্তদানের পর স্বাস্থ্য খারাপ হয়ে যায়।',
    truth:
      'এটি ভুল ধারণা। বরং নিয়মিত রক্তদানে হৃদরোগের ঝুঁকি কমে এবং শরীরে অতিরিক্ত আয়রন জমতে পারে না।',
  },
  {
    myth: 'ডায়াবেটিসে আক্রান্ত ব্যক্তি রক্ত দিতে পারবেন না।',
    truth:
      'এটিও ভুল ধারণা। স্বাস্থ্য পরীক্ষায় যোগ্য বিবেচিত হলে নিয়ন্ত্রণে থাকা ডায়াবেটিসের রোগীও রক্ত দিতে পারেন।',
  },
] as const

export default function Misconceptions() {
  return (
    <section className="bg-amber-50/60 border-y border-amber-100">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <SectionHeading
          eyebrow="Myths vs Facts"
          title="কিছু ভুল ধারণা"
          subtitle="রক্তদান নিয়ে প্রচলিত কিছু ভুল ধারণা — এবং আসল সত্য।"
          tone="amber"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MYTHS.map((item, i) => (
            <Reveal key={item.myth} delay={i * 100}>
              <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm h-full hover:shadow-md transition-shadow">
                <p className="flex items-start gap-2 text-sm font-semibold text-gray-800 mb-3">
                  <span className="text-red-500 shrink-0" aria-hidden="true">
                    ✗
                  </span>
                  <span className="line-through decoration-red-300">
                    {item.myth}
                  </span>
                </p>
                <p className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                  <span className="text-green-600 shrink-0" aria-hidden="true">
                    ✓
                  </span>
                  <span>{item.truth}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
