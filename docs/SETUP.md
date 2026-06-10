# Blood Finder — Setup Guide

Local development থেকে production deploy পর্যন্ত — ধাপে ধাপে।

## 1. Prerequisites

- Node.js 20+ (Vercel default এখন Node 24)
- একটি [Supabase](https://supabase.com) project (free tier যথেষ্ট)
- (deploy-এর জন্য) একটি [Vercel](https://vercel.com) account

## 2. Environment variables

`.env.example` কপি করে `.env.local` বানান:

```bash
cp .env.example .env.local
```

| Variable | কোথায় পাবেন |
|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys → **Publishable** (`sb_publishable_...`) বা Legacy **anon public** key |

⚠️ কখনোই `service_role`/secret key এখানে দেবেন না — শুধু publishable/anon key।
`.env.local` gitignored — commit হয় না।

## 3. Database setup

Supabase SQL Editor-এ **এই ক্রমে** চালান (দুটোই idempotent — বারবার চালানো নিরাপদ):

1. `supabase-schema.sql` — core tables (profiles, donors, blood_requests,
   donation_records), triggers, RPCs, RLS policies, anon column grants
2. `supabase-emergency.sql` — emergency board tables (requests, contacts,
   offers, reports) + তাদের RLS

ঐচ্ছিক — ম্যাপ/স্ট্যাটস দেখার জন্য ডেমো ডেটা:

```sql
-- supabase-seed-demo.sql চালান। আসল লঞ্চের আগে মুছে ফেলুন:
delete from donors where user_id is null;
```

### Auth configuration

- **Email/password**: Supabase → Authentication → Providers → Email — enabled
  রাখুন। ("Confirm email" বন্ধ থাকলে signup-এর পর সরাসরি logged-in হয়;
  মোবাইল-নম্বর signup synthetic email ব্যবহার করে, তাই confirm-email বন্ধ
  থাকাই এই app-এর জন্য প্রত্যাশিত সেটিং।)
- **Google OAuth**: Authentication → Providers → Google-এ client ID/secret দিন,
  এবং **Redirect URLs**-এ যোগ করুন:
  - `http://localhost:3000/auth/callback`
  - `https://<your-domain>/auth/callback`
- **Leaked password protection**: Authentication → Settings → Security →
  "Leaked password protection" **on করুন** (dashboard-only toggle — SQL দিয়ে হয় না)।

### Admin বানানো

```sql
update profiles set is_admin = true where email = 'you@example.com';
```

Admin link footer-এ দেখা যাবে (শুধু admin-দের), আর `/admin` সরাসরি URL দিয়েও খোলা যায়।

## 4. Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

যাচাই:

```bash
npm run lint       # ESLint
npx tsc --noEmit   # type-check
npm run build      # production build (.env.local লাগবে)
```

## 5. Deploy (Vercel)

1. Repo-টি GitHub-এ push করে Vercel-এ import করুন (framework: Next.js — auto)।
2. Vercel → Project → Settings → Environment Variables-এ
   `NEXT_PUBLIC_SUPABASE_URL` ও `NEXT_PUBLIC_SUPABASE_ANON_KEY` দিন
   (Production + Preview দুটোতেই)।
3. Supabase Auth → URL Configuration-এ production domain-টি
   **Site URL** ও Redirect URLs-এ যোগ করুন।
4. Deploy। প্রতি push-এ preview deployment, `main`-এ merge হলে production।

## 6. Troubleshooting

| সমস্যা | সমাধান |
|--------|---------|
| Build fail: "Missing Supabase env" | `.env.local` আছে কিনা ও দুটি var ঠিক আছে কিনা দেখুন |
| Google login ঘুরে `/login?error=auth_callback_error`-এ ফেরে | Supabase Redirect URLs-এ `…/auth/callback` আছে কিনা দেখুন |
| Anon ভিজিটরের query ৪০১/permission error | কোনো query `select('*')` করছে — anon-এর column grant নেই; explicit columns দিন (`DONOR_CARD_SELECT`) |
| Donor search-এ "Donor" নামের কার্ড | এগুলো demo seed data (`user_id is null`) — উপরের delete চালান |
