import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

export default function CallToDonate() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 px-6 py-12 sm:px-12 sm:py-16 text-center shadow-xl shadow-red-200">
          {/* decorative blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl animate-blob"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/10 blur-2xl animate-blob"
            style={{ animationDelay: '5s' }}
          />

          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-red-100 font-semibold mb-4">
              Donate Blood
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white leading-snug max-w-3xl mx-auto mb-5">
              আপনার এক ব্যাগ রক্ত হতে পারে কারো পুরো পৃথিবী।
            </h2>
            <p className="text-red-50/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              রক্ত কৃত্রিমভাবে তৈরি করা যায় না — একজন মানুষই পারে আরেকজনের জীবন
              বাঁচাতে। আজই <strong className="text-white">রক্তদাতা</strong>{' '}
              হিসেবে নাম লেখান; জরুরি মুহূর্তে রোগীর পরিবার নিজেই আপনাকে খুঁজে
              নেবে।
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/become-donor"
                className="bg-white text-red-600 px-7 py-3 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm"
              >
                🩸 রক্তদাতা হোন
              </Link>
              <Link
                href="/emergency/new"
                className="bg-red-500/30 border border-white/40 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-red-500/50 transition-colors"
              >
                রক্তের রিকোয়েস্ট দিন
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
