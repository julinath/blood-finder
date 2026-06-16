# Claude Design দিয়ে Presentation বানানোর Prompt

> **কীভাবে ব্যবহার করবেন:**
> 1. [claude.ai](https://claude.ai)-তে নতুন চ্যাট খুলুন।
> 2. নিচের ধূসর বক্সের পুরো prompt টা **copy করে paste** করুন — ব্যস, এতেই সব
>    কনটেন্ট ও ছবির লিংক আছে, আলাদা কিছু attach করা লাগবে না।
> 3. Claude একটা interactive slide-deck artifact বানাবে — ডান পাশে live দেখতে
>    পাবেন। পছন্দ না হলে বলুন *“slide 6 আরও bold করো”* / *“darker theme”* — ও
>    সাথে সাথে বদলে দেবে।
> 4. ভালো লাগলে artifact-এর **Publish/Share** দিয়ে লিংক নিন, বা কোড copy করে
>    নিজের কাছে রাখুন।
>
> 💡 আরও নিখুঁত করতে চাইলে এই রিপোর `docs/presentation/BRIEF.md` ফাইলটাও চ্যাটে
> attach করতে পারেন (বিস্তারিত তথ্যের জন্য) — কিন্তু বাধ্যতামূলক নয়।

---

## 📋 Copy this prompt

```
You are an award-winning presentation designer. Build me a STUNNING, interactive
slide deck as a single self-contained HTML artifact for my university project
"Blood Finder". Surprise me with the visual design — make it distinctive,
modern and memorable, not a generic template. You have full creative freedom on
layout, typography and motion, within the constraints below.

ABOUT THE PROJECT
Blood Finder is a trusted blood-donor platform for Bangladesh: find verified
donors by blood group + district in seconds, post urgent needs on a public
emergency board where nearby donors step forward, and register as a donor.
Mobile-first, Bangla UI. Live at https://blood-finder-bangladesh.vercel.app
Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase
(PostgreSQL + Auth + Row Level Security), deployed on Vercel.

It started as a JavaFX + SQLite desktop app for our Object Oriented Programming
Lab (same domain model: User, Donor, BloodRequest, DonationRecord), then was
rebuilt as this production web platform — so it connects OOP concepts to a real
product.

TEAM (put names + student IDs on the title & closing slides):
- Juli Nath — 2401011004
- Asma Akter — 2401011021
- Mom Chakraborty — 2401011034
Supervisor: Dhonita Tripura — Assistant Professor, CSE, RMSTU
Course: Object Oriented Programming Lab — CSE 11th Batch, RMSTU
GitHub: github.com/julinath/blood-finder

LANGUAGE POLICY (important):
- All headings and explanations in SIMPLE English a supervisor can follow
  easily — no jargon, short bullets, lots of breathing room.
- Use Bengali ONLY for two exact UI quotes where it adds authenticity:
  the offer button "আমি রক্ত দিতে পারবো" and the confirm "রক্ত পেয়েছি".
  (Load a Bangla web font like Hind Siliguri from Google Fonts so they render.)

TWO IDEAS THAT MUST LAND CLEARLY (our signature points):
1. Donor-first privacy: a donor's phone number is never public; the donor
   chooses to respond, and only then does the requester see their number.
2. The receiver confirms the donation — never the donor — so no one can
   inflate their own donation count (anti-fraud).

USE THESE HOSTED SCREENSHOTS (embed by URL inside nice "browser window" frames;
preserve aspect ratio, never stretch):
- Home (desktop):   https://blood-finder-bangladesh.vercel.app/presentation/screenshots/01-home-desktop.png
- Home (mobile):    https://blood-finder-bangladesh.vercel.app/presentation/screenshots/08-home-mobile-390.png
- Donor search:     https://blood-finder-bangladesh.vercel.app/presentation/screenshots/02-donor-search.png
- Donor profile:    https://blood-finder-bangladesh.vercel.app/presentation/screenshots/03-donor-profile.png
- Emergency board:  https://blood-finder-bangladesh.vercel.app/presentation/screenshots/04-emergency-board.png
- Profile hub:      https://blood-finder-bangladesh.vercel.app/presentation/screenshots/05-profile-hub.png
- Admin panel:      https://blood-finder-bangladesh.vercel.app/presentation/screenshots/06-admin-panel.png
- District map:     https://blood-finder-bangladesh.vercel.app/presentation/screenshots/07-stats-map.png

SLIDES (about 12-14; one clear idea per slide):
1. Title — Blood Finder, a one-line tagline, team (names + IDs), supervisor,
   course, and the live URL.
2. The Problem — finding blood fast is too hard: no reliable place to search;
   some people make money from the crisis; no privacy for donors; fear and
   wrong beliefs.
3. The Solution — one platform, three flows: Find Donors · Emergency Board ·
   Become a Donor.
4. The Product — made for everyday phone users (show desktop + mobile home).
5. Find Donors — from search to contact in seconds: verified-only results,
   automatic 90-day eligibility rule, contact gated by login (donor-search shot).
6. Emergency Board — donor-first privacy (signature): request posted → a donor
   responds with one tap ("আমি রক্ত দিতে পারবো") → the requester calls; the
   donor's number stays private (emergency-board shot).
7. Request Lifecycle — PENDING → ACCEPTED → COMPLETED; the receiver confirms
   ("রক্ত পেয়েছি"), never the donor → no fake counts.
8. Admin Panel — keeps it safe & real: donor approval queue, reports queue,
   full oversight (admin-panel shot).
9. Tech Stack — what we use and why: Next.js 16 + React 19, TypeScript,
   Tailwind v4, Supabase (PostgreSQL + Auth + RLS), Vercel, Playwright.
10. How it works — defense in depth: UI checks → server-action checks →
    database RLS + column-level grants; the 700KB map is rendered on the server.
11. Lab project → real product — Phase 1 JavaFX desktop (OOP Lab) → Phase 2 web
    rebuild → Phase 3 production hardening → next: real launch.
12. Same OOP ideas, two stacks — Encapsulation (keep data private),
    Abstraction (hide the details), Inheritance & Polymorphism (reuse code),
    MVC (split into clear parts); a short Desktop vs Web example for each.
13. Roadmap — SMS/push notifications, donor badges, stronger (NID) verification.
14. Closing — "One bag of blood can be someone's whole world." + live URL +
    team + supervisor + github.com/julinath/blood-finder.

TECHNICAL REQUIREMENTS for the artifact:
- A single self-contained HTML file (inline CSS/JS, Google Fonts allowed).
- 16:9, works full-screen; navigate with arrow keys, spacebar, on-screen
  arrows, and clicking; show a slide counter; "F" toggles fullscreen.
- Must look perfect on a laptop screen (≈1366×768) AND a projector — scale the
  slides to fit so nothing ever overflows or gets cut off.
- Respect prefers-reduced-motion. Use a refined color palette built around
  blood red, but don't drown the slides in red — use it as an accent.

Build it, then briefly tell me the theme/fonts you chose so I can ask for tweaks.
```

---

## 💡 টিপস

- **থিম পছন্দ না হলে:** “try a darker, more cinematic theme” বা “use a cleaner,
  editorial magazine style” — Claude আবার বানাবে।
- **স্লাইড কম/বেশি:** “make it 10 slides” বা “add a live-demo slide”।
- **নিজের ছবি/লোগো:** চ্যাটে ছবি drag করে দিন, বলুন কোথায় বসাতে।
- **HTML deck-ই যথেষ্ট হলে:** আমাদের তৈরি deck আগে থেকেই live —
  https://blood-finder-bangladesh.vercel.app/presentation
- **PowerPoint (.pptx) চাইলে:** [PPTX-PROMPT.md](PPTX-PROMPT.md) দেখুন (Claude
  Code-কে দেওয়ার আলাদা prompt)।
