# Ultraplan Session Prompt — Full Audit, Refactor & Stabilization

> **How to use:** Start a fresh Claude Code session in this repo, set the model to
> Claude Fable 5 (max/ultraplan effort), then paste everything below the line as the
> first message. Keep the dev server credentials (`.env.local`) in place before starting.

---

# Blood Finder — Full Codebase Audit, Refactor & Stabilization

You are working on **Blood Finder**, a blood-donor finding platform for Bangladesh
(Next.js 16 App Router + TypeScript + Tailwind + Supabase, deployed on Vercel).
Most of our users are **mobile-only**, and many read **Bengali** better than English.

**Mission:** Audit the entire codebase at maximum depth, fix every bug, refactor for
clean code, polish the home page and language, verify every feature end-to-end in a
real browser, and overhaul the docs (delete stale ones, rewrite the rest to match the
current codebase). The end state is a **stable, real-life-ready site with no
easy-to-hit bugs** — আমি রিয়েল লাইফ প্রবলেম সলভ করতে চাই, তাই বাগ থাকলে সমস্যা ।

**Bias to action:** whenever you find an improvement on any page — a UX gap, a better
layout, an animated-interaction idea — **implement it** (within the performance and
dependency constraints below); don't just list it as a suggestion. But Ensure everything work, nothing broken.

Plan thoroughly before touching code. Work autonomously through all phases; only stop
for genuinely destructive decisions.

## Current state — verify, do not rebuild

Previous sessions already implemented the items below. For each one, **verify it works
exactly as specified** (in the browser, not just by reading code) and fix it if broken:

1. **Navbar** ([src/components/Navbar.tsx](../src/components/Navbar.tsx)): menu items are
   Emergency, Find Donors, About Us, plus a **profile circle icon** (avatar initial) that
   links to `/profile`. There must be **no Dashboard menu, no Stats menu, and no Admin
   link** in the navbar.
2. **/dashboard** permanently redirects to `/profile` (the dashboard was merged into Profile).
3. **/profile** shows all user data (editable), donor info management, **requests the user
   made, and requests they received**.
4. **/become-donor** collects: Full Name, Email, Blood Group, Last Donation Date, Mobile
   Number, District, Area, Sex, Age, Weight, and কোনো রোগ আছে কিনা (health condition).
   It **pre-fills from the `profiles` table** and **saving syncs back** — the name given at
   registration, edited on /profile, and shown on the donor form must always match.
   (Reference flows: bloodbank.org.bd/register, donatebloodbd.com/be-a-donor.)
5. **Footer** ([src/components/Footer.tsx](../src/components/Footer.tsx)): Quick Links include
   **Statistics** (`/stats`); `AdminFooterLink` shows the Admin link **only to admins**;
   `/admin` is also reachable by typing the URL directly (protected by `src/proxy.ts` +
   `profiles.is_admin`).
6. **Home page** shows a stats section for visual appeal only (no separate Stats nav item).

## Phase 1 — Full audit (read everything in `src/`)

Catalog issues by category before fixing anything:

- **Correctness:** broken or illogical functions, unhandled errors, missing validation in
  server actions, race conditions, stale state, broken links/redirects.
- **Security:** every protected server action re-checks auth server-side; admin actions
  re-check `is_admin`; RLS assumptions in `supabase-schema.sql` actually hold; no service
  keys or secrets exposed client-side.
- **Architecture & clean code:** naming conventions, dead code, duplication, component
  boundaries, server/client component split, consistent file organization.
- **Feature logic:** anything that should be **removed** (illogical/unused), **simplified**,
  or **added** — propose each with a one-line rationale, then implement what is clearly right.
- **Admin dashboard:** judge whether its UI is dated or weak; if so, redesign it to match
  the rest of the site's quality, then test it.

## Phase 2 — Home page

- Check the **full-page pattern**: is the section order what a first-time visitor needs?
  (e.g., hero → urgent/emergency strip → donor search → stats → how-it-works → CTA → footer —
  decide the best order and justify it.)
- The owner wants a **distinctive, data-driven, animated** feel — not a sparse generic list.
  Add tasteful interactive/animated touches: CSS-first, 60fps, respect
  `prefers-reduced-motion`, no layout shift, fast on low-end mobiles.
- Proofread every Bengali sentence on the page.

## Phase 3 — Language pass (entire site)

Policy: **যেখানে বাংলা মানানসই সেখানে বাংলা; যেখানে English common term, সেখানে English.**

- **Bengali:** emotional/instructional copy, descriptions, helper text, empty states,
  success/error messages aimed at general users.
- **English:** universally-recognized terms — blood group labels (A+, O−), Login, Register,
  Emergency, district names, technical form labels where English is the convention in BD.
- Find and fix every **ভাঙা / broken Bengali string** (garbled conjuncts, mixed scripts,
  wrong words). The font is Hind Siliguri — confirm it actually applies everywhere Bengali
  is rendered.
- Flag places where the language is currently wrong-way-around (English where Bengali fits,
  Bengali where English fits) and fix them.

## Phase 4 — Mobile pass

Most users are on phones. For **every page**, test at 360px, 390px, and 768px:

- No horizontal scroll anywhere.
- Tap targets ≥ 44px; forms easy to fill with one thumb.
- Bengali text readable at small sizes (line-height, font size).
- Navbar/mobile menu, tables (admin), cards, and filters all behave on small screens.

## Phase 5 — Static verification

Run and get all of these clean before browser testing
(`.env.local` must exist for the build):

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Phase 6 — Browser verification (Playwright or Chrome DevTools MCP)

Start `npm run dev` → http://localhost:3000 and walk every flow as a real user:

1. **Register** a new account (email/password) → check the profile row is created.
2. **Login / logout**, including the Google OAuth button presence.
3. **Become a Donor:** form pre-fills from profile → fill all fields (blood group, last
   donation date, district, area, sex, age, weight, health condition) → save → confirm the
   row in `donors` **and** that the shared fields synced back to `profiles`.
4. **Profile:** edit name/mobile → confirm the change shows in the navbar avatar tooltip
   and pre-fills elsewhere. Verify "my requests" and "requests received" render.
5. **Find Donors (/donors):** every filter combination (blood group, district, availability)
   returns sensible results; empty states look right; donor public profile (`/donor/[id]`)
   opens.
6. **Emergency (/emergency):** the board renders, **filters work**, posting a new emergency
   request works (`/emergency/new`).
7. **Blood request (/request):** create a request → it appears where it should.
8. **Admin:** set `is_admin = true` for a test account via Supabase SQL → `/admin` loads via
   direct URL, footer admin link appears, all admin actions (verify donor, manage requests)
   work; non-admins are blocked.
9. **Mobile emulation** re-run of the critical flows (register, become-donor, find donors,
   emergency) at 390px.

**Every issue found → fix → re-test the same flow.** Loop until a full pass is clean.

## Phase 7 — Supabase & Vercel health check

**Supabase** (use the Supabase MCP tools):

- Run `get_advisors` for **security and performance** advisories — fix every actionable
  finding (missing/weak RLS, exposed objects, missing indexes, slow queries).
- `list_tables` and confirm the live schema matches `supabase-schema.sql`; reconcile any
  drift with additive, idempotent SQL.
- `get_logs` (api / postgres / auth) — investigate and fix the root cause of recent errors.
- Verify the auth config the app depends on actually works: email/password sign-up, Google
  OAuth redirect URL pointing at `/auth/callback`.

**Vercel** (use the Vercel MCP, the `vercel` CLI — install with `npm i -g vercel` if
missing — or the vercel:status skill):

- Project is linked; the **latest production deployment is READY** with no runtime errors
  in the logs.
- All required env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.)
  exist for production/preview and match `.env.local`.
- After everything passes locally, create a **preview deployment** and smoke-test the
  critical flows (home, find donors, emergency, login) on the deployed URL; report the URL.

## Phase 8 — Documentation overhaul

- **Audit every file in `docs/` and every loose `.md` at the repo root** against the
  current codebase.
- **Delete stale/temp docs from `main`:** the JavaFX-era guides (`01-…` through `10-…`,
  OOP concepts, JavaFX controllers, `project-setup.md`, `plan.md`, `idea.md`,
  `description.md`) describe the old desktop app, which is preserved on the `desktop-app`
  branch. One-off session prompts (`docs/HOME-TEST-PROMPT.md`, `docs/ULTRAPLAN-PROMPT.md`)
  and root scratch files (`prompt.md`, `about-us.md` if its copy already lives in the app)
  are temp — delete them once their content is no longer needed.
- **Keep & refresh** what still reflects reality: `docs/RESEARCH.md` (product vision),
  `feature.md`.
- **Write a small, current doc set** for the web app: a concise `docs/README.md`
  (what the app is, architecture, routes, data model) and a setup guide
  (env vars, Supabase schema setup, local dev, deploy).
- Update **CLAUDE.md** so the directory structure, routes, commands, and feature list
  match reality.
- Update **feature.md** (repo root, bilingual checklist) — mark what passed testing, add
  anything new you built.

## Phase 9 — Final report

End with: what you found, what you fixed, what you changed/removed/added (with reasons),
Supabase/Vercel health status, docs deleted vs. rewritten, remaining suggestions for
future sessions, and the verification evidence (commands run, flows tested, pass/fail).

## Constraints

- Schema changes must be **additive and idempotent** (`alter table ... add column if not
  exists` style, matching the existing `supabase-schema.sql`); never drop data or weaken RLS.
- Don't introduce heavy UI dependencies; prefer Tailwind + CSS animations.
- Commit in logical chunks with clear messages as you go.
- Don't claim anything works without having tested it in the browser.
