# Next-session prompt — Browser-test & improve the Home page

> Paste the block below as your first message in a **new** Claude Code session
> (after restarting so the **Playwright MCP** and **Chrome DevTools MCP** load).
> Everything Claude needs to know is included.

---

## 📋 Copy-paste this prompt

```
তুমি Playwright MCP আর Chrome DevTools MCP ব্যবহার করে আমার Blood Finder
ওয়েবসাইটের পুরো Home page টা একটা real browser-এ টেস্ট করবে, যা ভাঙা আছে ঠিক
করবে, আর আরও সুন্দর + interactive করবে।

## Project context
- Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4,
  Supabase. Dev server: `npm run dev` → http://localhost:3000 (.env.local লাগে,
  সেটআপ করা আছে)। Node: "C:\Program Files\nodejs"।
- Verify গুলো সবসময়: `npx tsc --noEmit`, `npm run lint`, `npm run build` — তিনটাই
  exit 0 হতে হবে।
- Home page sections (ক্রম): Hero (animated "living blood drop" + blood-type
  quick chips) → StatsStrip (count-up) → Emergency preview → How it works →
  Blood Availability board (per-group live counts, click → /donors?blood_type=..)
  → Live Data map (district heatmap + blood-group chart) → Why donate →
  Misconceptions → Donation guide → final CTA.
- মূল ফাইল: src/app/page.tsx, src/components/home/*, src/components/stats/
  DonorStats.tsx (ম্যাপ), src/components/DonorSearch.tsx।
- ম্যাপ ডেটা bundle করা: src/data/bd-districts.json (+ bdDistricts.ts wrapper);
  কোনো runtime fetch নেই। জেলা-নাম canonical করা হয় src/lib/bdGeo.ts-এ।
- ডেমো ডেটা: supabase-seed-demo.sql দিয়ে ~131 জন demo donor বসানো আছে (এদের
  user_id NULL)। মুছতে: `delete from donors where user_id is null;`। নতুন seed
  দরকার হলে Supabase MCP দিয়ে চালাতে পারো (project_id: ifxkgmocpdrmjadvkxse)।

## ম্যাপের ইতিহাস (যাতে সময় নষ্ট না হয়)
ম্যাপ আগে অদৃশ্য ছিল কারণ (১) dev server বন্ধ ছিল, আর (২) <svg>-এর height
collapse করছিল। SSR HTML-এ ম্যাপ ঠিকঠাক ছিল (৬৪ path, heatmap রঙসহ)। এখন svg-টা
`aspect-[460/640]` div-এর ভেতরে absolute-fill করা — height guaranteed। তবুও real
browser-এ চোখে দেখে নিশ্চিত করো।

## যা করবে (ধাপে ধাপে)
1) নিশ্চিত করো dev server চলছে (না চললে চালাও), Playwright/Chrome DevTools MCP
   দিয়ে http://localhost:3000 খোলো।
2) Chrome DevTools দিয়ে **Console**-এর সব error/warning ধরো (বিশেষ করে hydration
   mismatch)। যা পাও, ঠিক করো।
3) **ম্যাপ যাচাই**: aria-label "মানচিত্র" wala <svg> element-টা select করে computed
   width/height নাও — height > 0 ও জেলাগুলো রঙিন (#991b1b/#dc2626/#f87171/...)
   দেখাচ্ছে কিনা। Screenshot নাও। ভাঙা থাকলে ঠিক করো।
4) **Interaction টেস্ট** (Playwright click/hover):
   - ম্যাপে জেলায় hover → tooltip; click → ডান পাশের chart ঐ জেলায় বদলায় কিনা।
   - Hero-র blood-type chip (যেমন O+) → /donors?blood_type=O_POS-এ filtered list।
   - Blood Availability board-এ গ্রুপে click → ঠিক filtered /donors।
   - StatsStrip / WhyDonate সংখ্যা scroll-এ count-up হয় কিনা।
   - Emergency "সব রিকোয়েস্ট দেখুন", "রক্তদাতা হোন" ইত্যাদি লিংক ঠিক জায়গায় যায়।
   - মোবাইল viewport (375px) ও desktop — দুটোতেই layout ঠিক; hero drop মোবাইলে
     এখন hidden, দরকার হলে দেখাও।
5) **Performance** (Chrome DevTools): Lighthouse/perf trace নাও; বড় bundle (ম্যাপ
   JSON ~700KB client-এ) দরকারে route-split বা dynamic import করো; LCP/CLS দেখো।
6) **আরও interactive + সুন্দর করো** (যেগুলো ভালো মনে করো): ম্যাপে zoom/সিলেক্টেড
   জেলা highlight, board-এ subtle animation, hero polish, scroll-reveal smoothness।
   প্রতিটা পরিবর্তনের পর browser-এ চোখে দেখে নিশ্চিত করো (regression না হয়)।
7) ভাষা: বাংলা + English mixed (common/technical term English, ব্যাখ্যা বাংলা)।
   লেখা যাতে duplicate/অতিরিক্ত না হয় খেয়াল রাখো।
8) শেষে: tsc + lint + build তিনটাই green করে, পরিষ্কার commit message-এ commit +
   push করো (main branch; Vercel auto-deploy)।

প্রতিটা ধাপে real browser-এ screenshot নিয়ে আমাকে দেখাবে কী ঠিক হলো।
```

---

## 🔧 দ্রুত রেফারেন্স (তোমার জন্য)

| কাজ | কমান্ড |
|---|---|
| Dev server | `npm run dev` → http://localhost:3000 |
| Verify | `npx tsc --noEmit` · `npm run lint` · `npm run build` |
| ডেমো ডেটা মুছে ফেলা | SQL: `delete from donors where user_id is null;` |
| ডেমো ডেটা আবার বসানো | `supabase-seed-demo.sql` SQL Editor-এ চালাও |
| Supabase project id | `ifxkgmocpdrmjadvkxse` |

## ⚠️ মনে রাখার বিষয়
- নতুন MCP/skill **session restart না করলে লোড হয় না** — এজন্যই এই session-এ
  Playwright/Chrome DevTools পাওয়া যায়নি।
- ডেমো donor-রা **live site-এও** দেখায় — আসল launch-এর আগে মুছে ফেলবে।
- Vercel deploy-এ env দুটো (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) সেট থাকতে হবে।
