# CLAUDE.md

Guidance for AI agents (Claude Code, etc.) working in this repo.

## Commands

```bash
npm run dev       # Start development server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint check
npx tsc --noEmit  # TypeScript type check (no emit)
```

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack) — read `node_modules/next/dist/docs/` for any conflicts with training data
- **Language**: TypeScript (strict)
- **UI**: React 19 + Tailwind CSS v4
- **Backend / DB**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel

## Architecture

### Directory layout

```
src/
├── app/
│   ├── layout.tsx                       Root layout (Navbar + Flash + Footer + shell)
│   ├── page.tsx                         / — landing: Hero + Stats + DonorSearch preview + HowItWorks + WhyDonate
│   ├── globals.css                      Tailwind import
│   ├── (auth)/
│   │   ├── login/page.tsx               /login (email/password + Google OAuth)
│   │   └── register/page.tsx            /register
│   ├── (main)/                          Auth-protected pages (proxy enforces)
│   │   ├── dashboard/{page,_components,actions}.tsx
│   │   ├── profile/{page,_components,actions}.tsx
│   │   ├── become-donor/{page,_components,actions}.tsx
│   │   └── request/page.tsx
│   ├── donors/page.tsx                  /donors — full browse (no preview cap)
│   ├── donor/[id]/page.tsx              Public donor profile
│   ├── admin/{page,_components,actions}.tsx
│   └── auth/callback/route.ts           Google OAuth code-exchange handler
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Flash.tsx                        ?flash=<key> → toast (see Flash.tsx for keys)
│   ├── DonorSearch.tsx                  Reusable: `preview` prop caps at 6 + adds /donors CTA
│   ├── BloodTypeBadge.tsx
│   ├── StatusBadge.tsx
│   ├── GoogleIcon.tsx
│   └── home/{Hero,StatsStrip,HowItWorks,WhyDonate}.tsx
├── lib/
│   ├── supabase/{client,server,env}.ts  Browser vs server Supabase clients
│   ├── eligibility.ts                   120-day rule
│   └── validation.ts                    BD mobile regex + normalizer
├── types/index.ts                       BloodType, RequestStatus, joined-query types, labels
└── proxy.ts                             Auth gate (Next.js 16 renamed middleware → proxy)

supabase-schema.sql                      Full schema — idempotent, re-run safe
docs/                                    Comprehensive Bangla docs (see docs/README.md)
```

### Conventions

- **Route groups** `(auth)` and `(main)` are URL-invisible — purely for organization.
- **Underscore prefix** (`_components.tsx`, `_form.tsx`) — colocated private files, not routable.
- **Server vs client**: default is server component; `'use client'` only when state/event handlers are needed. Server actions live in `actions.ts` with `'use server'`.
- **Forms**: client component + `useActionState(serverAction)` + server-side validation + `revalidatePath()` + `redirect('/...?flash=key')`.
- **Flash messages**: never put free text in URL — use a key registered in `src/components/Flash.tsx`.
- **Path alias**: `@/` → `src/`.
- **Cache**: Home page uses `export const revalidate = 60` for stats; server actions use `revalidatePath` for fresh reads.

### Auth

- Supabase email/password + Google OAuth via `signInWithOAuth({ provider: 'google' })`.
- Session cookies refreshed in `src/proxy.ts` on every request (the canonical Next + Supabase SSR pattern).
- Protected routes (`proxy.ts`): `/dashboard`, `/become-donor`, `/request`, `/admin`, `/profile`.
- Admin check: `profiles.is_admin = true`. Server-side check in admin `page.tsx` + every server action via `requireAdmin()` helper.
- New users get a `profiles` row via the `handle_new_user` trigger (runs on `auth.users` insert).

### Database

- 4 tables: `profiles`, `donors`, `blood_requests`, `donation_records`.
- `auth.users.id` → `profiles.id` (FK + PK).
- RLS enabled on all four tables.
- Recursion-safe admin/donor lookups via `SECURITY DEFINER` SQL functions: `public.is_admin(uid)`, `public.donor_user_id(d_id)`.
- Unique partial index prevents duplicate PENDING requests: `(requester_id, donor_id) WHERE status = 'PENDING'`.
- Re-running `supabase-schema.sql` is safe — every statement is idempotent.

### Sync invariants

- `donors.location` is the canonical donor location and is mirrored into `profiles.location` by the become-donor server action.
- `profiles.mobile` is only on profiles (no `donors.mobile` column). Become-donor form prefills from profile and writes back if changed.

## When making changes

- Edit `supabase-schema.sql` for any DB change; do not invent migration files. After editing, the user must re-run the script in Supabase SQL Editor.
- Don't add new flash keys without registering them in `src/components/Flash.tsx`.
- Prefer server actions over client-side mutations for anything that writes to the DB — gives free cache invalidation via `revalidatePath`.
- Don't break the desktop app history: the original JavaFX app is preserved on the `desktop-app` branch.

## Docs

Comprehensive Bangla beginner docs in `docs/` (target reader: C/C++ background only). Start at [`docs/README.md`](docs/README.md).
