# 🩸 Blood Finder

**বাংলাদেশের জন্য একটি বিশ্বাসযোগ্য রক্তদাতা খোঁজার প্ল্যাটফর্ম** — find verified
blood donors near you in seconds, post emergency requests, and become a donor.

Built with **Next.js 16** (App Router) · **TypeScript** · **Tailwind CSS v4** ·
**Supabase** (PostgreSQL + Auth) · deployed on **Vercel**.

## Features

- 🔍 **Find Donors** — search verified donors by blood group, district and area
- 🚑 **Emergency board** — post urgent needs; donors respond with one tap;
  contact numbers stay private until a donor offers (donor-first privacy)
- 🧑‍⚕️ **Become a Donor** — admin-approved donor profiles with the 90-day
  eligibility rule enforced across search, profiles and requests
- 📊 **Live data** — district donor map, blood-group availability board,
  donation counts maintained by database triggers
- 🛡️ **Safety** — abuse reports queue, admin panel, RLS + column-level grants
  so anonymous visitors can never read emails, phone numbers or health data
- 🇧🇩 **Bengali-first UI** — Hind Siliguri, mobile-first (most users are on phones)

## Quick start

```bash
npm install
cp .env.example .env.local   # add your Supabase URL + publishable key
npm run dev                  # http://localhost:3000
```

Run `supabase-schema.sql` then `supabase-emergency.sql` in the Supabase SQL
editor first — full instructions in **[docs/SETUP.md](docs/SETUP.md)**.

## Documentation

- [docs/README.md](docs/README.md) — architecture, routes, data model
- [docs/SETUP.md](docs/SETUP.md) — environment, database, auth, deploy
- [feature.md](feature.md) — bilingual feature checklist with test status
- [docs/RESEARCH.md](docs/RESEARCH.md) — product vision & research

> The original JavaFX desktop version lives on the `desktop-app` branch.

## Team

CSE 11th Batch, Rangamati Science and Technology University (RMSTU) —
see [/about](https://blood-finder.vercel.app/about).
