import Link from 'next/link'

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/emergency', label: 'Emergency Requests' },
  { href: '/donors', label: 'Find Donors' },
  { href: '/become-donor', label: 'Become a Donor' },
  { href: '/stats', label: 'Statistics' },
  { href: '/about', label: 'About Us' },
] as const

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">🩸</span>
              <span className="font-bold text-lg text-white">Blood Finder</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              বাংলাদেশের জন্য একটি বিশ্বাসযোগ্য রক্তদাতা খোঁজার প্ল্যাটফর্ম। দ্রুত,
              নিরাপদ এবং সম্পূর্ণ বিনামূল্যে।
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a
                  href="mailto:julinath2006@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  📧 julinath2006@gmail.com
                </a>
              </li>
              <li>📍 Rangamati, Chittagong, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Blood Finder. All rights reserved.</p>
          <p>Built with care to save lives in Bangladesh 🇧🇩</p>
        </div>
      </div>
    </footer>
  )
}
