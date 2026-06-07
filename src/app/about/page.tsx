import Link from 'next/link'

export const metadata = {
  title: 'About Us | Blood Finder',
  description:
    'Blood Finder — RMSTU-এর একটি প্রজেক্ট যা বাংলাদেশের জন্য একটি বিশ্বাসযোগ্য রক্তদাতা নেটওয়ার্ক গড়ে তুলতে চায়।',
}

const TEAM = [
  { name: 'Juli Nath', id: '2401011004' },
  { name: 'Asma Akter', id: '2401011021' },
  { name: 'Mom Chakraborti', id: '2401011034' },
] as const

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Intro */}
      <div className="text-center mb-12">
        <div
          className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-5"
          aria-hidden="true"
        >
          <span className="text-3xl">🩸</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">About Us</h1>
        <p className="text-gray-500 mt-3 leading-relaxed">
          আমরা <strong>Rangamati Science and Technology University (RMSTU)</strong>{' '}
          — CSE 11th Batch-এর শিক্ষার্থী। <strong>Blood Finder</strong> আমাদের{' '}
          Object Oriented Programming (OOP) Lab-এর প্রজেক্ট। আমাদের লক্ষ্য — এই
          University Lab Project-কে একটি সত্যিকারের real-life solution-এ রূপ দেওয়া,
          যা মানুষ জরুরি প্রয়োজনে ব্যবহার করতে পারবে।
        </p>
      </div>

      {/* Mission */}
      <section className="bg-red-50 border border-red-100 rounded-2xl p-7 mb-10 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">আমাদের লক্ষ্য</h2>
        <p className="text-gray-700 leading-relaxed">
          বাংলাদেশের প্রতিটি জরুরি মুহূর্তে দ্রুত, নিরাপদ ও বিশ্বাসযোগ্য রক্তদাতা
          খুঁজে পেতে সাহায্য করা — এবং রক্তদানকে সবার জন্য সহজ ও স্বচ্ছ করে তোলা।
        </p>
      </section>

      {/* Team */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">আমাদের টিম</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEAM.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center"
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full mb-3 font-bold"
                aria-hidden="true"
              >
                {member.name.charAt(0)}
              </div>
              <p className="font-semibold text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-400 mt-1">ID: {member.id}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supervisor */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-10 text-center">
        <p className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-2">
          Supervisor
        </p>
        <p className="font-semibold text-gray-900">Dhonita Tripura</p>
        <p className="text-sm text-gray-500">Assistant Professor, CSE — RMSTU</p>
      </section>

      {/* Contact */}
      <section className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">যোগাযোগ</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <a
              href="mailto:julinath2006@gmail.com"
              className="text-red-600 hover:underline"
            >
              📧 julinath2006@gmail.com
            </a>
          </li>
          <li>
            <a href="tel:+8801623384742" className="text-red-600 hover:underline">
              📞 +880 1623-384742
            </a>
          </li>
          <li>📍 Rangamati, Chittagong, Bangladesh</li>
        </ul>

        <Link
          href="/become-donor"
          className="inline-block mt-8 bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          আমাদের সাথে যুক্ত হোন — Be a Donor
        </Link>
      </section>
    </div>
  )
}
