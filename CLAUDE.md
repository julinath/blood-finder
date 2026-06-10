# CLAUDE.md

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build (.env.local required)
npm run lint      # Lint check
npx tsc --noEmit  # Type check
```

## Architecture

Next.js 16 web app (App Router, TypeScript, Tailwind CSS v4, Supabase, Vercel).
Audience: mobile-first Bangladeshi users; UI is Bengali-first (Hind Siliguri)
with English for universal terms (blood groups, Login, Emergency, districts).

### Directory Structure
```
src/
├── app/
│   ├── (auth)/login/         ← Login (email/mobile + password, Google OAuth)
│   ├── (auth)/register/      ← Register (mobile-number signup supported)
│   ├── (main)/profile/       ← Profile hub: info, donor details, sent/received
│   │                            requests, my emergencies, donation history
│   ├── (main)/dashboard/     ← Legacy → permanent redirect to /profile
│   ├── (main)/become-donor/  ← Donor application (pre-fills from profiles,
│   │                            saving syncs back)
│   ├── (main)/request/       ← Send donation request (server-validated:
│   │                            eligibility, availability, no self/duplicate)
│   ├── admin/                ← Admin panel (donors, users, requests,
│   │                            emergencies, reports queue)
│   ├── donors/               ← Public donor search
│   ├── donor/[id]/           ← Public donor profile (mobile only when signed in)
│   ├── emergency/            ← Public emergency board (+ /new to post)
│   ├── stats/                ← District map + blood-group stats
│   ├── about/                ← Team/project page
│   ├── auth/callback/        ← OAuth code exchange + profile self-heal
│   └── page.tsx              ← Home (search-first hero, emergency preview,
│                                availability board, stats, map, awareness)
├── components/
│   ├── Navbar.tsx Footer.tsx Flash.tsx DonorSearch.tsx ReportButton.tsx
│   ├── AdminFooterLink.tsx BloodTypeBadge.tsx StatusBadge.tsx GoogleIcon.tsx
│   ├── home/                 ← Home sections (Hero, EmergencyPreview, …)
│   ├── stats/                ← Donor map + stats (server-side SVG projection)
│   └── ui/                   ← CountUp, Reveal, form.tsx (FIELD_CLASS + Field)
├── lib/
│   ├── supabase/             ← client.ts (browser) / server.ts (SSR) / env.ts
│   ├── eligibility.ts        ← 90-day rule, fitness checks, todayIsoDate
│   ├── validation.ts         ← BD mobile regex + HTML pattern, lengths
│   ├── districts.ts          ← 64 districts + isDistrict
│   ├── bn.ts                 ← Bangla digits/date formatting
│   └── auth-identifier.ts    ← email-or-mobile login identifier parsing
├── data/                     ← bd-districts.json (700 KB, SERVER-ONLY import)
├── types/index.ts            ← Shared types, enums, labels, DONOR_CARD_SELECT
└── proxy.ts                  ← Route protection (Next.js 16 renamed middleware
                                 → proxy; this file IS executed — do not "fix")
```

### Auth & data rules
- Supabase Auth: email/password (mobile signup via synthetic email) + Google
  OAuth (`/auth/callback`).
- `src/proxy.ts` protects `/profile`, `/become-donor`, `/request`, `/admin`,
  `/emergency/new`. Admin = `profiles.is_admin`; admin link in footer only —
  never in the navbar; `/admin` is also reachable by URL.
- Every server action re-checks `auth.getUser()`, filters by ownership, and
  reports outcomes via `?flash=<key>` (catalog: `src/components/Flash.tsx`).
- The `anon` role has **column-level SELECT grants only** — public queries must
  select explicit columns (use `DONOR_CARD_SELECT`); `select('*')` on donors/
  profiles fails for signed-out visitors by design.
- Request lifecycle: PENDING → ACCEPTED → COMPLETED (donor confirms via
  `complete_blood_request` RPC, which also writes the donation record;
  a trigger bumps donation_count + last_donation_date).

### Database
Run `supabase-schema.sql` then `supabase-emergency.sql` (both idempotent) in
the Supabase SQL editor. Tables: profiles, donors, blood_requests,
donation_records, emergency_requests, emergency_contacts, emergency_offers,
reports. Demo donors: `supabase-seed-demo.sql` (`user_id IS NULL`).
Schema changes must stay additive + idempotent; never weaken RLS.

### Language policy
যেখানে বাংলা মানানসই সেখানে বাংলা (instructional copy, helper text, empty
states, user-facing success/error messages); English for universal terms
(A+/O−, Login, Register, Emergency, district names) and the admin panel.

### Docs
`docs/README.md` (architecture), `docs/SETUP.md` (setup/deploy),
`docs/RESEARCH.md` (vision), `feature.md` (bilingual checklist).

### Desktop App
The original JavaFX desktop app is preserved on the `desktop-app` branch.
