# 10 — Presenting to Teacher (Demo + Q&A)

এই doc-এ — কীভাবে confident-ly project demo করবে এবং common questions-এর জন্য prepared থাকবে।

---

## Demo Plan (১০-১৫ মিনিট)

ধরো টিচার বললেন "দেখাও তোমাদের project।" তোমার plan:

### Part 1: Introduction (১ মিনিট)
"Sir, আমরা **Blood Finder** নামে একটা web application বানিয়েছি। উদ্দেশ্য — Bangladesh-এ blood donor খোঁজার প্রক্রিয়াকে fast আর verified করা। কেউ donor হিসেবে register করতে পারে, কেউ search করে directly request পাঠাতে পারে। Stack: Next.js, TypeScript, Supabase, Vercel।"

### Part 2: Live URL দেখাও (১ মিনিট)
- Browser-এ `https://blood-finder-bangladesh.vercel.app`
- Hero, stats, featured donors, "how it works", "why donate", footer — scroll করে show করো
- "Site Vercel-এ host করা — push করলেই auto-deploy"

### Part 3: User flow (৪-৫ মিনিট)
Live demo করো:

1. **Register** — নতুন account খুলো (নাম, email, password)
2. **Login** — login করো → dashboard
3. **Become Donor** — form fill, submit → pending status
4. **Admin login** (অন্য tab-এ) → /admin → তোমার donor approve করো
5. **Search** — home page → বিভিন্ন filter দিয়ে search
6. **Send request** — কোনো donor-এ ক্লিক → request পাঠাও
7. **Accept request** — donor account-এ ফিরে → dashboard → accept

### Part 4: Code walkthrough (৩-৪ মিনিট)
VS Code-এ project open করে দেখাও:

- `src/app/` structure — "File-based routing — folder = URL"
- `src/app/page.tsx` — "Server component, প্রথমে server-এ render হয়"
- `src/components/DonorSearch.tsx` — "Client component, search interactivity"
- `src/app/(main)/become-donor/actions.ts` — "Server action — security-critical কাজ server-এ"
- `supabase-schema.sql` — table structure show করো, এক-দুটো RLS policy দেখাও

### Part 5: Database (১ মিনিট)
Supabase dashboard share করো:
- Table editor → 4টা table দেখাও
- Authentication → registered users দেখাও
- "RLS — database-এ row-level permission"

### Part 6: Closing (৩০ সেকেন্ড)
"আমরা শূন্য থেকে শিখে এই project করেছি। নতুন tools — TypeScript, React, Supabase, Vercel। AI assistance নিয়েছি কোডিং-এ, কিন্তু architecture, design decisions, deployment — সব নিজেরা বুঝে নিয়েছি।"

---

## Common Questions + Answers

### "Why Next.js, why not just React?"
"React নিজে শুধু UI library — routing, server-side rendering, API endpoints নেই। Next.js এই সব built-in দেয়। আর Next.js Vercel-এর তৈরি framework, deployment-ও সহজ।"

### "TypeScript কেন? JavaScript-এ হত না?"
"হত, কিন্তু JS-এ no type check। `add("5", "10")` → "510" — bug ধরা যায় না। TypeScript C++ -এর মতো static typing দেয় — compile-এই error detect। বড় project-এ অনেক বেশি reliable।"

### "Supabase কী? Backend নিজে লিখলে না কেন?"
"Supabase — Backend-as-a-Service। PostgreSQL + Auth + auto-generated API একসাথে। নিজে backend লিখতে গেলে: server setup, database setup, auth code, OAuth integration — সব আলাদা। Supabase এই সব managed দেয়। আমাদের project-এর scale-এ এটা perfect — শুধু frontend code লেখায় focus করতে পারি।"

### "Database security কীভাবে handled?"
"RLS — Row Level Security। PostgreSQL-এর feature। প্রতি table-এ policy define করা — কে কোন row read/write করতে পারে। যেমন: 'user নিজের profile-ই update করতে পারে', 'admin সব profile দেখতে পারে'। এই check database level-এ হয়, frontend bypass করলেও database refuse করবে।"

### "Auth flow সংক্ষেপে?"
"User login করলে Supabase একটা JWT token দেয়, browser cookie-তে store হয়। প্রতি request-এ cookie যায়, server token verify করে user identify করে। Google OAuth-ও same pattern — Google redirect-এ user authorize করে, Supabase token দেয়।"

### "Why Vercel?"
"Vercel — Next.js-এর creator-এর platform। GitHub-এ push করলে auto-build, auto-deploy। Free tier আমাদের project-এর জন্য enough। HTTPS, CDN সব built-in।"

### "Server component আর client component-এর তফাত?"
"Server component শুধু server-এ run — directly DB call করতে পারে, কিন্তু `useState` ইত্যাদি hooks না। Client component browser-এ run — interactive UI, state, event handler। আমাদের static parts (Hero, Footer) server, interactive parts (DonorSearch, Forms) client।"

### "Server Action কী?"
"Form submit-এর জন্য server-side function। Client component থেকে directly call করা যায়, কিন্তু code server-এ run হয়। Security: validation, auth check, DB write — সব server-side, bypass করা যায় না। Plus: `revalidatePath` দিয়ে cache invalidate করতে পারে।"

### "Mobile validation কেন server-এ আর client-এ দুই জায়গায়?"
"Client-side validation — UX-এর জন্য, error তাড়াতাড়ি দেখাই। Server-side validation — security-এর জন্য, client-side bypass সম্ভব। Defense in depth — কোনোটাই বাদ দেওয়া যায় না।"

### "Trigger কী? কেন দরকার?"
"PostgreSQL trigger — কোনো event (insert/update) ঘটলে automatic একটা function run। আমাদের `handle_new_user` trigger — Supabase auth-এ user create হলে automatic `profiles` table-এ row insert। এটা না থাকলে আমাদের code-এ manually করতে হত — error-prone।"

### "Cache কীভাবে handle হয়?"
"দুই strategy: time-based (`revalidate = 60`) আর on-demand (`revalidatePath('/profile')`)। Home page-এ stats 1 minute cache — frequent visits-এ DB hit হয় না। Profile update-এর পর `revalidatePath('/profile')` — immediately fresh data দেখায়।"

### "Test কী লিখেছ?"
"আপাতত automated test নাই — manual testing করেছি প্রতি feature-এ। Production-এ test লাগে: Jest unit test, Playwright E2E test। This is a known gap, but scope-এর বাইরে এই project-এর জন্য।"

### "Scale করা যাবে?"
"হ্যাঁ — Vercel auto-scale, Supabase free tier 500MB DB + 50k auth users, RLS policies efficient (PostgreSQL indexes use)। ১০০০+ donors handle করতে আলাদা কিছু লাগবে না।"

### "AI use করেছ কোথায়?"
"Claude Code-এর সাথে pair programming-এ। Code লেখা, refactor, bug debug, এই docs লেখা — সব Claude-এর সাথে discuss করেছি। কিন্তু decision-গুলো (architecture, feature scope, design choices) নিজে নিয়েছি। AI as collaborator, not replacement।"

---

## Technical terms cheat sheet

| Term | এক লাইনের ব্যাখ্যা |
|---|---|
| **Component** | Reusable UI piece (button, card, form) |
| **State** | Component-এর "মনে রাখা" data |
| **Hook** | Component-এ feature add করার function (`useState`, `useEffect`) |
| **Props** | Parent component থেকে child-এ data পাঠানো |
| **Server-side rendering (SSR)** | HTML server-এ generate হয়, browser-এ পাঠানো হয় |
| **Hydration** | Server-rendered HTML-এ React event handlers attach করা |
| **API** | Server endpoint যেটা data return করে |
| **REST API** | HTTP-based standard API pattern (GET, POST, PUT, DELETE) |
| **JWT** | Encoded token যেটা প্রমাণ করে কে user |
| **Cookie** | Browser-এ ছোট data store যা request-এ auto-পাঠানো হয় |
| **CORS** | Cross-Origin Resource Sharing — কোন domain কাকে call করতে পারে |
| **CDN** | Content Delivery Network — পৃথিবীর বিভিন্ন server-এ file caching |
| **Webhook** | কোনো event-এ অন্য system-এর URL hit করা (GitHub → Vercel) |
| **Foreign key** | এক table-এর row অন্য table-এর row reference করা |
| **Index** | Database lookup fast করার data structure |
| **Trigger** | DB event-এ automatic function run |
| **RLS** | Row Level Security — row-level access control |
| **Idempotent** | একই operation বারবার চালালেও same result |

---

## "যা আমি কিনাও জানি" বললে কী করব?

কখনো honest থাকো:
- "Sir, এটা ঠিক জানি না, একটু check করে বলব" — better than wrong answer
- কোনো specific syntax মনে না থাকলে: "এই syntax-টা exact মনে নাই, কিন্তু concept-টা [X]"
- AI use করেছ — সেটা hide করার কিছু নাই। AI প্রায় সব আজকের developers ব্যবহার করেন

---

## Pre-demo checklist

Demo-এর ১০ মিনিট আগে:

- [ ] Internet connection check
- [ ] Live URL load করে দেখো — কাজ করছে কিনা
- [ ] Test user-এর password remember
- [ ] Admin user-এর login ready
- [ ] একটা incognito tab — নতুন registration demo-এর জন্য
- [ ] VS Code-এ project খোলা — code walkthrough-এর জন্য
- [ ] Supabase dashboard tab খোলা — database show করতে
- [ ] Charger plugged
- [ ] Browser zoom = ১২৫% (টিচার দূর থেকে যাতে দেখে)
- [ ] No personal info / unrelated tabs visible

---

## Last word

Confidence গুরুত্বপূর্ণ। তুমি এই project actually বানিয়েছ — সব line code পড়ে বুঝেছ। এই docs পুরো পড়ে নিলে যেকোনো question-এ deep answer দিতে পারবে।

🩸 **Good luck, Juli এবং team!**
