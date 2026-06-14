# Blood Finder — Presentation Content Pack

> এই ফাইলটাই presentation বানানোর **single source of truth** — সব তথ্য,
> গল্পের ধারা, স্লাইড-ভিত্তিক কনটেন্ট ও সংখ্যা এখানে। নতুন deck (PPTX বা HTML)
> বানাতে চাইলে [PPTX-PROMPT.md](PPTX-PROMPT.md) খুলে ভেতরের prompt টা Claude Code-কে
> দিন — ও এই BRIEF + `screenshots/` পড়ে স্লাইড বানিয়ে দেবে।
>
> **তৈরি interactive deck:** [index.html](index.html) — ব্রাউজারে খুললেই চলে
> (১৪ স্লাইড, English, যেকোনো স্ক্রিনে fit হয়, `F` = fullscreen)।
> **Live:** https://blood-finder-bangladesh.vercel.app/presentation

---

## 0) ভাষা-নীতি (গুরুত্বপূর্ণ)

- **Presentation-এর সব ব্যাখ্যা/heading = simple English** — স্যার ও শ্রোতা যেন
  সহজে বোঝেন। কঠিন/jargon শব্দ এড়ান।
- **বাংলা শুধু সেখানে** যেখানে স্বাভাবিক: screenshot-এর ভেতরের UI লেখা, আর
  রক্তদাতার বোতামের মতো হুবহু quote (যেমন “আমি রক্ত দিতে পারবো”, “রক্ত পেয়েছি”)।
- টেক্সট কম, কথা বেশি — প্রতি স্লাইডে অল্প bullet, presenter মুখে বুঝিয়ে বলবেন।

## 1) এক লাইনে প্রজেক্ট

**Blood Finder** — বাংলাদেশের জন্য একটি বিশ্বাসযোগ্য রক্তদাতা খোঁজার প্ল্যাটফর্ম:
জরুরি মুহূর্তে verified রক্তদাতা খোঁজা, public emergency board-এ রিকোয়েস্ট পোস্ট,
আর রক্তদাতা হিসেবে নিবন্ধন — সব এক জায়গায়, mobile-first ও বাংলায়।

- **Live site:** https://blood-finder-bangladesh.vercel.app
- **GitHub:** https://github.com/julinath/blood-finder
- **Team:** Juli Nath (2401011004) · Asma Akter (2401011021) · Mom Chakraborti (2401011034)
- **Supervisor:** Dhonita Tripura — Assistant Professor, CSE, RMSTU
- **Course:** Object Oriented Programming Lab — CSE 11th Batch, RMSTU

## 2) গল্পের ধারা (narrative arc)

1. **সমস্যা:** জরুরি রক্তের দরকারে মানুষ Facebook পোস্ট, পরিচিতজন আর ফোনকলের উপর
   ভরসা করে — দেরি হয়, ভুয়া/টাকা-চাওয়া দালালের ঝুঁকি থাকে, রক্তদাতার নম্বর
   যত্রতত্র ছড়িয়ে পড়ে।
2. **সমাধান:** একটি প্ল্যাটফর্ম — (ক) blood group + জেলায় সেকেন্ডে verified
   রক্তদাতা খোঁজা, (খ) জরুরি রিকোয়েস্ট public board-এ, এলাকার রক্তদাতারা নিজে
   এগিয়ে আসেন, (গ) প্রতিটি রক্তদাতা admin-verified।
3. **Trust ও privacy = আমাদের মূল নকশা:** admin approval gate, সবখানে ৯০-দিনের
   eligibility rule, **donor-first privacy** (রক্তদাতার নম্বর লুকানো; তিনি সাড়া
   দিলে তবেই requester নম্বর পান), abuse report → admin queue, আর anonymous
   ভিজিটর database থেকেও email/mobile/স্বাস্থ্যতথ্য পড়তে পারে না (column-level
   security)।
4. **জালিয়াতি ঠেকানো (signature point):** রক্তদান হয়েছে কিনা **শুধু যিনি রক্ত
   পেলেন (requester) তিনিই নিশ্চিত করেন** — রক্তদাতা কখনো নিজের donation নিজে
   confirm করতে পারে না, তাই কেউ নিজের count বাড়াতে পারে না।
5. **OOP কোর্সের সংযোগ:** শুরু JavaFX + SQLite desktop app হিসেবে (`desktop-app`
   branch-এ সংরক্ষিত)। একই domain model (User, Donor, BloodRequest,
   DonationRecord) পরে production web platform-এ rebuild — OOP ধারণা → বাস্তব পণ্য।
6. **ভবিষ্যৎ:** SMS notification, donor badge, NID verification — লক্ষ্য:
   বাংলাদেশের সবচেয়ে বিশ্বাসযোগ্য রক্তদাতা নেটওয়ার্ক।

## 3) Screenshots (`screenshots/` ফোল্ডার)

| File | কোথায় ব্যবহার | কী দেখায় |
|---|---|---|
| `01-home-desktop.png` | Product slide | Home: এক-ট্যাপ blood-group search, live availability board, জেলা heatmap |
| `02-donor-search.png` | Find Donors slide | blood group + জেলা ফিল্টার, eligibility ও donation count badge |
| `03-donor-profile.png` | (optional) | Public donor profile; নম্বর শুধু লগইন করলে |
| `04-emergency-board.png` | Emergency slide | urgency-ট্যাগসহ কার্ড, auto-filtered feed, এক-ট্যাপ সাড়া |
| `05-profile-hub.png` | (optional) | Profile hub: রিকোয়েস্ট, offers, donation history |
| `06-admin-panel.png` | Admin slide | approvals (fitness verdict), reports queue, oversight |
| `07-stats-map.png` | (optional) | জেলা heatmap + blood-group distribution |
| `08-home-mobile-390.png` | Product slide | mobile-first: 390px-এ search above the fold |

## 4) স্লাইড-ভিত্তিক কনটেন্ট (১৪ স্লাইড — তৈরি deck-এর কাঠামো)

> এই কাঠামোটাই পরীক্ষিত। PPTX-এ এটাই অনুসরণ করুন (চাইলে optional স্লাইড বাদ
> দিয়ে ১০–১২-এ নামানো যায়)।

1. **Title** — Blood Finder · tagline · team (নাম + ID) · supervisor · course · live URL pill
2. **The Problem** — *“Finding blood fast is too hard.”* bullets: No reliable
   place to search · Some make money from the crisis · No privacy for donors ·
   Fear and wrong beliefs. পাশে quote: “someone needs blood every two seconds…”
3. **The Solution** — *“One platform, three flows.”* কার্ড: Find Donors ·
   Emergency Board · Become a Donor
4. **The Product** — *“Made for everyday phone users.”* desktop + mobile
   screenshot; “search above the fold @ 390px”
5. **Find Donors** — *“From search to contact in seconds.”* verified-only ·
   90-day eligibility · contact gated by login (`02-donor-search.png`)
6. **Emergency Board — donor-first privacy** *(signature)* — Request posted →
   donor responds (নম্বর লুকানো) → requester calls (`04-emergency-board.png`)
7. **Request Lifecycle** — PENDING → ACCEPTED → COMPLETED. **The receiver
   confirms, not the donor** → কেউ নিজের count বাড়াতে পারে না (anti-fraud)
8. **Admin panel — keeps it safe & real** — approval queue · reports queue ·
   full oversight (`06-admin-panel.png`)
9. **Tech Stack — what we use and why** — Next.js 16 + React 19 · TypeScript ·
   Tailwind v4 · Supabase (PostgreSQL + Auth + RLS) · Vercel · d3-geo ·
   Playwright · Hind Siliguri
10. **How the app works (architecture)** — Client → Next.js (server actions,
    proxy route-protection) → Supabase (RLS, column grants, triggers, SECURITY
    DEFINER). Notes: defense in depth · performance · quality process
11. **Lab project → real-life product** — Phase 1 JavaFX desktop (OOP Lab) →
    Phase 2 web rebuild → Phase 3 production hardening → next: launch
12. **Same OOP ideas, two stacks** — Encapsulation · Abstraction · Inheritance
    & Polymorphism · MVC; প্রতিটায় এক-লাইন সহজ মানে + Desktop/Web উদাহরণ
13. **Roadmap** — SMS/push · donor badges · stronger verification · smart automation
14. **Closing** — “One bag of blood can be someone’s whole world.” · live URL ·
    team · supervisor · `github.com/julinath/blood-finder`

## 5) সংখ্যা (slide-এ ব্যবহারযোগ্য)

- ৬৪ জেলার structured location data + ইন্টারেক্টিভ heatmap
- ৮টি blood group-এর live availability
- ১৩০+ donor profile (ডেমো ডেটাসহ) — ম্যাপ ও বোর্ড লাইভ ডেটায় চলে
- ১৬টি route/পেজ · ৮টি database table · সবগুলোতে RLS

## 6) Technical highlights (architecture slide-এর জন্য)

- **Stack:** Next.js 16 (App Router, Server Components + Server Actions),
  TypeScript, Tailwind CSS v4, Supabase (PostgreSQL + Auth + RLS), Vercel।
- **Security (defense in depth):** প্রতি server action-এ auth + ownership
  re-check; এক policy/টেবিল/অ্যাকশন RLS; anonymous-দের column-level grants
  (email/mobile/health unreadable); SECURITY DEFINER DB function-এ atomic
  operation (যেমন donation complete)।
- **Data integrity:** donation count + last-donation-date DB trigger-এ; duplicate
  request DB unique index-এ blocked; সব enum CHECK constraint-এ।
- **Auth resolved server-side:** navbar/admin/prefill — সব server-rendered
  (browser cookie aged/OAuth session-এ অনির্ভরযোগ্য)।
- **Performance:** ৭০০KB জেলা GeoJSON server-side SVG-তে (client-এ যায় না),
  CSS-only animation, মোবাইলে horizontal scroll নেই।
- **Quality:** পুরো সাইট Playwright দিয়ে end-to-end browser-tested (desktop +
  390px mobile); lint + type-check + production build clean।

---

*সঙ্গী ফাইল: [PPTX-PROMPT.md](PPTX-PROMPT.md) (Claude Code-কে দেওয়ার prompt),
[../problem-vs-solution.md](../problem-vs-solution.md), [../TECH-STACK.md](../TECH-STACK.md).*
