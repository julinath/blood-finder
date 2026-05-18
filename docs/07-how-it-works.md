# 07 — How it works (page render হওয়ার পুরো journey)

এই doc-এ আমরা দেখব — তুমি browser-এ একটা URL hit করার পর সব কী কী step-এ হয়, কোথায় code চলে, কেন server vs client distinction matter করে।

---

## C/C++ analogy

C/C++ এ:
```
main() → function call → output → terminate
```

Web app-এ একটা request:
```
URL hit → DNS → server → Next.js → Supabase → HTML → browser → React hydrate → user interacts
```

অনেক বেশি pieces — কিন্তু কোনটা কোথায় চলে সেটা বুঝলে সব clear।

---

## একটা request-এর জীবন

ধরো user `https://blood-finder-bangladesh.vercel.app/donors` open করল।

### Step 1: DNS lookup
Browser জিজ্ঞেস করে — `blood-finder-bangladesh.vercel.app` IP address কী? Vercel-এর CDN-এর nearest server-এর IP ফেরত আসে।

### Step 2: HTTPS connection
Browser আর Vercel server-এর মধ্যে TLS handshake — encrypted channel।

### Step 3: HTTP request পাঠানো
```
GET /donors HTTP/2
Host: blood-finder-bangladesh.vercel.app
Cookie: sb-xxxxx-auth-token=...
```

### Step 4: Vercel → Next.js → proxy.ts
Vercel আমাদের Next.js app চালু করে। **প্রথমে `proxy.ts`** চলে:
- Cookie থেকে session validate (Supabase auth check)
- `/donors` protected route না — pass through

### Step 5: Page component render (server)
[`src/app/donors/page.tsx`](../src/app/donors/page.tsx) — server component, server-এই run হয়:

```tsx
export default function DonorsPage() {
  return (
    <>
      <section>...hero...</section>
      <DonorSearch />
    </>
  )
}
```

এই server component HTML-এর string তৈরি করে।

### Step 6: HTML response পাঠানো
```html
<!DOCTYPE html>
<html>
  <body>
    <nav>...</nav>
    <section>...hero...</section>
    <div data-react-root>...</div>
    <footer>...</footer>
    <script src="/_next/static/.../client.js"></script>
  </body>
</html>
```

### Step 7: Browser-এ HTML render
User HTML দেখতে পায় — fast initial paint।

### Step 8: JavaScript download + hydrate
HTML-এর সাথে আসা `<script>`-গুলো download হয়। React সেই static HTML-এ "hydrate" করে — মানে event handlers attach করে, state setup করে। এখন button click ইত্যাদি কাজ করে।

### Step 9: Client component-এর work
[`DonorSearch.tsx`](../src/components/DonorSearch.tsx) client component — browser-এ Supabase call করে donor list fetch করে, grid render করে।

### Step 10: User interaction
User search button চাপলে → React state update → Supabase query → results re-render। কোনো full page reload না।

---

## Server Component vs Client Component

Next.js App Router-এর key concept। তোমাকে এটা ভালো করে বুঝতে হবে।

### Server Component (default)

- File-এ `'use client'` লেখা **নাই**
- শুধু server-এ run
- Result শুধু HTML হিসেবে browser-এ যায়
- Browser-এ কোনো JS বের হয় না (smaller bundle)
- `useState`, `useEffect` ব্যবহার করতে পারে না
- `onClick` handler দিতে পারে না
- কিন্তু **direct async function** হতে পারে, await করতে পারে, DB call করতে পারে

```tsx
// Server component
export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase.from('donors').select('*').limit(5)
  return <div>{data.map(d => <p>{d.name}</p>)}</div>
}
```

### Client Component

- File-এর প্রথম লাইনে `'use client'`
- Server-এ initial render হয়, কিন্তু browser-এও bundle আসে hydration-এর জন্য
- `useState`, `useEffect`, `onClick` সব কাজ করে
- DB call চলে, কিন্তু user-এর session-এ (RLS apply)

```tsx
'use client'

import { useState } from 'react'
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### কোনটা কখন?

| কাজ | Use |
|---|---|
| Just display data from DB | Server component |
| Static content | Server component |
| Form-এ state managing | Client component |
| Button click handler | Client component |
| `useState`, `useEffect` লাগে | Client component |
| Search input live filter | Client component |

### Mix করা যায়?

হ্যাঁ! Server component-এর ভিতরে client component import করা যায়। উদাহরণ:

```tsx
// app/page.tsx — server component
import Hero from '@/components/home/Hero'           // server
import DonorSearch from '@/components/DonorSearch'  // client

export default async function Home() {
  // server-এ data fetch
  return (
    <>
      <Hero />          {/* server */}
      <DonorSearch />   {/* client — interactive */}
    </>
  )
}
```

---

## Server Actions

Form submit হলে server-এ function চালানোর সবচেয়ে clean way — **Server Actions**।

আমাদের [`src/app/(main)/become-donor/actions.ts`](../src/app/(main)/become-donor/actions.ts):

```ts
'use server'   // ← এই directive file-এর সব function server-only

export async function registerAsDonor(_prev, formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // validation
  // database insert
  // revalidate cache
  redirect('/dashboard?flash=donor-pending')
}
```

Client component-এ এটা ব্যবহার:
```tsx
'use client'
import { registerAsDonor } from './actions'

function Form() {
  const [state, action] = useActionState(registerAsDonor, null)
  return <form action={action}>...</form>
}
```

### কেন server action?
- **Security** — validation, auth check server-এ (client-এ bypass করা যায় না)
- **Cache invalidation** — `revalidatePath` দিয়ে next page load fresh data দেয়
- **No API endpoint লেখা লাগে** — Next.js automatic এটাকে POST endpoint বানিয়ে দেয়

---

## Why server-first matters

আমাদের `/donors` page প্রথমবার load হলে:

### আগে (পুরোনো React-only)
1. Browser empty HTML পায়
2. JS download হয়
3. JS run করে DB থেকে data fetch করে
4. তারপর UI render হয়

User এই whole সময় খালি screen দেখে। SEO-ও খারাপ (Google crawler JS render করে না সব সময়)।

### এখন (Next.js server component)
1. Server data fetch করে, HTML সহ পাঠায়
2. Browser instant HTML render
3. JS background-এ download হয়ে interactivity add করে

User instant content দেখে। SEO ভালো (HTML-এ data থাকে)।

---

## Cache + revalidate

Server components-এর ফলাফল Next.js cache করে রাখতে পারে — same URL আবার hit হলে রি-render না করে cached HTML serve।

### Two approaches:

**1. Time-based** (`export const revalidate = 60`)
আমাদের home page এ আছে:
```tsx
export const revalidate = 60   // 60 seconds-এ cache refresh
```
Stats query প্রতি minute-এ refresh — 60s ভিতরে repeat visits cached data দেখে।

**2. On-demand** (`revalidatePath('/profile')`)
Become-donor server action-এ:
```ts
revalidatePath('/profile')
```
পরের request-এ /profile fresh data দেবে — cache invalidate।

---

## Form-এর Server Action workflow

আমাদের become-donor flow:

```
1. User /become-donor visit
   → page.tsx (server) profile fetch করে → form-এ defaults pass করে

2. User form fill করে Submit চাপে
   → browser form data + `useActionState` দিয়ে server action call

3. Server-এ registerAsDonor চলে
   → validate (blood type, location, mobile)
   → profiles upsert (mobile + location sync)
   → donors insert
   → revalidatePath('/profile'), revalidatePath('/dashboard')
   → redirect('/dashboard?flash=donor-pending')

4. Browser /dashboard?flash=donor-pending-এ navigate
   → flash toast দেখায়
   → fresh profile / dashboard data
```

কোনো manual `fetch()`, কোনো API endpoint, কোনো JSON parse — সব Next.js handle করে।

---

## কোন code কোথায় চলে — quick check

| Code | কোথায় run |
|---|---|
| `src/app/page.tsx` (no `'use client'`) | Server (Vercel) |
| `src/app/donors/page.tsx` | Server |
| `src/components/Hero.tsx` (no `'use client'`) | Server (render-time) |
| `src/components/DonorSearch.tsx` (`'use client'`) | Server initial + Browser |
| `src/components/Navbar.tsx` (`'use client'`) | Server initial + Browser |
| `src/proxy.ts` | Server (Vercel Edge/Function) |
| `actions.ts` (`'use server'`) | Server only |
| `supabase/server.ts` | Server only |
| `supabase/client.ts` | Browser |

---

## পরবর্তী পড়া

প্রতিটা key feature trace-by-trace → [08-feature-walkthroughs.md](08-feature-walkthroughs.md)
