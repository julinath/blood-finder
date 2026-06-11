# Blood Finder — Tech Stack: কী ব্যবহার করেছি, কেন করেছি

> দুই ভার্সনের (desktop + web) প্রতিটা technology-র পেছনের কারণ, OOP-এর প্রয়োগ,
> আর স্যারের সম্ভাব্য প্রশ্নের উত্তর — presentation-এর আগে একবার পড়ে গেলেই যথেষ্ট।

---

## Part 1 — Desktop App (Phase 1, `desktop-app` branch)

| Technology | কী | কেন বেছে নিয়েছি |
|---|---|---|
| **Java 21** | Programming language | OOP Lab-এর মূল ভাষা — class, interface, inheritance, encapsulation সরাসরি প্রয়োগ করা যায়। Java 21 = সর্বশেষ LTS (long-term support) version। |
| **JavaFX 21** | Desktop UI framework | Java-র modern UI toolkit (Swing-এর উত্তরসূরি)। FXML দিয়ে UI আলাদা ফাইলে রাখা যায় — Controller থেকে View সম্পূর্ণ আলাদা, যেটা MVC-র জন্য আদর্শ। |
| **FXML** | UI layout (XML) | UI-এর গঠন XML-এ, logic Java-তে — design আর code আলাদা থাকায় টিমের একজন UI বানাতে পারে, আরেকজন logic লিখতে পারে। |
| **SQLite** | Database (file-based) | কোনো server install লাগে না — একটা `.db` ফাইলেই পুরো database। Lab project-এ সবার মেশিনে চালানো সহজ; পুরো SQL শেখাও হয়। |
| **JDBC** | Java ↔ database সংযোগ | Java-র standard database API — `PreparedStatement` দিয়ে SQL injection থেকেও সুরক্ষা। |
| **Maven** | Build tool | Dependency management + এক command-এ build/run (`mvn javafx:run`); পুরো টিম একই configuration পায়। |
| **MVC pattern** | Architecture | Model (entities) – View (FXML) – Controller আলাদা স্তরে; সাথে **Repository pattern** (data access interface) ও **Service layer** (business logic)। |

**Desktop ভার্সনের সীমাবদ্ধতা (যার কারণে Phase 2):** এক কম্পিউটারে এক ইউজার,
data শুধু লোকাল ফাইলে (সবার donor list আলাদা!), install করতে হয়, মোবাইলে চলে না —
অথচ আমাদের আসল ইউজার মোবাইলে।

---

## Part 2 — Web App (Phase 2–3, বর্তমান `main`)

| Technology | কী | কেন বেছে নিয়েছি |
|---|---|---|
| **Next.js 16** (App Router) | Full-stack web framework | এক framework-এই UI (React) আর server logic (Server Components + Server Actions)। আলাদা backend server (যেমন Express/Spring) বানাতে-চালাতে হয় না। Server-side rendering-এ প্রথম লোড দ্রুত — দুর্বল ফোনেও। |
| **React 19** | UI library | Component-ভিত্তিক UI — একটা `BloodTypeBadge` বা `Field` বানিয়ে সব জায়গায় reuse। Industry-standard, চাকরির বাজারেও সবচেয়ে চাহিদার স্কিল। |
| **TypeScript** | Typed JavaScript | আমাদের পুরো domain model typed — `Donor`, `BloodRequest`, `EmergencyRequest` interface। ভুল field নাম বা ভুল status লিখলে **কোড লেখার সময়ই** error দেখায়, deploy-এর পরে না। |
| **Tailwind CSS 4** | Styling | Utility-class দিয়ে দ্রুত consistent design; আলাদা CSS ফাইলের জঞ্জাল নেই; production-এ অব্যবহৃত style বাদ পড়ে — ছোট ফাইল, দ্রুত লোড। |
| **Supabase** | Database (PostgreSQL) + Auth | নিজে auth server + database server না বানিয়ে production-grade PostgreSQL: <br>• **Auth**: email/password, মোবাইল-নম্বর signup, Google OAuth — readymade<br>• **Row Level Security (RLS)**: কে কোন row পড়তে/লিখতে পারবে — নিয়মটা database-এর ভেতরে; app-এ bug হলেও data নিরাপদ<br>• **Column-level grants**: anonymous ভিজিটর email/mobile/স্বাস্থ্যতথ্যের column পড়তেই পারে না<br>• **Triggers + DB functions**: donation count, rate-limit, atomic operations |
| **Vercel** | Hosting + CI/CD | `git push` করলেই auto-deploy; বিশ্বজুড়ে CDN; free tier-এ student project অনায়াসে চলে। Preview deployment-এ প্রতিটা পরিবর্তন আগে দেখে নেওয়া যায়। |
| **d3-geo** | Map projection | বাংলাদেশের ৬৪ জেলার GeoJSON → SVG path। হিসাবটা server-এ হয়, তাই ৭০০KB-র ম্যাপ ডেটা কখনো ইউজারের ফোনে যায় না। |
| **Hind Siliguri** | Bengali font | বাংলা রেন্ডারিং সুন্দর ও স্পষ্ট — যুক্তাক্ষর ঠিকভাবে দেখায়; `next/font`-এ optimize হয়ে লোড হয়। |
| **Playwright** | Browser testing | Register → donor → request → donate — প্রতিটা flow আসল ব্রাউজারে (desktop + 390px mobile) টেস্ট করা। |

### Web-এ কেন গেলাম (এক লাইনে প্রশ্ন এলে)

> "আমাদের ইউজার মোবাইল-ব্যবহারকারী সাধারণ মানুষ — install ছাড়া, যেকোনো ফোনে,
> সবার ডেটা এক জায়গায়। Desktop app এগুলোর কোনোটাই দিতে পারে না; web দেয়।"

---

## Part 3 — OOP কোথায়? (দুই stack-এ একই ধারণা)

| OOP Concept | Desktop (Java) | Web (TypeScript) |
|---|---|---|
| **Encapsulation** | `Donor.java`-তে private fields + getters/setters — বাইরে থেকে সরাসরি data বদলানো যায় না | Business rule গুলো module-এ বন্দি: `lib/eligibility.ts`-এ ৯০-দিনের নিয়ম **একটাই** function — search, profile, request form সবাই সেটাই ডাকে |
| **Abstraction** | Repository **interface**-এর পেছনে SQLite-এর খুঁটিনাটি লুকানো; Service layer SQL জানেই না | Server Actions-এর পেছনে Supabase/SQL লুকানো — UI component শুধু `acceptRequest(id)` ডাকে, ভেতরে কী হয় জানে না |
| **Inheritance / Polymorphism** | Common entity base + interface-এর একাধিক implementation — DB বদলালে service code একই থাকে | Discriminated union types (`RequestStatus`, `Eligibility`) — এক type, একাধিক রূপ, compiler নিশ্চিত করে সব case সামলানো হয়েছে; reusable component (`Field`, `BloodTypeBadge` variants) |
| **MVC / Separation of concerns** | Model (entities) · View (FXML) · Controller class | একই ভাগ আধুনিক রূপে: Supabase tables (Model) · React components (View) · Server actions (Controller) |
| **Domain modeling** | User, Donor, BloodRequest, DonationRecord class | **হুবহু একই মডেল** `src/types/index.ts`-এ typed interface হিসেবে — OOP-এ শেখা মডেলটাই দুই প্রযুক্তিতে বেঁচে আছে; এটাই প্রজেক্টের সবচেয়ে বড় OOP শিক্ষা |

---

## Part 4 — স্যারের সম্ভাব্য প্রশ্ন ও উত্তর

**প্র: OOP Lab-এর প্রজেক্ট, কিন্তু web app-এ OOP কোথায়?**
উ: OOP-এর মূল শিক্ষা ভাষা নয় — **চিন্তার পদ্ধতি**: domain-কে object/model-এ ভাগ করা, data লুকিয়ে রাখা (encapsulation), implementation লুকানো (abstraction), দায়িত্ব ভাগ (MVC)। Desktop-এ যে User/Donor/BloodRequest মডেল বানিয়েছিলাম, web-এ সেই একই মডেল typed interface হয়ে আছে। Part 3-এর টেবিলটাই উত্তর।

**প্র: নিজেরা backend (যেমন Java Spring) না বানিয়ে Supabase কেন?**
উ: আমরা যেটা নিজে বানালে মাসখানেক লাগত (auth, password hashing, OAuth, SQL server, security), Supabase সেটা production-মানে দেয় — আর আমরা সময়টা দিয়েছি আসল সমস্যায়: donor privacy, eligibility rules, emergency flow। Architecture বুঝি বলেই জানি কোনটা নিজে বানানো উচিত আর কোনটা নয় — এটাও engineering সিদ্ধান্ত।

**প্র: Data security কীভাবে নিশ্চিত হয়?**
উ: তিন স্তরে — (১) UI validation, (২) প্রতিটা server action-এ auth + ownership re-check, (৩) database-এ RLS + column grants + CHECK constraints। কোনো এক স্তরে bug থাকলেও বাকি দুটো আটকায়। যেমন: anonymous কেউ API দিয়ে সরাসরি query করলেও donor-এর মোবাইল নম্বর পড়তে পারবে না — database-ই মানা করে।

**প্র: দুজন ইউজার একসাথে একই donor-কে request করলে কী হবে?**
উ: Database-এ unique index আছে — একজনের duplicate PENDING request তৈরিই হবে না; race condition-ও database স্তরে আটকানো।

**প্র: রক্তদান হয়েছে কি না সেটা কে নিশ্চিত করে? ভুয়া সংখ্যা বাড়ানো যায় না?**
উ: **সবসময় যিনি রক্ত পেলেন (requester), তিনিই নিশ্চিত করেন** — direct request-এ "রক্ত পেয়েছি" বাটনে, emergency-তে "ইনি রক্ত দিয়েছেন" বাটনে। রক্তদাতা কখনোই নিজের donation নিজে confirm করতে পারেন না — DB function-ই আটকায় — তাই কেউ নিজের count নিজে বাড়াতে পারে না। Requester-এর মিথ্যা confirm করার কোনো লাভ নেই (credit অন্যের ঘরে যায়)। Confirm হলে atomic DB function request বন্ধ করে donation record লেখে, trigger সংখ্যা বাড়ায়।

**প্র: SQLite থেকে PostgreSQL-এ কেন?**
উ: SQLite এক ফাইল, এক মেশিন — শেখার জন্য আদর্শ। PostgreSQL server-grade: অনেক ইউজার একসাথে, RLS-এর মতো security feature, triggers/functions। ধারণা একই (SQL), স্কেল ভিন্ন।

**প্র: এটা scale করবে? ১০,০০০ ইউজার হলে?**
উ: হ্যাঁ — Vercel auto-scale করে, PostgreSQL-এ সব দরকারি index আছে (blood group + district search index সহ), ভারী হিসাব (ম্যাপ) server-side cached। আজকের free tier-এই কয়েক হাজার ইউজার চলে; বাড়লে শুধু plan upgrade।

**প্র: বাংলা UI কেন? English কেন নয়?**
উ: আমাদের টার্গেট ইউজার সাধারণ মোবাইল-ব্যবহারকারী, যাঁদের অনেকে বাংলায় স্বচ্ছন্দ। নীতি: নির্দেশনা/বার্তা বাংলায়, universal term (A+, Login, Emergency, জেলার নাম) English-এ — দুটোই যেন স্বাভাবিক লাগে।

**প্র: টেস্ট করেছ কীভাবে?**
উ: তিন স্তরে — TypeScript type-check + ESLint (প্রতি build-এ), production build, আর Playwright দিয়ে আসল ব্রাউজারে সব flow: register → donor হওয়া → admin approve → search → request → accept → donate → report → admin queue; desktop আর 390px mobile দুটোতেই।

**প্র: Deploy কীভাবে হয়?**
উ: GitHub-এ push করলেই Vercel auto-build + deploy। প্রতিটা change-এর আগে preview URL-এ দেখে নেওয়া যায়; main branch merge হলে production-এ যায়। Live: blood-finder-bangladesh.vercel.app

---

*সঙ্গী ডকুমেন্ট: [problem-vs-solution.md](problem-vs-solution.md) (কোন সমস্যার কী জবাব),
[README.md](README.md) (architecture/routes/data model), [SETUP.md](SETUP.md) (চালানোর নিয়ম)।*
