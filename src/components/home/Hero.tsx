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

      <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* ---- Left: copy + actions (quick search BEFORE the CTA buttons so
               the "I need blood now" path is above the fold on a 390×844 phone) ---- */}
          <div className="text-center lg:text-left animate-fade-up">
            <span className="inline-flex items-center gap-2 bg-white border border-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              বাংলাদেশের বিশ্বস্ত রক্তদাতা প্ল্যাটফর্ম
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight leading-tight">
              রক্তের প্রয়োজনে{' '}
              <span className="text-red-600">দ্রুত খুঁজে নিন রক্তদাতা।</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-5">
              রক্তের গ্রুপ আর জেলা বেছে নিন — কাছের যাচাইকৃত রক্তদাতার তালিকা
              পাবেন মুহূর্তেই। আর নিজে রক্ত দিতে চাইলে আজই নাম লেখান।
            </p>

            <BloodTypeQuickSearch className="max-w-md mx-auto lg:mx-0 mb-6" />

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/become-donor"
                className="bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-red-700 active:scale-[0.98] transition-[background-color,box-shadow,transform] shadow-sm hover:shadow-md"
              >
                🩸 রক্তদাতা হোন
              </Link>
              <Link
                href="/donors"
                className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-[background-color,border-color,transform]"
              >
                রক্তদাতা খুঁজুন
              </Link>
            </div>
          </div>

          {/* ---- Right: animated living blood-drop visual ---- */}
          <HeroDrop />
        </div>
      </div>
    </section>
  )
}
