import Link from 'next/link'
import BloodTypeQuickSearch from './BloodTypeQuickSearch'
import HeroDrop from './HeroDrop'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-50 via-white to-white">
      {/* soft animated background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-red-200/40 blur-3xl animate-blob"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-rose-200/40 blur-3xl animate-blob"
        style={{ animationDelay: '4s' }}
      />

      <div className="relative max-w-6xl mx-auto px-4 pt-14 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* ---- Left: copy + actions ---- */}
          <div className="text-center lg:text-left animate-fade-up">
            <span className="inline-flex items-center gap-2 bg-white border border-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm mb-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              বাংলাদেশের বিশ্বস্ত রক্তদাতা প্ল্যাটফর্ম
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
              রক্তের প্রয়োজনে,{' '}
              <span className="text-red-600">দ্রুত খুঁজে নিন রক্তদাতা।</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-7">
              নিজের রক্তের গ্রুপের তথ্য দিন, প্রয়োজনে কাছের verified donor খুঁজে
              নিন। এক ব্যাগ রক্ত বাঁচাতে পারে একটি মূল্যবান জীবন।
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link
                href="/become-donor"
                className="bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
              >
                🩸 রক্তদাতা হোন
              </Link>
              <Link
                href="/donors"
                className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                রক্তদাতা খুঁজুন
              </Link>
            </div>

            <BloodTypeQuickSearch className="max-w-md mx-auto lg:mx-0" />
          </div>

          {/* ---- Right: animated living blood-drop visual ---- */}
          <HeroDrop />
        </div>
      </div>
    </section>
  )
}
