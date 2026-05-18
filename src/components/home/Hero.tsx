import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-red-50 via-white to-white">
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-12 text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-5 shadow-sm"
          aria-hidden="true"
        >
          <span className="text-3xl">🩸</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          রক্ত দিন, <span className="text-red-600">জীবন বাঁচান</span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-7">
          Find verified blood donors near you in seconds. Every donation can save up to three lives.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/become-donor"
            className="bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
          >
            Become a Donor
          </Link>
          <Link
            href="/request"
            className="bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Request Blood
          </Link>
        </div>
      </div>
    </section>
  )
}
