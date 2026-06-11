import DonorMapSection from '@/components/stats/DonorMapSection'

// Stats are cheap aggregations — refresh once a minute, not on every visit.
export const revalidate = 60

export const metadata = {
  title: 'পরিসংখ্যান | Blood Finder',
  description:
    'বাংলাদেশের জেলা-ভিত্তিক রক্তদাতা ও ব্লাড গ্রুপের পরিসংখ্যান — ইন্টারেক্টিভ ম্যাপে দেখুন।',
}

export default function StatsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          বাংলাদেশে রক্তদাতার চিত্র
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          কোন জেলায় কতজন রক্তদাতা আছেন এবং কোন Blood Group কত — ইন্টারেক্টিভ
          ম্যাপে দেখুন।
        </p>
      </div>
      <DonorMapSection />
    </div>
  )
}
