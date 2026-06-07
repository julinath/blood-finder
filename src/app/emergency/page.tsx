import Link from 'next/link'
import EmergencyFeed from './_components'

export const metadata = {
  title: 'ইমার্জেন্সি রক্তের রিকোয়েস্ট | Blood Finder',
  description:
    'এই মুহূর্তে যেসব রোগী জরুরি রক্তের অপেক্ষায় আছে তাদের তালিকা — আপনার এলাকায় কারো রক্ত লাগলে এগিয়ে আসুন।',
}

export default function EmergencyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          ইমার্জেন্সি রক্তের রিকোয়েস্ট
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          এই মুহূর্তে যেসব রোগী জরুরি রক্তের অপেক্ষায় আছে তাদের তালিকা। আপনার
          এলাকায় কারো রক্ত লাগলে এগিয়ে আসুন।
        </p>
        <Link
          href="/emergency/new"
          className="inline-block mt-5 bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
        >
          + রক্তের রিকোয়েস্ট দিন
        </Link>
      </div>

      <EmergencyFeed />
    </div>
  )
}
