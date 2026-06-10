'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// Centralised flash-message catalog. Pages push to `?flash=<key>` and we
// render the matching message. Keeps URLs clean of free-text content.
// Language policy: messages for general users are Bengali; admin-panel
// messages stay English (the admin UI is English-labelled).
const FLASH_MESSAGES: Record<
  string,
  { type: 'success' | 'info' | 'error'; text: string }
> = {
  registered: {
    type: 'success',
    text: 'স্বাগতম! আপনার অ্যাকাউন্ট তৈরি হয়েছে।',
  },
  'login-ok': {
    type: 'success',
    text: 'সাইন ইন সফল হয়েছে।',
  },
  'donor-pending': {
    type: 'info',
    text: 'রক্তদাতা হওয়ার আবেদন জমা পড়েছে। অ্যাডমিন যাচাই করে শীঘ্রই অনুমোদন দেবেন।',
  },
  'donor-approved': {
    type: 'success',
    text: 'Donor approved.',
  },
  'donor-rejected': {
    type: 'success',
    text: 'Donor rejected and removed.',
  },
  'donor-unapproved': {
    type: 'success',
    text: 'Donor hidden from public search.',
  },
  'donor-removed': {
    type: 'success',
    text: 'Donor record removed.',
  },
  'admin-granted': {
    type: 'success',
    text: 'Admin access granted.',
  },
  'admin-revoked': {
    type: 'success',
    text: 'Admin access revoked.',
  },
  'user-deleted': {
    type: 'success',
    text: 'User deleted permanently.',
  },
  'request-sent': {
    type: 'success',
    text: 'রিকোয়েস্ট পাঠানো হয়েছে! রক্তদাতা রাজি হলে এখানে স্ট্যাটাস দেখতে পাবেন।',
  },
  'request-accepted': {
    type: 'success',
    text: 'রিকোয়েস্ট গ্রহণ করেছেন। রক্তদান হয়ে গেলে “রক্ত দিয়েছি” বাটনে চাপ দিন।',
  },
  'request-completed': {
    type: 'success',
    text: 'ধন্যবাদ! আপনার রক্তদান রেকর্ড হয়েছে এবং রিকোয়েস্ট সম্পন্ন হয়েছে। 🩸',
  },
  'request-declined': {
    type: 'success',
    text: 'রিকোয়েস্টটি ফিরিয়ে দেওয়া হয়েছে।',
  },
  'request-cancelled': {
    type: 'success',
    text: 'রিকোয়েস্ট বাতিল করা হয়েছে।',
  },
  'availability-on': {
    type: 'success',
    text: 'আপনি এখন Available — রক্তদাতার তালিকায় দেখা যাবেন।',
  },
  'availability-off': {
    type: 'success',
    text: 'আপনি এখন Unavailable — তালিকা থেকে সাময়িকভাবে আড়ালে থাকবেন।',
  },
  'emergency-posted': {
    type: 'success',
    text: 'রিকোয়েস্ট পোস্ট হয়েছে। আপনার এলাকার রক্তদাতারা এটি দেখতে পাবেন।',
  },
  'emergency-fulfilled': {
    type: 'success',
    text: 'ধন্যবাদ! রিকোয়েস্ট সম্পন্ন হিসেবে চিহ্নিত হয়েছে।',
  },
  'donation-credited': {
    type: 'success',
    text: 'ধন্যবাদ! রক্তদানটি রক্তদাতার হিসাবে যোগ হয়েছে এবং রিকোয়েস্ট সম্পন্ন হয়েছে।',
  },
  'emergency-cancelled': {
    type: 'success',
    text: 'রিকোয়েস্ট বাতিল করা হয়েছে।',
  },
  'report-resolved': {
    type: 'success',
    text: 'Report marked as resolved.',
  },
  'report-reviewed': {
    type: 'success',
    text: 'Report marked as reviewed.',
  },
  'emergency-expired': {
    type: 'success',
    text: 'Emergency request marked as expired.',
  },
  'cannot-self-demote': {
    type: 'error',
    text: 'You cannot remove your own admin access.',
  },
  'cannot-self-delete': {
    type: 'error',
    text: 'You cannot delete your own account.',
  },
  'demote-before-delete': {
    type: 'error',
    text: 'Revoke admin access before deleting an admin.',
  },
  'action-failed': {
    type: 'error',
    text: 'দুঃখিত, কাজটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।',
  },
}

const AUTO_DISMISS_MS = 4000

function FlashItem({ entryKey }: { entryKey: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false)
      // Strip the param so refresh doesn't replay the toast.
      const next = new URLSearchParams(params.toString())
      next.delete('flash')
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, AUTO_DISMISS_MS)
    return () => clearTimeout(timeout)
  }, [params, pathname, router])

  const entry = FLASH_MESSAGES[entryKey]
  if (!visible || !entry) return null

  const palette =
    entry.type === 'success'
      ? 'bg-green-50 border-green-200 text-green-800'
      : entry.type === 'error'
        ? 'bg-red-50 border-red-200 text-red-800'
        : 'bg-blue-50 border-blue-200 text-blue-800'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 max-w-md w-[calc(100%-2rem)]"
    >
      <div
        className={`${palette} border rounded-xl px-4 py-3 text-sm font-medium shadow-sm flex items-center gap-2`}
      >
        <span aria-hidden="true">
          {entry.type === 'success' ? '✅' : entry.type === 'error' ? '⚠️' : 'ℹ️'}
        </span>
        <span>{entry.text}</span>
      </div>
    </div>
  )
}

function FlashInner() {
  const params = useSearchParams()
  const key = params.get('flash')
  if (!key || !FLASH_MESSAGES[key]) return null
  // Use the key as React key so a different flash remounts the item, giving
  // it a fresh dismiss timer and avoiding setState-in-effect anti-patterns.
  return <FlashItem key={key} entryKey={key} />
}

export default function Flash() {
  // Suspense boundary required because useSearchParams suspends during prerender.
  return (
    <Suspense fallback={null}>
      <FlashInner />
    </Suspense>
  )
}
