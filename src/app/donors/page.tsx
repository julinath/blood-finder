import type { Metadata } from 'next'
import { Suspense } from 'react'
import DonorSearch from '@/components/DonorSearch'

export const metadata: Metadata = {
  title: 'All Donors — Blood Finder',
  description:
    'Browse and search all verified blood donors across Bangladesh by blood type and location.',
}

export default function DonorsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-red-50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-10 text-center">
          <p className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-2">
            Find Donors
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            রক্তদাতা খুঁজুন
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            সারা বাংলাদেশের verified রক্তদাতাদের মধ্যে খুঁজুন — blood group,
            জেলা বা এলাকা দিয়ে ফিল্টার করে আপনার কাছের রক্তদাতা বের করুন।
          </p>
        </div>
      </section>

      <div className="pt-8">
        <Suspense
          fallback={
            <div className="max-w-6xl mx-auto px-4 pb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200 p-5 h-36 animate-pulse"
                  />
                ))}
              </div>
            </div>
          }
        >
          <DonorSearch />
        </Suspense>
      </div>
    </>
  )
}
