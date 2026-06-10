# Blood Finder — Project Documentation

> বাংলাদেশের জন্য একটি বিশ্বাসযোগ্য রক্তদাতা খোঁজার প্ল্যাটফর্ম।
> Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase, deployed on Vercel.

**Docs index**

| File | বিষয় |
|------|-------|
| [README.md](README.md) (this file) | App কী, architecture, routes, data model |
| [SETUP.md](SETUP.md) | Env vars, Supabase setup, local dev, deploy |
| [RESEARCH.md](RESEARCH.md) | Product vision ও বাজার-গবেষণা (বড় ফাইল) |
| [../feature.md](../feature.md) | Feature checklist (বাংলা/English, টেস্ট-স্ট্যাটাস সহ) |
| [../CLAUDE.md](../CLAUDE.md) | AI-assistant instructions + directory map |

> পুরোনো JavaFX desktop app-এর docs ও কোড `desktop-app` branch-এ সংরক্ষিত আছে।

---

## What is Blood Finder?

জরুরি মুহূর্তে দ্রুত, নিরাপদ ও বিশ্বাসযোগ্য রক্তদাতা খুঁজে দেওয়াই এই প্ল্যাটফর্মের কাজ। মূল ফ্লো তিনটি:

1. **Find Donors** — blood group / জেলা / এলাকা দিয়ে verified রক্তদাতা খোঁজা, প্রোফাইল দেখা, donation request পাঠানো।
2. **Emergency board** — "এখনই রক্ত লাগবে" ধরনের public রিকোয়েস্ট পোস্ট করা; রক্তদাতারা *"আমি রক্ত দিতে পারবো"* চেপে সাড়া দেন; রিকোয়েস্টকারী সাড়াদাতার নম্বর দেখে নিজে যোগাযোগ করেন (donor-first privacy)।
3. **Become a Donor** — প্রোফাইল থেকে pre-fill হওয়া ফর্মে রক্তদাতা হিসেবে আবেদন; admin অনুমোদনের পর search-এ দেখা যায়।

**Trust & safety primitives:** admin approval gate, ৯০-দিনের eligibility rule (UI + server + search জুড়ে), donation count (DB trigger-এ রক্ষিত), abuse reports queue, per-case contact privacy, RLS + column-level grants।

---

## Architecture

```
Browser (React 19 client components)
   │  @supabase/ssr browser client (anon key only)
   ▼
Next.js 16 App Router  ──  src/proxy.ts (route protection; Next 16 renamed
   │                        middleware → proxy — the file IS executed)
   │  Server Components + Server Actions (@supabase/ssr server client)
   ▼
Supabase (PostgreSQL + Auth)
   • RLS on every table; single consolidated policy per table/action
   • anon role: column-level SELECT grants only (no email/mobile/health data)
   • SECURITY DEFINER helpers: is_admin, donor_user_id, emergency_requester,
     has_offered, emergency_is_open (RLS helpers — intentionally executable)
   • RPCs with internal gates: admin_delete_user, record_emergency_donation,
     complete_blood_request
   • Triggers: handle_new_user (profile auto-create),
     bump_donation_count (+ last_donation_date), emergency offer rate limit
```

Key conventions:

- **Server actions own all writes** for protected flows; each one re-checks
  `auth.getUser()`, filters by ownership, and reports failures via
  `?flash=<key>` (catalog in `src/components/Flash.tsx`).
- **Public reads** (donor search, emergency feed) go straight from client
  components to Supabase with the anon key — safe because of RLS + column
  grants. Queries must select **explicit columns**
  (`DONOR_CARD_SELECT` in `src/types/index.ts`); `select('*')` fails for anon.
- **Language policy:** যেখানে বাংলা মানানসই সেখানে বাংলা (instructions,
  empty states, success/error messages); universal terms English (blood
  groups, Login, Register, Emergency, district names). Bengali font: Hind
  Siliguri (loaded in `src/app/layout.tsx`).
- The 700 KB district GeoJSON (`src/data/bd-districts.json`) is **server-only**
  — the map is projected to SVG paths on the server.

## Routes

| Route | Access | What it does |
|-------|--------|--------------|
| `/` | public | Home: hero + quick search, emergency preview, availability board, stats, map, awareness sections |
| `/donors` | public | Donor search (filters: blood group, district, area) |
| `/donor/[id]` | public | Donor public profile; contact number only when signed in |
| `/emergency` | public | Emergency needs board + filters; offering requires login |
| `/emergency/new` | login | Post an emergency request (contact goes to RLS-protected `emergency_contacts`) |
| `/login`, `/register` | guest | Email/password (mobile-number signup supported) + Google OAuth |
| `/auth/callback` | — | OAuth code exchange + profile self-heal |
| `/profile` | login | Profile hub: personal info, donor details, sent/received requests, my emergencies + offers, donation history |
| `/dashboard` | login | Legacy — permanent redirect to `/profile` |
| `/become-donor` | login | Donor application (pre-fills from profile; saving syncs back) |
| `/request` | login | Send a donation request to a donor (server-validated) |
| `/stats` | public | District map + blood-group statistics |
| `/about` | public | Team / project info |
| `/admin` | admin | Donor approvals, users, requests, emergencies, reports queue |

`src/proxy.ts` protects `/profile`, `/become-donor`, `/request`, `/admin`,
`/emergency/new` (and bounces signed-in users away from `/login`/`/register`).
Admin = `profiles.is_admin`; the admin link lives in the footer (admins only).

## Data model

Schema lives in two idempotent SQL files (run in order in the Supabase SQL editor):
`supabase-schema.sql` → `supabase-emergency.sql`. Demo data: `supabase-seed-demo.sql`
(rows with `user_id IS NULL`; delete before real launch).

| Table | Purpose | Notable rules |
|-------|---------|---------------|
| `profiles` | extends `auth.users` (name, email, mobile, location, district, is_admin) | auto-created by trigger; anon may read only id/full_name/location/district/created_at of approved donors |
| `donors` | donor record (blood_type, location/district, availability, last_donation_date, sex/age/weight/health, donation_count, is_approved) | one per user; anon cannot read sex/age/weight/health; CHECK constraints mirror app validation |
| `blood_requests` | direct requests requester→donor | `PENDING → ACCEPTED → COMPLETED` (or `CANCELLED`); partial unique index blocks duplicate PENDING; COMPLETED only via `complete_blood_request` RPC which also writes the donation record |
| `donation_records` | immutable donation log | insert bumps `donation_count` + `last_donation_date` via trigger; `request_id` null for emergency donations |
| `emergency_requests` | public needs board | snapshot `requester_name`; status OPEN/FULFILLED/CANCELLED/EXPIRED |
| `emergency_contacts` | per-request contact phone | readable only by requester + admins (donor-first privacy) |
| `emergency_offers` | "আমি রক্ত দিতে পারবো" responses | unique per donor+request; insert allowed only while OPEN; rate-limited by trigger |
| `reports` | abuse/no-show reports → admin queue | reporter must be involved in the request; statuses OPEN/REVIEWED/RESOLVED |

## Request lifecycle (direct requests)

```
requester ──send──▶ PENDING ──donor declines / requester cancels──▶ CANCELLED
                       │
                  donor accepts          (requester sees donor's mobile)
                       ▼
                   ACCEPTED ──donor taps "রক্ত দিয়েছি"──▶ COMPLETED
                                                  └─ donation_record inserted
                                                     (count + last date bumped)
```

Emergency flow: post → donors offer → requester calls a donor → requester
taps **"ইনি রক্ত দিয়েছেন"** (credits that donor, closes the request) or marks
it fulfilled/cancelled. Admins can additionally mark stale requests EXPIRED.
