import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Only allow relative redirects to avoid open-redirect abuse
  const rawNext = searchParams.get('next') ?? '/profile'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/profile'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // The DB trigger handles first-time signups, but pre-existing users (or
      // OAuth providers that don't expose `full_name`) can end up with an
      // empty profile row. Sync the auth user's metadata into the profile so
      // the dashboard, navbar, and donor cards always have a name.
      const user = data.user
      if (user) {
        const meta = user.user_metadata ?? {}
        const fullName =
          (typeof meta.full_name === 'string' && meta.full_name) ||
          (typeof meta.name === 'string' && meta.name) ||
          ''

        const { data: existing } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle()

        // Keep an already-customised name; otherwise fall back to metadata.
        const resolvedName =
          existing?.full_name && existing.full_name.trim() !== ''
            ? existing.full_name
            : fullName

        // Upsert so users who pre-date the trigger still get a profile row.
        await supabase.from('profiles').upsert(
          {
            id: user.id,
            email: user.email ?? '',
            full_name: resolvedName,
          },
          { onConflict: 'id' },
        )
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('[auth/callback] exchange failed:', error.message)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
