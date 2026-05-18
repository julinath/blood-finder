const FACTS = [
  {
    stat: '২ সেকেন্ড',
    desc: 'প্রতি ২ সেকেন্ডে দেশের কোথাও না কোথাও কারো রক্তের প্রয়োজন হয়।',
  },
  {
    stat: '৩ জীবন',
    desc: '১ ব্যাগ রক্তদান বাঁচাতে পারে পর্যন্ত ৩টি মূল্যবান জীবন।',
  },
  {
    stat: '৪ মাস',
    desc: 'একজন সুস্থ মানুষ প্রতি ৪ মাস পরপর নিরাপদে রক্ত দিতে পারেন।',
  },
] as const

export default function WhyDonate() {
  return (
    <section className="bg-red-50/60 border-y border-red-100">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-2">
            Why donate
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            কেন রক্তদান গুরুত্বপূর্ণ?
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            একটি ছোট্ট সিদ্ধান্ত — একটি জীবন। আপনার রক্ত হতে পারে কারো বাঁচার আশা।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {FACTS.map((fact) => (
            <div
              key={fact.stat}
              className="bg-white rounded-2xl border border-red-100 p-6 text-center"
            >
              <p className="text-3xl font-bold text-red-600 mb-3">{fact.stat}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {fact.desc}
              </p>
            </div>
          ))}
        </div>

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
      </div>
    </section>
  )
}
