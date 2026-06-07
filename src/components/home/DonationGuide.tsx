const REASONS = [
  'আপনার দানকৃত রক্ত একজন মানুষের জীবন বাঁচাবে — রক্তদানের এর চেয়ে বড় কারণ আর কী হতে পারে!',
  'হয়তো একদিন আপনার নিজের প্রয়োজনে/বিপদে অন্য কেউ এগিয়ে আসবে।',
  'নিয়মিত রক্তদানে হৃদরোগ ও হার্ট অ্যাটাকের ঝুঁকি অনেকটাই কমে যায়।',
] as const

const CRITERIA = [
  '১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থদেহের মানুষ রক্ত দিতে পারবেন।',
  'শারীরিক ও মানসিকভাবে সুস্থ, নিরোগ ব্যক্তি রক্ত দিতে পারবেন।',
  'আপনার ওজন অবশ্যই ৫০ কিলোগ্রাম বা তার বেশি হতে হবে।',
  'প্রতি ৪ মাস অন্তর অন্তর নিরাপদে রক্তদান করা যায়।',
] as const

export default function DonationGuide() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* কেন রক্তদান করবেন? */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span aria-hidden="true">❤️</span> কেন রক্তদান করবেন?
          </h2>
          <ul className="space-y-4">
            {REASONS.map((reason) => (
              <li key={reason} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                <span className="text-red-600 mt-0.5 shrink-0" aria-hidden="true">
                  ✓
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* কারা রক্তদান করতে পারবেন? */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span aria-hidden="true">🩸</span> কারা রক্তদান করতে পারবেন?
          </h2>
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
      </div>
    </section>
  )
}
