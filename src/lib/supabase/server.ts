import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        // `cookies().set` throws when called from a Server Component context
        // (only Route Handlers / Server Actions / Proxy may write cookies).
        // That's expected here — proxy.ts refreshes the session on every
        // navigation, so swallowing this is safe. Log unexpected errors in dev.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            const message = err instanceof Error ? err.message : String(err)
            if (!/Server Component/i.test(message)) {
              console.warn('[supabase/server] cookie write failed:', message)
            }
          }
        }
      },
    },
  })
}
