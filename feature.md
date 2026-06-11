# 🩸 Blood Finder — Feature তালিকা (টেস্ট ও রিভিউ চেকলিস্ট)

> এই ডকুমেন্টে সাইটের **সব feature** বাংলা ব্যাখ্যা + English term সহ দেওয়া আছে।
> প্রতিটা একে একে টেস্ট করুন, `[ ]`-এ টিক দিন (`[x]`), আর পাশে **📝 নোট** লিখে কী
> বদলাতে চান বলুন।
>
> **টেস্ট করার ঠিকানা:** লোকাল → `http://localhost:3000` (`npm run dev`) অথবা live site।

> **সর্বশেষ ফুল টেস্ট:** 2026-06-11 — Playwright দিয়ে সব মূল ফ্লো ব্রাউজারে টেস্ট করা হয়েছে
> (desktop + 390px/360px mobile)। `[x]` = ওই টেস্টে পাস করেছে। বিস্তারিত: docs/README.md।

> ### 👥 টিমমেটদের জন্য — কীভাবে ব্যবহার করবেন
> - **Live site:** https://blood-finder-bangladesh.vercel.app — এখান থেকেই টেস্ট করুন।
> - `[x]` = ইতিমধ্যে ব্রাউজারে টেস্ট-পাস; `[ ]` = **তোমরা হাতে-কলমে চেক করো** আর কিছু
>   খটকা লাগলে পাশে 📝 নোট লেখো।
> - **টেস্ট অ্যাকাউন্ট** (password দুটোতেই `BloodTest#2026`):
>   `01712340001` → Juli Nath (admin + approved O+ donor) ·
>   `bf.test.karima@example.org` → Asma Akter (requester)।
>   চাইলে নিজের নামে নতুন অ্যাকাউন্টও খুলে নাও (মোবাইল নম্বর দিয়েই হয়)।
> - প্রেজেন্টেশন: `docs/presentation/index.html` (ব্রাউজারে খুলে F = fullscreen) ·
>   স্যারের প্রশ্নের প্রস্তুতি: `docs/TECH-STACK.md` + `docs/problem-vs-solution.md`।

---

## 0) Global / সব পেজে কমন

- [x] **Navbar** — মেনু: **Emergency, Find Donors, About Us**। লগইন করা থাকলে ডান পাশে **Profile Circle Icon** (নামের প্রথম অক্ষর) — ক্লিক করলে `/profile`। লগইন না থাকলে Login/Register। (Dashboard, Stats, Admin মেনুতে **নেই**।)
- [x] **Footer** — Quick Links (Home, Emergency, Find Donors, Become a Donor, **Statistics**, About Us) + যোগাযোগ (email, location)।
- [x] **Admin link (Footer-only)** — admin হিসেবে লগইন থাকলে footer-এর নিচে **"Admin Panel"** লিংক দেখা যায়; সাধারণ ইউজার দেখে না। Admin-রা চাইলে সরাসরি `domain/admin` URL দিয়েও ঢুকতে পারে।
- [x] **Bilingual UI** — বাংলা + English mixed; common/technical term English, ব্যাখ্যা বাংলা।
- [x] **Bengali font (Hind Siliguri)** — বাংলা লেখা সুন্দর ও পরিষ্কার দেখায়।
- [x] **Flash / Toast** — কোনো action-এর পর (register, donor apply, admin action ইত্যাদি) উপরে ছোট নোটিফিকেশন।
- [x] **Animations** — scroll-এ count-up সংখ্যা, card গুলো fade-up হয়ে আসা, hover effect; `prefers-reduced-motion` respect করে।

---

## 1) Home Page (`/`)

- [x] **Hero — Living Blood Drop** — ডান পাশে অ্যানিমেটেড রক্তের ফোঁটা (liquid wave, bubbles, pulse ring, heartbeat/ECG line)।
- [x] **Blood-type Quick Search chips** — Hero-তে A+, A−, … O− চিপ; ক্লিক করলে সরাসরি ঐ গ্রুপের filtered donor list (`/donors?blood_type=...`)।
- [x] **Hero CTA** — "রক্তদাতা হোন" → `/become-donor`, "রক্তদাতা খুঁজুন" → `/donors`।
- [x] **Stats Strip** — মোট রক্তদাতা / এখন Available / জেলা / Blood Group — scroll-এ **count-up** হয়। (Stats-এর আলাদা মেনু নেই — হোমের সৌন্দর্যের জন্য এখানে, আর বিস্তারিত `/stats` পেজ footer-এর "Statistics" লিংকে।)
- [x] **Emergency Preview** — "Live · Emergency": এই মুহূর্তের জরুরি রিকোয়েস্টের ৩টা কার্ড; "সব রিকোয়েস্ট দেখুন" → `/emergency`।
- [x] **How it works** — ৩ ধাপে কীভাবে কাজ করে (Search → Request → Save a life)।
- [x] **Blood Availability Board** — ৮টা গ্রুপের লাইভ available সংখ্যা + heat bar; ক্লিক করলে ঐ গ্রুপের filtered list (০ হলে "আপনি হোন" → become-donor)।
- [x] **Live Data Map — District Heatmap** — জেলা অনুযায়ী রঙিন বাংলাদেশের ম্যাপ (যত বেশি donor তত গাঢ় লাল)।
  - [ ] **Hover Tooltip** — জেলার উপর মাউস নিলে নাম + donor সংখ্যা।
  - [ ] **Click-to-Zoom** — জেলায় ক্লিক করলে সেই জেলায় zoom + বাকিগুলো dim + "পুরো ম্যাপ" বাটনে reset।
  - [x] **Blood Group Chart** — ম্যাপের পাশে গ্রুপ-বণ্টন bar chart; জেলা সিলেক্ট করলে সেই জেলার বণ্টন দেখায়।
- [x] **Why Donate** — impact facts (২ সেকেন্ড / ৩ জীবন / ১০ মিনিট) + মিশন।
- [x] **Myths vs Facts (Misconceptions)** — রক্তদান নিয়ে ভুল ধারণা vs সত্য।
- [x] **Donation Guide (Eligibility)** — কারা রক্ত দিতে পারবেন + রক্তদানের আগে/পরে পরামর্শ।
- [x] **Final CTA Band** — শেষে বড় লাল ব্যানার + "রক্তদাতা হোন" / "রিকোয়েস্ট দিন"।

---

## 2) Authentication (`/login`, `/register`)

- [x] **Email বা Mobile দিয়ে Register** — email না থাকলে **মোবাইল নম্বর + password** দিয়েই অ্যাকাউন্ট খোলা যায় (যেমন: 01712345678); সফল হলে `/profile`-এ যায়।
- [x] **Email বা Mobile দিয়ে Login** — একই ফিল্ডে email অথবা mobile, যেটা দিয়ে register করা; সফল হলে `/profile`-এ যায়।
- [ ] **Google OAuth** — Google দিয়ে sign-in (callback: `/auth/callback` → `/profile`)।
- [x] **Logout** — Profile পেজের **Sign Out** বাটন (mobile menu-তেও Logout আছে)।
- [x] **Protected Routes** — লগইন ছাড়া `/profile`, `/become-donor`, `/request`, `/admin`, `/emergency/new`-এ গেলে আটকায় (`proxy.ts`)। পুরনো `/dashboard` লিংক `/profile`-এ redirect হয়।
- [x] **Profile auto-create** — register-এর পর `profiles` টেবিলে রেকর্ড তৈরি হয়।

---

## 3) Donor (রক্তদাতা)

- [x] **Become a Donor** (`/become-donor`) — পূর্ণাঙ্গ donor registration ফর্ম:
  **Full Name, Email (read-only), Blood Group, Last Donation Date, Mobile Number (আবশ্যক), District (৬৪-জেলা dropdown), Area, Sex, Age, Weight (kg), কোনো রোগ আছে কিনা**।
  - [x] **Mobile আবশ্যক** — donor হতে হলে মোবাইল নম্বর দিতেই হবে (রোগীরা এই নম্বরে যোগাযোগ করবে)।
  - [x] **Profile Prefill & Sync** — registration বা profile-এ আগে দেওয়া নাম/মোবাইল/জেলা/এলাকা ফর্মে আগে থেকে বসানো থাকে; এখানে যা সেভ হয় তা প্রোফাইলেও আপডেট হয় — দুটো সবসময় **sync** থাকে।
  - [x] **Eligibility — submit আটকায় না** — বয়স ১৬–৭০ ও ওজন ৩০+ হলে আবেদন জমা হয়; নিয়মের বাইরে (১৮-এর কম, ৪৫ কেজির কম) হলে **admin panel-এ "Not eligible" verdict** দেখায়, admin সিদ্ধান্ত নেয়। শেষ রক্তদানের তারিখ ভবিষ্যতের হতে পারবে না।
- [x] **Donor Search & Filter** (`/donors`) — filter: **Blood type / District / Area**।
  - [x] **Search না করা পর্যন্ত খালি** — পেজ খুললে কোনো donor list দেখায় না; মোটিভেশনাল মেসেজ থাকে। Search চাপলে (বা deep-link দিয়ে এলে) তবেই ফিল্টার অনুযায়ী result।
  - [x] **URL deep-link** — `/donors?blood_type=O_POS` দিয়ে এলে আগে থেকেই filtered।
  - [x] **Eligibility badge** — শেষ রক্তদানের তারিখ থেকে ৯০-দিনের হিসাবে "Available" বা কবে eligible হবে।
  - [x] **Donation Count** — donor কার্ডে "🩸 X বার রক্ত দিয়েছেন" badge (এই প্ল্যাটফর্মে যতবার দিয়েছে)।
- [x] **Public Donor Profile** (`/donor/[id]`) — একজন donor-এর পাবলিক প্রোফাইল (eligibility status + **Total Donations** সহ)।
- [x] **Admin Approval** — নতুন donor `is_approved` না হলে পাবলিকে দেখায় না (admin approve করে)।

---

## 4) Emergency Board (জরুরি রক্ত)

- [x] **Post Emergency Request** (`/emergency/new`) — রোগীর সমস্যা, blood type, ব্যাগ সংখ্যা, hemoglobin, কবে লাগবে, district, hospital, urgency।
- [x] **Emergency Feed** (`/emergency`) — সব OPEN রিকোয়েস্ট কার্ড আকারে।
- [x] **Offer to Donate** — "আমি রক্ত দিতে পারবো" — donor offer দেয়; offer দিতে হলে প্রোফাইলে **মোবাইল নম্বর থাকতে হবে** (না থাকলে প্রোফাইলে যোগ করার লিংক দেখায়)।
- [x] **Donor-first Privacy** — offer দিলে donor রিকোয়েস্টারের নম্বর **দেখে না**; বরং রিকোয়েস্টকারী তার প্রোফাইলে offer-দেওয়া donor-এর নাম+নম্বর দেখে **donor-কে কল করে** (রক্তদাতার privacy আগে)।
- [ ] **Area/District Matching** — লগইন করা ইউজারের ফিড default তার নিজের জেলায় filtered থাকে (চাইলে অন্য জেলা/সব জেলা দেখা যায়)।
- [ ] **Rate Limiting** — খুব বেশি offer দিলে আটকায় (spam protection)।

---

## 5) Profile Hub (`/profile`) — সব কিছু এক জায়গায়

> আলাদা Dashboard মেনু **নেই** — আগের dashboard-এর সব কিছু এখন Profile-এ।

- [ ] **Personal Information** — নাম, email (অপরিবর্তনযোগ্য), মোবাইল, district, area — **Edit** বাটনে view/edit toggle।
- [ ] **Sync to Donor** — প্রোফাইল আপডেট করলে donor রেকর্ডেও মিলে যায় (district/area sync)।
- [ ] **Donor Status Card** (donor হলে) — blood group badge, location, **Approved / Pending Approval** status; approved হলে **Available/Unavailable toggle**।
- [x] **Donation Eligibility Note** — donor নিজের কার্ডে দেখে: ✅ "এখন রক্ত দিতে পারবেন" বা ⏳ "আরো X দিন পরে (তারিখ)" — ৯০-দিনের নিয়মে।
- [ ] **Donor Details (Edit)** — district, area, sex, age, weight, last donation date, রোগ — সব view ও edit করা যায়।
- [x] **Requests I Sent** — পাঠানো রক্তের অনুরোধ + status; PENDING হলে Cancel; ACCEPTED হলে donor-এর মোবাইল + **"🩸 রক্ত পেয়েছি — নিশ্চিত করুন"** বাটন।
- [x] **Requests I Received** (donor হলে) — পাওয়া অনুরোধ + requester-এর নাম/মোবাইল; **Accept / Decline**; Accept-এর পর donor অপেক্ষা করেন — **রিকোয়েস্টকারীই সম্পন্ন নিশ্চিত করেন** (donor নিজের donation নিজে confirm করতে পারে না)।
- [x] **Request Completion (requester-confirmed)** — রিকোয়েস্টকারী "রক্ত পেয়েছি" চাপলে রিকোয়েস্ট **COMPLETED**, donation record তৈরি, donor-এর **count +১** ও ৯০-দিনের countdown শুরু।
- [x] **My Emergency Requests** — নিজের পোস্ট করা জরুরি রিকোয়েস্ট + কারা offer দিয়েছে (নাম/মোবাইল/report বাটন); **Fulfill / Cancel**।
- [x] **"✓ ইনি রক্ত দিয়েছেন"** — ব্লাড পেয়ে গেলে রিকোয়েস্টকারী offer-দেওয়া donor-এর পাশে এই বাটন চাপে — রিকোয়েস্ট FULFILLED হয়, donation রেকর্ড হয় এবং সেই donor-এর **donation count +১** হয়।
- [x] **Donation History** — আগের রক্তদানের রেকর্ড (কত তারিখে, কাকে দিয়েছে)।
- [x] **Donation Count** — donor card-এ "🩸 X বার রক্ত দিয়েছেন"।
- [x] **Sign Out** — উপরের ডান কোণে।
- [ ] **Become a Donor CTA** — donor না হলে উপরে বাটন।
- [x] **Blood Request** (`/request`) — নির্দিষ্ট donor-কে রক্তের অনুরোধ পাঠানো; পাঠানোর পর "Go to Profile"।

---

## 6) Reports & Admin (নিরাপত্তা ও পূর্ণ নিয়ন্ত্রণ)

- [x] **Report (safety)** — কোনো donor/requester সম্পর্কে অভিযোগ অ্যাডমিনকে জানানো (No-show / টাকা চেয়েছে / ভুয়া / খারাপ আচরণ)।
- [x] **Admin Panel** (`/admin`) — শুধু admin (`profiles.is_admin = true`); লিংক footer-এ, অথবা সরাসরি URL:
  - [x] **Stats Cards** — Pending Donors / Open Emergencies / Recent Requests / Total Users।
  - [x] **Pending Donor Approvals** — approve/reject; প্রতিটা আবেদনে **sex, age, weight, mobile, শেষ রক্তদান, রোগ** + স্বয়ংক্রিয় verdict chip: ✓ "রক্তদানের উপযুক্ত" বা ⚠ **"Not eligible — কারণ"** (যেমন: বয়স ১৮–৬৫ এর বাইরে / ওজন ৪৫ কেজির কম / ৯০ দিন হয়নি) — admin ডাটা না পড়েই বুঝে যায়।
  - [x] **Approved Donors** — সব approved donor-এর তালিকা (availability সহ); **Unapprove** (public search থেকে লুকানো, পরে আবার approve করা যায়) / **Remove** (donor record মুছে ফেলা, account থাকে)।
  - [x] **Manage Users** — **Make admin / Revoke admin**; **Delete** (account + donor record + সব request স্থায়ীভাবে মুছে যায়, confirm dialog সহ)।
  - [ ] **Safety Guards** — নিজেকে delete বা নিজের admin status বদলানো যায় না; আরেক admin-কে delete করতে হলে আগে **Revoke admin** করতে হয় (UI + server + database তিন স্তরে enforced)।
  - [ ] **Blood Requests** — সাম্প্রতিক সব অনুরোধ দেখা; PENDING/ACCEPTED হলে **Cancel** করা যায়।
  - [x] **Emergency Requests** — সব জরুরি রিকোয়েস্ট (urgency + তারিখসহ); OPEN হলে **Mark fulfilled / Cancel**, পুরনো হলে **Mark expired**।
  - [x] **View Reports** — অভিযোগের queue: **Open / Reviewed / Resolved ট্যাব**; **Mark reviewed → Mark resolved**।

---

## 7) Info Pages

- [ ] **About Us** (`/about`) — সাইট সম্পর্কে (Navbar মেনুতে আছে)।
- [ ] **Statistics** (`/stats`) — ম্যাপ + গ্রুপ-বণ্টন চার্ট (আলাদা পেজ; লিংক footer-এর Quick Links-এ)।

---

## 8) ডেটা ও কারিগরি (Technical)

- [ ] **Database Schema** — `profiles` (name, email, mobile, district, area), `donors` (blood_type, district, area, **sex, age, weight_kg, health_conditions, donation_count**, last_donation_date, availability, approval), `blood_requests`, `donation_records`, emergency টেবিলগুলো — সব RLS policy সহ (`supabase-schema.sql`, idempotent — বারবার চালানো নিরাপদ)।
- [ ] **admin_delete_user()** — SECURITY DEFINER database function; admin check + self-delete guard + admin-target guard সহ `auth.users` থেকে user মুছে দেয় (cascade)।
- [ ] **Donation Count trigger** — `donation_records`-এ insert হলেই trigger donor-এর `donation_count` +১ ও `last_donation_date` আপডেট করে; `record_emergency_donation()` RPC দিয়ে emergency credit।
- [ ] **Mobile Auth** (`src/lib/auth-identifier.ts`) — মোবাইল-নম্বর অ্যাকাউন্ট ভিতরে synthetic email (`01XXXXXXXXX@mobile.bloodfinder.app`) ব্যবহার করে; UI-তে synthetic email কখনো দেখায় না।
- [ ] **Eligibility Logic** (`src/lib/eligibility.ts`) — ৯০-দিন gap rule (`calculateEligibility`) + বয়স/ওজন/gap মিলিয়ে fitness verdict (`checkDonorFitness`)।
- [ ] **Demo Data** — টেস্টের জন্য ~131 জন demo donor বসানো (`user_id` NULL)। মুছতে: `delete from donors where user_id is null;` (`supabase-seed-demo.sql`)।
- [ ] **Map data bundled** — জেলা GeoJSON build-time-এ bundle (runtime fetch নেই); projection server-side।
- [ ] **Deploy (Vercel)** — main-এ push করলে auto-deploy; env দুটো (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) সেট থাকতে হবে।

---

## 📝 আমার রিভিউ নোট (যা বদলাতে চাই)

> এখানে স্বাধীনভাবে লিখুন — কোন feature ভালো, কোনটা বদলাতে হবে, নতুন কী চাই:

-
-
-

---

## 9) ২০২৬-০৬-১১ সেশনে নতুন/পরিবর্তিত

- **Request lifecycle সম্পূর্ণ** — Accept এখন শুধু সম্মতি; রক্তদানের পর **রিকোয়েস্টকারী "🩸 রক্ত পেয়েছি"** নিশ্চিত করলে রিকোয়েস্ট COMPLETED + donation record তৈরি হয় (নতুন `complete_blood_request` DB function, atomic)। রক্তদাতা নিজের donation নিজে confirm করতে পারেন না — count বাড়ানোর fraud বন্ধ।
- **Accept হলে মোবাইল দেখা যায়** — Accept হলে requester এখন donor-এর মোবাইল নম্বর দেখতে পায়।
- **`/request` এখন server-validated** — eligibility (৯০ দিন), availability, নিজের কাছে রিকোয়েস্ট ব্লক, duplicate ব্লক।
- **Privacy hardening** — anonymous ভিজিটর আর email/mobile/স্বাস্থ্যতথ্য পড়তে পারে না (column-level grants)।
- **Admin panel redesign** — stats row, reports queue (Open/Reviewed/Resolved ট্যাব + "Mark reviewed"), emergency-তে urgency + তারিখ + "Mark expired", user search, শক্ত delete confirmation, মোবাইল-ফ্রেন্ডলি।
- **Home reorder** — hero-তে quick search above the fold, Emergency → Availability আগে; সব হোম সেকশনের বাংলা natural করা হয়েছে।
- **সাইটজুড়ে ভাষা-পাস** — error/success মেসেজ বাংলা, মিশ্র "donor" শব্দ → "রক্তদাতা", তারিখ বাংলা সংখ্যায়।
- **Mobile fixes** — navbar tap target ৪৪px, ছোট বাংলা লেখা ≥12px।
- **Supabase** — advisor ফিক্স (search_path, function grants, RLS consolidation + initplan, FK index), নতুন migration `security_performance_hardening`।
