'use client'

import { Suspense, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GoogleIcon from '@/components/GoogleIcon'
import { MIN_PASSWORD_LENGTH } from '@/lib/validation'
import { parseAuthIdentifier } from '@/lib/auth-identifier'
import { Field, FIELD_CLASS } from '@/components/ui/form'
import { safeNextPath, withFlash } from '@/lib/safe-next'

type Form = { full_name: string; identifier: string; password: string; confirm: string }

export default function RegisterPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const router = useRouter()
  const next = safeNextPath(useSearchParams().get('next'))
  const supabase = useMemo(() => createClient(), [])
  const [form, setForm] = useState<Form>({
    full_name: '',
    identifier: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const set =
    <K extends keyof Form>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const fullName = form.full_name.trim()
    if (!fullName) {
      setError('পুরো নাম লিখুন।')
      return
    }
    const identifier = parseAuthIdentifier(form.identifier)
    if (!identifier) {
      setError('সঠিক email অথবা mobile number দিন (যেমন: 01712345678)।')
      return
    }
    if (form.password !== form.confirm) {
      setError('দুটি password মেলেনি — আবার দেখুন।')
      return
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password কমপক্ষে ${MIN_PASSWORD_LENGTH} অক্ষরের হতে হবে।`)
      return
    }

    setLoading(true)

    // Mobile signups use a synthetic email under the hood (Supabase Auth is
    // email-based); the mobile lands on the profile via signup metadata.
    const { error } = await supabase.auth.signUp({
      email: identifier.email,
      password: form.password,
      options: {
        data: {
          full_name: fullName,
          ...(identifier.kind === 'mobile' ? { mobile: identifier.mobile } : {}),
        },
      },
    })

    if (error) {
      setError(
        error.message.includes('already registered')
          ? 'এই email/mobile দিয়ে আগে থেকেই অ্যাকাউন্ট আছে — Login করুন।'
          : error.message,
      )
      setLoading(false)
      return
    }

    // Continue to where they were headed (e.g. /become-donor), else profile.
    router.push(withFlash(next ?? '/profile', 'registered'))
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    const callback = `${window.location.origin}/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ''
    }`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callback },
    })
    if (error) {
      setError('Google সাইন-ইন শুরু করা যায়নি। আবার চেষ্টা করুন।')
      setGoogleLoading(false)
    }
  }

  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : '/login'

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-2">Join Blood Finder and save lives</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {next && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-6 text-center">
              চালিয়ে যেতে একটি অ্যাকাউন্ট খুলুন — অথবা আগে থেকে থাকলে{' '}
              <Link href={loginHref} className="font-semibold underline">
                লগইন
              </Link>{' '}
              করুন।
            </div>
          )}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            aria-busy={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6 disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 uppercase">
              <span className="bg-white px-3">or</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3"
              >
                {error}
              </div>
            )}
            <Field label="Full Name">
              <input
                type="text"
                value={form.full_name}
                onChange={set('full_name')}
                required
                autoComplete="name"
                className={inputClass}
                placeholder="Jewel Ahmed"
              />
            </Field>
            <Field label="Email বা Mobile Number">
              <input
                type="text"
                value={form.identifier}
                onChange={set('identifier')}
                required
                autoComplete="username"
                className={inputClass}
                placeholder="you@example.com অথবা 01XXXXXXXXX"
              />
              <span className="block text-xs text-gray-400 mt-1">
                Email না থাকলে মোবাইল নম্বর দিয়েই অ্যাকাউন্ট খুলতে পারবেন।
              </span>
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                className={inputClass}
                placeholder={`Min. ${MIN_PASSWORD_LENGTH} characters`}
              />
            </Field>
            <Field label="Confirm Password">
              <input
                type="password"
                value={form.confirm}
                onChange={set('confirm')}
                required
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                className={inputClass}
                placeholder="••••••••"
              />
            </Field>
            <button
              type="submit"
              disabled={loading || googleLoading}
              aria-busy={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href={loginHref} className="text-red-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const inputClass = FIELD_CLASS
