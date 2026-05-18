const STEPS = [
  {
    num: 1,
    icon: '🔍',
    title: 'Search Donor',
    desc: 'রক্তের গ্রুপ ও এলাকা দিয়ে দ্রুত verified donor খুঁজুন।',
  },
  {
    num: 2,
    icon: '✉️',
    title: 'Send Request',
    desc: 'এক ক্লিকে donor কে রক্তের অনুরোধ পাঠান, কোনো ঝামেলা ছাড়াই।',
  },
  {
    num: 3,
    icon: '❤️',
    title: 'Save a Life',
    desc: 'রক্তদানের মাধ্যমে একজনের জীবন বাঁচানোর অংশ হোন।',
  },
] as const

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-wider text-red-600 font-semibold mb-2">
          How it works
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          তিনটি সহজ ধাপে রক্তদাতা খুঁজুন
        </h2>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Connecting donors and recipients in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:border-red-200 hover:shadow-md transition-all"
          >
            <div
              className="inline-flex items-center justify-center w-14 h-14 bg-red-50 text-3xl rounded-2xl mb-4"
              aria-hidden="true"
            >
              {step.icon}
            </div>
            <div className="text-xs font-semibold text-red-600 mb-1">
              STEP {step.num}
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
