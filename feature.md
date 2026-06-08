# 🩸 Blood Finder — Feature তালিকা (টেস্ট ও রিভিউ চেকলিস্ট)

> এই ডকুমেন্টে সাইটের **সব feature** বাংলা ব্যাখ্যা + English term সহ দেওয়া আছে।
> প্রতিটা একে একে টেস্ট করুন, `[ ]`-এ টিক দিন (`[x]`), আর পাশে **📝 নোট** লিখে কী
> বদলাতে চান বলুন।
>
> **টেস্ট করার ঠিকানা:** লোকাল → `http://localhost:3000` (`npm run dev`) অথবা live site।

---

## 0) Global / সব পেজে কমন

- [ ] **Navbar** — উপরে navigation bar (Emergency, Find Donors, Stats, Dashboard, Profile, Admin, Login/Logout)। লগইন অবস্থা অনুযায়ী মেনু বদলায়।
- [ ] **Footer** — নিচে যোগাযোগ/তথ্য (email, location, লিংক)।
- [ ] **Bilingual UI** — বাংলা + English mixed; common/technical term English, ব্যাখ্যা বাংলা।
- [ ] **Bengali font (Hind Siliguri)** — বাংলা লেখা সুন্দর ও পরিষ্কার দেখায়।
- [ ] **Flash / Toast** — কোনো action-এর পর (register, donor apply, admin ইত্যাদি) উপরে ছোট নোটিফিকেশন।
- [ ] **Animations** — scroll-এ count-up সংখ্যা, card গুলো fade-up হয়ে আসা, hover effect; `prefers-reduced-motion` respect করে।

---

## 1) Home Page (`/`)

- [ ] **Hero — Living Blood Drop** — ডান পাশে অ্যানিমেটেড রক্তের ফোঁটা (liquid wave, bubbles, pulse ring, heartbeat/ECG line)।
- [ ] **Blood-type Quick Search chips** — Hero-তে A+, A−, … O− চিপ; ক্লিক করলে সরাসরি ঐ গ্রুপের filtered donor list (`/donors?blood_type=...`)।
- [ ] **Hero CTA** — "রক্তদাতা হোন" → `/become-donor`, "রক্তদাতা খুঁজুন" → `/donors`।
- [ ] **Stats Strip** — মোট রক্তদাতা / এখন Available / জেলা / Blood Group — scroll-এ **count-up** হয়।
- [ ] **Emergency Preview** — "Live · Emergency": এই মুহূর্তের জরুরি রিকোয়েস্টের ৩টা কার্ড; "সব রিকোয়েস্ট দেখুন" → `/emergency`।
- [ ] **How it works** — ৩ ধাপে কীভাবে কাজ করে (Search → Request → Save a life)।
- [ ] **Blood Availability Board** — ৮টা গ্রুপের লাইভ available সংখ্যা + heat bar; ক্লিক করলে ঐ গ্রুপের filtered list (০ হলে "আপনি হোন" → become-donor)।
- [ ] **Live Data Map — District Heatmap** — জেলা অনুযায়ী রঙিন বাংলাদেশের ম্যাপ (যত বেশি donor তত গাঢ় লাল)।
  - [ ] **Hover Tooltip** — জেলার উপর মাউস নিলে নাম + donor সংখ্যা।
  - [ ] **Click-to-Zoom** — জেলায় ক্লিক করলে সেই জেলায় zoom + বাকিগুলো dim + "পুরো ম্যাপ" বাটনে reset।
  - [ ] **Blood Group Chart** — ম্যাপের পাশে গ্রুপ-বণ্টন bar chart; জেলা সিলেক্ট করলে সেই জেলার বণ্টন দেখায়।
- [ ] **Why Donate** — impact facts (২ সেকেন্ড / ৩ জীবন / ১০ মিনিট) + মিশন।
- [ ] **Myths vs Facts (Misconceptions)** — রক্তদান নিয়ে ভুল ধারণা vs সত্য।
- [ ] **Donation Guide (Eligibility)** — কারা রক্ত দিতে পারবেন + রক্তদানের আগে/পরে পরামর্শ।
- [ ] **Final CTA Band** — শেষে বড় লাল ব্যানার + "রক্তদাতা হোন" / "রিকোয়েস্ট দিন"।

---

## 2) Authentication (`/login`, `/register`)

- [ ] **Email/Password Register** — নতুন অ্যাকাউন্ট তৈরি।
- [ ] **Email/Password Login** — লগইন।
- [ ] **Google OAuth** — Google দিয়ে sign-in (callback: `/auth/callback`)।
- [ ] **Logout** — Navbar থেকে লগআউট।
- [ ] **Protected Routes** — লগইন ছাড়া `/dashboard`, `/become-donor`, `/request`, `/admin`-এ গেলে আটকায় (`proxy.ts`)।
- [ ] **Profile auto-create** — register-এর পর `profiles` টেবিলে রেকর্ড তৈরি হয়।

---

## 3) Donor (রক্তদাতা)

- [ ] **Become a Donor** (`/become-donor`) — donor হিসেবে register: blood type, district (64-জেলা dropdown), area/location, last donation date।
  - [ ] **Profile Prefill** — প্রোফাইলের নাম/মোবাইল/লোকেশন আগে থেকে বসানো থাকে।
  - [ ] **Safety / Eligibility rules** — যোগ্যতার শর্ত দেখানো।
- [ ] **Donor Search & Filter** (`/donors`) — সব verified+available donor; filter: **Blood type / District / Area**।
  - [ ] **URL deep-link** — `/donors?blood_type=O_POS` দিয়ে এলে আগে থেকেই filtered।
  - [ ] **Eligibility badge** — "Available" বা "In Nd" (শেষ রক্তদানের তারিখ থেকে হিসাব)।
- [ ] **Public Donor Profile** (`/donor/[id]`) — একজন donor-এর পাবলিক প্রোফাইল।
- [ ] **Admin Approval** — নতুন donor `is_approved` না হলে পাবলিকে দেখায় না (admin approve করে)।

---

## 4) Emergency Board (জরুরি রক্ত)

- [ ] **Post Emergency Request** (`/emergency/new`) — রোগীর সমস্যা, blood type, ব্যাগ সংখ্যা, hemoglobin, কবে লাগবে, district, hospital, urgency।
- [ ] **Emergency Feed** (`/emergency`) — সব OPEN রিকোয়েস্ট কার্ড আকারে।
- [ ] **Offer to Donate** — "আমি রক্ত দিতে পারবো" — donor offer দেয়।
- [ ] **Contact Reveal** — offer দিলে তবেই রিকোয়েস্টারের ফোন নম্বর দেখা যায় (privacy)।
- [ ] **Area/District Matching** — একই এলাকার donor-রা প্রাসঙ্গিক রিকোয়েস্ট দেখে।
- [ ] **Rate Limiting** — খুব বেশি offer দিলে আটকায় (spam protection)।

---

## 5) Requests & Dashboard

- [ ] **Blood Request** (`/request`) — নির্দিষ্ট donor-কে রক্তের অনুরোধ পাঠানো।
- [ ] **Dashboard** (`/dashboard`) — নিজের কার্যক্রম:
  - [ ] **My Emergency Requests** — নিজের পোস্ট করা রিকোয়েস্ট + কারা offer দিয়েছে; **Fulfill / Cancel**।
  - [ ] **Sent / Received Requests** — পাঠানো ও পাওয়া রক্তের অনুরোধ।
  - [ ] **Donation History** — আগের রক্তদানের রেকর্ড।

---

## 6) Profile (`/profile`)

- [ ] **Edit Profile** — নাম, মোবাইল, location, district আপডেট।
- [ ] **Sync to Donor** — প্রোফাইল আপডেট করলে donor রেকর্ডেও মিলে যায় (district sync)।

---

## 7) Reports & Admin (নিরাপত্তা)

- [ ] **Report (safety)** — কোনো donor/requester সম্পর্কে অভিযোগ অ্যাডমিনকে জানানো (No-show / টাকা চেয়েছে / ভুয়া / খারাপ আচরণ)।
- [ ] **Admin Panel** (`/admin`) — শুধু admin (`profiles.is_admin = true`):
  - [ ] **Approve Donors** — pending donor approve/reject।
  - [ ] **Manage Users** — admin promote/revoke।
  - [ ] **View Reports** — জমা পড়া অভিযোগ দেখা।

---

## 8) Info Pages

- [ ] **About Us** (`/about`) — সাইট সম্পর্কে।
- [ ] **Stats** (`/stats`) — ম্যাপ + গ্রুপ-বণ্টন চার্ট (আলাদা পেজ)।

---

## 9) ডেটা ও কারিগরি (Technical)

- [ ] **Demo Data** — টেস্টের জন্য ~131 জন demo donor বসানো (`user_id` NULL)। মুছতে: `delete from donors where user_id is null;` (`supabase-seed-demo.sql`)।
- [ ] **Map data bundled** — জেলা GeoJSON build-time-এ bundle (runtime fetch নেই); projection server-side।
- [ ] **Deploy (Vercel)** — main-এ push করলে auto-deploy; env দুটো (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) সেট থাকতে হবে।

---

## 📝 আমার রিভিউ নোট (যা বদলাতে চাই)

> এখানে স্বাধীনভাবে লিখুন — কোন feature ভালো, কোনটা বদলাতে হবে, নতুন কী চাই:

-
-
-
