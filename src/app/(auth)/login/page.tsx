'use client'

import { Suspense, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GoogleIcon from '@/components/GoogleIcon'
import { parseAuthIdentifier } from '@/lib/auth-identifier'
import { FIELD_CLASS } from '@/components/ui/form'
import { safeNextPath, withFlash } from '@/lib/safe-next'

export default function LoginPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const next = safeNextPath(useSearchParams().get('next'))
  const supabase = useMemo(() => createClient(), [])
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const parsed = parseAuthIdentifier(identifier)
    if (!parsed) {
      setError('সঠিক email অথবা mobile number দিন।')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password,
    })
    if (error) {
      setError('Email/mobile অথবা password ভুল — আবার চেষ্টা করুন।')
      setLoading(false)
      return
    }
    // Back to where they came from (e.g. /become-donor), else the profile.
    router.push(withFlash(next ?? '/profile', 'login-ok'))
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

  const registerHref = next ? `/register?next=${encodeURIComponent(next)}` : '/register'

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your Blood Finder account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {next && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-6 text-center">
              চালিয়ে যেতে আগে লগইন করুন — অথবা নতুন হলে{' '}
              <Link href={registerHref} className="font-semibold underline">
                রেজিস্টার
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

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3"
              >
                {error}
              </div>
            )}
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1.5">
                Email বা Mobile Number
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
                className={FIELD_CLASS}
                placeholder="you@example.com অথবা 01XXXXXXXXX"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1.5">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={FIELD_CLASS}
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              disabled={loading || googleLoading}
              aria-busy={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href={registerHref} className="text-red-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
