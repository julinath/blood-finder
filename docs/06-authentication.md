# 06 — Authentication (login কীভাবে কাজ করে)

এই doc-এ আমরা দেখব Blood Finder-এ login system কীভাবে কাজ করে — কোথায় password verify হয়, session কীভাবে browser-এ থাকে, Google OAuth এ কী হয়, এবং কীভাবে protected page-এ unauthorized user-কে block করা হয়।

---

## Background — Authentication vs Authorization

| Term | মানে | উদাহরণ |
|---|---|---|
| **Authentication** | "তুমি কে?" | password verify, Google login |
| **Authorization** | "তুমি কী করতে পারবে?" | admin check, RLS policies |

আমাদের authentication করে **Supabase Auth**। Authorization-এর কিছু client/server check + বেশিরভাগ **RLS** ([05-database.md](05-database.md))।

---

## Session, Cookie — basic concepts

HTTP **stateless** — প্রতি request আলাদা, server "মনে রাখে" না কে আগে log in করেছিল।

Solution: **Cookie**। Login successful হলে server browser-কে একটা encrypted token দেয় (cookie-এ store হয়)। প্রতি request-এ browser cookie পাঠায় — server token verify করে চিনে নেয়।

Supabase cookie-এ একটা **JWT (JSON Web Token)** রাখে যেটার ভিতরে user-এর id, expiration time, signature থাকে।

---

## আমাদের Auth flows

৩টা flow আছে:

1. **Email/Password Register + Login**
2. **Google OAuth Login**
3. **Logout**

প্লাস: **session refresh** আর **route protection**।

---

## Flow 1 — Email/Password Register

User goes to `/register` → form (নাম, email, password) → submit।

[`src/app/(auth)/register/page.tsx`](../src/app/(auth)/register/page.tsx) (client component):

```ts
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { full_name: fullName } }
})
```

### কী হয় background-এ:

1. Supabase Auth-এ user create হয় (`auth.users` table-এ row)
2. আমাদের `handle_new_user` trigger fire হয় → `profiles` table-এ corresponding row create
3. Supabase একটা confirmation email পাঠায় (default-এ enabled — তবে dev-এ off করা যায়)
4. User email link click করলে confirmed হয়
5. তারপর login করতে পারে

> Email confirmation Supabase dashboard → Authentication → Email templates / Settings থেকে on/off করা যায়।

---

## Flow 2 — Email/Password Login

[`src/app/(auth)/login/page.tsx`](../src/app/(auth)/login/page.tsx):

```ts
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})
```

### Behind the scene:

1. Supabase password verify করে (bcrypt hash compare)
2. JWT (session token) generate করে
3. Browser-এ cookies set হয় (`sb-xxxxx-auth-token`)
4. Page redirect → `/dashboard?flash=login-ok`

এই cookie-ই পরের সব request-এর সাথে যাবে — server চিনবে কে user।

---

## Flow 3 — Google OAuth

[`src/app/(auth)/login/page.tsx`](../src/app/(auth)/login/page.tsx)-এ "Continue with Google" button:

```ts
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` }
})
```

### Step-by-step:

1. User Google button click করে
2. Supabase user-কে Google sign-in page-এ redirect করে
3. User Google account দিয়ে authorize করে
4. Google ফেরত পাঠায় `https://xxxxx.supabase.co/auth/v1/callback?code=...`-এ
5. Supabase সেই code Google থেকে verify করে user-কে আমাদের `/auth/callback?code=...`-এ redirect করে

### আমাদের callback handler

[`src/app/auth/callback/route.ts`](../src/app/auth/callback/route.ts):

```ts
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${url.origin}/dashboard`)
}
```

### কী হয়:
1. URL থেকে `code` extract
2. Supabase-এ exchange — code-এর বিনিময়ে session token
3. Browser-এ session cookie set
4. `/dashboard`-এ redirect

### Profile-এর কী হয়?

Google থেকে আসা user-এর জন্যও **same trigger** fire হয় (`handle_new_user`):
- `raw_user_meta_data->>'full_name'` থেকে নাম copy (Google "full_name" আকারে দেয়)
- email copy
- profile row create

মানে Google user-এর জন্যও আমাদের `profiles` table-এ entry থাকে।

---

## Flow 4 — Logout

[`src/components/Navbar.tsx`](../src/components/Navbar.tsx):

```ts
await supabase.auth.signOut()
router.push('/')
router.refresh()
```

`signOut()` cookie clear করে — server পরের request-এ user-কে চিনবে না।

---

## Session Refresh — proxy.ts-এর কাজ

JWT token-এর expiration থাকে (সাধারণত ১ ঘণ্টা)। Token expire হয়ে গেলে user-কে আবার login করতে দেওয়া বিরক্তিকর হবে।

Supabase একটা **refresh token**-ও রাখে (longer expiry)। Refresh token দিয়ে নতুন JWT নেওয়া যায়।

আমাদের [`src/proxy.ts`](../src/proxy.ts) প্রতি request-এ এই refresh করে দেয়:

```ts
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // এই call automatic refresh trigger করে if needed
  const { data: { user } } = await supabase.auth.getUser()
  ...
}
```

### এই function কখন চলে?

প্রতি request-এ। (Except static assets — see `config.matcher` at bottom of file)

---

## Route Protection — proxy-এর দ্বিতীয় কাজ

`proxy.ts`-এর পরের অংশ:

```ts
const protectedRoutes = ['/dashboard', '/become-donor', '/request', '/admin', '/profile']
const authRoutes = ['/login', '/register']
const path = request.nextUrl.pathname

if (!user && protectedRoutes.some(r => path.startsWith(r))) {
  return NextResponse.redirect(new URL('/login', request.url))
}

if (user && authRoutes.some(r => path.startsWith(r))) {
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

### বাংলায়:

- **Logged-out user `/dashboard` যেতে চাইলে** → force redirect to `/login`
- **Logged-in user `/login` যেতে চাইলে** → force redirect to `/dashboard` (অর্থহীন তো!)

Protected routes-এ flow:
```
User clicks /dashboard
   ↓
proxy.ts runs
   ↓
session check → no user
   ↓
redirect to /login
```

এই check **server-side** — JavaScript disabled থাকলেও বাইপাস করা যায় না।

---

## Admin Authorization

`is_admin` check দুই জায়গায়:

### 1. Client-side (Navbar — যাতে link দেখায়)

[`src/components/Navbar.tsx`](../src/components/Navbar.tsx):

```ts
useEffect(() => {
  if (!user) return
  supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()
    .then(({ data }) => setIsAdmin(data?.is_admin ?? false))
}, [supabase, user, pathname])

{isAdmin && <NavLink href="/admin">Admin</NavLink>}
```

পরিষ্কার: এটা শুধু UI hint। কেউ direct URL `/admin` type করলে এই check বাঁচায় না।

### 2. Server-side (actual security)

[`src/app/admin/page.tsx`](../src/app/admin/page.tsx):

```ts
const { data: profile } = await supabase
  .from('profiles')
  .select('is_admin')
  .eq('id', user.id)
  .maybeSingle()
if (!profile?.is_admin) redirect('/dashboard')
```

[`src/app/admin/actions.ts`](../src/app/admin/actions.ts):

```ts
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profile?.is_admin) throw new Error('Forbidden')
  return { supabase, user }
}
```

প্রতি admin action-এ এই function call হয় — even if কেউ JavaScript bypass করে directly server action-ই hit করে।

### 3. RLS Layer

এমনকি যদি কোনোভাবে protection bypass হয়, RLS-ও আছে। `"Admins can update any donor"` policy DB-level-এ block করে non-admin updates। **Defence in depth**।

---

## পুরো picture — একসাথে

```
┌──────────────────────────────────────────────────────────┐
│ User browser                                              │
│  - cookie-এ Supabase session token                       │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTP request (cookie সহ)
                     ▼
┌──────────────────────────────────────────────────────────┐
│ proxy.ts runs first                                       │
│  - Cookie → Supabase session validate                    │
│  - Token refresh if needed                               │
│  - Protected route + no user → redirect /login           │
└────────────────────┬─────────────────────────────────────┘
                     │ Allow
                     ▼
┌──────────────────────────────────────────────────────────┐
│ Page component (server)                                   │
│  - getUser() → who's logged in                           │
│  - Extra check (admin / donor / etc.)                    │
│  - Supabase query for page data                          │
└────────────────────┬─────────────────────────────────────┘
                     │ Render
                     ▼
┌──────────────────────────────────────────────────────────┐
│ Supabase Postgres                                         │
│  - RLS check: এই user এই row পেতে পারে?                │
│  - SELECT / INSERT / UPDATE অনুমতিভিত্তিক               │
└──────────────────────────────────────────────────────────┘
```

---

## Common questions

### Q: Cookie steal করলে hacker login করতে পারবে?
A: হ্যাঁ, যদি hacker সেই cookie পায়। তাই HTTPS mandatory (Vercel auto)। আর JWT-তে expiration থাকে।

### Q: Password কোথায় store হয়?
A: Supabase-এর `auth.users` table-এ — bcrypt hash হিসেবে। Plain text কখনো store হয় না, এমনকি admin-ও দেখতে পারে না।

### Q: Google OAuth-এ Google আমাদের password জানে?
A: না। আমরা শুধু Google-এর granted permission পাই (email, name)। Password Google-এর কাছে।

### Q: এই project কি "secure"?
A: Production-level secure বলা যাবে না — production-এ আরো hardening দরকার (rate limiting, 2FA, audit log, etc.)। কিন্তু school project-এর জন্য standard practices follow করা: RLS, server actions, HTTPS, JWT, no plain text password।

---

## পরবর্তী পড়া

পুরো একটা page render হওয়ার flow → [07-how-it-works.md](07-how-it-works.md)
