import SectionHeading from './SectionHeading'
import Reveal from '@/components/ui/Reveal'

const MYTHS = [
  {
    myth: 'রক্ত দিতে অনেক ব্যথা লাগে।',
    truth:
      'রক্তদানে মোটেও ব্যথা লাগে না — শুধু সূচ ফোটানোর সময় অল্প একটু অস্বস্তি হয়, ব্যস।',
  },
  {
    myth: 'রক্তদানের পর স্বাস্থ্য খারাপ হয়ে যাবে।',
    truth:
      'এটি ভুল ধারণা। বরং রক্তদানে হৃদরোগের ঝুঁকি কমে এবং দেহে অতিরিক্ত আয়রন বা লৌহ জমা প্রতিরোধ হয়।',
  },
  {
    myth: 'ডায়াবেটিসে আক্রান্ত ব্যক্তি রক্ত দিতে পারবে না।',
    truth:
      'এটিও ভুল ধারণা। স্বাস্থ্য পরীক্ষায় যোগ্য বিবেচিত হলে ডায়াবেটিস নিয়ন্ত্রণে থাকা ব্যক্তিও রক্ত দিতে পারেন।',
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
