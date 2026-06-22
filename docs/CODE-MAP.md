# Blood Finder — কোন কোড কোথায় (টিম + প্রেজেন্টেশন গাইড)

> ম্যাম/স্যার কোড দেখতে চাইলে কোন ফাইল খুলতে হবে — এক জায়গায়।
> OOP প্রশ্নের পুরো ব্যাখ্যা: `docs/TECH-STACK.md` (Part 3 ও Part 4)।

---

## প্রথমেই: "ওয়েব প্রজেক্টে class নেই কেন?"

ওয়েব অ্যাপে (`main` branch) `class` কিওয়ার্ড দিয়ে লেখা ক্লাস **ইচ্ছাকৃতভাবেই** নেই:

- **UI** → React এখন **functional component** ব্যবহার করে (`class` নয়)।
- **Domain model** → ক্লাসের বদলে TypeScript **`interface` / `type`**।

আসল OOP **class** গুলো Phase 1-এর **JavaFX desktop অ্যাপে** আছে (`desktop-app` branch)।
ওয়েবে সেই একই মডেল typed interface হয়ে বেঁচে আছে — OOP-এর *চিন্তা* এক, শুধু ভাষার রূপ আলাদা।

| ওয়েবের মডেল (interface) | Desktop-এ যা ছিল (class) |
|---|---|
| `Profile` | User |
| `Donor` | Donor |
| `BloodRequest` | BloodRequest |
| `DonationRecord` | DonationRecord |
| `EmergencyRequest`, `EmergencyOffer` | (নতুন, web-only) |

---

## ১. Domain Model — OOP-এর হৃদয় (এটা আগে দেখাও)

- সব মডেল এক ফাইলে: `src/types/index.ts`

> বলবে: "Desktop-এর class গুলোই এখানে typed interface — এটাই আমাদের সবচেয়ে বড় OOP ধারাবাহিকতা।"

## ২. Business Logic / Encapsulation (নিয়ম এক জায়গায় বন্দি)

- ৯০-দিনের রক্তদান নিয়ম, fitness চেক → `src/lib/eligibility.ts`
- BD মোবাইল নম্বর validation → `src/lib/validation.ts`
- email-নাকি-মোবাইল login পার্স → `src/lib/auth-identifier.ts`
- ৬৪ জেলার তালিকা → `src/lib/districts.ts`

## ৩. Controller / Server Actions (Abstraction — SQL লুকানো)

- রক্তের অনুরোধ পাঠানো (eligibility + duplicate চেক) → `src/app/(main)/request/actions.ts`
- Donor হওয়া (profile-এ sync) → `src/app/(main)/become-donor/actions.ts`
- অনুরোধ accept / complete → `src/app/(main)/profile/request-actions.ts`
- Admin কাজ → `src/app/admin/actions.ts`

## ৪. View / UI Components (reuse — একবার বানিয়ে সব জায়গায়)

- Donor খোঁজার UI → `src/components/DonorSearch.tsx`
- রক্তের গ্রুপ ব্যাজ (reusable) → `src/components/BloodTypeBadge.tsx`
- Form ফিল্ড (reusable) → `src/components/ui/form.tsx`
- হোম পেজের সেকশনগুলো → `src/components/home/`

## ৫. Security / Auth (তিন স্তরের সুরক্ষা)

- রুট প্রটেকশন (login ছাড়া ঢোকা যাবে না) → `src/proxy.ts`
- Google OAuth callback → `src/app/auth/callback/route.ts`
- DB connection (browser/server) → `src/lib/supabase/`
- RLS + column grants (database স্তর) → `supabase-schema.sql`

## ৬. Entry Point / Database

- হোম পেজ → `src/app/page.tsx`
- পুরো ডেটাবেস স্কিমা → `supabase-schema.sql` + `supabase-emergency.sql`

---

**প্রেজেন্টেশন টিপ:** OOP দেখাতে হলে **#১ → #২ → #৩** যথেষ্ট —
Model (types) · Encapsulation (lib) · Abstraction/Controller (actions)।

---

## ধাপে ধাপে প্রেজেন্টেশন স্ক্রিপ্ট (web-only)

> ম্যাম "ধাপে ধাপে কোড দেখাও" বললে — এলোমেলো ফাইল না খুলে একজন ইউজারের
> পুরো যাত্রা ধরে দেখাও: Model → Database। শুধু web, desktop branch খুলতে হবে না।

**শুরুর লাইন:** "ম্যাম, আমি একজন ইউজারের পুরো যাত্রা ধরে কোডটা দেখাচ্ছি — model থেকে database পর্যন্ত।"

1. **Model (ভিত্তি)** → `src/types/index.ts`
   "সব data-র গঠন — `Donor`, `BloodRequest`, `DonationRecord`। পুরো প্রজেক্ট এর উপর দাঁড়ানো।"
2. **View (ইউজার যা দেখে)** → `src/app/page.tsx` → `src/components/DonorSearch.tsx`
   "রক্তের গ্রুপ + জেলা দিয়ে donor খোঁজা — reusable search component।"
3. **Encapsulation (নিয়ম বন্দি)** → `src/lib/eligibility.ts` (+ `validation.ts`)
   "৯০-দিনের নিয়ম এক জায়গায় — search/profile/request সবাই এই function ডাকে।"
4. **Controller / Abstraction** → `src/app/(main)/request/actions.ts`
   "request পাঠালে eligibility + duplicate + self-check করে DB-তে লেখে; UI ভেতরের SQL জানে না।"
5. **Security (তিন স্তর)** → `src/proxy.ts` (+ RLS `supabase-schema.sql`)
   "login ছাড়া `/request`-এ ঢোকা যায় না; anonymous কেউ মোবাইল নম্বর পড়তে পারে না।"
6. **Database** → `supabase-schema.sql`
   "টেবিল + `complete_blood_request` function — রক্তদান নিশ্চিত হলে count বাড়ায়।"

**শেষ লাইন:** "এক নজরে — Model → View → নিয়ম → Controller → Security → Database — এই ছয় স্তরেই পুরো অ্যাপ।"

**মনে রাখার ক্রম:** `types` → `page/components` → `lib` → `actions` → `proxy` → `.sql`

> `class` নিয়ে প্রশ্ন এলে: "web ভার্সনে domain model TypeScript `interface` (ধাপ ১),
> OOP-এর ধারণা — encapsulation (`lib`), abstraction (server actions) — পুরো কোডে আছে;
> React functional component ব্যবহার করি বলে UI-তে `class` লিখি না।"

---

## Database কোড কীভাবে লেখা

> ম্যাম "database-এর কোড কীভাবে লেখা" জিজ্ঞেস করলে — `supabase-schema.sql` (~৪২৬ লাইন)
> উপর থেকে নিচে এই ছয় সেকশনে সাজানো:

1. **Tables** — `create table if not exists ...` দিয়ে ৪টা মূল টেবিল
   (`profiles`, `donors`, `blood_requests`, `donation_records`); `if not exists` → বারবার চালালেও ভাঙে না (idempotent)।
2. **CHECK constraints** — blood group শুধু A+/O− এর মতো বৈধ মান, status শুধু PENDING/ACCEPTED/COMPLETED; ভুল ডেটা database-ই আটকায়।
3. **Indexes** — donor search দ্রুত করা; আর unique index একই donor-কে **duplicate PENDING request** আটকায়।
4. **Triggers + Functions** — `complete_blood_request()` atomically request বন্ধ করে + donation record লেখে; trigger নিজে count বাড়ায়। রক্তদাতা নিজের count নিজে বাড়াতে পারে না।
5. **Row Level Security (RLS)** — কে কোন row পড়তে/লিখতে পারবে নিয়মটা **database-এর ভেতরে**; app-এ bug থাকলেও ডেটা নিরাপদ।
6. **Grants** — anonymous ভিজিটর donor-এর নাম/গ্রুপ/জেলা দেখে, কিন্তু **মোবাইল নম্বর কখনো নয়** (column-level grant)।

**এক লাইনে:** "Table → CHECK → Index → Trigger/Function → RLS → Grant — মানে শুধু ডেটা রাখা নয়, ভুল ডেটা আটকানো, duplicate রোধ আর নিরাপত্তা সবই database-এর ভেতরেই।"

> Emergency board-এর টেবিল (`emergency_requests`, `emergency_offers`) আলাদা ফাইলে —
> `supabase-emergency.sql` (~৩২৩ লাইন), একই ছয়-সেকশন গঠনে।
