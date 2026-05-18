# 🩸 Blood Finder

> **রক্ত দিন, জীবন বাঁচান** — A modern web platform connecting blood donors and recipients across Bangladesh.

**Live:** https://blood-finder-bangladesh.vercel.app

---

## What is this?

Blood Finder is a web application that lets anyone find **verified** blood donors near them in seconds. Donors register and get admin-approved before appearing publicly; recipients can browse by blood type and location, then send a request to a specific donor with a single click. Donors manage incoming requests from their dashboard and accept ones they can fulfill — and every completed donation becomes part of an automatic history record.

A semester project by **Juli Nath** and team — 2nd-semester CSE students at **Rangamati Science and Technology University (RSTU)**. Built entirely from scratch with no prior project experience (only competitive programming background in C/C++), with Claude Code as a pair-programming collaborator.

---

## Features

### Public
- Browse approved donors with filters (blood type, location)
- View individual donor profiles
- Landing page with live stats, "How it works", "Why donate" sections

### Logged-in users
- Email/password or Google OAuth registration
- Profile management (name, mobile, location)
- Send blood requests to donors
- Cancel own pending requests
- Track sent & received requests in a dashboard

### Donors (logged-in users who applied)
- Become-donor form auto-prefilled from profile
- Toggle availability (AVAILABLE / UNAVAILABLE)
- Accept or decline incoming requests
- Automatic donation history

### Admin
- Approve or reject pending donor applications
- View recent blood requests
- Promote / revoke admin role for other users

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript (strict) |
| UI | React 19 + [Tailwind CSS](https://tailwindcss.com) v4 |
| Auth + DB | [Supabase](https://supabase.com) (PostgreSQL + Auth) |
| Hosting | [Vercel](https://vercel.com) |
| Version control | Git + GitHub |

---

## Quick Start

### Prerequisites
- Node.js 20+ and npm
- A free [Supabase](https://supabase.com) project (for database + auth)
- A free [Vercel](https://vercel.com) account (for deployment, optional)

### Local setup

```bash
# 1. Clone
git clone https://github.com/julinath/blood-finder.git
cd blood-finder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key

# 4. Run database schema
# Copy contents of supabase-schema.sql → Supabase SQL Editor → Run

# 5. Start dev server
npm run dev
```

Open http://localhost:3000.

For full step-by-step instructions including creating a Supabase project, see [docs/03-setup-guide.md](docs/03-setup-guide.md).

---

## Documentation

Comprehensive Bangla documentation in [`docs/`](docs/) — written for beginners with only C/C++ background who want to understand the entire project from scratch:

1. [Project Overview](docs/01-project-overview.md) — what, why, who
2. [Tech Stack](docs/02-tech-stack.md) — every tool explained, with rationale
3. [Setup Guide](docs/03-setup-guide.md) — from zero to a running local app
4. [Project Structure](docs/04-project-structure.md) — folder-by-folder tour
5. [Database](docs/05-database.md) — schema, RLS, triggers
6. [Authentication](docs/06-authentication.md) — session, cookies, OAuth
7. [How it Works](docs/07-how-it-works.md) — request flow, server vs client components
8. [Feature Walkthroughs](docs/08-feature-walkthroughs.md) — every feature traced through code
9. [Deployment](docs/09-deployment.md) — Vercel + GitHub workflow
10. [Presenting](docs/10-presenting.md) — demo script + Q&A prep

---

## Project Structure

```
src/
├── app/              Pages & routes (App Router)
├── components/       Reusable UI (Navbar, Footer, DonorSearch, ...)
├── lib/              Supabase clients + helpers (eligibility, validation)
├── types/            Shared TypeScript types & enums
└── proxy.ts          Auth route protection (Next.js 16 middleware)

supabase-schema.sql   Full DB schema (run in Supabase SQL Editor)
docs/                 Bangla documentation
```

See [docs/04-project-structure.md](docs/04-project-structure.md) for the full tour.

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

---

## Branches

- `main` — current web app (Next.js + Supabase)
- `desktop-app` — preserved original JavaFX + SQLite desktop version (1st semester project)

---

## Contributing

This is an academic project, not actively seeking external contributions. But if you spot a bug or want to suggest an improvement, feel free to open an issue.

---

## Acknowledgements

- **Claude Code** — for AI-assisted pair programming throughout development
- **Supabase, Vercel, Next.js teams** — for the generous free tiers and excellent documentation
- **RSTU CSE** — for the project assignment that pushed us to learn modern web development

---

## License

This project is released for educational purposes. No formal license — feel free to learn from it.

---

**Built with care to save lives in Bangladesh 🇧🇩**
