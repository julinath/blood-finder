# 04 — Project Structure (folder-by-folder)

এই doc-এ পুরো project folder-এর tour। কোথায় কী আছে এবং কেন আছে।

---

## Top-level files

```
blood-finder/
├── src/                    ← আসল code এখানে
├── docs/                   ← এই documentation
├── public/                 ← Static files (favicon, image)
├── node_modules/           ← npm packages (gitignored)
├── .next/                  ← Build output (gitignored)
├── .env.local              ← Secret keys (gitignored)
├── .env.example            ← Template for .env.local
├── .gitignore              ← কোন file git-এ যাবে না
├── package.json            ← Dependencies + scripts
├── package-lock.json       ← Exact installed versions
├── tsconfig.json           ← TypeScript config
├── next.config.ts          ← Next.js config
├── eslint.config.mjs       ← Lint rules
├── postcss.config.mjs      ← Tailwind সাথে কাজের জন্য
├── supabase-schema.sql     ← Database setup SQL
├── README.md               ← GitHub-এ landing
├── CLAUDE.md               ← Claude/AI agent-এর জন্য guide
└── AGENTS.md               ← AI agent extra rules
```

### এই file গুলো বুঝে নাও

| File | কী এতে |
|---|---|
| **package.json** | Project name, dependencies list (next, react, supabase), scripts (`dev`, `build`, `lint`) |
| **tsconfig.json** | TypeScript কীভাবে compile হবে — strictness, target, paths (`@/` = `src/`) |
| **next.config.ts** | Next.js config — খুব minimal আমাদের |
| **supabase-schema.sql** | পুরো database structure SQL-এ — Supabase-এ run করলে সব table + RLS তৈরি |
| **.env.local** | তোমার Supabase URL + API key — git-এ যায় না |

---

## `src/` — মূল code

```
src/
├── app/                    ← Pages + routes (Next.js App Router)
├── components/             ← Reusable UI pieces
├── lib/                    ← Helper functions + clients
├── types/                  ← Shared TypeScript types
└── proxy.ts                ← Middleware (auth gate)
```

---

## `src/app/` — সব pages/routes

Next.js App Router-এ **folder = URL path**, আর প্রতিটা folder-এ `page.tsx` থাকে।

```
src/app/
├── layout.tsx              ← সব page-এর wrapper (Navbar + Footer + html shell)
├── globals.css             ← Tailwind import
├── favicon.ico             ← Browser tab icon
├── page.tsx                ← / (Home page)
│
├── (auth)/                 ← Route group — login/register
│   ├── login/page.tsx      → /login
│   └── register/page.tsx   → /register
│
├── (main)/                 ← Route group — protected pages
│   ├── dashboard/          → /dashboard
│   ├── profile/            → /profile
│   ├── become-donor/       → /become-donor
│   └── request/            → /request
│
├── donors/                 → /donors (browse all)
│   └── page.tsx
│
├── donor/                  → /donor/[id] (individual public profile)
│   └── [id]/page.tsx
│
├── admin/                  → /admin (admin-only)
│   ├── page.tsx
│   ├── actions.ts          ← Server actions
│   └── _components.tsx     ← Client components
│
└── auth/                   → Google OAuth callback
    └── callback/route.ts
```

### Route group কী?

`(auth)` বা `(main)` — bracketed folder URL-এ আসে না, শুধু code organization-এর জন্য। যেমন:

- `src/app/(auth)/login/page.tsx` → URL: `/login` (not `/auth/login`)
- `src/app/(main)/dashboard/page.tsx` → URL: `/dashboard`

কেন: পরে যদি আমরা auth pages-এর জন্য আলাদা layout চাই, এই grouping সাহায্য করবে।

### `_components.tsx` underscore কেন?

`_` দিয়ে শুরু folder/file URL-এ আসে না। এটা **private** convention — শুধু সেই page-এর জন্য local components রাখি। Reusable হলে `src/components/`-এ যেত।

### Dynamic route `[id]` কী?

`donor/[id]/page.tsx` — URL `/donor/123`, `/donor/abc-xyz` যেকোনো id-এর জন্য কাজ করে। Code-এ `params.id` দিয়ে value পাওয়া যায়।

### Server Action file (`actions.ts`)

`'use server'` লিখে শুরু — এই file-এর function-গুলো server-এ run হবে, browser-এ পাঠানো হবে না। Database write, validation, redirect — সব security-sensitive কাজ এখানে।

---

## `src/app/` — প্রতি page-এ কী

| Folder | কী page, কে দেখতে পারে |
|---|---|
| `page.tsx` | **Home** — Hero + Stats + Featured donors + How it works + Why donate (public) |
| `(auth)/login` | **Login** form (public) |
| `(auth)/register` | **Register** form (public) |
| `auth/callback/route.ts` | Google OAuth-এর redirect এখানে আসে (public) |
| `donors/page.tsx` | **All donors browse** + search (public) |
| `donor/[id]/page.tsx` | **Individual donor's public profile** — name, blood type, location (public) |
| `(main)/dashboard` | User dashboard — donor status, sent/received requests (logged-in) |
| `(main)/profile` | Profile edit — name, mobile, location (logged-in) |
| `(main)/become-donor` | Donor registration form (logged-in) |
| `(main)/request` | Send blood request to a donor (logged-in) |
| `admin/page.tsx` | Admin panel — approve donors, view requests, manage users (admin only) |

> **Public** = login ছাড়া দেখা যায়
> **Logged-in** = Supabase session লাগে
> **Admin only** = `profiles.is_admin = true` লাগে

---

## `src/components/` — Reusable UI

```
src/components/
├── Navbar.tsx              ← Top navigation bar (সব page-এ)
├── Footer.tsx              ← Footer (সব page-এ)
├── Flash.tsx               ← Toast/notification message
├── DonorSearch.tsx         ← Search form + donor cards grid (preview/full mode)
├── BloodTypeBadge.tsx      ← A+ / O- ধরনের colored badge
├── StatusBadge.tsx         ← Request status (Pending/Accepted/...) badge
├── GoogleIcon.tsx          ← Google logo SVG
├── home/                   ← Home page-এর section components
│   ├── Hero.tsx            ← "রক্ত দিন, জীবন বাঁচান" hero
│   ├── StatsStrip.tsx      ← 3 stat cards (donors, available, blood groups)
│   ├── HowItWorks.tsx      ← 3-step explainer
│   └── WhyDonate.tsx       ← Bangla facts + mission
└── ui/                     ← Lower-level UI primitives (যদি কিছু থাকে)
```

### কখন component বানাব?

- কোনো UI ৩+ জায়গায় repeat হলে → component
- 100+ lines-এর JSX এক page-এ → break into components
- কোনো জিনিস visually self-contained (Card, Badge, Modal) → component

### Client vs Server component?

- উপরে `'use client'` লেখা থাকলে → **Client component** (browser-এ run, state/event handlers থাকতে পারে)
- কিছু না লিখলে → **Server component** (default — server-এ render হয়, smaller bundle)

বিস্তারিত [07-how-it-works.md](07-how-it-works.md)-এ।

---

## `src/lib/` — Helper functions

```
src/lib/
├── supabase/
│   ├── client.ts           ← Browser-এ Supabase client বানানো
│   ├── server.ts           ← Server-এ Supabase client বানানো
│   └── env.ts              ← .env থেকে URL/key load
├── eligibility.ts          ← Donor eligible কিনা calculate (4 মাস rule)
└── validation.ts           ← Mobile validation (Bangladesh format)
```

### `supabase/client.ts` vs `supabase/server.ts`

দুটো **আলাদা Supabase client** কেন?

- **Browser-এ** (`client.ts`) — user-এর session cookie থেকে authentication।
- **Server-এ** (`server.ts`) — Next.js cookies API দিয়ে session read করতে হয়, আলাদা library setup।

দুটো-ই same database-এ connect করে, কিন্তু environment ভিন্ন।

### `eligibility.ts` example

```ts
// একজন donor শেষ blood দেওয়ার ৪ মাস (১২০ দিন) পর available
export function calculateEligibility(lastDonationDate: string | null) {
  if (!lastDonationDate) return { isEligible: true, daysRemaining: 0 }
  const days = (Date.now() - new Date(lastDonationDate).getTime()) / 86400000
  if (days >= 120) return { isEligible: true, daysRemaining: 0 }
  return { isEligible: false, daysRemaining: Math.ceil(120 - days) }
}
```

---

## `src/types/index.ts` — Shared types

TypeScript-এ type একবার লিখলে যেখানে দরকার সেখানে use। যেমন:

```ts
export type BloodType = 'A_POS' | 'A_NEG' | 'B_POS' | ...
export type Donor = {
  id: string
  user_id: string
  blood_type: BloodType
  location: string
  ...
}
export const BLOOD_TYPE_LABELS = { A_POS: 'A+', ... }
```

এই file-টা একদম পড়ে নিও — পুরো project-এর data model এখানে সংক্ষিপ্ত।

---

## `src/proxy.ts` — Middleware (auth gate)

**প্রতি request আসার আগে** এই function চলে। কাজ:

1. Session cookie check করে user logged in কিনা
2. Protected route (যেমন `/dashboard`)-এ গেলে — login না থাকলে redirect to `/login`
3. Login/register page-এ গেলে — already login থাকলে redirect to `/dashboard`

> Next.js-এর traditional name `middleware.ts`, কিন্তু Next.js 16-এ `proxy.ts`-এ rename হয়েছে।

---

## `public/` — Static files

এই folder-এর content directly URL-এ served হয়:
- `public/favicon.ico` → `/favicon.ico`
- `public/logo.png` → `/logo.png`

আমাদের project-এ এখানে কিছু না — emoji ব্যবহার করেছি image-এর জায়গায়।

---

## `node_modules/` — Library code (gitignored)

`npm install` করলে এখানে সব dependency download হয়। **কখনো manual edit করবে না**। GitHub-এ যায় না।

---

## `.next/` — Build output (gitignored)

`npm run dev` বা `build` দিলে এখানে compiled output আসে। GitHub-এ যায় না।

---

## ছোট cheat sheet

| জিনিস খুঁজছ | কোথায় |
|---|---|
| একটা specific URL-এর code | `src/app/<path>/page.tsx` |
| Form submission logic | সেই page-এর `actions.ts` |
| একটা client-side UI piece | `src/components/` বা page-এর `_components.tsx` |
| Database query helper | `src/lib/supabase/` |
| Type definition | `src/types/index.ts` |
| Database schema | `supabase-schema.sql` (root) |
| Auth route protection | `src/proxy.ts` |
| Style/colors | direct Tailwind classes JSX-এর ভিতরে |

---

## পরবর্তী পড়া

Database deep dive → [05-database.md](05-database.md)
