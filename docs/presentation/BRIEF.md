# Blood Finder — Presentation Brief (Claude-কে দেওয়ার Context Pack)

> **কীভাবে ব্যবহার করবেন:** claude.ai-তে (বা Claude Code-এ) নতুন চ্যাট খুলে এই পুরো
> ফাইলটা paste করুন + `screenshots/` ফোল্ডারের ছবিগুলো attach করুন, তারপর বলুন কী
> ধরনের আউটপুট চান (slide deck / .pptx / HTML presentation)। নিচের সবকিছুই
> presentation বানানোর জন্য যথেষ্ট context।

---

## 1) এক লাইনে প্রজেক্ট

**Blood Finder** — বাংলাদেশের জন্য একটি বিশ্বাসযোগ্য রক্তদাতা খোঁজার প্ল্যাটফর্ম:
জরুরি মুহূর্তে verified রক্তদাতা খোঁজা, public emergency board-এ রিকোয়েস্ট পোস্ট,
আর রক্তদাতা হিসেবে নিবন্ধন — সব এক জায়গায়, বাংলা-first ও mobile-first।

- **Live site:** https://blood-finder-bangladesh.vercel.app
- **GitHub:** https://github.com/devjewel01/blood-finder
- **Team:** Juli Nath (2401011004), Asma Akter (2401011021), Mom Chakraborti (2401011034)
- **Supervisor:** Dhonita Tripura, Assistant Professor, CSE — RMSTU
- **Course context:** CSE 2nd year, Object Oriented Programming Lab — RMSTU, CSE 11th Batch

## 2) গল্পটা (presentation narrative arc)

1. **সমস্যা:** বাংলাদেশে জরুরি রক্তের প্রয়োজনে মানুষ Facebook পোস্ট, পরিচিতজন আর
   ফোনকলের উপর নির্ভর করে — সময় নষ্ট হয়, ভুয়া/টাকা-চাওয়া দালালের ঝুঁকি থাকে,
   আর রক্তদাতার ফোন নম্বর যত্রতত্র ছড়িয়ে পড়ে।
2. **আমাদের সমাধান:** একটি প্ল্যাটফর্ম যেখানে (ক) blood group + জেলা দিয়ে সেকেন্ডেই
   verified রক্তদাতা খোঁজা যায়, (খ) জরুরি রিকোয়েস্ট public board-এ পোস্ট করলে
   এলাকার রক্তদাতারা নিজে এগিয়ে আসেন, (গ) প্রতিটি রক্তদাতা admin-verified।
3. **Trust & privacy আমাদের মূল ডিজাইন নীতি:** admin approval gate, ৯০-দিনের
   eligibility rule সব জায়গায় enforced, donor-first privacy (রিকোয়েস্টারের নম্বর
   লুকানো থাকে; রক্তদাতা সাড়া দিলে রিকোয়েস্টার তাঁর নম্বর দেখে নিজে কল করেন),
   abuse report → admin queue, এবং anonymous ভিজিটর কারো email/mobile/স্বাস্থ্যতথ্য
   পড়তেই পারে না (database-level column security)।
4. **Evolution (OOP কোর্সের সাথে সংযোগ):** প্রজেক্টটা শুরু হয়েছিল JavaFX + SQLite
   desktop app হিসেবে (OOP Lab) — repo-র `desktop-app` branch-এ সংরক্ষিত। সেই
   একই domain model (User, Donor, BloodRequest, DonationRecord) পরে production-grade
   web platform-এ rebuild করা হয়েছে। OOP concepts → real-life product.
5. **ভবিষ্যৎ:** SMS notification, auto-expiry, রক্তদাতা rating/badge, NID-ভিত্তিক
   verification — লক্ষ্য: বাংলাদেশের সবচেয়ে বিশ্বাসযোগ্য রক্তদাতা নেটওয়ার্ক।

## 3) মূল ফিচার (screenshot সহ)

| Screenshot | ফিচার |
|---|---|
| `01-home-desktop.png` | Home: hero-তে এক-ট্যাপ blood-group search, live availability board (গ্রুপ-ভিত্তিক রিয়েল কাউন্ট), ইন্টারেক্টিভ জেলা heatmap, awareness sections — সম্পূর্ণ data-driven ও animated |
| `02-donor-search.png` | Donor search: blood group + জেলা + এলাকা ফিল্টার, eligibility badge, donation count badge |
| `03-donor-profile.png` | Public donor profile: eligibility countdown, total donations; নম্বর শুধু লগইন করলে |
| `04-emergency-board.png` | Emergency board: urgency-ট্যাগসহ কার্ড, লগইন ইউজারের গ্রুপ+জেলা auto-filtered, "আমি রক্ত দিতে পারবো" এক-ট্যাপ সাড়া |
| `05-profile-hub.png` | Profile hub: donor card + eligibility note, পাঠানো/পাওয়া রিকোয়েস্ট, emergency offers (সাড়াদাতার নম্বরসহ), donation history |
| `06-admin-panel.png` | Admin panel: pending donor approvals (fitness verdict সহ), reports queue (Open/Reviewed/Resolved), emergency oversight, user management |
| `07-stats-map.png` | District heatmap + blood group distribution (click-to-zoom, server-side SVG) |
| `08-home-mobile-390.png` | Mobile-first: 390px-এ পুরো search above the fold |

**সম্পূর্ণ user flow (ডেমোতে দেখানোর ক্রম):**
Register (email বা শুধু মোবাইল নম্বরে) → Become a Donor (প্রোফাইল থেকে pre-fill) →
Admin approve → Search-এ দেখা যায় → কেউ request পাঠায় → Donor accept (তখন
রিকোয়েস্টার নম্বর পায়) → রক্তদানের পর "🩸 রক্ত দিয়েছি" → donation history +
count + ৯০-দিনের countdown। Emergency: পোস্ট → রক্তদাতার সাড়া → "ইনি রক্ত
দিয়েছেন" → বন্ধ + রক্তদাতার হিসাবে যোগ।

## 4) Technical highlights (architecture slide-এর জন্য)

- **Stack:** Next.js 16 (App Router, Server Components + Server Actions), TypeScript,
  Tailwind CSS v4, Supabase (PostgreSQL + Auth, Row Level Security), Vercel।
- **Security:** প্রতিটি server action-এ auth + ownership re-check; এক policy/টেবিল/অ্যাকশন
  RLS; anonymous-দের জন্য column-level grants (email/mobile/health unreadable);
  SECURITY DEFINER DB functions দিয়ে atomic operations (যেমন donation complete)।
- **Data integrity:** donation count + last donation date DB trigger-এ রক্ষিত;
  duplicate request DB unique index-এ blocked; সব enum CHECK constraint-এ।
- **Bengali-first:** Hind Siliguri font, বাংলা সংখ্যা/তারিখ, ভাষা-নীতি — নির্দেশনা বাংলায়,
  universal term (A+, Login, Emergency) English-এ।
- **Performance:** ৭০০KB জেলা GeoJSON server-side SVG-তে project হয় (client-এ যায় না),
  CSS-only animations (prefers-reduced-motion respected), মোবাইলে কোথাও horizontal scroll নেই।
- **Quality process:** পুরো সাইট Playwright দিয়ে end-to-end browser-tested
  (desktop + mobile), lint + type-check + production build clean।

## 5) সংখ্যা (slide-এ ব্যবহারযোগ্য)

- ৬৪ জেলার structured location data + ইন্টারেক্টিভ heatmap
- ৮টি blood group-এর live availability
- ১৩০+ donor profile (ডেমো ডেটাসহ) — ম্যাপ ও বোর্ড লাইভ ডেটায় চলে
- ১৬টি route/পেজ, ৮টি database table, সবগুলোতে RLS

## 6) Slide outline (১০–১২ স্লাইড সাজেশন)

1. Title — Blood Finder + tagline + team
2. সমস্যা (বাংলাদেশের রক্ত খোঁজার বাস্তবতা)
3. সমাধান এক নজরে (তিনটি মূল ফ্লো)
4. Live demo / home screenshot
5. Donor search + verified donor profile
6. Emergency board + donor-first privacy (এটা আমাদের signature design)
7. Request lifecycle (PENDING→ACCEPTED→COMPLETED, donation trigger)
8. Admin panel + trust/safety (approval, reports, eligibility rules)
9. Architecture (stack diagram + security layers)
10. OOP desktop app → web platform evolution (course connection)
11. Future roadmap
12. ধন্যবাদ + live URL + QR code

> **Claude-কে প্রম্পট দেওয়ার টিপস:** "তুমি একজন presentation designer। উপরের brief +
> attached screenshot দিয়ে ১২-স্লাইডের একটা university project presentation বানাও —
> theme: লাল (#dc2626) + সাদা, পরিচ্ছন্ন, যেন Blood Finder-এর UI-এর সাথে মেলে।
> স্লাইডের লেখা বাংলায় (technical term English-এ)।" — আউটপুট format চাইলে বলুন:
> `.pptx` ফাইল, অথবা HTML slide deck (artifact)।
