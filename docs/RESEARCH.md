# Blood Finder Bangladesh — Research, Competitive Analysis & Product Roadmap

> **রক্ত খোঁজার একটি পূর্ণ-প্রফেশনাল প্ল্যাটফর্ম গড়ার গবেষণা দলিল**
> A research dossier for turning `blood-finder` into a fully professional, real-world blood-donor platform for Bangladesh.

**Date / তারিখ:** 2026-06-06
**Status:** Research & strategy (pre-implementation)
**Audience:** Founders, contributors, and volunteers of blood-finder

---

## How this was produced / কীভাবে তৈরি

This document is the output of **two multi-agent research workflows (47 subagents total)** that web-researched the Bangladeshi and global blood-donation ecosystem, then **adversarially fact-checked every load-bearing claim** against primary sources before writing.

- **Scope:** the BD ecosystem (Badhan, Sandhani, donatebloodbd, bloodbank.org.bd, Bloodman, Rokto, Roktalap, and the de-facto Facebook channel), the government rail (DGHS BBMS), and global references (India e-RaktKosh, American Red Cross, NHS Give Blood, Simply Blood, Friends2Support), **plus** innovative international systems (Facebook/Meta Blood Donations, LifeBank Nigeria, Zipline, Turkey Kızılay, Indonesia PMI, Australia Lifeblood, Singapore/Japan/Gulf, Pakistan/Nepal apps).
- **Verification:** claims were rated *confirmed / partly-confirmed / unverifiable / refuted*. Where a number is **self-reported** by an org/vendor (e.g., most adoption figures), it is flagged as such. Only a few figures (e.g., the Zipline Rwanda study, the donor-reminder RCTs) are peer-reviewed — these are called out.
- **Grounding:** recommendations are tied to our real stack and schema (Next.js 16 / React 19 / Tailwind v4 / Supabase / Vercel; `profiles`, `donors`, `blood_requests`, `donation_records`), so each proposal maps to a concrete, buildable change.

🇧🇩 **বাংলা:** এই দলিলটি **দুটি মাল্টি-এজেন্ট গবেষণা ওয়ার্কফ্লো (মোট ৪৭টি সাব-এজেন্ট)**-এর ফলাফল, যেগুলো বাংলাদেশি ও আন্তর্জাতিক রক্তদান ইকোসিস্টেম নিয়ে ওয়েব-গবেষণা করেছে এবং লেখার আগে **প্রতিটি গুরুত্বপূর্ণ দাবি প্রতিকূলভাবে যাচাই** করেছে। সব বড় সংখ্যা যেখানে সংস্থা/বিক্রেতার স্ব-ঘোষিত, সেখানে স্পষ্টভাবে চিহ্নিত করা হয়েছে; প্রতিটি সুপারিশ আমাদের নিজস্ব কোড ও স্কিমার সঙ্গে যুক্ত।

> ⚠️ **On numbers / সংখ্যা প্রসঙ্গে:** Adoption, user, and "lives saved" figures from companies/NGOs are indicative, **not independently audited**. Use them for direction, not as ground truth. Specific figures (SMS pricing, eligibility intervals, statistics) should be re-verified before they appear in product copy, pitches, or medical guidance.

---

## Table of Contents / সূচিপত্র

1. [Executive Summary & Methodology](#executive-summary--methodology)
2. [Competitive Landscape — How Existing Platforms Work](#competitive-landscape--how-existing-platforms-work)
3. [International Best-in-Class & Innovative Platforms (Beyond the Shortlist)](#international-best-in-class--innovative-platforms-beyond-the-shortlist)
4. [Gap Analysis — What Existing Platforms Miss](#gap-analysis--what-existing-platforms-miss)
5. [How Other Countries Smartly Solved Blood-Finding (and What We Can Copy)](#how-other-countries-smartly-solved-blood-finding-and-what-we-can-copy)
6. [Our Current Site — Assessment & Quick Wins](#our-current-site--assessment--quick-wins)
7. [Feature Recommendations (Prioritized — MoSCoW)](#feature-recommendations-prioritized--moscow)
8. [AI / ML Feature Opportunities](#ai--ml-feature-opportunities)
9. [AI in Blood Supply — Global Case Studies & What We Can Realistically Build](#ai-in-blood-supply--global-case-studies--what-we-can-realistically-build)
10. [UI/UX, Interactivity, Animation & the Bangladesh Map](#uiux-interactivity-animation--the-bangladesh-map)
11. [Technical Architecture, Data Model & Notifications](#technical-architecture-data-model--notifications)
12. [Trust, Safety, Privacy & Verification](#trust-safety-privacy--verification)
13. [Phased Roadmap & Success Metrics](#phased-roadmap--success-metrics)

---

## Executive Summary & Methodology

### The Opportunity

Bangladesh needs roughly **800,000–1,000,000 units of blood per year** (WHO Bangladesh, 2025), yet only about **30%** comes from voluntary, non-remunerated donors — the rest is family-replacement or, historically, unsafe paid donation. The country has dozens of donor apps and 100k+-member Facebook groups, but **no single trusted platform** that is fresh, private, and verified. That gap is the opening for **blood-finder**.

🇧🇩 **বাংলা:** বাংলাদেশে বছরে প্রায় ৮–১০ লক্ষ ব্যাগ রক্ত লাগে, কিন্তু মাত্র ~৩০% আসে স্বেচ্ছায় রক্তদান থেকে। অসংখ্য অ্যাপ ও ফেসবুক গ্রুপ থাকলেও একটিও নির্ভরযোগ্য, হালনাগাদ ও গোপনীয়তা-সুরক্ষিত প্ল্যাটফর্ম নেই — এখানেই আমাদের সুযোগ।

### The Single Biggest Gaps in Existing BD Platforms

Across every Bangladeshi tool we examined (Badhan, Sandhani, donatebloodbd, bloodbank.org.bd, Bloodman, Rokto, Roktalap, Roktoshare) the same structural failures repeat. These are also, point-for-point, the gaps in **our own current app**:

| # | Gap (industry-wide) | Why it kills these platforms | Our app today |
|---|---------------------|------------------------------|---------------|
| 1 | **Stale/dead data** — donors who already donated still show "available"; dead phone numbers | Top user complaint everywhere; the silent killer of every directory | Search shows an eligibility badge but does **not** filter ineligible donors out |
| 2 | **Open phone exposure** — raw numbers published to strangers | Spam, harassment (~68% of BD cybercrime victims are women); donors disengage | RLS policy `Profiles of approved donors viewable` leaks `profiles.mobile` at the **API layer** to anon callers |
| 3 | **Unstructured location** — free-text only, no district/coords | Can't do "O+ donor in Mirpur"; the single most-requested real query | `donors.location` is a free-text `ilike` substring |
| 4 | **No notifications** — donors must keep checking, no SOS push | Useless at 2am, the exact moment blood is needed | Donors only see requests inside the dashboard |
| 5 | **Wrong eligibility window** — flat/generic intervals | Routes requests to people who can't actually donate | `DONATION_ELIGIBILITY_DAYS = 90`, gender-blind, vs BD norm of **120d (men) / 180d (women)** |
| 6 | **Fragmentation & no verification** — duplicated, unvetted, paid-donor risk | No source of truth; paid donors carry far higher infection rates (HBsAg ~29% vs ~4%) | Only an admin `is_approved` boolean; no OTP, no fraud guard |

🇧🇩 **বাংলা:** সব বিদ্যমান প্ল্যাটফর্মের মূল ছয়টি দুর্বলতা — বাসি তথ্য, প্রকাশ্য ফোন নম্বর, অগঠিত লোকেশন, নোটিফিকেশন না থাকা, ভুল উপযুক্ততা-নিয়ম, এবং খণ্ডিত-অযাচাইকৃত ডেটা। দুঃখজনকভাবে আমাদের নিজেদের অ্যাপেও ঠিক এই ছয়টি সমস্যাই বিদ্যমান — তাই এগুলো ঠিক করাই আমাদের সবচেয়ে বড় সুযোগ।

### Strategic Direction

Our differentiation is **not** more donors — it is **trust, freshness, and privacy**. We win by being the platform where the listed donor is genuinely reachable, genuinely eligible, and genuinely safe to contact. The strategy sequences cheap-and-decisive wins on our existing stack (**Next.js 16 / React 19 / Tailwind v4 / Supabase / Vercel**) before any heavy investment.

| Priority | Strategic move | Build cost on our stack |
|----------|----------------|--------------------------|
| **P0 — Freshness** | Filter search to **eligible donors only**; make eligibility **gender-aware** (120/180d, config not a constant) | Pure logic in `src/lib/eligibility.ts` + a `sex` column |
| **P0 — Privacy** | **Reveal-on-accept** contact: never return `mobile` to anon; reveal only after a donor accepts a request | Fix the RLS column grant; gate on existing `ACCEPTED` status |
| **P0 — Structured data** | Replace free-text location with **division → district** (later upazila/coords) | New columns + cascading dropdowns; enables maps & SOS later |
| **P1 — Notifications** | Eligibility-timed **SMS** + emergency **broadcast** to matching eligible donors | Supabase cron/`pg_cron` + a BD SMS gateway; SMS is the only near-universal channel |
| **P1 — Trust** | OTP-verified phone, verified badge, report/block, anti-paid-donor copy | Supabase phone auth + small `reports`/`blocks` tables |
| **P2 — Engagement** | Impact messaging ("your blood was used"), milestone badges, BD donor-distribution map | `donation_records` already exists; Recharts + SVG choropleth (no map bill) |

🇧🇩 **বাংলা:** আমাদের কৌশল — বেশি ডোনার নয়, বরং **বিশ্বাস, হালনাগাদ তথ্য ও গোপনীয়তা**। প্রথমে কম খরচে নিশ্চিত জয়: শুধু উপযুক্ত ডোনার দেখানো, ফোন নম্বর গোপন রেখে "সম্মতি দিলে প্রকাশ", এবং বিভাগ/জেলা-ভিত্তিক গঠিত লোকেশন। এরপর SMS নোটিফিকেশন, যাচাইকরণ, এবং সবশেষে এনগেজমেন্ট ফিচার।

### Methodology

This document is built on a structured, **adversarially-verified** research process — not a single-pass opinion.

- **Scope of research.** We benchmarked the full BD ecosystem (**Badhan, Sandhani, donatebloodbd, bloodbank.org.bd, Blood Donors Club BD, Bloodman, Rokto, Roktalap, Roktoshare**, and the de-facto Facebook channel), the government rail (**DGHS BBMS**), and global best-practice references (**India's e-RaktKosh, American Red Cross, NHS Give Blood, Simply Blood, Friends2Support**). We also reviewed the BD domain itself: the **Safe Blood Transfusion Act 2002 / Rules 2008**, the **Personal Data Protection Ordinance 2025**, WHO/clinical eligibility, thalassemia demand, and peer-reviewed retention RCTs.

🇧🇩 **বাংলা:** আমরা বাংলাদেশের প্রায় সব ব্ল্যাড অ্যাপ, সরকারি ব্যবস্থা, এবং ভারত/যুক্তরাষ্ট্র/যুক্তরাজ্যের সেরা প্ল্যাটফর্ম পর্যালোচনা করেছি — সঙ্গে আইন, WHO নিয়ম ও গবেষণাও।

- **Verification discipline.** Every load-bearing claim went through an **adversarial fact-check**: claims were rated *confirmed / partly-confirmed / unverifiable / refuted* against primary sources, and we prefer each item's `verification.correctedSummary` over its raw research. Where evidence was weak we say so explicitly — e.g. the often-cited **"1,400 Facebook groups"** and a competitor's **"40% over goal"** figure are **unverified** and flagged, not presented as fact.

🇧🇩 **বাংলা:** প্রতিটি গুরুত্বপূর্ণ দাবি প্রতিকূল-যাচাইয়ের মধ্য দিয়ে গেছে; প্রাথমিক উৎসের বিপরীতে যাচাই করা হয়েছে এবং দুর্বল প্রমাণগুলো স্পষ্টভাবে চিহ্নিত করা আছে — অনুমানকে সত্য হিসেবে চালানো হয়নি।

- **Codebase grounding.** Recommendations are tied to verified facts about **our** schema and code (`profiles`, `donors`, `blood_requests`, `donation_records`; the flat 90-day `calculateEligibility`; the anon-readable `mobile` RLS grant), so every proposal maps to a concrete, buildable change.

🇧🇩 **বাংলা:** প্রতিটি সুপারিশ আমাদের নিজস্ব কোড ও ডেটাবেস স্কিমার যাচাইকৃত বাস্তবতার সঙ্গে যুক্ত — তাই সবকিছুই বাস্তবে তৈরি করার মতো সুনির্দিষ্ট।

### North-Star Vision

> **blood-finder becomes Bangladesh's most *trusted* blood-donor network — not the biggest list, but the one where every donor you find is genuinely eligible, genuinely reachable, and genuinely safe to contact.** A patient's family, at 2am, in any district, opens one app, sees only donors who can actually give blood right now, and reaches them through a private, consent-based channel that protects both sides — turning a frightening, broker-ridden scramble into a fast, dignified, life-saving connection.

🇧🇩 **বাংলা:** **blood-finder** হয়ে উঠবে বাংলাদেশের সবচেয়ে **বিশ্বাসযোগ্য** রক্তদাতা নেটওয়ার্ক — সবচেয়ে বড় তালিকা নয়, বরং এমন একটি জায়গা যেখানে প্রতিটি ডোনারই সত্যিকারে উপযুক্ত, সত্যিকারে যোগাযোগযোগ্য ও নিরাপদ। রাত ২টায়, যেকোনো জেলায়, একটি পরিবার একটি অ্যাপ খুলে শুধু এখনই রক্ত দিতে পারে এমন ডোনারদের দেখবে এবং সম্মতি-ভিত্তিক গোপন চ্যানেলে তাদের কাছে পৌঁছাবে — ভয়ংকর ও দালাল-নির্ভর দৌড়ঝাঁপকে একটি দ্রুত, মর্যাদাপূর্ণ ও জীবন রক্ষাকারী সংযোগে রূপান্তরিত করবে।

---

## Competitive Landscape — How Existing Platforms Work

The blood-finding space we are entering is crowded but structurally weak. It splits into three layers: **(1)** offline-first voluntary organisations (Badhan, Sandhani, Red Crescent) that run on volunteers + hotlines + a curated donor database; **(2)** web/app donor directories and matchmakers (bloodbank.org.bd, donatebloodbd.com, Bloodman, Rokto, Roktalap, Roktoshare, the govt DGHS BBMS); and **(3)** the de-facto layer — large Facebook groups where most real emergencies are actually solved. Two non-BD references set the bar much higher: India's **e-RaktKosh** (real-time blood-bank stock) and the **American Red Cross / NHS** apps (donor-experience and retention). The recurring failure mode across every Bangladeshi tool is the same: **stale data, exposed phone numbers, no eligibility gating, and no single source of truth.**

🇧🇩 **বাংলা:** বাংলাদেশের রক্তদাতা খোঁজার সব টুল মূলত তিন স্তরে ভাগ — স্বেচ্ছাসেবী সংগঠন, অ্যাপ/ওয়েব ডিরেক্টরি, আর বাস্তবে সবচেয়ে বেশি ব্যবহৃত ফেসবুক গ্রুপ। প্রায় সবার একই দুর্বলতা: পুরোনো/ভুল ডেটা, খোলা ফোন নম্বর, যোগ্যতা যাচাই নেই, আর কোনো নির্ভরযোগ্য একক উৎস নেই।

### Comparison Across Studied Platforms

| Platform | Model | Donor search | Location granularity | Notifications | Verification | Map / geo | App | Notable strength |
|---|---|---|---|---|---|---|---|---|
| **Badhan** | P2P donor org (offline-first, "fresh" blood) | Blood group; geolocation "nearest donor" | App: geolocation-based; org operates ~55 districts (donor DB spans ~58) | Donation-date reminders; emergency request posts; auto next-eligible-date | Donors blood-typed at free camps (offline vetting) | Yes (geolocation in app) | Yes (4.1★, 216 reviews) | ~64k vetted student donors + 28-yr brand trust |
| **Sandhani** | Voluntary blood/eye bank (offline) | Weak/absent public search | District/unit-level (offline) | None public | Tests for viral agents before storage | No | Not confirmed official | Pioneer (since 1977), clinical credibility |
| **bloodbank.org.bd** | Donor directory (registry) | By blood group / by name | District-level; **no clear district filter** in search | None | Self-signup only | No | Yes (Android) | Bilingual, free/non-commercial framing |
| **donatebloodbd.com** | Donor directory + call center | Blood group + Availability + Country + District dropdowns | District filter; area shown on profile | Call center (Sun–Thu 8am–midnight, not 24/7) | Self-signup; "Super/Courageous Donor" labels | No | Web | Phone hidden behind "View Details"; structured filters |
| **Blood Donors Club BD** | Public request feed | Browse live request cards | Area-level (e.g. "Laksam, Cumilla") | None | None | No | Web | Public structured request board |
| **Bloodman** | 24/7 matchmaker (hotline + app) | Blood group + area | District/area | Hotline-driven | Self-signup | Partial ("near hospital") | Yes | 24/7 since 2014; ~26k+ donors; ICT+FB partnership |
| **Rokto.co** | SMS matchmaker | Blood group + area | Area-level | **SMS-based auto matching** (+ website) | Self-signup | No | Web/SMS | Free real-time SMS connect (since 2018) |
| **Roktalap** | Privacy-first P2P | Blood group + radius | Opt-in live GPS *after* accept | SOS broadcast, high-priority push, in-app chat | Post-donation ratings | Yes (VoIP + opt-in GPS) | Yes | **Hides phone numbers** until both agree |
| **Roktoshare** | Cross-org registry | Blood group + district/area | District + area only (never exact) | Live dispatch board | Verified-donor badge; no-show tracking | No | Web | Shared eligibility synced across orgs; color status (early-stage adoption) |
| **DGHS BBMS (govt)** | National facility system | Facility blood-availability table | Facility-level | None | Govt-operated | No | Web | Official rail; but tiny scale (~34 facilities, table often empty) |
| **Facebook groups** | Informal social network | Manual feed search | Free-text in posts | Post + shares (huge reach) | None (FB official feature hides info until donor shares) | No | FB app | Biggest real reach + instant human response |
| **e-RaktKosh (India)** | Govt blood-bank inventory | State > District > Group > **Component** > Location | District + facility | Alert/notification system | Biometric donor mgmt; TTI screening | Facility-level | Yes | **Real-time stock by component** with "Last Updated" |
| **Red Cross / NHS (global)** | Appointment + retention | Center/drive locator | Center-level | Appointment + shortage alerts (NHS targeted appeals) | RapidPass health pre-screen | Center finder | Yes | Donor journey tracking, badges, RapidPass |

🇧🇩 **বাংলা:** উপরের টেবিল প্রতিটি প্ল্যাটফর্মকে মডেল, সার্চ, লোকেশন নির্ভুলতা, নোটিফিকেশন, ভেরিফিকেশন, ম্যাপ ও মূল শক্তি অনুযায়ী তুলনা করেছে। মনে রাখবেন — এতে কিছু ফিচার প্ল্যাটফর্মের নিজস্ব মার্কেটিং দাবি, স্বাধীনভাবে যাচাই করা নয়।

> **Honesty note on verification.** Cells marked from a platform's own marketing/Play-Store copy (notably **Roktalap**'s SOS/VoIP/chat and **Roktoshare**'s feature set) are "as advertised," not independently audited. Roktoshare's live counters (≈53 donors, 2 orgs) reveal it is an **early-stage/demo** product — the *features* exist in the UI, the *user base* does not yet. Badhan's "auto next-donation-date calculation" appears in the app listing but specific user-review complaints (combined group+district search, easy last-donation entry) could **not** be verified. The "~1,400 Facebook groups" and "~119k Positive Bangladesh Blood Donors" figures are **unconfirmed** and dropped; only *Rokto Daaner Opekkhay Bangladesh* (>126k) is confirmed.

### Cluster 1 — Voluntary Organisations (Badhan, Sandhani, Red Crescent)

These are the **trust anchors** of the ecosystem. Badhan (founded 24 Oct 1997 at University of Dhaka) runs an offline-first model: it blood-types students for free at camps, then matches a *specific eligible donor* to a *specific patient* and supplies "fresh" donor-to-patient blood rather than stored blood. Its app adds geolocation nearest-donor search, donor/acceptor dashboards, reminders, and emergency posts over a ~64k pre-vetted donor base. Sandhani (1977) is the pioneer but largely **offline** with weak/absent public search tech. Their advantage — **human accountability and pre-screened, trusted donors** — is exactly what a pure self-signup app cannot replicate.

🇧🇩 **বাংলা:** বাঁধন/সন্ধানীর আসল শক্তি প্রযুক্তি নয়, বরং বিশ্বাস ও যাচাই — ক্যাম্পে রক্তের গ্রুপ পরীক্ষা করে আগেই যাচাইকৃত ডোনার। আমাদের অ্যাপে এই বিশ্বাসকে অনুকরণ করতে হলে একটি **admin-নিয়ন্ত্রিত "verified donor" ব্যাজ** দরকার (আমাদের `profiles.is_admin` ইতিমধ্যেই আছে)।

- **For us:** We cannot match their offline vetting, so we should **encode trust differently** — an admin-set `is_verified` flag on `donors` (we already have an admin panel + `donors.is_approved`), a "verified" badge in search results, and verification driven by a recorded `donation_record` or admin review.

### Cluster 2 — BD Directories & Matchmakers (bloodbank.org.bd, donatebloodbd, Bloodman, Rokto, Roktalap, Roktoshare)

This is our **direct competitive set**, and it is fragmented and decaying. The common loop is *register → search by group + location → call a phone number*. The honest reality: **bloodbank.org.bd lacks a clear district filter**, donatebloodbd hides numbers behind "View Details" but shows no eligibility/last-donation in list view, and **Blood Donors Club BD publishes phone numbers completely unmasked** — the exact privacy/spam vector that drives donors away. The standouts point our roadmap directly:

- **Roktalap** — privacy-preserving: in-app chat + VoIP that **never expose phone numbers until both agree**, opt-in GPS only *after* a donor accepts. This is the single most ethically important pattern to copy.
- **Roktoshare** — **shared eligibility** synced across orgs, **color-coded availability** (green = eligible now / amber = N days / grey = unavailable), verified-donor badges, district+area-only privacy.
- **Rokto.co** — **SMS-based** automated matching (the channel with near-universal BD reach).

🇧🇩 **বাংলা:** এই স্তরের সবচেয়ে বড় সমস্যা — পুরোনো নম্বর, খোলা ফোন এক্সপোজার, আর যোগ্যতা যাচাই না থাকা (যে ডোনার গত সপ্তাহে রক্ত দিয়েছেন তিনিও "available" দেখান)। Roktalap-এর প্রাইভেসি মডেল আর Roktoshare-এর কালার-কোডেড eligibility আমাদের অনুসরণ করা উচিত।

- **For us (concrete):** Our schema already has the bones to beat them. We compute 90-day eligibility but **do not filter ineligible donors from search** — fix that to deliver a three-state (green/amber/grey) badge like Roktoshare, computed from `donors.last_donation_date`. Move location from **free-text `ilike`** to **structured division/district/upazila** (the #1 missing filter — "O+ donor in Mirpur" combining group AND area). And adopt **reveal-on-accept contact** via RLS so `profiles.mobile` is never returned in public search — our existing `ACCEPTED` request status is the natural gate.

### Cluster 3 — Government Systems (DGHS BBMS) & e-RaktKosh (India)

The govt **DGHS BBMS** (bbms.dghs.gov.bd) exists but is *tiny* in practice (≈34 reporting facilities, ~24.7k donors, availability table often empty) — which actually **proves the gap**: Bangladesh has no comprehensive real-time national system. India's **e-RaktKosh** is the gold standard of what's missing: real-time **stock by State > District > Blood Group > Component > Location** with a "Last Updated" timestamp across several thousand centers (~3,800 registered / ~2,800 actively using — state these separately, not merged). Its biometric donor management and TTI screening require institutional partnerships we cannot replicate solo.

🇧🇩 **বাংলা:** e-RaktKosh-এর আসল চমক হলো রিয়েল-টাইম রক্তের স্টক দেখা — বাংলাদেশে কোথাও নেই। আমরা ব্লাড ব্যাংকের ইনভেন্টরি দিতে পারব না, কিন্তু **"ঢাকায় N জন available O+ ডোনার" — এমন aggregate গণনা** আমাদের `donors` টেবিল থেকেই দেখাতে পারি, যা সস্তা ও অনন্য।

- **For us:** Real per-bank inventory is **not adoptable** without blood-bank data feeds. But a lightweight version is: **aggregate availability counts** ("N available O+ donors in Dhaka") computed from `donors`, and optionally **linking out** to BBMS rather than replicating stock.

### Cluster 4 — Facebook Groups & Global Best-Practice Apps (Red Cross, NHS)

**Facebook is the de-facto national tool** because it is free, already installed, surfaces a *responding human* in minutes, and amplifies via shares — the bar any new app must clear. Its weaknesses (no verification, no dedup, exposed numbers, manual feed search) are our opening. At the opposite end, **Red Cross / NHS** show the **retention** playbook BD tools lack: appointment booking, RapidPass pre-screening (~15 min saved), "your blood is on its way to a patient" journey tracking, milestone badges, and **blood-type-specific shortage alerts** (NHS issues targeted appeals; a per-donor in-app alert feature was not substantiated on the official app page, so treat it as inferred).

🇧🇩 **বাংলা:** ফেসবুক জেতে কারণ এটি বিনামূল্যে, সবার ফোনে আছে, আর কয়েক মিনিটেই মানুষ সাড়া দেয়। আমাদের সুযোগ হলো — যাচাই, প্রাইভেসি, আর eligibility gating যোগ করা, যা ফেসবুকে নেই। আর Red Cross/NHS থেকে শেখার বিষয় হলো **retention**: ব্যাজ, ইমপ্যাক্ট মেসেজ, আর শুধু প্রয়োজনীয় গ্রুপকে শর্টেজ অ্যালার্ট।

- **For us:** To beat Facebook on speed, add an **urgent request broadcast** to eligible + same-group + nearby donors (extend our 1:1 `blood_requests` into an open/broadcast type). To beat it on trust, add verification + reveal-on-accept. To retain donors (Red Cross/NHS), surface **milestone badges and donation counts** from our existing `donation_records`, and a "your donation helped a patient" impact loop on request completion (our unused `COMPLETED` enum is the hook).

### Summary — Where the Whitespace Is

No competitor combines all four of these; owning even the first three is a defensible position:

1. **Combined blood-group + structured district/upazila search** (most-requested, weakest across BD tools).
2. **Eligibility-gated, three-state availability** (green/amber/grey) so search never returns ineligible/stale donors.
3. **Privacy-preserving reveal-on-accept contact** (Roktalap model) instead of open phone exposure.
4. **Lightweight aggregate availability + retention loop** (Red Cross-style badges/impact), with e-RaktKosh-style stock deferred to partnerships.

🇧🇩 **বাংলা:** কোনো প্রতিযোগী এই চারটি একসাথে দেয় না। প্রথম তিনটি — **গ্রুপ+জেলা সার্চ, eligibility-gated availability, আর reveal-on-accept প্রাইভেসি** — আমাদের বর্তমান Next.js 16 + Supabase স্ট্যাকেই দ্রুত বানানো সম্ভব এবং এটিই আমাদের আসল পার্থক্য তৈরি করবে।

---

## International Best-in-Class & Innovative Platforms (Beyond the Shortlist)

Beyond our core shortlist, we surveyed a wider set of international platforms to harvest one or two genuinely best-in-class or innovative ideas from each. The single most important lens for an independent, low-budget, mobile-first Bangladesh app on low-end Android (weak/expensive data, SMS still dominant) is the **transferability distinction**: ideas that are pure software on our Next.js + Supabase + Vercel stack vs. ideas that fundamentally require a hospital, blood-bank, government, or logistics partnership because they touch actual blood units, inventory, or medical verification. We mark that distinction explicitly throughout, and we treat all vendor/PR adoption numbers as self-reported, not independently audited.

🇧🇩 **বাংলা:** আমাদের মূল তালিকার বাইরে আমরা আরও কিছু আন্তর্জাতিক প্ল্যাটফর্ম পর্যালোচনা করেছি, প্রতিটি থেকে এক-দুটি সত্যিকারের সেরা বা উদ্ভাবনী ধারণা নেওয়ার জন্য। আমাদের মতো একটি স্বাধীন, স্বল্প-বাজেটের, মোবাইল-ফার্স্ট অ্যাপের জন্য সবচেয়ে গুরুত্বপূর্ণ প্রশ্ন হলো: কোন ধারণাটি কেবল আমাদের Next.js + Supabase + Vercel স্ট্যাকে সফটওয়্যার দিয়েই করা যায়, আর কোনটির জন্য হাসপাতাল/ব্লাড-ব্যাংক/সরকার/লজিস্টিক্স অংশীদারিত্ব দরকার (কারণ সেটি আসল রক্তের ইউনিট বা চিকিৎসা-যাচাই স্পর্শ করে)। এই পার্থক্যটি আমরা স্পষ্টভাবে চিহ্নিত করেছি, এবং সব ভেন্ডর/PR সংখ্যাকে স্ব-ঘোষিত (স্বাধীনভাবে যাচাই-না-করা) হিসেবে দেখেছি।

### Comparison Table

| Platform | Country / Region | Model | The ONE standout idea | Transferable to us? |
|---|---|---|---|---|
| **Facebook (Meta) Blood Donations** | India, BD, Pakistan, Brazil, 37 countries | Opt-in donor registry layered on social profiles; notifies nearby donors of a request | Donor-initiated contact: requester sees NO donor info until the donor chooses to respond | **Yes (adopt-now)** — privacy model + opt-in registry are pure RLS; mass distribution is not feasible |
| **Google Maps + American Red Cross** | USA | Maps Platform locator for nearby blood drive/bank | Location-finder UX (NOT a donor-matcher — prompt premise corrected) | **Adapt** — free OpenStreetMap/Leaflet locator is feasible; no peer matching to copy |
| **LifeBank** | Nigeria (Lagos) | Smart logistics + inventory across blood banks; owns last-mile cold-chain fleet | Multi-channel access incl. USSD for no-internet hospitals; "match request to nearest stock" | **Adapt + Partnership** — multi-channel access yes; physical inventory needs partnership |
| **Zipline** | Rwanda, Ghana, Nigeria, etc. | On-demand drone delivery from central hubs; clinics order by text message | Centralized stock + on-demand delivery (peer-reviewed 61% faster, 67% less expiry) | **Partnership / Not feasible** — drones/cold-chain need aviation + government |
| **Damu Sasa** | Kenya | Donor DB + facility blood-locator over web/Android/USSD | Full flow over USSD (`*483*277#`) for no-smartphone users | **Adapt** — SMS-first now; interactive USSD needs a telco/aggregator |
| **Kızılay (Türk Kızılay)** | Turkey | Centralized national blood operator + donor app (kanver.org) | "Blood is not urgent, it is a continuous need" reframing + football-team gamification league | **Yes (adopt-now)** — reframing, donor card, group leaderboard are pure UX |
| **PMI "Ayo Donor"** | Indonesia | National Red Cross app with real-time stock by type | Live blood STOCK by type per region as a trust signal | **Adapt** — show "available compatible donors nearby" as the analog; real stock needs partnership |
| **Lifeblood** | Australia | Official blood-bank app | Daily Blood Supply Update dashboard (5 urgency tiers) + "donation countdown" to next eligible | **Adopt-now (countdown) / Partnership (real inventory)** |
| **DonateBlood (HSA + SRC)** | Singapore | Official app, SingPass login | Self-service Health Assessment Form (pre-screening eligibility quiz) | **Yes (adopt-now)** — a static branching form, no AI |
| **Love Blood (ラブラッド)** | Japan (JRC) | National Red Cross app | Targeted blood-type-specific shortage appeals via push/LINE/email + points loyalty | **Adapt** — targeted appeals yes (delivery costs); bank-side test results not feasible |
| **Wateen** | Saudi Arabia | National donor app under MoH "Sehhaty" | SMS to donors of the exact needed blood type + lifetime donation count | **Adapt** — SMS-by-type is the core finder action (budget-gated) |
| **SEHA / UAE Volunteer Platform** | UAE (Abu Dhabi) | Blood-bank + national volunteer scheme | Accredited volunteer credit-hours usable toward university graduation | **Partnership** — needs a university/employer scheme |
| **Friends2Support** | India (+ BD, 7 countries) | Free SMS/OTP volunteer donor directory | Auto-hide donor for 90 days after donating (freshness + anti-harassment) | **Yes (adopt-now)** — pure DB query |
| **Simply Blood** | India | P2P request board | Privacy-by-default: numbers exchanged only AFTER a donor accepts | **Yes (adopt-now)** — our single biggest trust upgrade |
| **Rokto** | Bangladesh | Free automated SMS + website donor finder | SMS-native matching by blood group + district (direct local competitor) | **Adapt** — SMS costs per message in BD |
| **Roktalap / Donoro** | Bangladesh | P2P donor apps | Community trust score / post-donation recipient reviews to flag stale/no-show donors | **Yes (adopt-now)** — computable from our own event logs |

🇧🇩 **বাংলা:** উপরের তুলনা টেবিলে প্রতিটি প্ল্যাটফর্মের দেশ, মডেল, একটি প্রধান উদ্ভাবনী ধারণা, এবং সেটি আমাদের জন্য গ্রহণযোগ্য কিনা (এখনই নেওয়া যায় / অভিযোজন করতে হয় / অংশীদারিত্ব দরকার) তা দেখানো হয়েছে। কাঠামোগত পরিভাষা ইংরেজিতে রাখা হয়েছে যাতে কারিগরি অর্থ স্পষ্ট থাকে।

---

### Facebook (Meta) Blood Donations — closest attempt in our exact market

This is the most relevant benchmark we have: it ran in Bangladesh, Pakistan, and India, in the same peer-to-peer space as blood-finder. It is an opt-in donor registry where donor status defaults to private ("Only me"), and the privacy model is **donor-initiated** — the requester sees no donor information unless the donor chooses to respond (verified verbatim in Meta's 2017 announcement). This single idea — never auto-exposing donor phone numbers — is the highest-value, lowest-cost win we can ship and a direct fix for our current "free-text + exposed contact" risk. Meta also used ML to throttle notification frequency to avoid "donor fatigue," and only vetted blood banks could post requests. In Bangladesh, partners were Bloodman BD, the ICT Division, and the health ministry; reported sign-ups (~8M in 2020, ~11M+ by 2021) are company-reported and not independently audited.

🇧🇩 **বাংলা:** এটি আমাদের সবচেয়ে প্রাসঙ্গিক উদাহরণ — এটি বাংলাদেশ, পাকিস্তান ও ভারতে আমাদের মতোই peer-to-peer মডেলে চলেছে। এর সেরা ধারণা: **donor-initiated contact** — অনুরোধকারী ডোনারের কোনো তথ্য দেখতে পায় না, যতক্ষণ না ডোনার নিজে সাড়া দেয়। ফোন নম্বর কখনো স্বয়ংক্রিয়ভাবে প্রকাশ না করা — এটিই আমাদের সবচেয়ে কম খরচে সবচেয়ে বড় উন্নতি, এবং আমাদের বর্তমান "ফ্রি-টেক্সট + উন্মুক্ত নম্বর" ঝুঁকির সরাসরি সমাধান।

**Action for us (verified):**
- Use Supabase RLS so a requester can **never** `select` a donor's phone; instead notify matching donors and let the donor tap to reveal/contact. **(adopt-now, no partnership)**
- Implement notification throttling now — cap requests per donor per week, cooldown after a response — even before we have push/SMS. **(adopt-now)**
- Add an admin-verified "trusted requester" badge using our existing `is_admin` panel. True blood-bank data integration **needs-partnership**.

🇧🇩 **বাংলা (করণীয়):** Supabase RLS দিয়ে নিশ্চিত করুন যেন অনুরোধকারী কখনোই ডোনারের ফোন নম্বর পড়তে না পারে; বরং মিলে যাওয়া ডোনারদের নোটিফাই করুন এবং ডোনার নিজে যোগাযোগ প্রকাশ করুক। প্রতি সপ্তাহে ডোনার-প্রতি অনুরোধের সীমা ও cooldown যোগ করুন (এখনই করা যায়)। আমাদের বিদ্যমান admin প্যানেল দিয়ে "যাচাইকৃত অনুরোধকারী" ব্যাজ দিন; সত্যিকারের ব্লাড-ব্যাংক ইন্টিগ্রেশনের জন্য অংশীদারিত্ব দরকার।

> **Correction / flag:** The prompt's premise about a **Google donor-matching tool in South Asia is inaccurate**. Google's only verified blood product is a US-focused Maps + American Red Cross *locator* (find a nearby drive/bank), not a peer-to-peer matcher. We should not benchmark against a Google South-Asia matcher that does not exist. Also note: the earlier claim that researchers concluded social media is "insufficient as a standalone solution" was a mischaracterization — the actual peer-reviewed conclusion is comparatively positive ("can drive significant behavioral outcomes"). Effect sizes (e.g., +18.9% first-time donations per US facility) are real but modest, with confidence intervals near zero for total-donation effects.

🇧🇩 **বাংলা (সংশোধন):** প্রম্পটে দাবি করা "দক্ষিণ এশিয়ায় Google-এর ডোনার-ম্যাচিং টুল" আসলে নেই — Google-এর একমাত্র যাচাইকৃত পণ্য হলো US-কেন্দ্রিক Maps + American Red Cross *লোকেটর* (কাছের ক্যাম্প/ব্যাংক খোঁজা), peer-to-peer ম্যাচার নয়। অর্থাৎ এই ক্ষেত্রে Google-কে বেঞ্চমার্ক ধরা ঠিক হবে না।

---

### LifeBank (Nigeria) & Zipline — the most innovative, but mostly partnership-gated

**LifeBank** is a smart logistics + inventory layer: it collates real-time stock across (a bounded set of) blood banks, lets hospitals order via app/USSD/24h call center, matches the request to the nearest stock via Google Maps, and runs its own cold-chain last-mile fleet (bikes, boats, tricycles, trucks, drones). The genuinely transferable kernel is the **multi-channel access layer** — especially USSD for hospitals/users without internet — and the idea of treating availability like inventory. The logistics-heavy core (physical inventory feeds, cold-chain delivery) **needs hospital/blood-bank partnerships** and is out of scope for an app that never touches blood.

🇧🇩 **বাংলা:** LifeBank একটি স্মার্ট লজিস্টিক্স + ইনভেন্টরি স্তর — এটি ব্লাড-ব্যাংকের স্টক একত্র করে, অ্যাপ/USSD/২৪-ঘণ্টা কল সেন্টারে অর্ডার নেয়, এবং নিজস্ব কোল্ড-চেইন বহর চালায়। আমাদের জন্য নেওয়ার মতো অংশ হলো **multi-channel access** (বিশেষত ইন্টারনেট-ছাড়া ব্যবহারকারীদের জন্য USSD)। কিন্তু এর মূল লজিস্টিক্স অংশ (আসল স্টক ফিড, কোল্ড-চেইন ডেলিভারি) আমাদের পরিসরের বাইরে — এর জন্য হাসপাতাল/ব্লাড-ব্যাংক অংশীদারিত্ব দরকার।

**Zipline** is the most innovative on raw technology — on-demand drone delivery from central hubs, with clinics ordering by **cell-phone text message**. It is also the only platform here with rigorous evidence: a peer-reviewed *Lancet Global Health* study (Rwanda) found a **61% reduction in blood-delivery time and 67% reduction in blood-unit expiry**. Crucially, those are the *only* peer-reviewed numbers in this whole survey; everything else is self-reported. For us, drones/cold-chain are **not feasible** (capital, aviation/airspace approval, ministry contracts). The transferable lesson is narrow but real: a dead-simple text-message order channel works even at national scale.

🇧🇩 **বাংলা:** Zipline প্রযুক্তিগতভাবে সবচেয়ে উদ্ভাবনী — কেন্দ্রীয় হাব থেকে ড্রোন ডেলিভারি, ক্লিনিক শুধু **টেক্সট মেসেজ** দিয়ে অর্ডার করে। এটিই একমাত্র প্ল্যাটফর্ম যার peer-reviewed প্রমাণ আছে: রুয়ান্ডায় রক্ত পৌঁছানোর সময় **৬১% কমেছে এবং রক্ত নষ্ট হওয়া ৬৭% কমেছে** (Lancet Global Health)। আমাদের জন্য ড্রোন/কোল্ড-চেইন **সম্ভব নয়** (পুঁজি, আকাশসীমা অনুমোদন, সরকারি চুক্তি দরকার)। কিন্তু একটি শিক্ষা সত্য ও প্রাসঙ্গিক: অত্যন্ত সরল টেক্সট-মেসেজ অর্ডার চ্যানেল জাতীয় স্কেলেও কাজ করে।

> **Flag:** Two correctness fixes from verification — the Lancet Rwanda study data period was **2017–2019** (not 2019–2021) and was authored by Nisingizwe et al. (NOT "analysis by IDinsight"; IDinsight's separate evaluation was of Zipline in **Ghana**, where it found only ~14–34% of health workers were trained to use it — i.e., the tech worked but uptake lagged). All LifeBank impact numbers (hospitals, units, lives saved) are inconsistent across sources and should be treated as PR. **Adoption/training is the silent failure mode** — a lesson for us regardless of tech.

🇧🇩 **বাংলা (সতর্কতা):** যাচাইয়ে দুটি সংশোধন: Lancet রুয়ান্ডা গবেষণার তথ্য সময়কাল **২০১৭–২০১৯** (২০১৯–২০২১ নয়), এবং এটি IDinsight-এর নয়। IDinsight-এর আলাদা মূল্যায়ন ছিল **ঘানা**-য়, যেখানে দেখা গেছে মাত্র ~১৪–৩৪% স্বাস্থ্যকর্মী এটি ব্যবহারে প্রশিক্ষিত ছিল — অর্থাৎ প্রযুক্তি কাজ করেছে কিন্তু গ্রহণ পিছিয়ে ছিল। গ্রহণ ও প্রশিক্ষণই নীরব ব্যর্থতার কারণ — এটি প্রযুক্তি নির্বিশেষে আমাদের জন্যও শিক্ষা।

---

### Kızılay (Turkey) — best engagement and retention mechanics

Kızılay is a centralized national operator, so most of its power comes from owning the supply — but its donor-facing layer has two cheap, copyable ideas. First, its headline message — **"blood is not an urgent need, it is a continuous need"** (verified verbatim on kanver.org) — deliberately shifts donors from panic-driven, emergency-only behavior to scheduled recurring donation, keeping a warm pool ready. Second, the **"Türkiye Kan Bağışı Ligi" (Blood Donation League)**: donors donate "for" their football team and climb a public leaderboard, converting tribal sports loyalty into donation. For Bangladesh this maps directly onto **university / district (zila) / employer / cricket-team leaderboards** — a single Supabase aggregate query plus an optional `group` field.

🇧🇩 **বাংলা:** Kızılay একটি কেন্দ্রীয় জাতীয় অপারেটর, কিন্তু এর দুটি সস্তা ধারণা আমরা নিতে পারি। প্রথমত, এর মূল বার্তা — **"রক্ত জরুরি প্রয়োজন নয়, এটি একটি ধারাবাহিক প্রয়োজন"** — যা ডোনারদের আতঙ্ক-চালিত জরুরি আচরণ থেকে নিয়মিত নির্ধারিত দানে নিয়ে আসে। দ্বিতীয়ত, **ফুটবল-টিম লিডারবোর্ড গেমিফিকেশন** — ডোনার নিজের পছন্দের দলের হয়ে রক্ত দেয়। বাংলাদেশে এটি বিশ্ববিদ্যালয়/জেলা/প্রতিষ্ঠান/ক্রিকেট-দল লিডারবোর্ডে রূপান্তরিত করা যায় — শুধু একটি Supabase aggregate query আর একটি ঐচ্ছিক `group` ফিল্ড দিয়ে।

> **Flag:** Turkey is **NOT fully self-sufficient** — one academic source says Kızılay meets ~half of national need (this conflicts with operator figures of ~82%), and recurring seasonal shortages are documented. Do not cite Turkey as a "solved supply" example; cite it only for its engagement/retention UX. All donor counts are org/press figures.

🇧🇩 **বাংলা (সতর্কতা):** তুরস্ক **সম্পূর্ণ স্বয়ংসম্পূর্ণ নয়** — তাই একে "সমাধান হয়ে যাওয়া সরবরাহ" উদাহরণ হিসেবে নয়, শুধু engagement/retention UX-এর জন্যই উল্লেখ করা উচিত।

---

### Developed Asia-Pacific & Gulf (Lifeblood, Singapore, Japan, Wateen, SEHA) — high-trust UX patterns

These are official, blood-bank-integrated systems, so bank-dependent features (real appointments, lab results, live inventory) are out of reach. But a tight cluster of **high-trust, retention-driving UX patterns is transferable cheaply**:

- **"Next eligible date" donation countdown** (Lifeblood, Wateen, JRC): pure date math on a stored last-donation date. **(adopt-now — biggest retention ROI per line of code)**
- **Self-service eligibility quiz / pre-screening** (Singapore Health Assessment Form, JRC web questionnaire): a static branching form, no AI, that filters out ineligible donors before contact. **(adopt-now)**
- **Blood-type-specific targeted appeals** (Wateen SMS-by-type, JRC push/LINE): the core finder action — notify only compatible, nearby donors. **(adapt — delivery costs money)**
- **Impact feedback loop** (American Red Cross "blood journey", OneBlood "Message My Donor"): we can't track blood into a hospital, but a requester-side **"mark fulfilled / thank you"** action is a faithful, privacy-safe analog. **(adopt-now)**
- **Non-cash recognition** (badges, certificates; SEHA's accredited volunteer hours): badges/certificates are free to issue. Formal credit-hours **need a university/employer partnership**.

🇧🇩 **বাংলা:** এগুলো অফিসিয়াল ব্লাড-ব্যাংক-যুক্ত সিস্টেম, তাই ব্যাংক-নির্ভর ফিচার আমাদের নাগালের বাইরে। কিন্তু কিছু **উচ্চ-আস্থা, রিটেনশন-বাড়ানো UX প্যাটার্ন সস্তায় নেওয়া যায়:** "পরবর্তী যোগ্যতার তারিখ" কাউন্টডাউন (শুধু তারিখের হিসাব — এখনই নেওয়া যায়); সেলফ-সার্ভিস eligibility quiz (স্ট্যাটিক ফর্ম, AI লাগে না); ব্লাড-গ্রুপ-নির্দিষ্ট টার্গেটেড অ্যাপিল (মূল finder কাজ, তবে ডেলিভারিতে খরচ); impact feedback ("অনুরোধ পূরণ হয়েছে / ধন্যবাদ" — privacy-নিরাপদ); এবং নন-ক্যাশ স্বীকৃতি (ব্যাজ/সার্টিফিকেট ফ্রি; আনুষ্ঠানিক credit-hour-এর জন্য বিশ্ববিদ্যালয় অংশীদারিত্ব দরকার)।

> **Flag:** Red Cross's "Clara" chatbot launched circa **2019–2021, not 2024** (it won 2021 awards). Predictive ML for churn/forecasting is real but bank-context and data-heavy — **not feasible** for us early on. All user counts and accuracy figures (Wateen 520k users, Clara ~20k/month, Lifeblood "75% would donate") are org/vendor-reported, not audited.

🇧🇩 **বাংলা (সতর্কতা):** Red Cross-এর "Clara" চ্যাটবট চালু হয়েছিল আনুমানিক **২০১৯–২০২১, ২০২৪ নয়**। Churn/forecasting-এর জন্য predictive ML বাস্তব কিন্তু ডেটা-নির্ভর ও ব্যাংক-কেন্দ্রিক — শুরুতে আমাদের জন্য **সম্ভব নয়**। সব ব্যবহারকারী-সংখ্যা ও নির্ভুলতার পরিসংখ্যান স্ব-ঘোষিত।

---

### Closest-context regional apps (India, Pakistan, Nepal, Sri Lanka, Bangladesh) — our exact tier

This tier is the most directly instructive because it *is* what blood-finder is: free directories matching requester → volunteer donor by group + location, handing off to a call/SMS, never touching blood. Two ideas are best-in-class for our budget:

- **Simply Blood — privacy-by-default request flow:** post a need without exposing any number; numbers are exchanged only **after a donor accepts**. This is pure app logic on Supabase + RLS (a `blood_requests` table, a donor "accept" action, RLS hiding phone until an accept row exists) and is our **single biggest trust upgrade** over current public donor profiles. **(adopt-now)**
- **Friends2Support — auto-hide donor for 90 days after donating, then auto-reappear:** kills two failures at once (calling ineligible donors; donor harassment) and keeps the list fresh with zero manual cleanup. Pairs naturally with a `last_donation_date` + availability toggle. **(adopt-now)**

The documented **#1 failure mode across every app in this tier is stale data / donor reachability** (non-responding donors, wrong numbers), not search. So **trust & freshness signals** — `last_active`, OTP-verified badge, response-rate / community trust score (Roktalap), recipient reviews (Donoro) — are the highest-leverage differentiator, all computable from our own Supabase event logs. **(adopt-now)**

🇧🇩 **বাংলা:** এই স্তরটিই আমাদের জন্য সবচেয়ে সরাসরি প্রাসঙ্গিক, কারণ blood-finder ঠিক এটাই — গ্রুপ ও অবস্থান দিয়ে ম্যাচ করে কল/SMS-এ হস্তান্তর, রক্ত স্পর্শ না করে। দুটি সেরা ধারণা: (১) **Simply Blood — privacy-by-default**: নম্বর প্রকাশ না করে অনুরোধ পোস্ট করা, ডোনার গ্রহণ করার **পরেই** নম্বর বিনিময় — এটি আমাদের বর্তমান উন্মুক্ত প্রোফাইলের চেয়ে **সবচেয়ে বড় আস্থা-উন্নতি**। (২) **Friends2Support — দান করার পর ৯০ দিন ডোনার লুকানো**, পরে স্বয়ংক্রিয়ভাবে ফিরে আসা — অযোগ্য ডোনারকে কল করা ও হয়রানি উভয়ই বন্ধ করে এবং তালিকা তাজা রাখে। সবচেয়ে বড় ব্যর্থতা হলো বাসি ডেটা/ডোনারের নাগাল — তাই **trust ও freshness signal** (last_active, OTP-যাচাই, response-rate, recipient review) সবচেয়ে শক্তিশালী পার্থক্য, যা আমাদের নিজস্ব Supabase লগ থেকেই বের করা যায়।

> **Flag:** Simply Blood's notification radius is reported inconsistently (5 km vs the more common 10 km) — do not state a precise figure. Its "21,000 requests / 34 countries" and Friends2Support's "~400k–500k donors" are self-reported and unaudited. Loud **no-paid-donor / anti-black-market positioning** is a cheap, high-trust ethical differentiator, grounded in documented black markets in India (paid donation banned 1996, units up to ~Rs 4,000) and a COVID-era plasma black market in Pakistan. **Rokto (BD, since 2018)** is our direct local SMS-native competitor.

🇧🇩 **বাংলা (সতর্কতা):** Simply Blood-এর নোটিফিকেশন ব্যাসার্ধ সূত্রভেদে ভিন্ন (৫ কিমি বনাম প্রচলিত ১০ কিমি) — নির্দিষ্ট সংখ্যা না বলাই ভালো। এর ও Friends2Support-এর ডোনার-সংখ্যা স্ব-ঘোষিত। স্পষ্টভাবে **"কোনো অর্থপ্রদত্ত ডোনার নয় / কালোবাজারবিরোধী"** অবস্থান একটি সস্তা ও উচ্চ-আস্থার নৈতিক পার্থক্য। **Rokto (বাংলাদেশ, ২০১৮ থেকে)** আমাদের সরাসরি স্থানীয় SMS-নির্ভর প্রতিযোগী।

---

### Cross-cutting takeaway for blood-finder

Across all these platforms, the same short list of ideas keeps recurring as **adopt-now and partnership-free** on our stack: (1) donor-initiated contact / hide phone numbers (Facebook, Simply Blood); (2) eligibility-aware auto-hide + "next eligible in N days" countdown (Friends2Support, Lifeblood, Wateen); (3) self-service eligibility quiz (Singapore); (4) trust/freshness signals (Roktalap, Donoro); (5) "continuous need" reframing + group leaderboard (Kızılay); (6) requester "mark fulfilled / thank you" impact loop (Red Cross/OneBlood analog). The **adapt** layer is delivery — targeted SMS-by-type (Wateen/Rokto) and structured district/upazila location (toward nearest-first ranking) — gated mainly by a per-message SMS budget, with free web push + `wa.me` deep links as the interim path. The **partnership / not-feasible** layer is anything touching actual blood units, real inventory dashboards (PMI/Lifeblood), drones/cold-chain (Zipline/LifeBank), national integration, or official medical-eligibility verification.

🇧🇩 **বাংলা:** সব প্ল্যাটফর্ম জুড়ে একই কিছু ধারণা বারবার **এখনই-গ্রহণযোগ্য ও অংশীদারিত্ব-মুক্ত** হিসেবে ফিরে আসে: (১) donor-initiated contact / ফোন নম্বর লুকানো; (২) eligibility-aware auto-hide + "N দিনে আবার যোগ্য" কাউন্টডাউন; (৩) সেলফ-সার্ভিস eligibility quiz; (৪) trust/freshness signal; (৫) "ধারাবাহিক প্রয়োজন" রিফ্রেমিং + গ্রুপ লিডারবোর্ড; (৬) অনুরোধকারীর "পূরণ হয়েছে/ধন্যবাদ" impact loop। **অভিযোজনযোগ্য** স্তর হলো ডেলিভারি — টার্গেটেড SMS ও কাঠামোগত জেলা/উপজেলা অবস্থান — যার প্রধান বাধা per-message SMS বাজেট (অন্তর্বর্তী সমাধান: ফ্রি web push + `wa.me` লিঙ্ক)। **অংশীদারিত্ব/অসম্ভব** স্তর হলো আসল রক্তের ইউনিট, প্রকৃত ইনভেন্টরি ড্যাশবোর্ড, ড্রোন/কোল্ড-চেইন, জাতীয় ইন্টিগ্রেশন বা সরকারি চিকিৎসা-যাচাই সংশ্লিষ্ট সবকিছু।

---

## Gap Analysis — What Existing Platforms Miss

Across the Bangladesh blood-finding landscape — voluntary orgs (Badhan, Sandhani, Bangladesh Red Crescent), web/app directories (donatebloodbd.com, bloodbank.org.bd, blooddonorsbd.com, Bloodman, rokto.co, Roktalap, Roktoshare), the government DGHS BBMS, and the de-facto channel of large Facebook groups — the same structural weaknesses repeat. Below, each gap is framed as a concrete opportunity for **blood-finder**, tied to our actual stack (Next.js 16, React 19, Tailwind v4, Supabase/Postgres, Vercel) and current schema (`profiles`, `donors`, `blood_requests`, `donation_records`).

The single most important framing: in this market, **the scarce asset is not donor quantity — it is trust and freshness.** Almost every gap below is a trust or freshness failure.

🇧🇩 **বাংলা:** বাংলাদেশের প্রায় সব রক্তদাতা খোঁজার মাধ্যমেই একই দুর্বলতাগুলো বারবার দেখা যায়। মূল কথা হলো — এখানে আসল সংকট দাতার সংখ্যা নয়, বরং আস্থা ও তথ্যের সতেজতা; নিচের প্রায় প্রতিটি ফাঁকই আসলে আস্থা বা সতেজতার ব্যর্থতা।

---

### Gap Map: Cross-Cutting Failures → Our Opportunity

| # | Gap (what existing platforms miss) | Who suffers from it | Our opportunity (blood-finder) |
|---|------------------------------------|---------------------|--------------------------------|
| 1 | **Stale / dead donor data** — "available" donors who donated last week, dead phone numbers, people who moved | Requesters waste hours; donors get annoyed | Eligibility-aware freshness engine + `last_confirmed_at` re-confirmation |
| 2 | **No real-time availability** — manual, rarely-updated availability toggles | Requesters call the unavailable | Computed availability from `last_donation_date` + one-tap "I donated" / pause |
| 3 | **No notifications** — donors only learn of a need if they happen to look | Donors never see the request; 19–24h to source a bag | Eligibility + impact SMS, emergency broadcast to matched donors |
| 4 | **No verification** — anyone can self-register; only an admin boolean exists | Fake/abandoned profiles, paid-donor infiltration | Verification ladder (phone OTP → age → optional NID → badge) |
| 5 | **Privacy / harassment** — phone numbers exposed publicly | Donors (esp. women) get spam/harassment, then disengage | Reveal-on-accept contact; phone never in public search |
| 6 | **No map / geo** — location is coarse free text, no distance | Can't find the *nearest* donor in an emergency | Structured division→district→upazila + optional choropleth/geo sort |
| 7 | **No eligibility filtering** — ineligible donors still appear | Calls to people in their cooldown window | Filter out / flag donors inside the gender-aware interval |
| 8 | **Fragmentation (Facebook chaos)** — 1,400+ groups, no shared record | Duplicated, unsynced, unverified donor data | One structured, deduped, status-tracked record per donor |
| 9 | **No rare-group handling** — only 8 ABO/Rh types; no Bombay (Oh) | The hardest, most urgent cases fall through | First-class rare/`Oh` flag + nationwide priority surfacing |
| 10 | **No trust signals** — no badges, history, response rate, freshness | Requesters can't tell a real donor from a stale entry | Verified badge, donation count, last-active, response rate |

🇧🇩 **বাংলা:** উপরের ছকটি দেখায় বিদ্যমান প্ল্যাটফর্মগুলোর প্রধান ১০টি অভিন্ন ফাঁক, কারা ভোগে, এবং প্রতিটির বিপরীতে আমাদের সুযোগ কোথায়।

---

### 1. Stale / Fake Numbers — The #1 Silent Killer

Roktoshare itself names the core failure: "calling someone who gave blood last Tuesday." Directories (bloodbank.org.bd, donatebloodbd, blooddonorsbd) list donors with no last-donation date and no re-confirmation, so phone numbers decay and "available" lies.

- **What's missing:** no freshness signal, no periodic "are you still reachable?" check, no de-ranking of stale profiles.
- **Our move:** we already store `donors.last_donation_date`. Add a `last_confirmed_at` column; run a Supabase `pg_cron` job that nudges donors to re-confirm every N months, surface a **"verified <date>"** freshness badge on the donor card, and de-rank long-unconfirmed profiles in search.

🇧🇩 **বাংলা:** পুরোনো/মৃত ফোন নম্বরই এই ডিরেক্টরিগুলোর সবচেয়ে বড় নীরব ঘাতক। সমাধান: প্রতিটি দাতার `last_confirmed_at` রাখা, নিয়মিত পুনঃনিশ্চিতকরণের অনুরোধ পাঠানো, এবং সার্চে সতেজ প্রোফাইলকে আগে দেখানো।

---

### 2. No Real-Time Availability

Most BD platforms rely on a manual "Available/Unavailable" toggle that donors rarely update. Badhan auto-calculates a next-eligible date, but reviewers complain that entering the last-donation date is clunky — so the data still goes stale.

- **What's missing:** availability that is *computed*, not self-claimed.
- **Our move:** treat effective availability as `availability_status = 'AVAILABLE'` **AND** the donor is outside their cooldown (derived from `last_donation_date`). Add a one-tap **"I donated today"** action (auto-flips status and sets the date) and a **"pause my availability"** toggle separate from eligibility. Pure logic + a small form change — no new infrastructure.

🇧🇩 **বাংলা:** ম্যানুয়াল টগলের বদলে রিয়েল-টাইম, স্বয়ংক্রিয় প্রাপ্যতা দরকার — `last_donation_date` থেকে হিসাব করে। সঙ্গে "আজ রক্ত দিয়েছি" বাটন ও "আমাকে বিরতিতে রাখো" অপশন।

---

### 3. No Notifications — The Broadcast Gap

This is the biggest structural shortfall. Existing tools are **browse-and-call-one**: the requester scrolls a list and phones a single person. Donors never get pushed a need. The cost is brutal — a documented ~48% of seekers spend 19–24 hours sourcing each bag.

- **What's missing:** any push channel (SMS / push / email) and any broadcast-to-many model.
- **Our move:**
  - Add an **open/broadcast request type** to `blood_requests` (blood type + district, no fixed `donor_id`) that fans out to matching, *eligible*, *nearby* donors; they accept in-app. Fits Next.js server actions + Supabase Realtime.
  - **SMS is the spine** for Bangladesh: only ~26% of rural users have smartphones, so SMS reaches everyone (a Chinese RCT found SMS reactivation at an ICER of ~70 RMB vs ~557 for phone calls). PWA push is the secondary channel; email tertiary; WhatsApp opt-in only (a Brazil RCT found no significant retention effect).
  - **Timing matters:** the Thai TEXT RCT showed an eligibility-timed "your blood was used for a patient" SMS lifted 9-month return from 16.9 to 22.4 per 100 donor-years (IRR 1.31). But Austrian Red Cross data shows impact messages sent ~10 days *before* re-eligibility backfired (63% less likely to return) — so fire reminders **at** the eligibility boundary, not before.

🇧🇩 **বাংলা:** এখনকার টুলগুলো একজন দাতাকে খুঁজে ফোন করার মডেলে আটকে — কোনো নোটিফিকেশন নেই, তাই এক ব্যাগ রক্ত জোগাড়ে ১৯–২৪ ঘণ্টা লাগে। সমাধান: মিলে যাওয়া যোগ্য দাতাদের কাছে জরুরি অনুরোধ ব্রডকাস্ট করা, আর বাংলাদেশে SMS-কেই মূল চ্যানেল করা (গ্রামে মাত্র ~২৬% স্মার্টফোন ব্যবহারকারী)।

---

### 4. No Verification

Beyond an admin `is_approved` boolean, no consumer BD platform verifies that a donor is a real, reachable person. Badhan's trust comes from offline blood-grouping camps — something self-signup apps lack. This matters acutely because of Bangladesh's documented **paid-donor crisis**: historically up to ~47% of collected blood came from professional donors, who carried far higher infection risk (~29% HBsAg vs ~4% in voluntary donors).

- **What's missing:** identity confidence and any signal that separates verified donors from random sign-ups.
- **Our move:** a **progressive verification ladder** — tier 0 email (have it) → tier 1 **phone OTP** (gate *requesting*, not browsing) → tier 2 age ≥18 self-attest → tier 3 optional NID spot-check → tier 4 **verified badge**. Supabase Auth supports phone OTP. Add `profiles.phone_verified_at` and `donors.verification_level`. Pair with anti-paid-donation guardrails: a prominent "donation is voluntary — never pay for blood" notice and a report-abuse action feeding the existing admin queue.

🇧🇩 **বাংলা:** অ্যাডমিন অনুমোদন ছাড়া কোনো যাচাই নেই, অথচ বাংলাদেশে পেইড-ডোনার সংকট মারাত্মক (পেশাদার দাতাদের সংক্রমণ হার অনেক বেশি)। সমাধান: ধাপে ধাপে যাচাই (ফোন OTP → বয়স → ঐচ্ছিক NID → ভেরিফায়েড ব্যাজ) এবং "রক্তের জন্য কখনো টাকা দেবেন না" সতর্কবার্তা।

---

### 5. Privacy / Harassment — The Open Phone-Number Problem

Facebook groups and most directories publish raw phone numbers (blooddonorsbd shows them unmasked on every request card). This drives spam, harassment, and donor fatigue. In Bangladesh the stakes are gendered: a large majority of online-harassment victims are women, making open numbers a concrete women's-safety hazard. Roktalap already proves the fix — in-app messaging and VoIP that never expose the SIM until both sides agree.

- **What's missing:** any privacy gate. (Note: our own `donors` search never selects `mobile`, and our profile page gates it behind login — but the RLS policy *"Profiles of approved donors viewable"* still grants anonymous SELECT on the whole `profiles` row, so an anon API query can pull `mobile`. This is a real exposure to close.)
- **Our move:**
  - **Reveal-on-accept:** never return phone to searchers. A request notifies the donor; only after the donor sets the request to `ACCEPTED` is contact shared. We already have the `ACCEPTED` status and `donor_user_id` RLS to gate this.
  - Fix the RLS so `mobile` is not in any anon-readable path (use a restricted view / column masking).
  - Add donor self-service controls: `phone_visibility ('hidden' | 'on_accept' | 'masked')`, `is_paused`, and self-delete (`deleted_at`).
  - This also aligns us with the **Personal Data Protection Ordinance 2025** (consent as the primary lawful basis; deletion/correction rights; geolocation is sensitive).

🇧🇩 **বাংলা:** ফেসবুক গ্রুপ ও ডিরেক্টরিগুলো ফোন নম্বর প্রকাশ্যে দেখায়, ফলে স্প্যাম ও হয়রানি — বিশেষত নারীদের জন্য ঝুঁকি। সমাধান: অনুরোধ গ্রহণের পরই কেবল যোগাযোগ প্রকাশ (reveal-on-accept), পাবলিক সার্চে নম্বর কখনো নয়, এবং PDPO 2025-এর সঙ্গে সামঞ্জস্য।

---

### 6. No Map / Geolocation / Distance

Emergencies are hyper-local ("O+ donor in Mirpur, now"), yet our `location` is free text (`ilike` substring) with no coordinates, and most BD tools stop at a district dropdown — if that. Badhan's most-requested missing feature is **blood group AND district together**.

- **What's missing:** structured geography and proximity ranking.
- **Our move:** replace free-text location with **cascading division → district → upazila** reference data; expose a combined **blood-group + area** filter as the first-class search (the most common real-world query). For visual impact, a lightweight **SVG choropleth** of the 64 districts (no map lib, no API key, SSR-safe) colored by available-donor count per blood group — fed by a Supabase aggregate view. Add optional `lat/lng` later for a "donors near me" sort.

🇧🇩 **বাংলা:** জরুরি প্রয়োজন স্থানীয়, কিন্তু আমাদের লোকেশন এখন শুধু ফ্রি-টেক্সট। সমাধান: বিভাগ→জেলা→উপজেলা কাঠামো, রক্তগ্রুপ+এলাকা একসঙ্গে ফিল্টার, এবং হালকা SVG ম্যাপে জেলাভিত্তিক দাতা সংখ্যা দেখানো।

---

### 7. No Eligibility Filtering

Our search shows an eligibility badge (90-day rule) but **does not exclude ineligible donors** — and BD blood banks use a longer, gender-aware interval (~4 months men / ~6 months women, i.e. ~120/180 days), so our flat 90 days can mark donors eligible before they truly are.

- **What's missing:** correct, gender-aware filtering that keeps ineligible donors out of results and broadcasts.
- **Our move:** turn `DONATION_ELIGIBILITY_DAYS = 90` into a config (e.g. `{ male: 120, female: 180 }`), add a `sex` field to `donors`, and *filter* (not just badge) ineligible donors from default search and from any emergency broadcast. This single correctness fix protects donor health and stops wasted requests.

🇧🇩 **বাংলা:** আমরা যোগ্যতার ব্যাজ দেখাই কিন্তু অযোগ্য দাতাদের সরাই না; তাছাড়া বাংলাদেশের নিয়ম লিঙ্গভেদে ~১২০/১৮০ দিন, আমাদের সমান ৯০ দিন নয়। সমাধান: লিঙ্গভিত্তিক সঠিক বিরতি এবং সার্চ/ব্রডকাস্ট থেকে অযোগ্যদের বাদ দেওয়া।

---

### 8. Fragmentation — Facebook Chaos & Duplicated Lists

Dozens of overlapping apps/sites plus a huge informal Facebook layer mean the same donor is listed many times, with eligibility unsynced and no single source of truth. The government BBMS exists but is tiny (only ~34 reporting facilities). Roktoshare's shared, deduped, status-tracked record is the right pattern.

- **What's missing:** one structured, deduplicated, status-aware donor record.
- **Our move:** make our record the clean one — **dedup on normalized phone** (strip `+880`/leading 0; `pg_trgm` on name+phone), a single eligibility state per donor, and a proper **request lifecycle** (open → matched → fulfilled/cancelled) closing the loop via the existing `donation_records` linkage. Quietly note: the `COMPLETED` status enum exists but is unused (accept sets `ACCEPTED`) — wire it up so fulfillment is tracked, which also produces clean historical data.

🇧🇩 **বাংলা:** অসংখ্য অ্যাপ ও ফেসবুক গ্রুপে একই দাতা বহুবার, কোনো একক সত্য নেই। সমাধান: ফোন নম্বর দিয়ে ডিডুপ করে একটি পরিষ্কার, স্ট্যাটাস-সহ রেকর্ড রাখা এবং অনুরোধের পূর্ণ জীবনচক্র (`COMPLETED` সহ) ট্র্যাক করা।

---

### 9. No Rare-Group Handling

The hardest emergencies are O-, AB-, and especially **Bombay (Oh)** — ~1 in 25,000 globally, with **no national registry in Bangladesh**, scarce reagents, and units sometimes flown in from India. Our schema's `CHECK` constraint hard-limits to 8 ABO/Rh types, excluding exactly these cases.

- **What's missing:** any representation of rare phenotypes and any priority surfacing.
- **Our move:** relax the `CHECK` constraint; add an `is_rare` boolean + free-text `phenotype` (to capture `Oh` and others). Surface rare donors **prominently and nationwide** (not just local), since for these groups the whole country is the search radius. Being the *only* BD tool with a Bombay-group flag is a clear, defensible differentiator.

🇧🇩 **বাংলা:** সবচেয়ে কঠিন কেসগুলো বিরল গ্রুপ — বিশেষত বোম্বে (Oh), যার বাংলাদেশে কোনো জাতীয় তালিকা নেই। সমাধান: ৮ গ্রুপের সীমা শিথিল করে বিরল ফেনোটাইপ যোগ করা এবং বিরল দাতাদের সারাদেশে অগ্রাধিকার দিয়ে দেখানো।

---

### 10. No Trust Signals

Requesters have no way to tell a reliable, real donor from a stale list entry. Global best practice (Red Cross badges/teams, marketplace "very responsive" labels, Roktoshare verified/reliability badges) shows trust signals are top adoption accelerators.

- **What's missing:** verified badge, donation history, responsiveness, last-active, no-show tracking.
- **Our move:** compute and surface, mostly from data we already hold:
  - `donation_count` (from `donation_records`),
  - `response_rate` (accepted ÷ received from `blood_requests`),
  - `last_active_at` (update on login/action),
  - a **verified badge** (from the verification ladder), and
  - reliability / no-show tracking (from `CANCELLED` requests).

  Pair retention mechanics on top: milestone badges and a shareable OG-image **donor card** (Next.js `ImageResponse`) for organic, social-driven recruitment — Bangladesh is heavily social, and impact framing is the highest-evidence retention lever.

🇧🇩 **বাংলা:** কে নির্ভরযোগ্য দাতা তা বোঝার কোনো সংকেত নেই। সমাধান: ভেরিফায়েড ব্যাজ, রক্তদানের সংখ্যা, সাড়া দেওয়ার হার, সর্বশেষ সক্রিয়তা ও নো-শো ট্র্যাকিং দেখানো — এর প্রায় সবই আমাদের ডেটা থেকেই হিসাব করা যায়।

---

### Strategic Takeaway

| Priority | Build first (cheap, high-impact, mostly logic/schema) | Build next | Defer until data accrues |
|----------|------------------------------------------------------|-----------|--------------------------|
| What | Gender-aware eligibility **filtering**; reveal-on-accept + RLS fix; freshness/`last_confirmed_at`; structured geography; verification ladder (OTP); rare-group flag; trust signals | Emergency **broadcast** + SMS gateway; impact/eligibility messaging; map choropleth; PWA push | Demand forecasting; churn ML; in-app masked relay/VoIP |

The pattern is clear: **the wins that beat every BD competitor are freshness, privacy, verification, eligibility correctness, and broadcast — none of which require AI or institutional partnerships.** They are achievable today on Supabase/Postgres + Next.js, and they directly fix the trust-and-freshness failures that plague the entire market.

🇧🇩 **বাংলা:** সারকথা: প্রতিযোগীদের ছাড়িয়ে যেতে দরকার সতেজতা, গোপনীয়তা, যাচাই, সঠিক যোগ্যতা ও ব্রডকাস্ট — এর কোনোটিরই AI বা প্রাতিষ্ঠানিক চুক্তির প্রয়োজন নেই; এগুলো আজই Supabase ও Next.js দিয়ে করা সম্ভব এবং সরাসরি বাজারের আস্থা-সতেজতার সমস্যা সমাধান করে।

---

## How Other Countries Smartly Solved Blood-Finding (and What We Can Copy)

Across Facebook (South Asia), LifeBank/Damu Sasa (Africa), Kızılay/PMI (Turkey/Indonesia), Lifeblood/JRC/Wateen (developed Asia-Pacific & Gulf), and regional peers (Friends2Support, Simply Blood, Rokto), the *same handful of smart mechanisms* keep recurring. This section strips out the country-specific packaging and distills the **transferable patterns** — each with the problem it solves, how it works, a concrete build note for our exact stack (Next.js 16 + Supabase Postgres/Auth/RLS + Vercel + a Bangladesh SMS gateway), and a transferability verdict.

**Verdict legend:** `adopt-now` = pure software on our current stack, no partner, low/zero cost · `adapt` = doable but needs a paid channel (SMS/WhatsApp) or scope change · `needs-partnership` = requires hospitals/blood-banks/government/logistics.

🇧🇩 **বাংলা:** বিশ্বজুড়ে অ্যাপগুলোর দেশভিত্তিক মোড়ক সরিয়ে দিলে দেখা যায়, আসলে গুটিকয়েক "স্মার্ট কৌশল" বারবার ফিরে আসে। এই অংশে আমরা সেই কৌশলগুলোকে আলাদা করে দেখাচ্ছি — প্রতিটির সমস্যা, কাজের ধরন, আমাদের স্ট্যাকে (Next.js 16 + Supabase + Vercel + বাংলাদেশি SMS গেটওয়ে) বানানোর উপায়, এবং গ্রহণযোগ্যতার রায় (এখনই নেওয়া যায় / মানিয়ে নিতে হবে / অংশীদারিত্ব দরকার)।

---

### Pattern 1 — Geo-targeted emergency broadcast to nearby + eligible + compatible donors (with anti-spam throttling)

**Problem it solves.** The hardest part of blood-finding is not search — it is *reaching the right willing donor fast*. Mass-blasting every donor for every request causes "donor fatigue," opt-outs, ignored alerts, and (for us) wasted paid SMS. This donor-fatigue failure mode is the single most-cited reason donor networks decay.

**How it works (proven elsewhere).** Facebook's feature notifies only nearby registered donors and uses ML to tune notification *frequency* explicitly to avoid donor fatigue. The peer-reviewed BLOODR app notifies a donor *only if* their blood group is compatible **and** they are in the same city/region. Donor-outreach research recommends "precision over volume" with **silence periods** rather than mass blasts. The transferable kernel: compute `compatible donor set × nearby set × eligible set`, rank by distance + freshness + responsiveness, and alert in **waves** with per-donor cooldowns.

🇧🇩 **বাংলা:** রক্ত খোঁজার সবচেয়ে কঠিন অংশ সার্চ নয় — সঠিক, ইচ্ছুক ডোনারের কাছে দ্রুত পৌঁছানো। প্রতিটি অনুরোধে সব ডোনারকে বার্তা পাঠালে তারা বিরক্ত হয়ে অ্যালার্ট উপেক্ষা করতে শেখে (এবং আমাদের SMS খরচও বাড়ে)। সমাধান: শুধু রক্তের গ্রুপে মানানসই + কাছাকাছি + যোগ্য (eligible) ডোনারদের ঢেউয়ে-ঢেউয়ে (in waves) বার্তা পাঠানো, প্রতিটি ডোনারের জন্য "নীরবতা সময়" (cooldown) রেখে।

**Build on our stack.**
- A Postgres function `match_donors(blood_group, district/upazila or lat,lng, radius)` returns candidates. Start with **structured location matching** on the current free-text field (normalize to a division/district/upazila dropdown); add `lat/lng` + PostGIS `<->` nearest-neighbour (with a GIST index) or a simple Haversine later.
- Encode the ABO/Rh **recipient-can-receive** compatibility matrix in SQL so a request only pulls donors the patient can actually receive from.
- A **queue table** (`alert_queue` with `last_alerted_at` per donor) + a **Vercel/Supabase Edge cron** processes alerts in waves: top-N first, widen radius / next wave only if no acceptance within a timeout; enforce a per-donor cooldown so the same person isn't pinged across requests.
- Throttling protects *both* donor goodwill and the SMS budget simultaneously.

| Sub-capability | Verdict | Note |
|---|---|---|
| Compatibility + proximity filtered alerts (DB logic) | `adopt-now` | Pure Supabase/SQL; district match first, geo later. No partner. |
| Wave-based throttling + cooldowns ("silence periods") | `adopt-now` | Queue table + cron + `last_alerted_at`. Protects budget and goodwill. |
| Web Push delivery (service worker) | `adapt` | Free, fits Next.js/Vercel, but unreliable on low-end BD Android — pair with SMS. |
| SMS delivery to matched donors | `adapt` | Needs a paid BD gateway (~0.30 BDT/SMS non-masking; masking often ~0.50). Throttling keeps spend low. |
| ML-personalised who/when to notify | `needs-partnership` *(skip)* | Not worth it at our scale; simple rules (group, distance, cooldown, recency) capture ~all the value. |

🇧🇩 **বাংলা:** Supabase-এ একটি Postgres ফাংশন বানান যা রক্তের গ্রুপ + এলাকা + দূরত্ব দিয়ে ডোনার ফিল্টার করবে; প্রথমে ফ্রি-টেক্সট লোকেশনের বদলে বিভাগ/জেলা/উপজেলা ড্রপডাউন আনুন, পরে lat/lng যোগ করুন। একটি কিউ-টেবিল ও cron দিয়ে ঢেউয়ে-ঢেউয়ে অ্যালার্ট পাঠান, প্রতিটি ডোনারের জন্য cooldown রাখুন। ওয়েব পুশ ফ্রি কিন্তু কম-দামি অ্যান্ড্রয়েডে অনির্ভরযোগ্য, তাই জরুরি ক্ষেত্রে SMS-এর সাথে জুড়ুন (টাকা লাগে, কিন্তু throttling খরচ কমায়)। AI-ভিত্তিক ব্যক্তিগতকরণ আমাদের মাপে দরকার নেই — সাধারণ নিয়মই যথেষ্ট।

---

### Pattern 2 — Donor-initiated contact / privacy-by-default (numbers revealed only after the donor accepts)

**Problem it solves.** Exposing donors' phone numbers is the core safety failure of donor-finder apps: it invites spam, harassment, scraping, and feeds the **paid-donor black market** — and it drives donors to quit. Friends2Support's top complaints are exactly stale lists, wrong numbers, and harassment from exposed contacts.

**How it works (proven elsewhere).** Facebook's verbatim model: *"the person who needs blood won't be able to see any information about the donor, unless the donor explicitly provides it when he/she reaches out."* Simply Blood (India) does the same — a requester posts a need, nearby donors are notified, and **numbers are exchanged only after a donor accepts**. Donor status defaults to private.

🇧🇩 **বাংলা:** ডোনারের ফোন নম্বর প্রকাশ করাই এই ধরনের অ্যাপের সবচেয়ে বড় নিরাপত্তা-ঝুঁকি — স্প্যাম, হয়রানি, এমনকি রক্তের কালোবাজারিকে উৎসাহ দেয়, আর ডোনাররা অ্যাপ ছেড়ে দেয়। Facebook ও Simply Blood-এর মডেল: অনুরোধকারী ডোনারের কোনো তথ্য দেখতে পায় না; ডোনার নিজে "সাহায্য করব" চাপলে তবেই নম্বর বিনিময় হয়।

**Build on our stack.** This is the **highest-value, lowest-cost upgrade** over our current public donor profiles. Use Supabase **RLS** so a requester can *never* `SELECT` a donor's phone. Flow: requester creates a `blood_requests` row → matching donors are alerted → a donor taps **"I can help" / "Not now"** → only on an `accept` row do RLS policies reveal contact to both parties. This both closes our "exposed contact" risk and feeds the response-rate signal in Pattern 6.

| Capability | Verdict | Note |
|---|---|---|
| Privacy-by-default + reveal-on-accept (RLS) | `adopt-now` | Pure RLS + an accept action. Biggest single trust upgrade. |
| Default-private donor registration | `adopt-now` | Visibility defaults to private; sharing/responding is a deliberate donor action. |
| One-tap "I can help / Not now" response | `adopt-now` | Converts intent to action and powers the trust score. |

🇧🇩 **বাংলা:** এটিই আমাদের বর্তমান পাবলিক প্রোফাইলের তুলনায় সবচেয়ে বেশি মূল্যবান অথচ সবচেয়ে কম খরচের উন্নতি। Supabase RLS দিয়ে নিশ্চিত করুন অনুরোধকারী যেন কখনোই ডোনারের ফোন `SELECT` করতে না পারে; ডোনার "সাহায্য করব" চাপলে তবেই দুপক্ষ নম্বর পাবে। ডিফল্টভাবে ডোনার প্রোফাইল প্রাইভেট রাখুন।

---

### Pattern 3 — Eligibility-aware, real-time availability search (treat "last donated" like inventory)

**Problem it solves.** A directory of names is noisy: many listed donors are medically ineligible (donated recently), paused, or unreachable, so requesters waste the critical first hour on dead leads. National apps solved this by surfacing each donor's eligibility/next-eligible date like a stock level.

**How it works (proven elsewhere).** Friends2Support **auto-hides a donor for 90 days after donating**, then auto-reappears, and sends a 3-month "time to donate again" reminder. Lifeblood, Wateen, JRC, Vitalant, and Stanford all show a **"next eligible date" / donation countdown**. LifeBank's whole model is matching a request to *in-stock* units — applied to people, that means matching to *available, eligible, nearby* donors.

🇧🇩 **বাংলা:** শুধু নামের তালিকা বিভ্রান্তিকর — অনেক ডোনার সম্প্রতি রক্ত দিয়েছেন বলে এখন অযোগ্য, কেউ বিরতিতে আছেন, কেউ অপ্রাপ্য, ফলে অনুরোধকারী মূল্যবান প্রথম ঘণ্টা নষ্ট করে। সমাধান: প্রতিটি ডোনারের "শেষ রক্তদানের তারিখ"-কে স্টকের মতো ধরা — Friends2Support রক্তদানের পর ৯০ দিন ডোনারকে স্বয়ংক্রিয়ভাবে লুকিয়ে রাখে; Lifeblood/Wateen/JRC "পরবর্তী যোগ্যতার তারিখ" দেখায়।

**Build on our stack.** Mostly a **schema change**: add `last_donated_at` + `is_available` to `donors`; compute `eligible_from = last_donated_at + interval`. Filter search and the Pattern 1 alert query to exclude donors where `now() < eligible_from OR is_available = false`. Show donors their own *"eligible again in N days"* countdown. **Important honesty caveat:** label this **"available," not "medically cleared"** — app-side eligibility is self-reported; true medical clearance needs a clinic. Use the standard BD whole-blood interval (~3 months / 90 days; clinical minimum is 56 days).

| Capability | Verdict | Note |
|---|---|---|
| Last-donation + interval + availability toggle, auto-hide ineligible | `adopt-now` | Schema + view/generated column + query filter. Biggest quality win per effort. |
| "Eligible again in N days" countdown + nudge | `adopt-now` | Pure date math; strongest retention lever (see Pattern 7). |
| "X available compatible donors near you" live signal | `adopt-now` | Owned-data analog of PMI's stock-by-type; do NOT claim to show blood-bank inventory. |
| Real blood-bank **stock-by-type** integration | `needs-partnership` | Requires hospital/blood-bank inventory feeds; out of scope for a finder. Don't fake it. |

🇧🇩 **বাংলা:** মূলত একটি স্কিমা পরিবর্তন: `donors`-এ `last_donated_at` ও `is_available` যোগ করুন, এবং `eligible_from = last_donated_at + interval` হিসাব করুন; সার্চ ও অ্যালার্টে অযোগ্য/অপ্রাপ্য ডোনার বাদ দিন। সতর্কতা: একে "available" বলুন, "মেডিকেলি ক্লিয়ার্ড" নয় — অ্যাপের যোগ্যতা স্ব-ঘোষিত, প্রকৃত মেডিকেল যাচাই ক্লিনিকের কাজ। প্রকৃত রক্ত-ব্যাংক স্টক দেখানো অংশীদারিত্ব ছাড়া সম্ভব নয় — ভুয়া স্টক দেখাবেন না।

---

### Pattern 4 — Low-connectivity access (SMS / USSD / IVR / WhatsApp / PWA) for low-end Android

**Problem it solves.** A large share of BD users are on low-end Android with weak/expensive data — or no smartphone — and emergencies happen to anyone. A data-only, JS-heavy web app **silently excludes them at the worst possible moment.** This is the single most BD-relevant pattern: SMS still dominates locally, and only ~31% of BD's supply is from voluntary donors (vs ~95% in India/Sri Lanka/Thailand, per WHO 2016/2017), so widening the on-ramp directly addresses a national gap.

**How it works (proven elsewhere).** Damu Sasa (Kenya) runs an *entire* serious blood platform over **USSD (`*483*277#`)**. Art of Living "Save Life India" uses a **missed-call** number where a volunteer calls back to register feature-phone users. Rokto (Bangladesh) is **SMS-native** on a dedicated number. WhatsApp bots are used for city-wise urgent appeals (very high open rates, though vendor-quoted figures like "98%" are unverified marketing).

🇧🇩 **বাংলা:** বাংলাদেশের অনেক ব্যবহারকারী কম-দামি অ্যান্ড্রয়েড ও দুর্বল/দামি ডেটায় চলেন, কেউ স্মার্টফোনই নেই — অথচ জরুরি অবস্থা যে কারো হতে পারে। শুধু-ডেটার ভারী ওয়েব অ্যাপ এদের ঠিক সংকটের মুহূর্তে বাদ দিয়ে দেয়। এটিই বাংলাদেশের জন্য সবচেয়ে প্রাসঙ্গিক প্যাটার্ন: এখানে SMS এখনো প্রধান, আর WHO অনুযায়ী মাত্র ~৩১% রক্ত স্বেচ্ছায় আসে। Damu Sasa পুরো প্ল্যাটফর্ম USSD-তে চালায়, "Save Life India" মিসড-কলে রেজিস্ট্রেশন করায়, Rokto SMS-নির্ভর।

**Build on our stack.**
- **Outbound SMS** alerts (Pattern 1) via a BD gateway with a **masking sender ID** for trust — `adopt-now` for the path, budget-gated for the messages.
- **Inbound SMS keyword** registration / requests (e.g., `BLOOD A+ DHAKA`) parsed by a Next.js API route → upsert into Supabase. Cheap and needs no data plan for the user.
- **PWA / offline-first**: keep bundles tiny, cache the donor-search shell, degrade gracefully on weak data. Pure engineering discipline on Next.js 16.
- **Missed-call/IVR** and **WhatsApp Business API** are higher-setup (virtual number / BSP + template approval + per-conversation fees) — defer. A **free interim** is a pre-filled `wa.me` deep link the requester taps to blast their need.

| Channel | Verdict | Note |
|---|---|---|
| PWA / lightweight offline-first build | `adopt-now` | No partner; bundle discipline + shell caching for low-end Android. |
| Outbound SMS alerts (masking sender ID) | `adapt` | Path is now; messages need a paid BD gateway. Reserve SMS for matched, high-intent alerts. |
| Inbound SMS-keyword registration/request | `adapt` | Easy + cheap; no data plan needed for the donor. |
| `wa.me` deep-link handoff | `adopt-now` | Free WhatsApp substitute before any Business API. |
| WhatsApp Business API bot | `adapt` | Needs a BSP, template approval, per-conversation fees. Do after SMS + PWA. |
| Missed-call / true IVR | `adapt` | Needs telephony/virtual-number vendor. Start with SMS-keyword + volunteer call-back queue. |

🇧🇩 **বাংলা:** আউটবাউন্ড SMS (মাস্কিং সেন্ডার আইডিসহ, বিশ্বাস বাড়াতে) ও ইনবাউন্ড SMS-কিওয়ার্ড রেজিস্ট্রেশন (`BLOOD A+ DHAKA`) Next.js API রুটে পার্স করে Supabase-এ রাখুন — ডোনারের ডেটা প্যাকেজ লাগে না। অ্যাপটিকে হালকা PWA বানান যাতে দুর্বল নেটে চলে। WhatsApp Business API ও সত্যিকারের IVR পরে — আপাতত ফ্রি `wa.me` লিংক দিয়ে অনুরোধকারী নিজে বার্তা ছড়াতে পারবেন।

---

### Pattern 5 — Standing rare-group registry + direct-mobilise alerts (O-neg, AB-neg, Bombay/Oh)

**Problem it solves.** For ultra-rare groups — O-neg, AB-neg, and especially the **Bombay (Oh) phenotype** (~0.01% in parts of India, ~0.0001% in Europe) — organic radius search across a free-text list *fails*: there may be only dozens of eligible donors in a whole region. You cannot wait for a normal broadcast to find them.

**How it works (proven elsewhere).** India's **Rare Donor Registry (RDRI)** keeps ~500 consented rare-group donors, mobilised by **direct phone contact** in emergencies; `bombaybloodgroup.org` runs a donor+blood-bank network reachable via a single hotline. The key insight: a small, **curated, consented, periodically re-verified** list contacted individually beats any algorithmic radius alert for sub-0.01% groups.

🇧🇩 **বাংলা:** অতি-বিরল গ্রুপের জন্য — O-নেগেটিভ, AB-নেগেটিভ, বিশেষত Bombay (Oh) ফেনোটাইপ — সাধারণ এলাকাভিত্তিক সার্চ কাজ করে না; পুরো অঞ্চলে হয়তো মাত্র কয়েক ডজন যোগ্য ডোনার থাকেন। ভারতের Rare Donor Registry ~৫০০ জন সম্মতিপ্রাপ্ত বিরল ডোনারকে জরুরি অবস্থায় সরাসরি ফোনে ডাকে। শিক্ষা: ছোট, যত্নে-বাছাই, নিয়মিত পুনঃযাচাই-করা তালিকা ব্যক্তিগতভাবে ডাকা — অ্যালগরিদমিক অ্যালার্টের চেয়ে কার্যকর।

**Build on our stack.** The **software is `adopt-now`**: a flagged subset of `donors` for rare groups, explicit consent capture, a **stricter re-verification cadence**, and an admin "mobilise" view that lists rare donors for direct outreach (bypassing the normal wave throttling). The catch is *reach*: genuine coverage for ultra-rare groups like Bombay realistically benefits from **linking to existing rare-donor networks / blood banks** — that linkage is the `adapt`/`needs-partnership` part, not the code.

| Capability | Verdict | Note |
|---|---|---|
| In-app rare-group registry + consent + re-verification cadence | `adopt-now` | Flagged subset + admin mobilise view. Bypass normal throttling for emergencies. |
| Reach for ultra-rare (Bombay/Oh) groups | `adapt` → `needs-partnership` | Software is ours; real coverage benefits from linking to existing rare-donor networks. |

🇧🇩 **বাংলা:** সফটওয়্যারটি এখনই বানানো যায়: বিরল গ্রুপের জন্য `donors`-এর একটি চিহ্নিত উপসেট, স্পষ্ট সম্মতি, কঠোর পুনঃযাচাইয়ের সময়সূচি, এবং অ্যাডমিনের জন্য একটি "mobilise" ভিউ যা জরুরি অবস্থায় স্বাভাবিক throttling এড়িয়ে সরাসরি ডাকতে দেয়। তবে Bombay-এর মতো অতি-বিরল গ্রুপে প্রকৃত নাগাল পেতে বিদ্যমান rare-donor নেটওয়ার্ক/রক্ত-ব্যাংকের সাথে সংযোগ লাগবে।

---

### Pattern 6 — Trust & freshness signals + light verification (fight stale lists and the black market)

**Problem it solves.** The #1 documented complaint across *every* app in this category is **stale data**: donors who don't answer, are out of station, or have wrong numbers. Search isn't the hard problem — *reachable, current, trustworthy* donors are. Separately, peer-to-peer boards attract **paid-donor solicitation** (a documented black market in India — units up to ~Rs 4,000 — and COVID-era plasma in Pakistan).

**How it works (proven elsewhere).** Roktalap (BD) uses a **community trust score that flags unresponsiveness/false SOS**; Donoro uses **post-donation recipient reviews**; Friends2Support gates registration behind **OTP** and offers report-a-bad-donor. Lifeblood/Wateen/Singapore build **digital donor cards + visible help history + milestones** to convert trust into pride. Simply Blood positions loudly around **"always free, never paid donors."**

🇧🇩 **বাংলা:** এই শ্রেণির প্রতিটি অ্যাপের ১ নম্বর অভিযোগ — বাসি তথ্য: ডোনার ফোন ধরে না, এলাকায় নেই, কিংবা নম্বর ভুল। আসল সমস্যা সার্চ নয়, *নাগালযোগ্য, হালনাগাদ, বিশ্বাসযোগ্য* ডোনার। পাশাপাশি পিয়ার-টু-পিয়ার বোর্ডে টাকার বিনিময়ে রক্তদাতার প্রস্তাব আসে (ভারত-পাকিস্তানে কালোবাজারি নথিভুক্ত)। সমাধান: ট্রাস্ট স্কোর (Roktalap), রিভিউ (Donoro), OTP যাচাই, এবং জোরালোভাবে "সবসময় বিনামূল্যে, কখনো পেইড ডোনার নয়" নীতি।

**Build on our stack.**
- `last_active` / `last_confirmed_at` timestamps + periodic **"are you still available?"** nudges; **rank recently-confirmed donors above stale ones**, demote/hide long-inactive ones. All from your own event logs — no external service.
- A **`reports` table** + admin review queue for wrong-number / no-show / **"report payment request"** flags.
- A **digital donor card** (name, group, total helps, last donation, badges) + **verified badge** — ship **phone-OTP** "verified" first (cheap via the same SMS gateway), defer NID/document verification (privacy/storage cost).
- A **loud no-paid-donor / anti-black-market policy** in the footer and the request flow — pure content, zero infra, high trust payoff.

| Capability | Verdict | Note |
|---|---|---|
| Last-active + freshness ranking + re-confirm nudges | `adopt-now` | From your own event logs. Directly beats competitors' stale lists. |
| Reports table + admin queue (incl. "report payment request") | `adopt-now` | You already have an admin panel + `is_admin`. |
| No-paid-donor / anti-black-market policy | `adopt-now` | Content + one flag. Zero cost, strong ethical differentiator. |
| Digital donor card + help history + badges | `adopt-now` | DB fields + UI; builds requester trust and donor pride. |
| Phone-OTP "verified" badge | `adapt` | OTP needs the SMS budget; email/Google OAuth you already have is a fine v1. |
| Admin-verified "trusted requester" flag | `adapt` | Manual badge feasible solo; true blood-bank verification needs partnership. |
| NID/document/medical verification | `needs-partnership` | Document OCR adds privacy/storage cost; medical fitness needs a clinic. |

🇧🇩 **বাংলা:** নিজের ইভেন্ট-লগ থেকে `last_active` ও পর্যায়ক্রমিক "এখনও কি উপলব্ধ?" নাজ যোগ করুন; সম্প্রতি-নিশ্চিত ডোনারদের উপরে দেখান, দীর্ঘ-নিষ্ক্রিয়দের নামান। ভুল-নম্বর/নো-শো/"টাকা চাওয়া রিপোর্ট"-এর জন্য একটি `reports` টেবিল ও অ্যাডমিন কিউ বানান। ডিজিটাল ডোনার কার্ড ও ব্যাজ দিন; প্রথমে ফোন-OTP "যাচাইকৃত" ব্যাজ (একই SMS গেটওয়েতে সস্তা), NID/ডকুমেন্ট যাচাই পরে। ফুটার ও অনুরোধ-ফ্লোতে "পেইড ডোনার নয়" নীতি স্পষ্ট লিখুন — খরচ শূন্য, বিশ্বাস অনেক।

---

### Pattern 7 — "Continuous need" reframing, retention nudges & lightweight gamification (a warm pool, not a cold panic-search)

**Problem it solves.** P2P apps spike only when someone is dying, so the donor pool is *cold and slow* exactly when speed matters. Emergency-only framing produces an unreliable, panic-driven supply; lapsed donors are the biggest lost supply.

**How it works (proven elsewhere).** Kızılay's headline message is literally *"blood is not an urgent need, it is a continuous need"* — they push **scheduled recurring donation** to keep a warm, recently-screened pool. The strongest evidence-based retention lever is **timing**: an RCT (Gemelli et al., *Transfusion* 2021) found a reminder **~1 week before the deferral period ends** is the most effective moment, and a separate Guangzhou RCT showed **SMS reminders are fast and very cheap** (¥0.7 vs ¥3.9 for calls). Kızılay's **"Kan Bağışı Ligi"** turns football-team loyalty into a public donation leaderboard; JRC awards points; Lifeblood shows pride-building **milestones**.

🇧🇩 **বাংলা:** পিয়ার-টু-পিয়ার অ্যাপ শুধু কেউ মুমূর্ষু হলে জাগে, ফলে ডোনার পুল ঠিক যখন গতি দরকার তখনই ঠান্ডা ও ধীর। শুধু-জরুরি কাঠামো অনির্ভরযোগ্য, আতঙ্কনির্ভর সরবরাহ তৈরি করে। Kızılay-এর মূল বার্তা: "রক্ত জরুরি নয়, ক্রমাগত প্রয়োজন।" সবচেয়ে প্রমাণিত retention কৌশল হলো *সময়*: deferral শেষ হওয়ার ~১ সপ্তাহ আগে রিমাইন্ডারই সবচেয়ে কার্যকর (RCT), আর SMS রিমাইন্ডার দ্রুত ও অনেক সস্তা।

**Build on our stack.**
- **Reframe** the landing page and donor dashboard around *staying ready*, not just one-off emergency response — pure UX/content, zero cost.
- **Timing nudge:** compute `last_donated_at + interval − 7 days` in Postgres and fire **one well-timed SMS/push** — no ML, highest retention ROI for the least code (only cost is the message itself).
- **Group leaderboard** (university / district / employer / cricket team): an optional `group` field + a Supabase aggregate query + a page. Culturally strong fit for BD campuses and districts; near-free to build.
- **Non-cash recognition** only: badges, a downloadable thank-you certificate, milestones. Avoid cash/material rewards (discouraged for voluntary donation; unaffordable). **Accredited volunteer hours** (à la Abu Dhabi) is aspirational — `needs-partnership` with a university.
- **Impact feedback loop:** a requester-side **"mark fulfilled / thank you"** action that notifies the donor — a faithful, privacy-safe analog of "your blood reached a hospital." Owned data, no partner; guard so only the requester can mark their own request.

| Capability | Verdict | Note |
|---|---|---|
| "Continuous need" reframing | `adopt-now` | UX/content only. No partner, no cost. |
| Deferral-end timing nudge (1 week before eligible) | `adopt-now` | `last_donated_at + interval − 7d` in Postgres + cron; SMS/push is the only cost. |
| Group leaderboard (campus/district/team) | `adopt-now` | Optional `group` field + aggregate query + page. Cheap, culturally strong. |
| Digital badges / certificate / milestones (non-cash) | `adopt-now` | Free to issue; avoid cash rewards. |
| Requester "mark fulfilled / thank you" feedback loop | `adopt-now` | Privacy-safe analog of recipient feedback; owned data. |
| Accredited volunteer credit hours | `needs-partnership` | Needs a university/employer/government scheme. Aspirational. |

🇧🇩 **বাংলা:** ল্যান্ডিং পেজ ও ড্যাশবোর্ডকে "প্রস্তুত থাকা"-র চারপাশে সাজান (খরচ শূন্য)। Postgres-এ `last_donated_at + interval − 7 দিন` হিসাব করে একটি সময়মতো SMS/পুশ পাঠান — AI লাগে না, সর্বোচ্চ ফল। বিশ্ববিদ্যালয়/জেলা/দল-ভিত্তিক লিডারবোর্ড যোগ করুন (একটি `group` ফিল্ড + অ্যাগ্রিগেট কোয়েরি)। শুধু নন-ক্যাশ স্বীকৃতি: ব্যাজ, সার্টিফিকেট, মাইলস্টোন। অনুরোধকারীর "সম্পন্ন/ধন্যবাদ" বোতাম ডোনারকে জানাবে — গোপনীয়তা-নিরাপদ। স্বীকৃত স্বেচ্ছাসেবক-ঘণ্টা বিশ্ববিদ্যালয়/সরকারি অংশীদারিত্ব ছাড়া সম্ভব নয়।

---

### Pattern 8 — Demand prediction & partner networks (mostly `needs-partnership`; one honest lite version)

**Problem it solves.** Knowing *where and which groups* are chronically short lets you proactively recruit donors there instead of always reacting to crises. True forecasting and partner integrations are what give national operators their reach.

**How it works (proven elsewhere).** Real ML demand/shortage forecasting (LifeBank + benshi.ai; peer-reviewed Canadian/Ghana studies) is genuinely powerful — but it **requires hospital/blood-bank inventory and transfusion data we neither have nor should collect**. Facebook's 100M-scale reach came from its existing install base, not anything we can replicate; eRaktKosh-style national stock integration needs Ministry/blood-bank cooperation. The growth that *is* available to us is **NGO / campus / community partnerships** (Bloodman BD + ICT Division grew Facebook's BD adoption to ~11M).

🇧🇩 **বাংলা:** কোথায় ও কোন গ্রুপে দীর্ঘমেয়াদি ঘাটতি তা জানলে সংকটের জন্য অপেক্ষা না করে আগেই সেখানে ডোনার নিয়োগ করা যায়। প্রকৃত ML চাহিদা-পূর্বাভাস শক্তিশালী, কিন্তু তার জন্য হাসপাতাল/রক্ত-ব্যাংকের ইনভেন্টরি ও ট্রান্সফিউশন ডেটা দরকার — যা আমাদের নেই এবং সংগ্রহ করাও উচিত নয়। Facebook-এর কোটি-মাপের নাগাল তার বিদ্যমান ব্যবহারকারী থেকে; আমরা তা নকল করতে পারব না। আমাদের জন্য বাস্তব বৃদ্ধি NGO/ক্যাম্পাস/কমিউনিটি অংশীদারিত্ব।

**Build on our stack.** Skip true ML. Build the **honest lite version**: aggregate your *own* `blood_requests` logs by **blood group × district × time** to surface **"shortage trends"** (e.g., recurring O- shortfalls in a city), then run targeted recruitment drives there. This is plain SQL/dashboards on data you already collect — frame it as *analytics*, not AI forecasting.

| Capability | Verdict | Note |
|---|---|---|
| "Shortage trends" analytics on our own request logs | `adopt-now` (`adapt`) | SQL/dashboards on owned data. Frame as trends, NOT AI forecasting. |
| NGO / campus / community partnerships for growth | `adapt` | The realistic distribution path; grow via communities, don't compete on raw reach. |
| True ML demand/shortage forecasting | `needs-partnership` | Needs blood-bank inventory + transfusion data we don't (and shouldn't) hold. |
| National stock integration (eRaktKosh-style) | `needs-partnership` | Ministry/blood-bank cooperation. Aim for a single local pilot first. |
| Physical inventory / cold-chain / drone logistics | *not-feasible* | Capital-, regulatory-, partnership-heavy; outside a finder that never touches blood. |

🇧🇩 **বাংলা:** প্রকৃত ML বাদ দিন। সৎ ও হালকা সংস্করণ বানান: নিজের `blood_requests` লগকে গ্রুপ × জেলা × সময় ধরে যোগ করে "ঘাটতির প্রবণতা" বের করুন, তারপর সেখানে লক্ষ্যভিত্তিক ডোনার-নিয়োগ চালান — এটি আপনার সংগৃহীত ডেটার উপর সাধারণ SQL, একে "প্রবণতা" বলুন, "AI পূর্বাভাস" নয়। প্রকৃত পূর্বাভাস ও জাতীয় স্টক-সংহতকরণ রক্ত-ব্যাংক/মন্ত্রণালয়ের অংশীদারিত্ব ছাড়া অসম্ভব; শারীরিক ইনভেন্টরি, কোল্ড-চেইন বা ড্রোন আমাদের পরিসরের বাইরে।

---

### What to copy first vs. what needs partners (at-a-glance)

| Smart pattern | Core verdict | Why it fits an independent low-budget BD app |
|---|---|---|
| 1. Geo-targeted compatible + eligible broadcast w/ throttling | `adopt-now` (delivery `adapt` for SMS) | Pure Supabase logic; throttling protects donor goodwill *and* SMS budget. |
| 2. Privacy-by-default, reveal-on-accept | `adopt-now` | Highest-value, lowest-cost upgrade; pure RLS. Fixes our exposed-contact gap. |
| 3. Eligibility-aware availability search | `adopt-now` | Schema change only; biggest quality win per effort. |
| 4. Low-connectivity access (SMS/PWA now; USSD/WhatsApp later) | `adopt-now` (PWA) / `adapt` (SMS) | Most BD-relevant; SMS-dominant market, ~31% voluntary supply gap. |
| 5. Rare-group standing registry | `adopt-now` (software) / `needs-partnership` (reach) | We can build it; ultra-rare coverage benefits from network links. |
| 6. Trust/freshness signals + light verification | `adopt-now` (OTP `adapt`) | Beats competitors' stale lists; anti-black-market is pure content. |
| 7. "Continuous need" reframing + timing nudges + gamification | `adopt-now` | Warm pool beats cold panic-search; deferral-end nudge is the top retention ROI. |
| 8. Demand prediction & partner networks | `adapt` (lite analytics) / `needs-partnership` (real forecasting) | Owned-data shortage trends now; true forecasting/stock needs partners. |

**Uncertainty flags (treat as indicative, not audited):** All headline adoption/impact numbers above (Facebook 100M / BD ~11M; Wateen 520k users; LifeBank/Damu Sasa lives-saved; WhatsApp "98% open rate") are **self-reported by orgs/vendors or single studies**, not independently audited. Only the **Zipline Rwanda** delivery-time (61%) / expiry (67%) figures and the **deferral-timing RCT** are peer-reviewed. BD SMS pricing (~0.30–0.50 BDT/SMS) is approximate vendor-listed market rate. WHO's "~31% voluntary" figure is 2016/2017 vintage.

🇧🇩 **বাংলা:** **প্রথমে কী নকল করবেন:** প্যাটার্ন ২ (গোপনীয়তা-ডিফল্ট) ও ৩ (যোগ্যতা-সচেতন সার্চ) — সর্বোচ্চ মূল্য, ন্যূনতম খরচ, কোনো অংশীদার লাগে না; এরপর ১ (লক্ষ্যভিত্তিক ব্রডকাস্ট), ৪ (PWA + SMS), ৬ (ট্রাস্ট সিগন্যাল), ৭ (retention নাজ)। অংশীদার লাগে: প্রকৃত স্টক-সংহতকরণ, প্রকৃত ML পূর্বাভাস, লজিস্টিকস। **সতর্কতা:** উপরের প্রায় সব বড় সংখ্যা (Facebook ১০ কোটি, Wateen, "৯৮% ওপেন রেট") সংস্থা/বিক্রেতার স্ব-ঘোষিত — নিরীক্ষিত নয়; শুধু Zipline রুয়ান্ডার ফল ও deferral-timing RCT পিয়ার-রিভিউড। SMS দর (~০.৩০–০.৫০ BDT) আনুমানিক, এবং WHO-র "~৩১% স্বেচ্ছায়" তথ্য ২০১৬/২০১৭ সালের।

---

## Our Current Site — Assessment & Quick Wins

This section grades **blood-finder** honestly against the Bangladesh landscape (Roktoshare, Roktalap, Badhan, Rokto.co, donatebloodbd) and the global bar (e-RaktKosh, Red Cross, NHS). The headline: our foundation is genuinely good — modern stack, a real request lifecycle, RLS, and an eligibility engine already exist — but five concrete defects undercut trust and usefulness, and **all five are cheap to fix on the current schema.**

🇧🇩 **বাংলা:** আমাদের অ্যাপের ভিত্তি ভালো — আধুনিক স্ট্যাক, রিকোয়েস্ট লাইফসাইকেল, RLS আর এলিজিবিলিটি লজিক আগে থেকেই আছে। কিন্তু পাঁচটি বাস্তব সমস্যা বিশ্বাসযোগ্যতা ও কার্যকারিতা কমিয়ে দিচ্ছে — আর পাঁচটিই বর্তমান স্কিমাতেই অল্প খরচে ঠিক করা সম্ভব।

### What We Already Do Well

These are real strengths — several BD competitors lack them. We should keep and build on them, not rebuild.

| Strength | Where it lives | Why it matters in BD |
|---|---|---|
| **Authenticated request lifecycle** (PENDING → ACCEPTED) with donor accept/decline | `blood_requests`, `dashboard/actions.ts` | Most BD tools stop at "browse a list and call a raw number." We have an in-app loop most competitors don't. |
| **Phone is not in the public search card** | `DonorSearch.tsx` selects only `full_name`, `location` | Avoids the open phone-harvesting that plagues Facebook groups and donatebloodbd. |
| **Eligibility engine already exists** (`calculateEligibility`, 90-day rule) | `src/lib/eligibility.ts` | The hard part (date math + `eligibleOn`) is done; we just under-use it. |
| **`donation_records` written on accept; `last_donation_date` auto-updated** | `acceptRequest()` | We capture donation history other directories never persist — the basis for badges, freshness, and forecasting later. |
| **RLS + SECURITY DEFINER helpers, admin approval gate** | `supabase-schema.sql`, `is_admin()`, `donor_user_id()` | Clean server-side authorization; a ranking RPC or stricter contact policy fits this pattern with no rearchitecting. |
| **Duplicate-request guard** | `blood_requests_unique_pending` partial unique index | Prevents one requester spamming the same donor with duplicate PENDINGs. |

🇧🇩 **বাংলা:** ইন-অ্যাপ রিকোয়েস্ট লাইফসাইকেল, সার্চে ফোন নম্বর লুকানো, এলিজিবিলিটি ইঞ্জিন, ডোনেশন রেকর্ড আর RLS — এগুলো আমাদের আসল শক্তি, যা অনেক প্রতিযোগীর নেই। এগুলো ধরে রেখে তার উপরই গড়তে হবে।

### Highest-Leverage Quick Wins

Ordered by impact-to-effort. Each is buildable on the existing tables with minimal new schema.

#### 1. Filter ineligible donors out of search (not just badge them)

**The bug:** `DonorSearch.tsx` queries `is_approved=true AND availability_status='AVAILABLE'`, then calls `calculateEligibility()` per card (line 158) **only to render a badge** ("Available" vs "In {N}d"). A donor who donated last week still appears in results, sorts in, and is clickable — and `/donor/[id]` will even show a disabled "Eligible in N days" button. This is exactly the "calling someone who gave blood last Tuesday" failure Roktoshare explicitly designed against.

**Fix:** push eligibility into the query. The `last_donation_date` column is already indexed-adjacent in `donors_search_idx`. Either (a) filter server-side `last_donation_date IS NULL OR last_donation_date <= now() - interval '90 days'`, or better, (b) move ranking into a Supabase RPC that excludes ineligible donors and returns eligible-first. Keep the badge for the few edge cases; stop showing un-contactable donors as primary results.

🇧🇩 **বাংলা:** এখন সার্চে অযোগ্য ডোনারও দেখায় — শুধু ব্যাজ বদলায়, তালিকা থেকে বাদ যায় না। `last_donation_date` দিয়ে কোয়েরিতেই ফিল্টার করলে যাঁকে এখন ফোন করা যায় না, তাঁকে আর দেখানো হবে না — এটাই সবচেয়ে বড় তাৎক্ষণিক জয়।

#### 2. Reveal phone on accept — not to every logged-in user

**The bug:** `/donor/[id]/page.tsx` (line 110) renders `donor.profile.mobile` to **any** authenticated visitor: `{user && donor.profile?.mobile && ...}`. There is no request, no donor consent — sign up, and you can pull every approved donor's number. Worse, the RLS policy **"Profiles of approved donors viewable"** grants SELECT on the whole `profiles` row (including `mobile`) to **anonymous** API callers, so the number is reachable via the data API even though the UI hides it from logged-out users. In a market where ~80% of online-harassment victims are women, open phone exposure is a concrete safety hazard — and Roktalap, Roktoshare, and Facebook's own BD feature all gate contact behind consent.

**Fix:** two parts. (a) Tighten RLS so `mobile` is not returned in the public/anon path (use a restricted view or a column-safe policy that excludes the phone). (b) Reveal the donor's number **only after `status='ACCEPTED'`** — the accept flow and `donor_user_id()` RLS already exist, so gate the contact block on an accepted `blood_request` between the two parties instead of on `user`.

🇧🇩 **বাংলা:** এখন যেকোনো লগইন করা ব্যক্তিই ডোনারের ফোন নম্বর দেখতে পায়, এমনকি RLS-এর কারণে নম্বরটি anon API থেকেও টানা যায়। ডোনার রিকোয়েস্ট **অ্যাকসেপ্ট** করার পরই কেবল নম্বর দেখানো উচিত — এটি নিরাপত্তা ও আস্থার জন্য জরুরি, বিশেষত নারী ডোনারদের জন্য।

#### 3. Fix the unused COMPLETED status (and the "accept = donated" conflation)

**The bug:** the `RequestStatus` enum has four states (`PENDING | ACCEPTED | CANCELLED | COMPLETED`) and `REQUEST_STATUS_STYLES` even styles COMPLETED blue — but **COMPLETED is never written anywhere.** In `acceptRequest()` (`dashboard/actions.ts`), accepting a request does three things at once: sets `status='ACCEPTED'`, inserts a `donation_record`, and sets `last_donation_date = today`. So "I'll help" and "the blood was actually given" are the same click. That corrupts data quality: `last_donation_date` (and therefore eligibility) flips on intent, not on a real donation, and we can never tell a no-show from a fulfilled donation.

**Fix:** split the lifecycle into PENDING → ACCEPTED → COMPLETED. `acceptRequest` should set `ACCEPTED` only (no donation record, no date change). Add a separate **"Mark as donated"** action — ideally a requester confirmation — that sets `COMPLETED`, then writes the `donation_record` and updates `last_donation_date`. This makes the existing fourth state meaningful, keeps eligibility honest, and unlocks the impact/thank-you message (the single strongest retention lever in the research).

🇧🇩 **বাংলা:** COMPLETED স্ট্যাটাসটি আছে কিন্তু কখনো ব্যবহার হয় না — "অ্যাকসেপ্ট" করলেই ধরে নেওয়া হয় রক্ত দেওয়া হয়েছে, ফলে `last_donation_date` ভুলভাবে বদলায়। অ্যাকসেপ্ট আর প্রকৃত ডোনেশন আলাদা করতে হবে: ACCEPTED → COMPLETED ধাপে ভাগ করলে ডেটা সঠিক থাকবে এবং থ্যাংক-ইউ/ইমপ্যাক্ট মেসেজ পাঠানো যাবে।

#### 4. Structured location instead of free-text `ilike`

**The bug:** `donors.location` is free text, and search does `query.ilike('location', '%${location}%')` with a "Location (e.g. Dhaka)" box. "Dhaka", "dhaka", "ঢাকা", "Mirpur, Dhaka" don't reconcile; you can't reliably answer the real query — *"O+ donor in Mirpur"* — and you can't aggregate by area for a map or "N available O+ donors in this district" counts.

**Fix:** add structured `division` and `district` columns (and keep an optional free-text `area`) with cascading dropdowns on `/become-donor` and the search form. Bangladesh division/district reference data is small and static. This is the single biggest functional upgrade after eligibility filtering, and it is the prerequisite for any future map/choropleth or distance ranking.

🇧🇩 **বাংলা:** এখন লোকেশন শুধু ফ্রি-টেক্সট, তাই "ঢাকা/Dhaka/Mirpur" মিলিয়ে দেখা যায় না। `division` ও `district` কলাম যোগ করে ড্রপডাউন করলে "মিরপুরে O+ ডোনার" এর মতো আসল প্রশ্নের সঠিক উত্তর দেওয়া যাবে এবং পরে ম্যাপ/দূরত্ব-ভিত্তিক র‍্যাঙ্কিংও সম্ভব হবে।

#### 5. Notifications — donors only learn of requests if they open the dashboard

**The bug:** there is **no** email/SMS/push anywhere. A donor discovers a `PENDING` request only by logging in and visiting `/dashboard`. For 2am emergencies — the core BD use case — that is effectively no notification at all. Every serious BD platform (Rokto SMS, Roktalap push, Bloodman hotline) pushes the need *to* donors.

**Fix:** start with the cheapest, highest-reach channel. The research is clear that **SMS is the spine in Bangladesh** (near-universal reach; far more cost-effective than calls). Two near-free wins first: (a) an **eligibility-aware re-engagement message** fired by a `pg_cron`/Vercel cron when a donor crosses `last_donation_date + interval`, using the `eligibleOn` we already compute; and (b) a **new-request notification** to the targeted donor. A BD SMS gateway is a paid dependency but not an institutional partnership; web push (PWA) is a zero-marginal-cost secondary channel for app users.

🇧🇩 **বাংলা:** এখন কোনো নোটিফিকেশন নেই — ডোনার ড্যাশবোর্ড না খুললে রিকোয়েস্টই দেখতে পায় না, যা জরুরি অবস্থায় অকার্যকর। বাংলাদেশে SMS-ই সবচেয়ে নির্ভরযোগ্য মাধ্যম; এলিজিবিলিটি-ভিত্তিক রিমাইন্ডার ও নতুন রিকোয়েস্ট SMS দিয়ে শুরু করা উচিত, সঙ্গে PWA পুশ।

### Lower-Effort Correctness Fixes Worth Bundling

| Fix | Detail | Source of truth |
|---|---|---|
| **Gender-aware eligibility interval** | Flat `DONATION_ELIGIBILITY_DAYS = 90` is shorter than BD norm (~120 days men / ~180 women). Make it config (`{male:120, female:180}`); requires a `sex` field on `donors`. | `src/lib/eligibility.ts` |
| **Add anti-paid-donation notice + report action** | WHO + BD law + ~93% public disapproval back a "donation is voluntary — never pay for blood" banner and a `reports` table feeding the existing admin queue. | research: BD regulations |
| **Phone OTP to gate *requesting*** | `profiles.mobile` is unverified. Verify via Supabase phone OTP and require it to INSERT a `blood_request` — cheap deterrent to fake accounts; keep browsing open. | `profiles.mobile`, RLS |
| **Donor self-service controls** | Add `is_paused` (discoverable separately from AVAILABLE) and a self-delete — PDPO 2025 grants deletion/withdrawal rights; today deletion needs an admin. | `donors`, PDPO context |
| **Surface trust/freshness + milestones** | We already store `donation_records`; derive a `donation_count` badge and "last donated" freshness on `DonorCard`. Pure app-layer, reuses `BloodTypeBadge`. | `donation_records` |

🇧🇩 **বাংলা:** এর সঙ্গে কিছু ছোট সংশোধন: লিঙ্গভেদে এলিজিবিলিটি (১২০/১৮০ দিন), "টাকা দিয়ে রক্ত নয়" সতর্কবার্তা ও রিপোর্ট অপশন, রিকোয়েস্টের আগে ফোন OTP যাচাই, ডোনারের পজ/ডিলিট নিয়ন্ত্রণ, এবং ডোনেশন গণনা থেকে ব্যাজ/ফ্রেশনেস দেখানো।

### Suggested Sequencing

1. **Week 1 (logic only, no new infra):** eligibility filter in search (#1), split ACCEPTED/COMPLETED (#3), gender-aware interval.
2. **Week 2 (privacy/trust):** reveal-on-accept + RLS phone fix (#2), anti-paid-donation notice, report queue.
3. **Week 3+ (schema + reach):** structured division/district (#4), SMS reminders/notifications (#5), phone OTP, milestone badges.

🇧🇩 **বাংলা:** প্রথমে শুধু লজিক ঠিক করা (সার্চ ফিল্টার, স্ট্যাটাস ভাগ), এরপর প্রাইভেসি (রিভিল-অন-অ্যাকসেপ্ট), তারপর স্কিমা ও SMS — এই ক্রমে এগোলে ঝুঁকি কম, প্রভাব বেশি।

**Bottom line:** none of these require a rewrite. The schema, RLS, eligibility engine, and request lifecycle are already the right shape — we are mostly *connecting wires we already laid* (using eligibility to filter, using COMPLETED, gating phone on accept) and adding two structural pieces (structured location, an SMS channel) that turn a decent directory into a trustworthy emergency tool.

🇧🇩 **বাংলা:** মূল কথা: কোনো কিছু নতুন করে লেখার দরকার নেই। স্কিমা, RLS, এলিজিবিলিটি ও রিকোয়েস্ট-ফ্লো ঠিক জায়গাতেই আছে — আমরা মূলত আগে থেকে বসানো তারগুলোই জুড়ছি, আর দুটি কাঠামোগত অংশ (স্ট্রাকচার্ড লোকেশন ও SMS) যোগ করছি যা একটি সাধারণ ডিরেক্টরিকে নির্ভরযোগ্য জরুরি টুলে রূপ দেবে।

---

## Feature Recommendations (Prioritized — MoSCoW)

This catalogue prioritizes features using **MoSCoW** (Must / Should / Could / Won't-yet). Priority reflects two things together: (a) impact on the real Bangladesh blood-finding problem — staleness, exposed phone numbers, paid-donor risk, 2am rare-group emergencies — and (b) buildability on our actual stack (Next.js 16 App Router + React 19 + Tailwind v4 + Supabase/Postgres + Vercel) with **no map lib, no charts lib, no state manager, no UI kit** today. Implementation notes are tied to our real schema (`profiles`, `donors`, `blood_requests`, `donation_records`) and helpers (`src/lib/eligibility.ts`, `src/components/DonorSearch.tsx`, `src/proxy.ts`).

🇧🇩 **বাংলা:** এই তালিকায় ফিচারগুলোকে MoSCoW পদ্ধতিতে (Must / Should / Could / Won't-yet) সাজানো হয়েছে — কোনটা আগে দরকার তা ঠিক করা হয়েছে বাংলাদেশের বাস্তব সমস্যা (পুরোনো তথ্য, ফোন নম্বর ফাঁস, টাকার বিনিময়ে রক্তদাতা, জরুরি দুর্লভ গ্রুপ) এবং আমাদের বর্তমান Next.js + Supabase স্ট্যাকে কতটা সহজে বানানো যায় — এই দুটো বিবেচনায়।

### Priority summary

| # | Feature | Priority | Effort | Needs new infra? |
|---|---------|----------|--------|------------------|
| 1 | Structured location (division → district → upazila) + combined search | **Must** | M | No |
| 2 | Contact privacy / reveal-on-accept | **Must** | S–M | No |
| 3 | Eligibility-aware availability (gender-correct interval, auto-flip) | **Must** | S | No |
| 4 | Request urgency + units + component fields | **Must** | S | No |
| 5 | Blood-compatibility matching | **Should** | S | No |
| 6 | Notifications: SMS (spine) + email + PWA push | **Should** | M–L | SMS gateway |
| 7 | Verification ladder (phone OTP → badge → admin) | **Should** | M | OTP/SMS |
| 8 | Emergency broadcast to matched eligible donors | **Should** | M | Notifications |
| 9 | Donor availability calendar / pause toggle | **Could** | S–M | No |
| 10 | Donation history & impact loop (badges, "blood used") | **Could** | M | Notifications |
| 11 | Rare-group alerts & registry (incl. Bombay/Oh) | **Could** | M | Notifications |
| 12 | NID/biometric verification, live-stock directory | **Won't-yet** | L | Partnerships |

🇧🇩 **বাংলা:** উপরের ছকে প্রতিটি ফিচারের অগ্রাধিকার, আনুমানিক পরিশ্রম (S=ছোট, M=মাঝারি, L=বড়) এবং নতুন কোনো অবকাঠামো লাগবে কিনা তা দেখানো হলো।

---

### MUST HAVE — fix the foundation

These four close the gaps that currently make the app indistinguishable from a stale Facebook list. None require external services; all are schema + query work on Supabase.

### 1. Structured location + combined blood-group × area search
**What:** Replace the free-text `donors.location` with structured **Division → District → Upazila/Thana** reference data and cascading dropdown filters, while keeping a free-text "area/landmark" field. Search must filter on **blood group AND district together** as a first-class query.

**Why it matters for BD:** "O+ donor in Mirpur" is the single most common real-world query, and reviewers of the Badhan app explicitly ask for group + district combined. Today `DonorSearch.tsx` does `.ilike('location', '%...%')` on free text, so "Dhaka", "dhaka", and "Dhaka Medical" never reconcile — coarse, error-prone, and impossible to aggregate later (for maps/charts).

🇧🇩 **বাংলা:** এখন লোকেশন শুধু ফ্রি-টেক্সট, তাই "ঢাকা" আর "Dhaka Medical" আলাদা হয়ে যায়। বিভাগ → জেলা → উপজেলা কাঠামোবদ্ধ করলে "মিরপুরে O+ ডোনার" — এই ধরনের অনুসন্ধান নিখুঁত হবে, যা বাংলাদেশের ব্যবহারকারীদের সবচেয়ে বেশি দরকার।

**Implementation note:** Add `division_id`, `district_id`, `upazila_id` columns to `donors` (and mirror on `profiles` for prefill). Ship a static BD admin-data file (8 divisions / 64 districts / 492 upazilas) under `src/lib/bd-geo.ts` — derive it once from `yasserius/bangladesh_geojson_shapefile` (bilingual `name`/`bn_name`). Move `DonorSearch.tsx` from `ilike` to indexed `.eq()` on `district_id`. This also unlocks the future BD choropleth (district-level TopoJSON joined to a Supabase aggregate RPC) without committing to a map lib now.

### 2. Contact privacy — reveal phone only on accept
**What:** Never expose `profiles.mobile` to anonymous (or even arbitrary logged-in) users. Gate the donor's phone behind a request the donor **accepts**; only then reveal contact. Add donor self-controls: `phone_visibility` (`hidden` / `on_accept` / `masked`) and the right to stay listed without a public number.

**Why it matters for BD:** Open phone lists on Facebook groups and directories drive spam, harassment, and donor fatigue — and ~80% of online-harassment victims aged 14–22 in BD are women, so an exposed number is a concrete safety hazard. Roktalap and Facebook's own BD feature both hide contact until consent. **This is our clearest ethical differentiator.** It also aligns with the Personal Data Protection Ordinance 2025 (consent as primary lawful basis; deletion/correction rights).

🇧🇩 **বাংলা:** ফেসবুক গ্রুপে ফোন নম্বর খোলাখুলি থাকায় স্প্যাম ও হয়রানি হয় — বিশেষ করে নারীরা ঝুঁকিতে থাকেন। আমরা নম্বর তখনই দেখাবো যখন ডোনার অনুরোধ গ্রহণ (accept) করবেন। এটাই আমাদের সবচেয়ে বড় নৈতিক পার্থক্য এবং নতুন ডেটা সুরক্ষা আইন (PDPO 2025) এর সাথেও সঙ্গতিপূর্ণ।

**Implementation note:** The accept flow already exists (`RequestStatus = ACCEPTED`, `donor_user_id()` RLS helper). The real fix is at the **RLS/API layer**, not the UI: tighten the "Profiles of approved donors viewable" policy so an anonymous data-API query cannot pull `mobile`. Use a public **view** that excludes `mobile`, and only join contact when `blood_requests.status = 'ACCEPTED'` for that requester. `DonorSearch.tsx` already selects only `full_name` + location — keep it that way.

### 3. Eligibility-aware availability (gender-correct, auto-flip)
**What:** Make a donor's effective availability = `AVAILABLE` **AND** past their re-eligibility date, computed server-side, and **auto-flip** recently-donated donors out of search. Make the interval **gender-aware**.

**Why it matters for BD:** Stale "available" donors who actually gave blood last week are the #1 failure of every BD directory. Worse, our hardcoded `DONATION_ELIGIBILITY_DAYS = 90` is medically too short and gender-blind: BD blood banks use **~120 days for men and ~180 days for women**. We risk routing emergencies to ineligible, iron-depleted donors.

🇧🇩 **বাংলা:** রক্তদানের পরও "Available" দেখানো — এটাই সব বাংলাদেশি ডিরেক্টরির বড় সমস্যা। আমাদের ৯০ দিনের নিয়মটিও কম: পুরুষদের ~১২০ দিন, নারীদের ~১৮০ দিন হওয়া উচিত। তাই নির্ধারিত সময়ের আগে কেউ যেন সার্চে না আসে।

**Implementation note:** Replace the flat constant in `src/lib/eligibility.ts` with a config `{ male: 120, female: 180 }` and add a `sex` field to `donors`. `calculateEligibility()` takes `sex`. Add a Supabase **`pg_cron`** (or Vercel cron route) that nightly sets ineligible donors out of search and emits a "you're eligible again" reminder when they cross the boundary. Filter ineligible donors out of search results (today the badge shows but they still appear).

### 4. Request urgency, units, and component fields
**What:** Give `blood_requests` real structure: `urgency` (`critical` / `urgent` / `routine`), `units_needed`, `needed_by` (datetime), `hospital`/`location`, and `component` (whole blood / platelets / plasma). Today the table has only free-text `notes`.

**Why it matters for BD:** Emergencies are time- and quantity-specific ("B+ 2 bag lagbe, Dhaka Medical, by tomorrow"); dengue/thalassemia patients specifically need **platelets**, not whole blood. Structured fields enable triage, broadcast targeting, and — later — demand analytics. ~41% of transfusion-dependent thalassemia patients transfuse every 2–4 weeks, so component + recurrence matters.

🇧🇩 **বাংলা:** জরুরি প্রয়োজন সময় ও পরিমাণ-নির্ভর ("B+ ২ ব্যাগ, ঢাকা মেডিকেল, কালকের মধ্যে")। ডেঙ্গু/থ্যালাসেমিয়া রোগীদের প্রায়ই হোল ব্লাড নয়, প্লাটিলেট লাগে। তাই অনুরোধে জরুরিত্ব, ব্যাগ সংখ্যা, সময়সীমা ও রক্তের উপাদান যোগ করা দরকার।

**Implementation note:** Add the columns to `blood_requests`; surface urgency with color **plus a text label** (never color alone, for accessibility) reusing existing Tailwind status tokens. Keep `units_needed` as a small integer; render with `BLOOD_TYPE_LABELS`. No new infra — this is the prerequisite that makes features 8, 10, and 11 useful.

---

### SHOULD HAVE — make matching smart and reachable

### 5. Blood-compatibility matching
**What:** Expand exact-match search into a **compatibility-aware** result set: an O− requester should see all groups they can receive (only O−), but an AB+ requester should see every donor; conversely a donor view shows whom they can help. Encode the fixed 8×8 ABO/Rh rules as a static lookup.

**Why it matters for BD:** Current search is naive `.eq('blood_type', …)`, which dramatically under-shows the usable pool. Compatibility expansion alone widens emergency matches — critical when minutes count.

🇧🇩 **বাংলা:** এখন শুধু হুবহু গ্রুপ মেলে। কিন্তু রক্তের সামঞ্জস্যের নিয়ম (যেমন O− সবাইকে দিতে পারে, AB+ সবার থেকে নিতে পারে) যোগ করলে জরুরি মুহূর্তে অনেক বেশি উপযুক্ত ডোনার পাওয়া যাবে।

**Implementation note:** Add `src/lib/compatibility.ts` with a static `Record<BloodType, BloodType[]>` (recipient → acceptable donor groups). Use it to build the `.in('blood_type', [...])` filter in `DonorSearch.tsx`. Pure logic, zero ML, zero infra.

### 6. Notifications — SMS spine + email + PWA push
**What:** A notification layer so donors learn about requests **without opening the dashboard**. Channel cascade: **SMS primary**, PWA web-push secondary, email tertiary, WhatsApp opt-in only.

**Why it matters for BD:** Today donors only see requests if they happen to log in — useless at 3am. SMS is the only near-universal channel (~26% rural smartphone use; feature phones dominate). Evidence is strong: an eligibility-timed SMS is far more cost-effective than phone calls, and an impact SMS ("your blood was used for a patient") measurably lifts return rates. WhatsApp showed **no** retention effect in an RCT, so keep it opt-in.

🇧🇩 **বাংলা:** এখন ডোনার লগইন না করলে অনুরোধ দেখেন না — রাত ৩টায় অকার্যকর। বাংলাদেশে SMS-ই সবচেয়ে সর্বজনীন (গ্রামে স্মার্টফোন কম)। তাই SMS হবে মূল মাধ্যম, এরপর PWA পুশ ও ইমেইল; WhatsApp শুধু অপ্ট-ইন।

**Implementation note:** Integrate one BD SMS gateway (Bangla-template, sender-ID registered) behind a single `sendNotification()` server action. Store per-channel opt-in flags on `profiles`. Make the app a **PWA** (Next.js supports this) for zero-marginal-cost push to smartphone users. Trigger from the `pg_cron`/request server actions already added in features 3–4.

### 7. Verification ladder
**What:** Progressive trust, increasing friction only where it pays: **Tier 0** email (have it) → **Tier 1** phone OTP (gates *requesting*, not browsing) → **Tier 2** age ≥18 self-attest → **Tier 3** admin spot-check / verified badge. Surface a "Verified" badge in search.

**Why it matters for BD:** A fake self-signup can currently become an approved donor (only `is_approved` boolean today). OTP confirms a real, reachable human and kills the dead-number problem that plagues old lists; a visible badge mirrors the trust Badhan earns from offline grouping camps.

🇧🇩 **বাংলা:** এখন ভুয়া অ্যাকাউন্টও approved ডোনার হতে পারে। ফোন OTP যাচাই করলে নম্বরটি আসল ও সক্রিয় কিনা নিশ্চিত হয় — পুরোনো তালিকার মৃত নম্বরের সমস্যা দূর হয়। "Verified" ব্যাজ আস্থা বাড়ায়।

**Implementation note:** Use Supabase phone-OTP auth (or the same SMS gateway). Add `profiles.phone_verified_at`, `donors.verification_level`, `donors.verified_badge`. Gate `blood_requests` INSERT on `phone_verified` in the server action; keep heavy checks (NID) out for now to avoid drop-off and sensitive-ID handling under PDPO.

### 8. Emergency broadcast to matched eligible donors
**What:** Convert the slow browse-and-call-one model into a **fan-out**: a critical request notifies all compatible, eligible, nearby donors at once; donors accept in-app, then contact is revealed.

**Why it matters for BD:** Reports cite ~19–24 hours to source a single bag via one-by-one calling. Badhan and Roktalap both broadcast SOS; targeting only **eligible** donors (feature 3) avoids spamming people inside their cooldown window.

🇧🇩 **বাংলা:** একজন একজন করে কল করতে গিয়ে প্রায়ই এক ব্যাগ রক্ত জোগাড়ে ১৯–২৪ ঘণ্টা লাগে। জরুরি অনুরোধ একসাথে সব উপযুক্ত ও যোগ্য ডোনারকে পাঠালে দ্রুত সাড়া মেলে; শুধু যোগ্য ডোনারকেই পাঠানো হয় যেন কুলডাউনে থাকা কেউ বিরক্ত না হন।

**Implementation note:** Add a broadcast request type (no fixed `donor_id`; carries `blood_type` + `district_id`). On insert, query compatible + `AVAILABLE` + eligible donors and fan out via feature 6. Supabase **Realtime** can stream live accepts to the requester. Reuses the existing accept lifecycle and the unique-pending-request guard.

---

### COULD HAVE — retention, depth, and the hard cases

### 9. Donor availability calendar / pause toggle
**What:** Let donors set an availability window or a one-tap **"pause my listing"** (separate from `UNAVAILABLE`), plus a "I donated today" button that auto-sets the cooldown.

**Why it matters for BD:** Anti-fatigue and honesty. Reviewers of BD apps complain there's no easy way to log a donation date, so data goes stale. A pause toggle protects repeat thalassemia-supporting donors from burnout.

🇧🇩 **বাংলা:** ডোনারদের জন্য "Pause" বোতাম ও "আজ রক্ত দিয়েছি" বোতাম — যাতে কুলডাউন স্বয়ংক্রিয়ভাবে সেট হয় এবং নিয়মিত ডোনাররা ক্লান্ত বা বিরক্ত না হন।

**Implementation note:** Add `donors.is_paused` and an optional `available_from` date; honor both in the search query. "I donated today" writes `last_donation_date` via a server action using `todayIsoDate()` and flips availability automatically.

### 10. Donation history & impact loop (badges + "blood used")
**What:** A donor stats page (donation count, last donation, milestone badges at 1/5/10/25) and an **impact message** after a completed donation: "Your blood was used for a patient on DATE — thank you." Add a shareable donor card.

**Why it matters for BD:** Turning one-time donors into repeat donors is the core fix for BD's low (~30%) voluntary share. Impact/past-use messaging is the strongest evidence-backed retention lever; shareable cards drive organic recruitment in a social-media-heavy market.

🇧🇩 **বাংলা:** একবারের ডোনারকে নিয়মিত ডোনারে পরিণত করা — এটাই বাংলাদেশে কম স্বেচ্ছা রক্তদানের মূল সমাধান। "আপনার রক্ত একজন রোগীর কাজে লেগেছে" বার্তা ও মাইলস্টোন ব্যাজ পুনরায় দান বাড়ায়; শেয়ারযোগ্য ডোনার কার্ড নতুন ডোনার আনে।

**Implementation note:** We already store `donation_records` and have an unused `COMPLETED` status — wire requester-confirms-received to create the record and trigger the impact SMS. Derive badges from `COUNT(donation_records)` (no new core table). Generate the share card with Next.js `ImageResponse` (built-in OG image). **Caution:** do **not** send impact info ~10 days before re-eligibility (research shows it backfires) — schedule it at completion and at the eligibility boundary.

### 11. Rare-group alerts & registry (incl. Bombay/Oh)
**What:** A `is_rare` flag and an extended phenotype field for **Bombay (Oh)** and other rare types, nationwide (not just local) search for them, and a standing rare-group alert list.

**Why it matters for BD:** O−, AB−, and especially Bombay (~1 in 25,000) are the true emergencies; BD has **no national Bombay registry** and units are sometimes flown in from India. A searchable, nationwide flag with proactive alerts is genuinely life-saving and unique in the BD context.

🇧🇩 **বাংলা:** O−, AB− এবং বিশেষ করে Bombay (Oh) গ্রুপই আসল জরুরি অবস্থা; বাংলাদেশে Bombay গ্রুপের কোনো জাতীয় তালিকা নেই, কখনো ভারত থেকে আনতে হয়। তাই দুর্লভ গ্রুপের আলাদা ফ্ল্যাগ ও সারাদেশজুড়ে অনুসন্ধান অত্যন্ত মূল্যবান।

**Implementation note:** Relax the 8-type `CHECK` constraint to allow an `is_rare` boolean + free-text `phenotype`; surface rare donors prominently and skip the district filter for them. Maintain an opt-in alert subscription so rare donors get notified the moment a matching request appears.

---

### WON'T-YET — valuable, but not solo-buildable now

These are real best-practice features (e-RaktKosh, Red Cross) but require **institutional partnerships, recurring cost, or data we cannot collect yet**. Defer deliberately; some have cheap interim substitutes.

| Feature | Why defer | Cheap interim / prerequisite |
|---|---|---|
| **Live blood-bank stock directory** (e-RaktKosh model) | Requires blood banks/hospitals to feed per-component live inventory — impossible without partnerships | List known blood banks + hotlines per district as **static curated data**; link out to `bbms.dghs.gov.bd` |
| **NID/biometric verification** | Friction + cost + sensitive-ID handling under PDPO; Porichoy access is gated to banks/fintech | Keep verification at **phone-OTP + optional admin review** (feature 7) |
| **Demand forecasting / shortage prediction** | Needs 6–12 months of granular historical request data we don't yet collect | Start **logging structured request events now** (feature 4 creates the clean data) |
| **AI chatbot / NLP request parsing** | Recurring Claude API cost; not foundational | Worth a later phase — Claude handles Bengali well (top-5); revisit once features 1–8 ship |
| **Masked-relay VoIP calling** | Telephony spend + provider integration | Use **reveal-on-accept** (feature 2) as the Phase-1 substitute; store `contact_channel` on `blood_requests` so relay can drop in later |
| **Data localization (PDPO Art. 29)** | US-hosted Supabase/Vercel likely don't satisfy the in-country real-time-copy rule; enforcement phases in ~May 2027 | Track as compliance debt; evaluate a **BD-region replica** before 2027; keep location coarse (district, never live GPS) |

🇧🇩 **বাংলা:** এই ফিচারগুলো (রিয়েল-টাইম রক্ত মজুদ, NID যাচাই, চাহিদা পূর্বাভাস, AI চ্যাটবট, মাস্কড কলিং, ডেটা লোকালাইজেশন) মূল্যবান, কিন্তু এর জন্য প্রাতিষ্ঠানিক অংশীদারিত্ব, নিয়মিত খরচ বা এমন ডেটা দরকার যা এখনো আমাদের কাছে নেই। তাই এগুলো এখন নয় — তবে কিছু ক্ষেত্রে সস্তা বিকল্প (যেমন স্ট্যাটিক ব্লাড ব্যাংক তালিকা, reveal-on-accept) দিয়ে শুরু করা যায়, এবং এখন থেকেই কাঠামোবদ্ধ ডেটা জমালে ভবিষ্যতের ফিচার সহজ হবে।

---

**Sequencing logic:** ship Must (1–4) first — they are pure Supabase work, fix the credibility-killing gaps, and lay the data foundation. Should (5–8) layer smart matching and the SMS reach that makes the app useful at 3am. Could (9–11) drive retention and handle the hard rare-group cases. Won't-yet items are tracked, with structured request logging (feature 4) deliberately started now so forecasting/AI become feasible later.

🇧🇩 **বাংলা:** ক্রম: আগে Must (১–৪) — এগুলো শুধু Supabase-এর কাজ, আস্থা নষ্ট করা ত্রুটি সারায় ও ডেটার ভিত্তি গড়ে। এরপর Should (৫–৮) স্মার্ট ম্যাচিং ও SMS যোগ করে, যাতে রাত ৩টায়ও অ্যাপটি কাজে লাগে। তারপর Could (৯–১১)। আর Won't-yet ফিচারগুলো ভবিষ্যতের জন্য রাখা হলো, তবে কাঠামোবদ্ধ ডেটা এখন থেকেই জমানো শুরু।

---

## AI / ML Feature Opportunities

For a small volunteer-run org, the winning strategy is **mostly-Postgres, selectively-Claude, almost-never trained-ML**. Our schema already stores `last_donation_date`, `availability_status`, `is_approved`, and donation history in `donation_records`, and we already compute a 90-day eligibility rule in `src/lib/eligibility.ts` — so the highest-value AI/ML wins are cheap logic-and-prompt features that build on what exists, not models we'd have to train and maintain.

🇧🇩 **বাংলা:** ছোট স্বেচ্ছাসেবী সংস্থার জন্য সবচেয়ে কার্যকর পথ হলো — বেশিরভাগ কাজ Postgres দিয়ে, কিছু নির্দিষ্ট জায়গায় Claude API দিয়ে, আর প্রায় কখনোই নিজে ML মডেল ট্রেন করে নয়। আমাদের ডেটাবেসে যা আছে তার উপরই সস্তা ও দ্রুত ফিচার বানানো সবচেয়ে বুদ্ধিমানের কাজ।

### How to read "build with what"

| Approach | Means | Cost shape | Maintenance |
| --- | --- | --- | --- |
| **Postgres / heuristic** | SQL functions, RPCs, indexes, scheduled jobs (`pg_cron` / Vercel cron) | Effectively free | Trivial — it's just our DB |
| **Claude API** | `@anthropic-ai/sdk` from a Next.js route handler / server action | Per-token, controllable with caching + model choice | Low — no model to host |
| **Small / trained model** | ARIMA/Prophet/LSTM in a separate Python job | Infra + MLOps overhead | High — disproportionate at our scale |

🇧🇩 **বাংলা:** Postgres-ভিত্তিক ফিচার কার্যত বিনামূল্যে ও সহজে রক্ষণাবেক্ষণযোগ্য; Claude API টোকেন-প্রতি খরচ কিন্তু মডেল হোস্ট করতে হয় না; নিজে ট্রেন করা ML মডেল আমাদের আকারের জন্য অপ্রয়োজনীয় বোঝা।

### Current Claude model IDs (relevant for the chatbot & NLP features)

Verified against the live Anthropic model catalog (cached 2026-05-26). Use the **exact** ID strings — do not append date suffixes.

| Model | Model ID | Context | Input $/1M | Output $/1M | Use here for |
| --- | --- | --- | --- | --- | --- |
| Claude Opus 4.8 | `claude-opus-4-8` | 1M | $5.00 | $25.00 | Hard one-off reasoning (rare) |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | 1M | $3.00 | $15.00 | Quality chatbot + NLP parsing |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 | Cost-sensitive chatbot / parsing |

- **Bengali quality is strong**, which makes a bilingual assistant genuinely viable. On a public Bengali benchmark, Claude Opus 4.6 scored ~92 and Sonnet 4.6 ~91 (top-5, alongside Gemini and GPT-5). *Caveat: those scores were measured on the 4.6 generation; treat them as evidence the model family handles Bangla well, not as an exact 4.8 figure.*
- **Structured outputs** (`output_config.format` with a JSON schema, or strict tool use) are GA on Opus 4.8 / Sonnet 4.6 / Haiku 4.5 — this is the clean mechanism for the NLP request parser.
- **Prompt caching** makes a fixed system prompt (eligibility rules + 8×8 compatibility chart) cost ~0.1× on cache reads — important for keeping a chatbot affordable.

🇧🇩 **বাংলা:** Claude বাংলা ভালো বোঝে, তাই দ্বিভাষিক সহায়ক বানানো বাস্তবসম্মত। খরচ কমাতে Haiku 4.5 বা Sonnet 4.6 ব্যবহার করুন এবং eligibility/compatibility নিয়মগুলো system prompt-এ রেখে prompt caching চালু করুন — তাতে বারবার একই নিয়ম পাঠানোর খরচ প্রায় ১০ ভাগের ১ ভাগে নেমে আসে।

### The ranked plan (value vs. effort)

| Rank | Feature | Value | Effort | Recommended approach |
| --- | --- | --- | --- | --- |
| 1 | **Smart matching & ranking** | High | Low–Med | **Postgres** (RPC + compatibility lookup) |
| 2 | **Fraud / paid-donor / duplicate detection** | High (safety) | Low–Med | **Postgres** heuristics + phone OTP (+ optional Claude classifier) |
| 3 | **Structured request logging + NLP parsing** | High | Med | **Claude** structured output → new columns |
| 4 | **Smart-reminder timing** | High | Low | **Postgres** scheduled job on eligibility boundary |
| 5 | **Bilingual AI assistant / chatbot** | Med–High | Med | **Claude** (Haiku 4.5 / Sonnet 4.6) |
| 6 | **OCR / NID verification** | Med | Med–High | **Claude vision** or OCR service — optional only |
| 7 | **Churn / retention modelling** | Low–Med (now) | High | **Postgres** heuristic now; defer ML |
| 8 | **Demand / shortage forecasting** | Med (later) | High | **Defer** — log data first, then a simple baseline |

🇧🇩 **বাংলা:** আগে করুন ১–৪ নম্বর (সস্তা, বড় প্রভাব, সবকিছুর ভিত্তি তৈরি করে), তারপর ৫–৬ (Claude-ভিত্তিক), আর ৭–৮ পরে — যখন যথেষ্ট ডেটা জমবে।

---

### 1. Smart matching & ranking — do this first

Today donor search is a naive exact match (`blood_type` equality + `location ILIKE '%...%'`, ordered newest-first) — no blood-compatibility expansion, no distance, no ranking. The single biggest UX win needs **zero ML**: a server-side ranking RPC.

- **What it does:** expand compatibility (e.g. an O− patient can receive only O−, but an O+ patient can receive O+/O−; AB+ accepts all), then score candidates by eligibility/recency (the 90-day rule we already have), availability, location proximity, and responsiveness (derived from `blood_requests` accept times).
- **Data needed:** a static 8×8 compatibility lookup (no new data); optionally a `lat`/`lng` (or structured division/district) column for distance, since `location` is currently free text.
- **Difficulty:** Low–Medium. A `SECURITY DEFINER` Postgres function fits our existing RLS pattern; use `earthdistance`/PostGIS only if/when we add coordinates.
- **Recommendation:** **Postgres, no model.** Compatibility expansion alone dramatically widens the visible pool for hard groups.

🇧🇩 **বাংলা:** এখনকার সার্চ শুধু হুবহু মিল খোঁজে; রক্তের গ্রুপ-সামঞ্জস্য, eligibility, দূরত্ব ও সাড়া দেওয়ার হার মিলিয়ে একটি র‍্যাঙ্কিং RPC বানালেই সবচেয়ে বড় উন্নতি হবে — কোনো ML লাগবে না, শুধু SQL।

### 2. Fraud / paid-donor / duplicate detection — the safety feature

Bangladesh's paid-donor problem is real and dangerous (historically a large share of supply came from professional donors, with far higher infection rates — e.g. ~29% HBsAg vs ~4% in voluntary donors in an older study). Detecting abuse protects patients and the platform's legitimacy.

- **What it does:** flag one phone/identity tied to many donor profiles, abnormally frequent "donations", fuzzy-duplicate names, and (optionally) solicitation/payment language in request `notes`.
- **Data needed:** normalized phone (strip `+880`/leading `0`); `pg_trgm` for fuzzy name/phone matching; phone-OTP verification to make numbers real. We currently have **no** OTP and no NID.
- **Difficulty:** Low–Medium. Mostly unique/partial indexes, normalization, and counts — feeding flags into the **existing admin approval queue**, never auto-banning.
- **Recommendation:** **Postgres heuristics + OTP**, with an *optional* Claude classifier on `notes` for paid-solicitation language. Keep a human in the loop.

🇧🇩 **বাংলা:** টাকার বিনিময়ে রক্তদান রোগীদের জন্য বিপজ্জনক। একই ফোন বহু প্রোফাইলে, অস্বাভাবিক ঘন ঘন "দান", বা টাকা চাওয়ার ভাষা — এসব Postgres নিয়ম দিয়ে ধরা যায়; OTP যাচাই যোগ করলে নকল নম্বর কমবে। সিদ্ধান্ত নেবে admin, স্বয়ংক্রিয় ব্যান নয়।

### 3. NLP parsing of free-text urgent requests

Requesters paste messy bilingual text like *"Urgent! B+ 2 bag lagbe, Dhaka Medical, kalker moddhe"*. Our `blood_requests` table has only a free-text `notes` field — no structured `blood_type`/`units`/`hospital`/`urgency`/`deadline`.

- **What it does:** extract `{blood_group, units, hospital, location, urgency, deadline}` from free text at submission time, populating new structured columns.
- **Data needed:** none upfront — just a JSON schema. This feature is what *creates* the clean historical data that forecasting (rank 8) would later need.
- **Difficulty:** Medium (schema migration + one Claude call per submitted request).
- **Recommendation:** **Claude structured output** (`output_config.format`) on **Sonnet 4.6** for quality or **Haiku 4.5** for cost. Validate the parsed fields and let the user confirm before saving.

🇧🇩 **বাংলা:** মানুষ এলোমেলো বাংলা-ইংরেজি মিশিয়ে অনুরোধ লেখে। Claude দিয়ে সেখান থেকে গ্রুপ, ব্যাগ সংখ্যা, হাসপাতাল, এলাকা ও জরুরিতা আলাদা করে গুছিয়ে নিলে স্বয়ংক্রিয় রাউটিং সহজ হয় — আর এই গোছানো ডেটাই পরে ফোরকাস্টিং-এর ভিত্তি।

### 4. Smart-reminder timing — heuristic beats a churn model

We already know exactly when each donor becomes eligible again (`last_donation_date` + 90 days). The evidence-backed retention win is a precisely-timed "you're eligible again" nudge, **not** an over-engineered churn model. Mistimed contact backfires, so the eligibility boundary is the right trigger.

- **What it does:** a scheduled job emails/SMSes donors when they cross eligibility, and re-engages eligible-but-inactive donors.
- **Data needed:** the fields we already have, plus a notification channel (we have none today — SMS is the near-universal channel in Bangladesh).
- **Difficulty:** Low. `pg_cron` or a Vercel cron route; Claude is optional only to personalize message copy bilingually.
- **Recommendation:** **Postgres scheduled job.** Pure logic.

🇧🇩 **বাংলা:** কে কবে আবার রক্ত দিতে পারবে তা আমরা ইতিমধ্যেই হিসাব করি। ঠিক সেই দিনে "আপনি আবার রক্ত দিতে পারবেন" বার্তা পাঠানোই সবচেয়ে কার্যকর — জটিল churn মডেলের দরকার নেই। চাইলে Claude দিয়ে বার্তাটি বাংলায় ব্যক্তিগত করা যায়।

### 5. Bilingual AI assistant / chatbot (Bangla + English)

A bounded, low-risk assistant that handles **eligibility screening** (age/weight/90-day interval/recent illness), **"who can donate to whom"** compatibility Q&A, and **guidance for panicked requesters**. It reduces admin load without making clinical decisions.

- **What it does:** answer informational questions in Bangla or English; pre-screen self-reported eligibility.
- **Data needed:** a system prompt encoding eligibility rules + the compatibility chart (cache it).
- **Difficulty:** Medium — a Next.js route handler calling `@anthropic-ai/sdk`.
- **Recommendation:** **Claude — Haiku 4.5** ($1/$5) for cost or **Sonnet 4.6** ($3/$15) for quality, with the rules cached via prompt caching (reads ~0.1×). **Keep it informational** with a clear "not medical advice — final screening happens at the blood bank" disclaimer, and **never let it auto-approve donors**.

🇧🇩 **বাংলা:** একটি দ্বিভাষিক সহায়ক — কে রক্ত দিতে পারবেন (বয়স/ওজন/৯০ দিনের নিয়ম), কোন গ্রুপ কাকে দিতে পারে, এবং আতঙ্কিত অনুরোধকারীদের পরামর্শ — admin-এর চাপ কমাবে। তবে এটি চিকিৎসা পরামর্শ নয়; চূড়ান্ত যাচাই ব্লাড ব্যাংকে, আর এটি কখনোই নিজে ডোনার অনুমোদন করবে না।

### 6. OCR / NID verification — optional trust booster only

A "verified" badge deters fake/paid donors from the identity side. Bangladesh has an official eKYC API (Porichoy), commercial OCR (PixDynamics, Brain Station 23), and open-source stacks (Tesseract+OpenCV).

- **What it does:** optionally read an NID image to prefill name/number and set a verified flag.
- **Data needed:** an uploaded NID image — high PII sensitivity. Store only a **hash / verified-flag**, not the raw image.
- **Difficulty:** Medium–High (friction, cost, privacy; Porichoy access is gated to banks/fintech, so a reseller or self-hosted OCR is more realistic for us).
- **Recommendation:** **Optional, incentivized — never mandatory.** Easiest path is Claude vision (or a dedicated OCR service) to prefill, then discard the image. Mind RLS/PII.

🇧🇩 **বাংলা:** NID যাচাই করে "verified" ব্যাজ দিলে নকল/পেইড ডোনার কমে। তবে NID ছবি অত্যন্ত সংবেদনশীল — মূল ছবি না রেখে শুধু hash/verified-flag রাখুন। এটি বাধ্যতামূলক নয়, ঐচ্ছিক ও উৎসাহমূলক রাখুন।

### 7. Churn / retention modelling — heuristic now, ML later

Donor churn is well-studied (survival analysis, Markov models), but those studies are from other countries (e.g. Zimbabwe), and at our scale a trained model is overkill. A simple Postgres heuristic — *eligible AND inactive for N days* — beats an MLOps pipeline today.

- **Recommendation:** **Postgres heuristic now.** Revisit a real churn model only after substantial donation history accrues.

🇧🇩 **বাংলা:** "যোগ্য কিন্তু N দিন নিষ্ক্রিয়" — এই সহজ নিয়মই এখন যথেষ্ট। যথেষ্ট ডেটা জমলে তবেই ML মডেল ভাবা যাবে।

### 8. Demand / shortage forecasting — defer, but log now

Forecasting shortages by area + blood group is proven in the literature (ARIMA/LSTM/Prophet), but it needs **months of granular historical request data we don't yet collect**. *Note: published error figures vary widely by study and granularity — don't anchor on a single number.*

- **Recommendation:** **Defer.** The prerequisite is feature #3 (structured request logging) — start capturing `{blood_group, area, timestamp, fulfilled?}` now. Once 6–12 months exist, begin with a **simple seasonal moving-average baseline per area+group** before reaching for Prophet/ARIMA; skip deep learning unless volume justifies it.

🇧🇩 **বাংলা:** এলাকা ও গ্রুপ অনুযায়ী চাহিদা পূর্বাভাস কার্যকর, কিন্তু এর জন্য কয়েক মাসের গোছানো ডেটা দরকার যা এখনো নেই। তাই এখনই ৩ নম্বর ফিচার দিয়ে ডেটা জমানো শুরু করুন; ৬–১২ মাস পর সহজ মুভিং-এভারেজ দিয়ে শুরু করে তারপর প্রয়োজনে উন্নত মডেল।

---

### Bottom line: what to build first

1. **Smart-match ranking RPC** (Postgres) — biggest UX gain, no ML.
2. **Fraud/duplicate heuristics + phone OTP** (Postgres) — the safety feature.
3. **Structured request columns + Claude NLP parser** — unblocks everything downstream, including forecasting.
4. **Eligibility-boundary reminders** (Postgres cron) — cheap retention win.

Then layer on the **bilingual Claude chatbot** (Haiku 4.5 / Sonnet 4.6, rules cached), make **OCR/NID verification optional**, and treat **churn-ML and forecasting as later-stage** once data has accrued.

🇧🇩 **বাংলা:** সংক্ষেপে — আগে Postgres-ভিত্তিক ম্যাচিং র‍্যাঙ্কিং, জালিয়াতি/ডুপ্লিকেট সনাক্তকরণ + OTP, গোছানো অনুরোধ-ডেটা + Claude NLP পার্সার, এবং eligibility-ভিত্তিক রিমাইন্ডার। তারপর দ্বিভাষিক Claude চ্যাটবট, ঐচ্ছিক NID যাচাই, আর সবশেষে — ডেটা জমলে — churn ও ফোরকাস্টিং মডেল।

---

## AI in Blood Supply — Global Case Studies & What We Can Realistically Build

This section turns the AI case-study research into a practical, build-or-skip guide for **blood-finder** — an independent, low-budget, peer-to-peer blood-*donor*-finder for Bangladesh (Next.js 16, React 19, Supabase, Vercel) that connects requesters to volunteer donors and never collects, stores, or delivers blood. The headline: most published "AI in blood" wins are *forecasting and inventory* systems that need hospital/blood-bank data we do not have; the parts that transfer to us are a few targeted, cheap uses of the **Claude API** plus "AI-lite" Postgres heuristics. Treat all vendor impact numbers below as self-reported, not audited.

🇧🇩 **বাংলা:** এই অংশটি AI কেস-স্টাডি গবেষণাকে একটি ব্যবহারিক "কী বানাবো / কী বানাবো না" গাইডে রূপান্তর করে — blood-finder–এর জন্য, যা একটি স্বাধীন, কম-বাজেটের, পিয়ার-টু-পিয়ার রক্তদাতা-খোঁজার অ্যাপ (রক্ত সংগ্রহ/সংরক্ষণ/সরবরাহ করে না)। মূল কথা: প্রকাশিত বেশিরভাগ "রক্তে AI" সাফল্য হলো পূর্বাভাস ও ইনভেন্টরি সিস্টেম, যেগুলোর জন্য হাসপাতাল/ব্লাড-ব্যাংকের ডেটা দরকার যা আমাদের নেই; আমাদের জন্য যা প্রযোজ্য তা হলো Claude API–এর কিছু লক্ষ্যভিত্তিক সস্তা ব্যবহার এবং Postgres হিউরিস্টিক "AI-lite"।

### 1. Real-world AI uses in blood supply (with confidence flags)

The table below summarizes documented AI/ML uses. The **Confidence** column flags how trustworthy the *reported impact* is, and **Transfer to us** marks whether it is realistically buildable for an independent BD donor-finder.

🇧🇩 **বাংলা:** নিচের সারণিতে নথিভুক্ত AI/ML ব্যবহারের সারসংক্ষেপ দেওয়া হলো। "Confidence" কলামটি জানায় রিপোর্ট করা ফলাফল কতটা নির্ভরযোগ্য, আর "Transfer to us" বলে দেয় আমাদের অ্যাপের জন্য এটি বাস্তবে বানানো সম্ভব কিনা।

| Use case | Who does it | Technique | Reported impact (confidence) | Transfer to us |
|---|---|---|---|---|
| Donor **return / churn** prediction | Kaohsiung Blood Center (Taiwan); various studies | XGBoost / LightGBM / **CatBoost** on RFM history (recency, frequency, months since first/last donation) | ~0.81 accuracy, CatBoost best; "return interval" + "donation location" most predictive (**medium** — single-center) | Later (needs our own history first) |
| Reminder **timing** (when to nudge) | Gemelli et al., *Transfusion* 2021 (RCT, n=1,676) | RCT on notification timing — no ML | Reminder **~1 week before deferral ends** is most effective; reminder vs control OR≈2.01 (**high**) | **Now** — plain SQL + cron, no ML |
| Reminder **channel** (SMS vs phone) | Guangzhou RCT, *BMC Public Health* 2020 (n=11,880 inactive donors) | RCT — no ML | SMS prompts faster return and is far cheaper (¥0.7 vs ¥3.9); **phone calls were *more* effective** among compliers (**high**) | **Now** — informs our SMS-first design |
| Donor–opportunity **matching / ranking** | Facebook Blood Donations (McElfresh et al., EC'20 / *Nature Machine Intelligence*) | Online bipartite matching on response probability + distance | **+5% relative** donor *action* in a pilot (3.7%→3.9%), 5–10% in simulation; "action" used as a **proxy** for donations (**high**, but proxy metric) | **Adapt** — distance-aware SQL ranking, no ML |
| Eligibility / FAQ **chatbot** | American Red Cross "Clara" | Conversational bot (eligibility, 100+ medications, scheduling) | ~20,000 users/month, ~90% of medication Qs answered (**medium** — self-reported); launched **~2021**, vendor/LLM stack **not disclosed** | **Now** — LLM via Claude API |
| Demand / shortage **forecasting** | Canadian Blood Services; Tema General Hospital (Ghana); LifeBank + benshi.ai | ARIMA / Prophet / LSTM / KNN / ELM time-series + ML | CBS: ML best with ~2 yrs data, ARIMA fine with ~8 yrs, **all models miss demand peaks**; Ghana KNN 12.55% error (**high** for studies; LifeBank's own numbers **low**) | **Needs partnership** (we hold no inventory) |
| Inventory optimization / last-mile logistics | LifeBank "Nerve" + benshi.ai | Predictive analytics on stock | "over 2,500 customers" — *clients, not donors*; LifeBank is broad medical-supply logistics (**low** — self-reported) | **Not feasible** (out of scope by design) |
| Free-text **NLP parsing** of requests | Adjacent domains; our own opportunity | LLM structured extraction | Established as a pattern; no blood-specific benchmark (**medium**) | **Now** — Claude API |
| Fraud / paid-donor / spam detection | Little published blood-specific ML | Heuristics dominate; optional LLM classifier | No robust numbers (**low / inference**) | **Now** — Postgres rules + optional LLM |
| Computer-vision / OCR ID verification | Adjacent KYC domains | Cloud OCR / LLM vision | N/A for blood (**low**) | Adapt later (privacy cost; defer behind phone OTP) |

🇧🇩 **বাংলা:** সবচেয়ে নির্ভরযোগ্য (peer-reviewed) ফলাফলগুলো হলো রিমাইন্ডার টাইমিং, SMS-বনাম-ফোন চ্যানেল, এবং ম্যাচিং পাইলট। ভেন্ডর-রিপোর্টেড সংখ্যাগুলো (Facebook ৭ কোটি সাইন-আপ, LifeBank "২৫০০ গ্রাহক", Clara "২০,০০০/মাস") যাচাই-অনিরীক্ষিত — সাবধানে ব্যবহার করুন।

> **Research corrections worth carrying forward:** (1) The "~1 week before deferral ends" finding is from Gemelli 2021, **not** the Guangzhou RCT — do not conflate them, and do not claim "SMS is most effective" (phone beat SMS on effectiveness in Guangzhou). (2) Clara launched **~2021** (not 2024); calling it "LLM-based" is an inference, not a disclosed fact. (3) The matching pilot's "+5%" is **donor action**, a proxy, not measured donations.
>
> 🇧🇩 **বাংলা:** গুরুত্বপূর্ণ সংশোধন: (১) "ডিফারাল শেষের ~১ সপ্তাহ আগে" তথ্যটি Gemelli 2021–এর, Guangzhou RCT–এর নয়; এবং "SMS সবচেয়ে কার্যকর" বলা ভুল (Guangzhou-তে ফোন কল বেশি কার্যকর ছিল)। (২) Clara চালু হয় ~২০২১, ২০২৪ নয়; "LLM-ভিত্তিক" বলা অনুমান মাত্র। (৩) ম্যাচিং পাইলটের "+৫%" হলো donor *action* (প্রক্সি), প্রকৃত রক্তদান নয়।

### 2. The realistic build ranking for blood-finder

We rank by **buildable now → AI-lite heuristics → later/with-data**, and explicitly mark difficulty, the data each needs, and what *not* to build.

🇧🇩 **বাংলা:** আমরা র‍্যাঙ্ক করেছি "এখনই বানানো যায় → AI-lite হিউরিস্টিক → পরে/ডেটা জমলে" — প্রতিটির জন্য কঠিনতা, প্রয়োজনীয় ডেটা, এবং কী বানানো *উচিত নয়* তা স্পষ্টভাবে দেওয়া হলো।

#### (a) Quick wins via the Claude API (build now)

These are genuine "AI" features that need no training data and no partnership — just well-scoped prompts and our existing Supabase data. **Current model IDs and pricing (per 1M tokens):** `claude-haiku-4-5` (200K context, **$1 in / $5 out**) — the right default for cheap, high-volume parsing and chat; `claude-sonnet-4-6` ($3 / $15) for harder reasoning; `claude-opus-4-8` ($5 / $25) only when correctness dominates cost. Use `claude-haiku-4-5` as our budget default. Use streaming for the chatbot, cache the system prompt (Bangladesh eligibility rules) so repeated calls bill the cached prefix at ~0.1×, and always set a `max_tokens` cap.

🇧🇩 **বাংলা:** এগুলো প্রকৃত "AI" ফিচার যেগুলোর জন্য কোনো ট্রেনিং-ডেটা বা পার্টনারশিপ লাগে না। বর্তমান মডেল ও দাম (প্রতি ১০ লক্ষ টোকেন): `claude-haiku-4-5` (২০০K কনটেক্সট, **$১ ইন / $৫ আউট**) — সস্তা ও বেশি-ভলিউমের পার্সিং ও চ্যাটের জন্য ডিফল্ট; কঠিন কাজে `claude-sonnet-4-6` ($৩/$১৫); শুধু নির্ভুলতা সবচেয়ে জরুরি হলে `claude-opus-4-8` ($৫/$২৫)। সিস্টেম-প্রম্পট (বাংলাদেশের যোগ্যতার নিয়ম) ক্যাশ করুন এবং `max_tokens` সীমা দিন।

| Quick win | What it does | Difficulty | Data needed | Notes / guardrails |
|---|---|---|---|---|
| **Bangla + English eligibility / compatibility chatbot** | Answers "B+ কে রক্ত দিতে পারে?", weight/age/interval/deferral questions, ABO–Rh compatibility, in either language | Low–Medium | Curated FAQ + national donor-eligibility rules in the system prompt; our `src/lib/eligibility.ts` (90-day window) as ground truth | `claude-haiku-4-5`; **frame as pre-screening guidance, not medical clearance**; cache the rules prompt; hand off edge cases; cap `max_tokens` and cache common answers for weak/expensive data |
| **NLP parsing of free-text urgent requests** | Turns "B+ lagbe urgent, Dhaka Medical er pashe, 2 bag" into structured `{blood_group, component, units, district, hospital, urgency}` and normalizes Banglish | Low | One Claude call per new request; a district/upazila list to normalize against | `claude-haiku-4-5`; **directly fixes our free-text-location gap** and feeds the SQL ranking in (b); add a deterministic fallback (regex + the dropdown) for failed/offline calls |
| **Smart de-dup / spam / paid-donor flags** | Classifies new posts: "is this soliciting *paid* donation?", near-duplicate repost, fake-looking profile | Low | Request/post text; phone/IP from our own tables | `claude-haiku-4-5` as a scorer **on top of** the Postgres rules in (b); never auto-delete — flag for the admin queue we already have |

🇧🇩 **বাংলা:** চ্যাটবটটি অবশ্যই "পূর্ব-যাচাই পরামর্শ" হিসেবে উপস্থাপন করতে হবে, চিকিৎসা-ছাড়পত্র নয়। ফ্রি-টেক্সট পার্সিং আমাদের লোকেশন-সমস্যা সরাসরি সমাধান করে এবং নিচের (b)-এর র‍্যাঙ্কিংকে শক্তি দেয়। স্প্যাম/পেইড-ডোনার ক্লাসিফায়ার কখনো স্বয়ংক্রিয়ভাবে মুছবে না — শুধু অ্যাডমিন কিউতে ফ্ল্যাগ করবে।

#### (b) AI-lite: simple Postgres / heuristic logic (build now, highest ROI)

These need **no LLM and no model training** — just schema fields and queries on Supabase. They capture nearly all the practical value of the published "matching" and "retention" AI at a fraction of the cost, and they should ship *before* the LLM features.

🇧🇩 **বাংলা:** এগুলোর জন্য কোনো LLM বা মডেল-ট্রেনিং লাগে না — শুধু Supabase-এ স্কিমা ফিল্ড ও কোয়েরি। প্রকাশিত "ম্যাচিং" ও "রিটেনশন" AI-এর প্রায় সব ব্যবহারিক মূল্য এগুলো খুব কম খরচে দেয়, এবং LLM ফিচারের *আগে* এগুলো বানানো উচিত।

| AI-lite feature | Heuristic | Difficulty | Data needed | Maps to which "AI" |
|---|---|---|---|---|
| **Smart donor ranking** | Score candidates by distance + recency-of-availability + past responsiveness; surface "recently confirmed" first | Low | `last_donation_date`, `is_available`, `last_confirmed_at`, structured district/upazila | Replaces Facebook/McElfresh ML matching with SQL |
| **Eligibility-aware matching** | Auto-hide donors inside their interval; compute `eligible_from = last_donation_date + interval` and filter search + alerts | Low | `last_donation_date` + interval (our `eligibility.ts`) | The cheap, deterministic core of every donor app |
| **Reminder timing** | Fire one well-timed nudge ~1 week before a donor becomes eligible again (cron on Vercel) | Low | `last_donation_date` only | The Gemelli 2021 RCT finding — pure date math, no churn model |
| **Anti-fatigue throttling** | Rank + wave-based alerting with per-donor cooldown (`last_alerted_at`), not mass blasts | Low–Medium | Alert log per donor | What FB's ML notification-throttling achieves, done with rules |

> **Why heuristics over ML here:** simple rules (group match, distance, cooldown, recency, responsiveness) capture nearly all the value at our scale, cost nothing per call, and avoid the donor-fatigue failure mode. Label app-side "eligible" as **available**, not *medically cleared* — only a clinic can clear medically.
>
> 🇧🇩 **বাংলা:** আমাদের স্কেলে সরল নিয়ম (গ্রুপ-ম্যাচ, দূরত্ব, কুলডাউন, সাম্প্রতিকতা, রেসপন্স-রেট) প্রায় সব মূল্য দেয়, প্রতি-কলে কোনো খরচ নেই, এবং ডোনার-ক্লান্তি এড়ায়। অ্যাপ-সাইডের "eligible" মানে **available**, "চিকিৎসাগতভাবে উপযুক্ত" নয় — সেটি শুধু ক্লিনিক বলতে পারে।

#### (c) Later / with-data: real ML (defer)

These are real, peer-reviewed techniques — but they need accumulated history or supply data we will not have for a long time. Build them *only after* (a) and (b) have run long enough to generate clean data.

🇧🇩 **বাংলা:** এগুলো প্রকৃত, peer-reviewed কৌশল — কিন্তু এর জন্য জমা-হওয়া ইতিহাস বা সাপ্লাই-ডেটা দরকার যা বহুদিন আমাদের থাকবে না। (a) ও (b) যথেষ্ট সময় চলার *পরেই* এগুলো বানান।

| Later feature | Difficulty | Data needed | Verdict |
|---|---|---|---|
| **Donor churn / return ML** (CatBoost/XGBoost) | Medium–High | Years of real return/no-return events per donor | Defer. Start with the heuristic timing rule in (b); beware tiny single-source datasets |
| **Demand / shortage forecasting** | High | Blood-bank inventory + transfusion data | **Needs partnership** — we hold no inventory; this is blood-bank/Red-Cross territory |
| **Inventory optimization / logistics** (LifeBank Nerve) | High | Supply chain, hospital customers, delivery fleet | **Not feasible / out of scope** — we never touch blood units |

#### What NOT to build yet

- **Do not build demand/inventory forecasting or logistics ML** — out of scope and partnership-dependent.
- **Do not train a churn model early** — you lack the history; a one-line SQL "nudge ~1 week before eligible" beats a model trained on thin data.
- **Do not give the chatbot authoritative medical-eligibility decisions** — guidance only, with clear disclaimers.
- **Do not auto-act on spam/fraud classifier output** — flag to the admin queue, never auto-delete.
- **Do not default to OCR/NID verification** — start with phone OTP; OCR adds privacy, storage, and trust cost for marginal gain.
- **Do not reach for `claude-opus-4-8` for routine parsing/chat** — `claude-haiku-4-5` is the budget-correct default; reserve Sonnet/Opus for hard cases.

🇧🇩 **বাংলা:** এখনই বানাবেন না: চাহিদা/ইনভেন্টরি পূর্বাভাস বা লজিস্টিক্স ML (পরিসরের বাইরে, পার্টনারশিপ-নির্ভর); শুরুতেই চার্ন-মডেল (ইতিহাস নেই — সরল SQL রিমাইন্ডারই যথেষ্ট); চ্যাটবটকে চূড়ান্ত চিকিৎসা-যোগ্যতার সিদ্ধান্ত (শুধু পরামর্শ + ডিসক্লেইমার); স্প্যাম/ফ্রড আউটপুটে স্বয়ংক্রিয় ব্যবস্থা (শুধু অ্যাডমিন-ফ্ল্যাগ); ডিফল্ট OCR/NID যাচাই (আগে ফোন OTP); রুটিন পার্সিং/চ্যাটে `claude-opus-4-8` (বাজেট-ডিফল্ট হলো `claude-haiku-4-5`)।

### 3. Bottom line

For an independent, SMS-era, low-end-Android BD app, "AI" should mean a few cheap, well-scoped **Claude API** calls (`claude-haiku-4-5` default) — a Bangla/English eligibility chatbot, free-text request parsing, and a spam/paid-donor flagger — sitting on top of **AI-lite Postgres heuristics** (eligibility-aware ranking, reminder timing, anti-fatigue throttling) that do the heavy lifting deterministically and for free. Genuine ML (forecasting, churn) is a *later* concern, and inventory/logistics AI is simply not our problem to solve.

🇧🇩 **বাংলা:** একটি স্বাধীন, SMS-যুগের, লো-এন্ড অ্যান্ড্রয়েড বাংলাদেশি অ্যাপের জন্য "AI" মানে হওয়া উচিত কয়েকটি সস্তা, সুনির্দিষ্ট **Claude API** কল (`claude-haiku-4-5` ডিফল্ট) — বাংলা/ইংরেজি যোগ্যতা চ্যাটবট, ফ্রি-টেক্সট রিকোয়েস্ট পার্সিং, ও স্প্যাম/পেইড-ডোনার ফ্ল্যাগার — যেগুলো **AI-lite Postgres হিউরিস্টিকের** (যোগ্যতা-সচেতন র‍্যাঙ্কিং, রিমাইন্ডার টাইমিং, অ্যান্টি-ফ্যাটিগ থ্রটলিং) উপরে বসে; ভারী কাজটা ওই হিউরিস্টিকই বিনামূল্যে করে। প্রকৃত ML (পূর্বাভাস, চার্ন) *পরের* বিষয়, আর ইনভেন্টরি/লজিস্টিক্স AI আমাদের সমস্যাই নয়।

---

## UI/UX, Interactivity, Animation & the Bangladesh Map

This section is a concrete, build-ready plan for the visual and interactive layer of **blood-finder**. It is scoped to our real stack — Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS v4, Supabase/Postgres, Vercel — and to our current code (`src/components/DonorSearch.tsx`, `src/app/layout.tsx`, `src/components/home/StatsStrip.tsx`). Today we ship **no map, no charts, no animation library, and Latin-only `Geist` font**; the hero already reads "রক্ত দিন, জীবন বাঁচান" but there is no Bengali web font loaded for it. The goal is high signal, low bundle, and smooth performance on low-end Android.

🇧🇩 **বাংলা:** এই অংশে blood-finder-এর ম্যাপ, চার্ট, অ্যানিমেশন আর বাংলা টাইপোগ্রাফির একটা বাস্তব, সরাসরি বানানো যায় এমন পরিকল্পনা দেওয়া হয়েছে — আমাদের আসল স্ট্যাক (Next.js 16, React 19, Supabase) আর কম দামের অ্যান্ড্রয়েড ফোনের কথা মাথায় রেখে।

---

### 1. The interactive Bangladesh donor map

**Recommendation: an inline SVG choropleth, not a tiled basemap.** At country scale we render a fixed, small feature set — **8 divisions** or **64 districts** — so we do not need pan/zoom over OpenStreetMap tiles. Inline SVG gives the smallest bundle, no API key, no per-load cost, and lets us style fills with Tailwind/CSS and hover with plain CSS.

🇧🇩 **বাংলা:** বাংলাদেশের ম্যাপের জন্য Google/Mapbox-এর মতো টাইল ম্যাপ লাগবে না — মাত্র ৮টা বিভাগ বা ৬৪টা জেলা আঁকতে হবে, তাই হালকা inline SVG-ই সবচেয়ে ভালো: কোনো API key নেই, খরচ নেই, আর কম দামের ফোনেও দ্রুত লোড হয়।

#### Library choice (with React 19 / SSR notes)

| Option | Verdict for us | Why / caveat |
|---|---|---|
| **`@vnedyalk0v/react19-simple-maps`** (fork) | **Primary pick** | Maintained fork of `react-simple-maps` that adds React 19 + ESM + TypeScript. Use this — the original `react-simple-maps` caps its peer dep at React 18 (open issue #367), so it will fight our stack. |
| **Hand-rolled `d3-geo`** (`geoMercator` + `geoPath`) | **Strong fallback** | A few dozen lines, zero map-lib dependency, fully SSR-safe (no `window`). Best if we want total control and minimal deps. |
| **`react-leaflet` / Leaflet** | Only if we later add real pan/zoom basemap | Not SSR-safe (calls `window`); must be loaded via `next/dynamic({ ssr: false })` inside a `'use client'` child, and pulls ~140KB+ of Leaflet CSS/JS. Overkill for a static choropleth. |
| **Mapbox GL / `react-map-gl`** | Avoid for now | Cost beyond 50,000 monthly map loads (~$5/1k after), heavy WebGL bundle. Use MapLibre GL (free OSS fork) only if we genuinely need a tiled basemap later. |
| **deck.gl** | Avoid | WebGL `GeoJsonLayer` is overkill for ~64 polygons. |

🇧🇩 **বাংলা:** React 19-এর সাথে মূল `react-simple-maps` ঠিকমতো চলে না, তাই হয় তার React 19 ফর্কটা ব্যবহার করুন, নয়তো `d3-geo` দিয়ে নিজেরাই কয়েক লাইনে SVG আঁকুন। Leaflet/Mapbox এই কাজের জন্য বাড়াবাড়ি।

#### Where to get the Bangladesh GeoJSON

| Source | What it gives | License |
|---|---|---|
| **`yasserius/bangladesh_geojson_shapefile`** | Clean per-level files: ADM0 outline, **ADM1 = 8 divisions**, **ADM2 = 64 districts**, ADM3 upazilas, plus a pre-simplified `small/` folder | open data |
| **`ifahimreza/bangladesh-geojson`** | `bangladesh.geojson` (~7MB, **upazila-level** polygons) with bilingual fields `district_name` / `district_bn_name` / `division_name` / `division_bn_name` / `name` / `bn_name` | Code MIT; boundaries **CC BY 4.0** (geoBoundaries) |

Important nuance: the `ifahimreza` polygons are **upazila-level**, so to draw an 8-division or 64-district choropleth you must **dissolve/aggregate up**. The bilingual `*_bn_name` fields are the reason to consider it — they let us label districts in Bengali directly. For simplicity, prefer `yasserius` ADM2 (districts) as the base geometry and reuse the bn names.

🇧🇩 **বাংলা:** ম্যাপের ডেটা ফ্রি-তেই পাওয়া যায় (geoBoundaries, CC BY 4.0)। `ifahimreza` ফাইলে জেলা/বিভাগের বাংলা নামও আছে — সেটা দিয়ে ম্যাপে বাংলায় লেবেল দেওয়া যাবে; তবে ওটা উপজেলা-লেভেল, তাই জেলা ম্যাপের জন্য জোড়া দিয়ে বড় করতে হবে।

#### Build step: shrink the geometry (critical for low-end Android)

1. Take `yasserius` ADM2 districts (or dissolve `ifahimreza` upazilas to districts using `mapshaper`).
2. Run through **mapshaper** with **Visvalingam simplification** (keep ~5–10% of vertices — district borders stay readable).
3. **Convert to TopoJSON.** TopoJSON encodes shared borders once as arcs, typically **80–95% smaller** than the equivalent GeoJSON for choropleths (treat the range as directional, not a guarantee).
4. Commit the small artifact (target **sub-100KB**) to `/public` and `fetch` it client-side — it is static and cacheable on Vercel's CDN.

🇧🇩 **বাংলা:** কাঁচা ৭MB ম্যাপ ফাইল কম দামের ফোনে পাঠানো যাবে না। mapshaper দিয়ে ছোট করে TopoJSON-এ রূপান্তর করলে ফাইল ৮০–৯৫% পর্যন্ত ছোট হয় — লক্ষ্য রাখুন ১০০KB-এর নিচে, আর সেটা `/public`-এ রাখুন।

#### Wiring counts from Supabase

Our donor location is currently **unstructured free text** (`donors.location`, searched via `ilike`), so the map cannot join on it reliably yet. The clean path:

- **Add a structured column** `district` (and ideally `division`) to `donors`, populated at `become-donor` time via a dropdown of the 64 districts. This is the single prerequisite that unlocks the map.
- **Pre-aggregate in Postgres** with a view or `RPC`, e.g. counts grouped by `district` + `blood_type`, filtered to `is_approved = true AND availability_status = 'AVAILABLE'` (the exact predicate `DonorSearch.tsx` already uses).
- Join the aggregate to the TopoJSON **by district name/id in the browser**, then color each path by donor count (a sequential red scale) and wire **click-to-filter** so tapping a district sets `DonorSearch`'s `location`/`district` filter.

This also resurfaces a genuinely novel feature for the BD market: an **"N available O+ donors in Dhaka" aggregate view** — cheap to compute, visually compelling, and absent from competitors like Badhan/donatebloodbd.

🇧🇩 **বাংলা:** এখন `location` শুধু ফ্রি টেক্সট, তাই ম্যাপে গোনা যায় না। প্রথমে `district` কলাম যোগ করে become-donor ফর্মে ড্রপডাউন দিন; তারপর Supabase-এ জেলা অনুযায়ী রক্তদাতার সংখ্যা গুনে ম্যাপে রঙ দিন আর জেলায় ট্যাপ করলে সার্চ ফিল্টার হয়ে যাবে।

---

### 2. Charts for blood-group distribution

**Recommendation: Recharts** as a small `'use client'` component for the blood-group breakdown (donut for share, horizontal bar for per-district counts).

| Library | Verdict | Note |
|---|---|---|
| **Recharts** | **Pick** | Declarative, React-first, simplest API, large community; works cleanly as a client component. **React 19 caveat:** older Recharts can fail to render under React 19 — pin a recent Recharts version (its newer releases add React 19 support) and, if needed, add a `react-is` override matching React 19. |
| **Nivo** | Avoid here | Needs Client-Component wrapping on the App Router; more friction than it's worth for a few simple charts. |
| **visx** | Only if we need tiny bundle | Lightest option but you compose primitives by hand — more code. |
| **Chart.js** (`react-chartjs-2`) | OK alternative | Needs `'use client'`; canvas-based. Fine but less idiomatic than Recharts here. |

Feed charts the **same Supabase aggregate** used by the map, and reuse one shared color-token set so the donut, the bars, and the choropleth speak one visual language. Keep charts a client component, never an RSC.

🇧🇩 **বাংলা:** রক্তের গ্রুপ অনুযায়ী ভাগ দেখাতে **Recharts** ব্যবহার করুন (ডোনাট + বার চার্ট) — সহজ, React-বান্ধব। শুধু React 19-এর সাথে নতুন ভার্সন রাখবেন। ম্যাপ আর চার্ট একই রঙ ব্যবহার করলে দেখতে এক রকম লাগবে।

---

### 3. Animation & micro-interactions

**Recommendation: CSS-first, with a thin Framer Motion layer only where it earns its place.** We currently have a basic `animate-pulse` skeleton in `DonorSearch.tsx` and **static** stat numbers in `StatsStrip.tsx` (rendered via `toLocaleString()`). Both can be upgraded cheaply.

| Feature | How | Performance / a11y guardrail |
|---|---|---|
| **Count-up stat tiles** (Verified Donors, Available Now) | Animate the number in `StatsStrip` on first view via a small hook or a tiny lib; trigger on scroll into view | Animate text content only; skip entirely under `prefers-reduced-motion` (render the final number immediately) |
| **Section / card reveals** | Stagger map + section fade-ins | Use CSS `transform`/`opacity` (compositor thread) over JS where possible; cap simultaneous animations |
| **Map hover tooltips** | District name (English + Bengali) + donor count on hover/focus | Must work on **focus**, not just hover, for keyboard/touch; do not rely on color alone |
| **Skeleton loaders** | Extend the existing `animate-pulse` skeleton to the map and charts | Skeletons feel modestly faster than spinners for content-heavy views (treat "20–30% faster" as a heuristic, not a measured constant); spinners only for short discrete actions like a submit button |

**Framer Motion vs CSS:** prefer CSS `transform`/`opacity` for the bulk of motion — they run on the compositor and avoid main-thread jank on cheap phones. Reach for Framer Motion only for orchestrated/staggered sequences. Either way:

- **Always gate motion behind `prefers-reduced-motion`** — reduce to `opacity`/`none`. This is an accessibility requirement, not a nice-to-have.
- **Limit the number of elements animating at once** — JS-driven animation can jank low-end Android when many elements move together.

🇧🇩 **বাংলা:** অ্যানিমেশন বেশিরভাগ CSS দিয়েই করুন (GPU-তে চলে, ফোন আটকায় না); Framer Motion শুধু দরকারি জায়গায়। স্ট্যাট সংখ্যাগুলো "count-up" করে দেখান, লোডিং-এ skeleton রাখুন। তবে যারা কম মোশন চায় (`prefers-reduced-motion`) তাদের জন্য অ্যানিমেশন বন্ধ রাখা **বাধ্যতামূলক**, আর হোভার টুলটিপ যেন কিবোর্ড/টাচেও কাজ করে।

---

### 4. Trust/clarity UX, mobile-first & Bengali typography

#### Trust & clarity patterns

- **Eligibility states without color-alone:** our cards already show a green "Available" vs amber "In Nd" badge from `calculateEligibility`. Keep the **text label** alongside color (color-blind safety) and add an explicit grey **"Unavailable"** state.
- **Verified-donor badge** and **last-active / last-donated** timestamps as freshness signals — directly counters the stale-data problem that plagues every BD directory.
- **Urgency levels** (critical / urgent / normal) on requests, expressed with **color + text + icon**, never color alone.
- **Honest empty states:** `DonorSearch` already does this ("No donors found… Try changing your filters") — extend the same honesty to sparse districts on the map ("No registered donors in this district yet").

🇧🇩 **বাংলা:** বিশ্বাস তৈরির জন্য: "Available/Unavailable" শুধু রঙ নয়, লেখাসহ দেখান; verified ব্যাজ আর "শেষ রক্তদান কবে" দেখালে পুরোনো/ভুয়া তথ্যের সমস্যা কমে। জরুরি অনুরোধে রঙ + লেখা + আইকন তিনটাই রাখুন।

#### Mobile-first for low-end Android

- Ship the **sub-100KB TopoJSON**, lazy-load the map/charts components (they are below the fold), and keep them client-only so they don't block first paint.
- The grid in `DonorSearch` is already responsive (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) — keep that mobile-first discipline for the map/chart panels (full-width on mobile, side-by-side on desktop).
- Provide a **list fallback** for the map (district + count rows) so the feature is usable even if SVG interaction is awkward on tiny screens.

🇧🇩 **বাংলা:** কম দামের অ্যান্ড্রয়েডের জন্য ম্যাপ/চার্ট নিচে থাকলে দেরিতে লোড করুন, ম্যাপ ফাইল ছোট রাখুন, আর মোবাইলে ম্যাপের পাশাপাশি একটা সাধারণ তালিকা (জেলা + সংখ্যা) রাখুন যাতে ছোট স্ক্রিনেও কাজ চলে।

#### Bengali typography (current gap)

`src/app/layout.tsx` loads only `Geist` with `subsets: ["latin"]`, so the Bengali hero text ("রক্ত দিন, জীবন বাঁচান") is currently rendered by a system fallback. Fix this with **`next/font/google`**:

- Add **Hind Siliguri** or **Noto Sans Bengali** with `subsets: ['bengali', 'latin']`, `display: 'swap'`.
- `next/font` **auto self-hosts** (no browser requests to Google), **subsets** the file, and **prevents layout shift** via `size-adjust` fallback metrics — all important for BD network conditions.
- Apply the Bengali font to the `<body>` (or as a CSS variable alongside `Geist`) so both Bengali and Latin render correctly throughout, including the hero, map labels, and stat captions.

🇧🇩 **বাংলা:** এখন শুধু Latin ফন্ট লোড হচ্ছে, তাই হিরোর বাংলা লেখা ঠিকমতো দেখাচ্ছে না। `next/font/google` দিয়ে **Hind Siliguri** বা **Noto Sans Bengali** (`subsets: ['bengali','latin']`, `display:'swap'`) যোগ করুন — এটা নিজে থেকেই ফন্ট হোস্ট করে, ছোট করে, আর লেআউট লাফালাফি ঠেকায়।

---

### What to install

```bash
# Map (pick ONE rendering path)
npm i @vnedyalk0v/react19-simple-maps   # React 19 fork of react-simple-maps
#   …or go dependency-light with just:
npm i d3-geo topojson-client            # hand-rolled SVG choropleth

# Charts
npm i recharts                          # pin a recent (React 19-ready) version

# Animation (optional — CSS-first; add only if you need orchestration)
npm i framer-motion

# Build-time geometry tooling (devDependency, one-time use)
npm i -D mapshaper

# Bengali font: NO install needed — use next/font/google (Hind Siliguri / Noto Sans Bengali)
```

**Prerequisite that is not an npm install:** add a structured `district` (and `division`) column to `donors` + a 64-district dropdown on `become-donor`, and a Supabase view/RPC that aggregates donor counts by district and blood group. Without it, the map and charts have nothing trustworthy to join against.

🇧🇩 **বাংলা:** ইনস্টল তালিকা উপরে দেওয়া। তবে সবচেয়ে জরুরি কাজটা npm-এর নয় — `donors` টেবিলে `district`/`division` কলাম যোগ করা আর become-donor ফর্মে ৬৪ জেলার ড্রপডাউন দেওয়া; এটা না করলে ম্যাপ-চার্টের জন্য নির্ভরযোগ্য ডেটাই থাকবে না।

---

## Technical Architecture, Data Model & Notifications

This section proposes a concrete, staged evolution of the blood-finder data model, search architecture, notification layer, and privacy/RLS posture. Everything below is grounded in our **actual schema** (`supabase-schema.sql`), our types (`src/types/index.ts`), and our eligibility logic (`src/lib/eligibility.ts`). Recommendations stay native to our stack: **Next.js 16 (App Router + server actions)**, **React 19**, **Tailwind v4**, **Supabase (Postgres + Auth + RLS)**, deployed on **Vercel** — no new heavy client libraries unless explicitly justified.

🇧🇩 **বাংলা:** এই অংশে আমাদের বর্তমান ডেটাবেস, সার্চ ব্যবস্থা, নোটিফিকেশন এবং প্রাইভেসি/RLS কীভাবে ধাপে ধাপে উন্নত করা যায় তার একটি বাস্তবসম্মত পরিকল্পনা দেওয়া হলো — সবকিছুই আমাদের প্রকৃত কোড ও স্কিমার উপর ভিত্তি করে।

---

### 1. Where We Are Today (Ground Truth)

A quick honest inventory of the current model, since every recommendation builds on it:

| Area | Current state | Limitation |
|---|---|---|
| **Location** | `donors.location text not null`, `profiles.location text` — free text | No division/district/upazila structure; no coordinates; impossible to do reliable nearby search |
| **Search** | Client-side `.eq('blood_type')` + `.ilike('location', '%…%')`, ordered by `created_at` | Naive exact-match, no ABO/Rh compatibility expansion, no distance, no ranking |
| **Eligibility** | `DONATION_ELIGIBILITY_DAYS = 90`, computed client-side, gender-blind | BD norm is ~120 days (men) / 180 days (women); ineligible donors are shown, not filtered |
| **Requests** | `blood_requests` has only `status`, `notes` (free text) | No structured blood type, units, hospital, urgency, or deadline; strictly 1:1 (`requester_id → donor_id`) |
| **Donor health/consent** | None captured | No DOB/weight/deferral; no consent flag for publishing contact |
| **Verification** | Single admin `is_approved` boolean | No phone OTP, no NID, no trust ladder |
| **Notifications** | None — donors only see requests in the dashboard | No SMS/push/email/WhatsApp; misses the 2am-emergency reality |
| **Audit** | None | No append-only log of status changes, contact reveals, or admin actions |
| **Privacy** | RLS policy `"Profiles of approved donors viewable"` grants **anonymous SELECT on the whole `profiles` row, including `mobile`** | An anon Data-API query can scrape donor phone numbers even though the UI gates them behind login |

🇧🇩 **বাংলা:** এখন লোকেশন শুধু ফ্রি-টেক্সট, সার্চ ক্লায়েন্ট-সাইডে চলে, এলিজিবিলিটি লিঙ্গ-নির্বিশেষে ৯০ দিন, রিকোয়েস্টে গঠনমূলক ফিল্ড নেই, কোনো নোটিফিকেশন নেই — এবং সবচেয়ে বড় ঝুঁকি: RLS নীতির কারণে অনুমোদিত ডোনারের `mobile` অ্যানোনিমাস ভিজিটরও API দিয়ে তুলে নিতে পারে।

> **Highest-priority fix, independent of everything else:** the `"Profiles of approved donors viewable"` policy exposes `profiles.mobile` to `anon` at the API layer. Even though `donor/[id]/page.tsx` gates the rendered number behind `{user && …}`, a raw PostgREST query bypasses the UI. This is the single most important change in this section (see §6).

---

### 2. Structured Location Model

Free-text location is the root cause of weak search. Replace it with a normalized administrative hierarchy plus optional coordinates.

**Recommended schema additions (`donors`, mirrored on `profiles`):**

| Column | Type | Notes |
|---|---|---|
| `division` | `text` (FK to `bd_divisions`) | 8 divisions |
| `district` | `text` (FK to `bd_districts`) | 64 districts |
| `upazila` | `text` (FK to `bd_upazilas`, nullable) | 492 upazilas; optional for finer matching |
| `area` | `text` (nullable) | free-text neighbourhood (e.g. "Mirpur 10") |
| `lat` / `lng` | `double precision` (nullable) | optional, opt-in, for nearby sort |
| `location_label` | `text` (generated) | human-readable cached string for display |

Add three small reference tables (`bd_divisions`, `bd_districts`, `bd_upazilas`) seeded from the freely-licensed **`yasserius/bangladesh_geojson_shapefile`** (adm1/adm2/adm3) or **`ifahimreza/bangladesh-geojson`** — both ship **bilingual `name` / `bn_name` fields** (MIT code, CC BY 4.0 boundary data). Store both English and Bengali names so the UI and search work in either language.

🇧🇩 **বাংলা:** ফ্রি-টেক্সট লোকেশনের বদলে বিভাগ → জেলা → উপজেলা → এলাকা কাঠামো রাখুন, সাথে ঐচ্ছিক lat/lng। রেফারেন্স টেবিলগুলো ওপেন-সোর্স বাংলাদেশ GeoJSON থেকে নিন যেগুলোতে ইংরেজি ও বাংলা দুই নামই আছে।

**Migration path (non-breaking):**
1. Add the new nullable columns; keep `location` temporarily.
2. Replace the `become-donor` / `profile` forms with **cascading dropdowns** (division → district → upazila) — pure Tailwind `<select>`s, no new library.
3. Backfill existing free-text `location` with a one-off script (fuzzy match district names via `pg_trgm`), flag low-confidence rows for admin review.
4. Once backfilled, drop `location` or keep it as `area`.

**`lat`/`lng` is optional, not mandatory.** Most users won't share precise coordinates, and under the **PDPO 2025** real-time geolocation is *sensitive data requiring explicit consent*. Treat coordinates as opt-in and prefer **district/upazila-level matching** as the default — coarse location is both privacy-safer and good enough for the dominant query ("O+ donor in Mirpur").

🇧🇩 **বাংলা:** lat/lng বাধ্যতামূলক নয় — বেশিরভাগ মানুষ সঠিক অবস্থান দিতে চায় না, আর নতুন আইনে রিয়েল-টাইম লোকেশন সংবেদনশীল ডেটা। তাই ডিফল্ট হিসেবে জেলা/উপজেলা পর্যায়ের ম্যাচিংই যথেষ্ট ও নিরাপদ।

---

### 3. Donor Health, Eligibility & Consent Fields

Our `90`-day, gender-blind rule is medically too permissive for Bangladesh (standard is ~4 months for men, ~6 months for women) and we currently *display* ineligible donors instead of ranking them down.

**Add to `donors` (or a linked `donor_health` row):**

| Column | Type | Purpose |
|---|---|---|
| `sex` | `text CHECK (sex in ('M','F'))` | Drives gender-aware interval |
| `date_of_birth` | `date` (nullable) | Age 18–60/65 eligibility check |
| `weight_kg` | `int` (nullable) | ≥45–50 kg eligibility (self-reported, disclaimer) |
| `deferred_until` | `date` (nullable) | Temporary deferral (illness, tattoo, pregnancy) |
| `deferral_reason` | `text` (nullable) | Honest "temporarily unavailable" badge |
| `is_rare` / `phenotype` | `bool` / `text` | Flag O-/AB-/**Bombay (Oh)** — relax the 8-type CHECK to allow rare phenotypes |
| `consent_to_publish_at` | `timestamptz` (nullable) | Explicit PDPO consent before discoverable |
| `phone_visibility` | `text` (`'hidden'｜'on_accept'｜'masked'`) | Donor controls contact exposure |
| `is_paused` | `bool` | Discoverability separate from `availability_status` |
| `deleted_at` | `timestamptz` (nullable) | Soft-delete for self-service erasure |

**Make eligibility gender-aware in `src/lib/eligibility.ts`** — change the flat constant into a small config and pass `sex`:

```ts
export const DONATION_ELIGIBILITY_DAYS = { M: 120, F: 180 } as const
```

🇧🇩 **বাংলা:** ৯০ দিনের একক নিয়ম বাংলাদেশের জন্য ভুল — পুরুষ ১২০ দিন, নারী ১৮০ দিন করুন এবং `sex` ফিল্ড যোগ করুন। সেইসাথে বয়স/ওজন/সাময়িক ডিফারাল, বিরল গ্রুপ (Bombay/Oh) ফ্ল্যাগ, এবং কন্টাক্ট প্রকাশের সম্মতি ও প্রাইভেসি কন্ট্রোল ফিল্ড যোগ করুন।

> Keep `weight`/health fields **self-reported with a clear disclaimer** ("final screening happens at the licensed blood bank"). The app is a *connector*, not a regulated blood bank under the Safe Blood Transfusion Act 2002 — it must never collect, store, type, or transfuse blood. Surface this boundary in the footer/About.

---

### 4. Request Model: Structured + Broadcast

Today `blood_requests` is a 1:1 row with only `notes`. Two upgrades unlock everything else (triage, notifications, future forecasting):

**(a) Add structured columns:**

| Column | Type | Purpose |
|---|---|---|
| `blood_type` | `text` (FK to the 8 enums) | Stop inferring from the donor; enables open broadcasts |
| `component` | `text` (`'WHOLE'｜'PLASMA'｜'PLATELET'`) | Dengue/thalassemia need components, not just ABO |
| `units` | `int` | Bags needed |
| `hospital` | `text` + structured location | Where to donate |
| `urgency` | `text` (`'CRITICAL'｜'URGENT'｜'ROUTINE'`) | Drives notification priority + colour (never colour alone) |
| `needed_by` | `timestamptz` | Deadline → enables request **expiry** |
| `patient_age` / `reason` | optional | Triage context |

**(b) Allow a broadcast (one-to-many) request type.** Make `donor_id` nullable: a row with `donor_id IS NULL` is an **open request** that fans out to matching eligible donors who then *accept in-app*; a row with `donor_id` set is the existing targeted request. This is a pure Supabase + RLS change — no new infra — and directly mirrors Roktalap/Simply Blood's SOS model, which beats the slow "browse-and-call-one" pattern (BD seekers report ~19–24 hours to source a single bag).

🇧🇩 **বাংলা:** রিকোয়েস্টে রক্তের গ্রুপ, কম্পোনেন্ট, ব্যাগ সংখ্যা, হাসপাতাল, জরুরি মাত্রা ও সময়সীমা যোগ করুন। আর `donor_id` কে nullable করে "ব্রডকাস্ট" রিকোয়েস্ট চালু করুন — যেখানে একসাথে অনেক উপযুক্ত ডোনারকে জানানো হবে, তারা অ্যাপেই অ্যাকসেপ্ট করবে। একজন একজন করে ফোন করার চেয়ে এটি অনেক দ্রুত।

A `needed_by` deadline also lets a scheduled job auto-expire stale requests, fixing a known gap (no request expiry today).

---

### 5. Server-Side Search & Ranking (Postgres, not client filter)

Move search from the client into a **Postgres RPC** (`search_donors(...)`) called from a server component / server action. This is the biggest UX win and requires **zero ML**.

**The ranking function should:**

1. **Expand ABO/Rh compatibility** via a static 8×8 lookup (e.g. an O- request also matches… well, O- recipients need O-, but an *O- donor* serves everyone — encode donor→recipient compatibility so an O+ requester sees O+ **and** O- donors instead of exact-match only).
2. **Filter to eligible donors:** `is_approved AND NOT is_paused AND deleted_at IS NULL AND availability_status='AVAILABLE' AND (last_donation_date IS NULL OR now() - last_donation_date >= interval)` and `deferred_until` is past.
3. **Score & order** by: location proximity (district match → upazila match → optional distance) + eligibility freshness + responsiveness (accept-rate from `blood_requests`) + last-active recency.

**Nearby search — two options, both Supabase-native:**

| Approach | When to use | Trade-off |
|---|---|---|
| **District/upazila join (no geo)** | Default — covers the dominant query | Simplest; no extension; coarse but privacy-safe |
| **`earthdistance` + `cube`** | When `lat/lng` exist and a "near me" sort is wanted | Lightweight, built into Postgres; fine for radius/point-distance |
| **PostGIS (`geography`, `ST_DWithin`)** | Only if you later need polygons, true geofencing, or heavy spatial queries | More powerful but heavier; overkill for 64 districts + point distance |

**Recommendation:** start with **structured district/upazila ranking** (no extension needed), add **`earthdistance`** for an optional "nearest donor" sort once coordinates exist. Reserve **PostGIS** for a future phase — it is not justified for a 64-district country-scale point problem.

🇧🇩 **বাংলা:** সার্চ ক্লায়েন্ট থেকে সরিয়ে Postgres RPC-তে নিন। এটি ABO/Rh কম্প্যাটিবিলিটি প্রসারিত করবে, কেবল এলিজিবল ডোনার দেখাবে, এবং দূরত্ব+সাড়াদানের হার অনুযায়ী র‍্যাঙ্ক করবে। শুরুতে জেলা/উপজেলা ম্যাচিংই যথেষ্ট; lat/lng থাকলে হালকা `earthdistance` ব্যবহার করুন — PostGIS এখন দরকার নেই।

---

### 6. Privacy & RLS Implications (Reveal-on-Accept)

The current open-phone model is the app's biggest ethical and safety liability, especially given that women are disproportionately targeted by online harassment in Bangladesh and the PDPO 2025 makes **consent the only safe lawful basis**.

**Concrete RLS / data-model changes:**

1. **Stop returning `mobile` in public/anon queries.** Replace the broad `"Profiles of approved donors viewable"` policy (which exposes the whole row) with a **restricted public view** (e.g. `public_donors`) that selects only `full_name`, structured location, `blood_type`, availability, verified badge, last-active — **never `mobile`/`email`**. Grant `anon`/`authenticated` SELECT on the view, not the base table column.
2. **Reveal-on-accept contact flow.** Phone is shared only after a `blood_request` reaches `status='ACCEPTED'`. The accept flow already exists (`status`, `donor_user_id()` RLS); gate the donor-mobile reveal and `ReceivedRequest.requester.mobile` on the accepted state. Default `DonorWithProfile`/`DonorCard` selects must drop `mobile`.
3. **Donor self-service controls** (`phone_visibility`, `is_paused`, `consent_to_publish_at`, `deleted_at`) honored in both the RPC and RLS — donors can stay listed while never exposing a number.
4. **PDPO data-localization (Article 29):** US-hosted Supabase/Vercel likely does **not** satisfy the requirement for a real-time synchronized in-Bangladesh copy of Bangladeshi personal data (enforcement phases in ~May 2027). Flag this as an architectural risk: evaluate a Bangladesh-region read replica or BD-hosted Postgres mirror, and capture explicit consent at signup. (Confirm with local legal counsel — the "connector is not a blood bank" position is a reasonable inference, not a ruling.)

🇧🇩 **বাংলা:** এখনই RLS পরিবর্তন করে অ্যানোনিমাস ক্যোয়ারি থেকে `mobile` সরান — শুধু নিরাপদ কলামসহ একটি পাবলিক ভিউ দিন। ফোন নম্বর তখনই দেখান যখন ডোনার রিকোয়েস্ট অ্যাকসেপ্ট করবে ("reveal-on-accept")। ডোনারকে নম্বর লুকানো/পজ/মুছে ফেলার নিয়ন্ত্রণ দিন। আর PDPO ২০২৫ অনুযায়ী বাংলাদেশে ডেটার রিয়েল-টাইম কপি রাখার বাধ্যবাধকতা একটি বড় স্থাপত্যগত ঝুঁকি — এটি বিবেচনায় নিন।

---

### 7. Notification & Audit Tables

Add two tables that make the system observable and trustworthy:

**`notifications`** — every outbound message and its delivery state:

| Column | Type |
|---|---|
| `id` | `uuid` |
| `user_id` | `uuid` (recipient) |
| `channel` | `text` (`'SMS'｜'PUSH'｜'EMAIL'｜'WHATSAPP'｜'IN_APP'`) |
| `kind` | `text` (`'eligibility'｜'impact'｜'broadcast'｜'request_accepted'｜'reminder'`) |
| `payload` | `jsonb` (template + variables) |
| `status` | `text` (`'queued'｜'sent'｜'delivered'｜'failed'`) |
| `related_request_id` | `uuid` (nullable) |
| `created_at` / `sent_at` | `timestamptz` |

**`audit_log`** — append-only record of sensitive events (status changes, contact reveals, admin approve/reject, report actions): `actor_id`, `action`, `entity`, `entity_id`, `before`/`after jsonb`, `created_at`. Insert via DB triggers or server actions; RLS = admins read, no one updates/deletes.

Add **`reports`** and **`blocks`** tables for abuse handling (reasons including `'paid_solicitation'`, `'spam'`, `'harassment'`), feeding the existing admin queue — paid-donor solicitation must be a first-class abuse category given WHO's voluntary-only stance, BD law, and documented plasma scams.

🇧🇩 **বাংলা:** একটি `notifications` টেবিল রাখুন যা প্রতিটি বার্তা ও তার ডেলিভারি অবস্থা রাখবে, আর একটি append-only `audit_log` রাখুন যা স্ট্যাটাস পরিবর্তন, কন্টাক্ট প্রকাশ ও অ্যাডমিন কাজ লগ করবে। সাথে `reports`/`blocks` টেবিল দিয়ে অপব্যবহার (বিশেষত টাকার বিনিময়ে রক্তের প্রস্তাব) সামলান।

---

### 8. Notification Delivery for Bangladesh

There is **no notification layer today** — donors only see requests in the dashboard, which fails the night-time emergency case. The right channel mix is dictated by BD reach data: only ~26% of rural mobile users have smartphones, so **SMS is the spine**, push/email secondary.

| Channel | Reach in BD | Cost | Best for | Trade-offs |
|---|---|---|---|---|
| **SMS gateway** (local BD aggregator, e.g. via masking provider) | Near-universal (feature phones too) | Per-message; sender-ID + Bangla template registration needed | Eligibility reminders, urgent broadcast, OTP | Paid; most cost-effective channel per evidence (ICER ~70 vs ~557 RMB vs phone) |
| **Web Push / PWA** | Smartphone app users only (~mid-50s–60s% nationally) | Free (VAPID, no vendor) | Re-engaging app users at zero marginal cost | Requires installable PWA + permission; misses feature phones |
| **Email** | Limited daily relevance | Cheap (Resend/Supabase) | Receipts, non-urgent digests, account events | Low open rates for emergencies |
| **WhatsApp Business API** | High penetration but **opt-in only** | Business API + template fees | Rich confirmations for opted-in users | A Brazil RCT found **no significant retention effect** — do not make it the default channel |

**Recommended cascade:** **SMS primary → PWA push secondary → email tertiary → WhatsApp opt-in only.** Store per-channel opt-in flags on `profiles`. Author all templates **bilingually (Bangla + English)**.

**Two evidence-backed messages to ship first (highest ROI, before any gamification):**
1. **Eligibility-aware reminder** — fired exactly when a donor crosses re-eligibility (`last_donation_date + interval`), via a **Supabase `pg_cron`** job or a **Vercel cron route** that scans donors and enqueues into `notifications`. Avoid sending impact info ~10 days *before* eligibility — that backfired in studies.
2. **Impact / past-use confirmation** — on `COMPLETED` / new `donation_record`: "আপনার রক্ত একজন রোগীর জন্য ব্যবহৃত হয়েছে — ধন্যবাদ" ("Your blood was used for a patient — thank you"). This single SMS lifted 9-month return rates materially in a Thai RCT.

🇧🇩 **বাংলা:** নোটিফিকেশনের মেরুদণ্ড হবে SMS (গ্রামেও পৌঁছায়), এরপর PWA পুশ, তারপর ইমেইল, আর WhatsApp শুধু opt-in — কারণ গবেষণায় WhatsApp-এ রিটেনশন বাড়েনি। সব টেমপ্লেট বাংলা+ইংরেজি রাখুন। সবার আগে দুটি বার্তা চালু করুন: (১) ঠিক যখন ডোনার আবার দান করতে পারবেন তখন রিমাইন্ডার, (২) দান সম্পন্ন হলে "আপনার রক্ত একজন রোগীর কাজে লেগেছে" বার্তা — এগুলোই সবচেয়ে কার্যকর।

---

### 9. Phased Rollout (Actionable Order)

| Phase | Work | Why first |
|---|---|---|
| **P0 — Privacy & correctness** | Restrict `profiles` public view (drop `mobile` from anon); reveal-on-accept; gender-aware eligibility (120/180); filter ineligible donors from search | Closes the scraping hole + fixes a medical error; mostly RLS + logic, low effort |
| **P1 — Structured data** | Division/district/upazila ref tables + cascading dropdowns; structured `blood_requests` fields; `notifications`/`audit_log`/`reports` tables | Unlocks search, notifications, and (later) forecasting |
| **P2 — Server-side search** | `search_donors` RPC with compatibility + ranking; optional `earthdistance` nearby | Core UX differentiator vs stale BD directories |
| **P3 — Notifications** | SMS gateway + eligibility reminder + impact message; broadcast request fan-out; request expiry; PWA push | Highest retention ROI; serves the emergency use case |
| **P4 — Trust ladder** | Phone OTP (gate *requesting*), verified badge, donation-count milestones, donor self-service controls | Data quality + retention; builds on existing `donation_records` |

🇧🇩 **বাংলা:** আগে প্রাইভেসি ও এলিজিবিলিটির ভুল ঠিক করুন (P0), তারপর গঠনমূলক ডেটা ও টেবিল (P1), এরপর সার্ভার-সাইড সার্চ (P2), তারপর SMS নোটিফিকেশন ও ব্রডকাস্ট (P3), সবশেষে OTP/ভেরিফিকেশন ও মাইলস্টোন (P4)।

> **Net architectural thesis:** keep the stack thin and Supabase-native. Almost every high-value capability here — structured location, compatibility ranking, eligibility filtering, broadcast requests, eligibility/impact reminders — is **plain Postgres + RLS + a cron job + an SMS gateway**, with no map library, no ML infrastructure, and no new client framework. Fix the privacy hole first; everything else compounds from a structured data model.

🇧🇩 **বাংলা:** মূল কথা: স্ট্যাকটি হালকা ও Supabase-নির্ভর রাখুন। এখানকার প্রায় সব গুরুত্বপূর্ণ ফিচারই কেবল Postgres + RLS + একটি ক্রন জব + একটি SMS গেটওয়ে দিয়ে সম্ভব — কোনো ভারী লাইব্রেরি বা ML অবকাঠামো লাগবে না। সবার আগে প্রাইভেসির ফাঁকটি বন্ধ করুন, বাকি সবকিছু গঠনমূলক ডেটা মডেলের উপরই গড়ে উঠবে।

---

## Trust, Safety, Privacy & Verification

For a platform that connects strangers around a life-or-death, time-critical need, **trust is the product**. The donors who matter most — the repeat voluntary donors who carry chronic thalassemia demand — will only stay if the system protects them from spam, harassment, and being treated as a paid commodity. This section turns the trust/safety research into a concrete policy + feature set, mapped to our real `profiles` / `donors` / `blood_requests` / `donation_records` schema.

🇧🇩 **বাংলা:** যে অ্যাপ অপরিচিত মানুষকে জরুরি রক্তের প্রয়োজনে যুক্ত করে, সেখানে আস্থাই আসল পণ্য। নিয়মিত স্বেচ্ছায় রক্তদাতারা তখনই থাকবেন যখন তাঁরা স্প্যাম, হয়রানি ও "টাকার বিনিময়ে রক্ত" সংস্কৃতি থেকে সুরক্ষিত থাকবেন।

> **Verification note.** Most platform feature claims below (Roktalap's masking, Urban Company's proxy pool) are from those products' own copy/engineering blogs — treat them as "as advertised," not independently audited. Two numbers from the raw research were softened after fact-check: the "~80% of online-harassment victims are women" figure is specifically *women aged 14–22* per a DMP Cyber Crime statement (a broader official IGP figure is **68% of cybercrime victims are women**); and "93% negative attitude to paid donation" is a single **University of Dhaka student survey**, not a national figure. The PDPO 2025 access/correction/deletion enumeration should be checked against the gazette before relying on the exact wording.

---

### 1. The #1 Risk Today: Phone Numbers Leak at the API Layer

Our current schema has a **structural privacy hole**, but the mechanism is subtler than "the UI shows phones to everyone":

| Layer | What actually happens | File / line |
|---|---|---|
| **RLS policy** | `"Profiles of approved donors viewable"` grants **anonymous** `select` on the *entire* `profiles` row — including `mobile` — for any approved donor | `supabase-schema.sql:181` |
| **Type contract** | `DonorWithProfile` includes `mobile`; `ReceivedRequest.requester` includes `mobile` | `src/types/index.ts:50`, `:62` |
| **Public search** | `DonorSearch` selects only `full_name` + `location` — never `mobile` (UI is safe) | `src/components/DonorSearch.tsx` |
| **Donor page** | Phone is gated behind `{user && donor.profile?.mobile && ...}` — only logged-in users see it rendered | `src/app/donor/[id]/page.tsx:110` |

So the rendered UI is mostly fine, but **an anonymous data-API query (`select=mobile`) can still scrape every approved donor's number**, because RLS grants the whole row. This is the single highest-risk decision in the app and the first thing to fix.

🇧🇩 **বাংলা:** আসল ঝুঁকি ইউজার ইন্টারফেসে নয় — RLS পলিসিতে। বর্তমান নিয়ম অনুমোদিত রক্তদাতার পুরো `profiles` সারি (মোবাইল নম্বরসহ) অজ্ঞাত ভিজিটরের কাছে খুলে দেয়, ফলে সরাসরি API কল করে সব নম্বর স্ক্র্যাপ করা সম্ভব — এটাই আগে ঠিক করতে হবে।

**Why this matters in Bangladesh specifically:** open donor-number lists are the documented failure mode of Facebook groups and directories like `blooddonorsbd.com` (which shows raw numbers on every request card). They cause spam, donor fatigue, paid-donor brokering, and — given that women are the majority of online-harassment victims — a concrete **women's-safety hazard**.

---

### 2. Contact-Privacy Model: Reveal-on-Accept (and a path to masked relay)

The fix, validated by **Roktalap** (a BD blood platform that runs entirely *without* exposing numbers — in-app messaging, single-tap VoIP "without revealing actual SIM identifiers," opt-in GPS only after accept) and by the marketplace **proxy-number** pattern (Urban Company: per-order proxy, two-way routing, recycled after the transaction): **never publish a donor's phone; mediate first contact through the request lifecycle.**

We already have the spine for this — `blood_requests.status` already moves `PENDING → ACCEPTED`, and the donor-side RLS (`donor_user_id`) already gates the accept action. We just bolt privacy onto it.

| Phase | Build | Schema change |
|---|---|---|
| **Phase 1 — Reveal-on-accept** | Remove `mobile` from any public/anon read path. Contact is revealed **only after** the donor sets `status='ACCEPTED'` on a request. | Tighten the RLS policy to **not** expose `profiles.mobile` to anon (use a column-restricted view or drop `mobile` from the public-donor grant). Gate the mobile reveal on an `ACCEPTED` `blood_request`. |
| **Phase 1 (interim)** | Until masking exists, keep coordination in-app: request `notes` + a reveal-on-accept number swap. | Add `blood_requests.contact_channel` now so swapping to a relay later needs no schema churn. |
| **Phase 2 — Masked relay** | Integrate a masking provider (Twilio Proxy or a BD SMS/VoIP vendor) so both parties see one disposable number that can be shut off and audited if abused. | `contact_channel` already in place; store the allocated proxy ref on the request. |

🇧🇩 **বাংলা:** নম্বর কখনোই প্রকাশ্যে দেখানো হবে না। অনুরোধকারী একটি রিকোয়েস্ট পাঠাবে, রক্তদাতা সেটি **Accept** করলে তবেই যোগাযোগের তথ্য খুলবে (reveal-on-accept)। পরবর্তী ধাপে মাস্কড রিলে নম্বর দিয়ে দুজনেই একটি অস্থায়ী নম্বরে কথা বলবেন — অপব্যবহার হলে যেটি বন্ধ করা যায়।

**Default rule for engineers:** the donor-profile select string and the public RLS path must **not** contain `mobile`. Treat any code that returns `profiles.mobile` to an unauthenticated or non-accepted caller as a bug.

---

### 3. Donor Verification Ladder (progressive friction)

Today verification = a single admin `is_approved` boolean. That cannot tell a real, reachable human from a fake account, and it gates *browsing* nothing. Replace it with a **ladder** — light friction to participate, heavier (optional) checks to earn trust signals. OTP confirms a real reachable human at minimal cost (the BD market already expects phone-OTP, per Badhan's app flow).

| Tier | Check | Gates / unlocks | Schema |
|---|---|---|---|
| **0** | Email (Supabase, already have) | Account exists | — |
| **1** | **Phone OTP** | **Gate requesting**, not browsing — you must verify a phone before you can *send* a `blood_request` | `profiles.phone_verified_at` |
| **2** | Age self-attest (≥18, DOB) + basic eligibility | Eligible to be listed as a donor (WHO: 18–65) | `donors.dob` or `donors.age_verified` |
| **3** | Optional NID last-4 / admin spot-check | "Verified" badge | `donors.verification_level` enum |
| **4** | Community vouch / prior recorded donation | "Trusted donor" badge, ranking boost | derived from `donation_records` |

Keep heavy ID checks (NID/Porichoy) **optional and incentivized**, never mandatory — NID is "sensitive" under PDPO 2025 and mandatory ID kills signups. If you do OCR an NID, store only a **hash + verified flag**, never the raw image.

🇧🇩 **বাংলা:** এক ধাপের অ্যাডমিন-অনুমোদনের বদলে ধাপে ধাপে যাচাই: ০) ইমেইল → ১) ফোন OTP (রিকোয়েস্ট পাঠাতে বাধ্যতামূলক, ব্রাউজিংয়ে নয়) → ২) বয়স → ৩) ঐচ্ছিক NID → ৪) কমিউনিটি ভাউচ। NID বাধ্যতামূলক নয়; করলে শুধু হ্যাশ ও "verified" ফ্ল্যাগ রাখুন, ছবি নয়।

---

### 4. Anti-Abuse & Anti-Paid-Donor Measures

Bangladesh's paid-donor crisis is a **patient-safety** problem, not just an ethics one: professional donors historically supplied a large share of blood and carried far higher infection rates (HBsAg ~29% vs ~4% in voluntary donors). WHO mandates 100% voluntary non-remunerated donation, the Safe Blood Transfusion Law 2002 cut paid donors from ~70% to ~10%, and documented COVID-plasma scams demanded Tk 5,000–20,000. The platform must **actively design against paid solicitation.**

- **Anti-paid-donor policy as a first-class abuse category.** A prominent, persistent notice ("Donation is voluntary — never pay for blood, and never pay before you receive blood") on request and donor pages, plus a dedicated report reason.
  🇧🇩 **বাংলা:** রক্তদান স্বেচ্ছায় — রক্তের জন্য টাকা দেবেন না, এবং রক্ত হাতে পাওয়ার আগে কোনো টাকা পরিশোধ করবেন না। "অর্থের বিনিময়ে রক্তের প্রস্তাব" আলাদা রিপোর্ট ক্যাটেগরি হিসেবে রাখুন।

- **Report / block tables.** Reporting + repeat-offender admin review (blocking alone leaves an abuser free to target others — a known dating-app finding).
  ```
  reports(id, reporter_id, target_user_id,
          reason enum['paid_solicitation','spam','harassment','fake_number','no_show'],
          notes, created_at)
  blocks(blocker_id, blocked_id, created_at)
  ```

- **Rate limiting.** Per-user request caps (N/day, M/hour) enforced in the create-request server action and/or a DB trigger — extend the existing unique-PENDING-per-(requester,donor) index philosophy.

- **Duplicate-number / fraud heuristics in Postgres.** Normalize phone (strip `+880`/leading `0`), add a partial unique index, and use `pg_trgm` fuzzy matching on name+phone to flag one identity tied to many donor profiles. Optionally classify request `notes` for payment/solicitation language with a small Claude call. **Feed flags into the admin queue — never auto-ban.**

🇧🇩 **বাংলা:** অপব্যবহার রোধে: রিপোর্ট/ব্লক টেবিল, রিকোয়েস্টে রেট-লিমিট, এবং Postgres-এ ফোন নম্বর নরমালাইজ করে ডুপ্লিকেট/ভুয়া অ্যাকাউন্ট শনাক্তকরণ। সব ফ্ল্যাগ অ্যাডমিন রিভিউ কিউতে যাবে — স্বয়ংক্রিয়ভাবে ব্যান নয়।

---

### 5. Women-Donor Safety

Given that women are the majority of online-harassment victims in Bangladesh (per the IGP figure, ~68% of cybercrime victims), the privacy defaults above are themselves the strongest women-safety feature — **no woman donor's number is ever scrapeable or visible until she accepts a specific request.** Layer on:

- **`phone_visibility` control** with a `'hidden'` option so a donor can stay searchable and helpful while *never* exposing a number (only in-app contact).
- **No live GPS, ever, by default.** Location stays coarse (district/area), opt-in, and at most shared *after* an accept — real-time geolocation is "sensitive" under PDPO 2025.
- **One-tap pause** (`is_paused`) to disappear from search instantly without deleting the account.
- **Surface the official channel:** link Bangladesh Police **Cyber Support for Women** (female-officer hotline) in the footer/report flow.

🇧🇩 **বাংলা:** নারী রক্তদাতার নম্বর গ্রহণযোগ্য রিকোয়েস্ট Accept না করা পর্যন্ত কখনোই দেখা বা স্ক্র্যাপ করা যাবে না। লোকেশন থাকবে জেলা/এলাকা পর্যায়ে (লাইভ GPS নয়), এবং "Pause" বাটনে এক চাপে অদৃশ্য হওয়া যাবে। ফুটারে পুলিশের "Cyber Support for Women" লিঙ্ক রাখুন।

---

### 6. Consent & Data Minimization (PDPO 2025 context)

Bangladesh's **Personal Data Protection Ordinance 2025** was enacted **6 Nov 2025**; enforcement/CDO provisions phase in ~18 months (~May 2027). Key implications for us:

| PDPO requirement | What we must do | Schema / action |
|---|---|---|
| **Consent is the *primary* lawful basis** (no GDPR-style "legitimate interests") | Explicit consent checkbox at donor signup before name/number is listed | `donors.consent_to_contact_at` + consent UI in `become-donor` |
| **Access / correction / deletion rights** (verify exact text vs gazette) | Self-serve "delete my donor data" that cascades; edit anytime | `donors.deleted_at` + a delete server action (we already use server actions for become-donor) |
| **Geolocation & health data are sensitive** (explicit consent) | Keep location coarse + opt-in; treat `last_donation_date` / any health field as sensitive | no live GPS column |
| **Article 29 data localization** — a **real-time synchronized copy of BD personal data must live inside Bangladesh** for foreign cloud; govt can order cessation within 60 days | **Architectural gap:** US-hosted Supabase/Vercel likely does **not** satisfy this. Evaluate a Bangladesh-region replica or BD-hosted DB; document cross-border transfer + obtain consent | infra decision, not a column |

**Data minimization as default:** collect only what a match needs (blood type, district, eligibility), never publish more than that, and store hashes/flags instead of raw IDs.

🇧🇩 **বাংলা:** PDPO ২০২৫ অনুযায়ী সম্মতিই (consent) প্রধান আইনি ভিত্তি, ব্যবহারকারীর অ্যাক্সেস/সংশোধন/মুছে ফেলার অধিকার আছে, এবং লোকেশন/স্বাস্থ্যতথ্য "সংবেদনশীল"। সবচেয়ে বড় চ্যালেঞ্জ Article 29: বিদেশি ক্লাউডে রাখা বাংলাদেশি ডেটার একটি রিয়েল-টাইম কপি দেশের ভেতরে রাখতে হবে — যা US-হোস্টেড Supabase/Vercel সম্ভবত পূরণ করে না, তাই দেশীয় রেপ্লিকা বিবেচনা করতে হবে।

---

### 7. Report / Block & Admin Review Loop

We already have an admin panel (`is_admin`, donor approval). Extend it into a **safety queue**:

- **Report button** on every donor profile and request, writing to `reports` (reasons in §4).
- **Block** writes to `blocks`; blocked users disappear from each other's search and cannot request.
- **Repeat-offender escalation:** an admin queue that surfaces users with ≥N reports or a `paid_solicitation` flag for human review and suspension — because, per the dating-app evidence, blocking alone doesn't stop a bad actor moving on to the next target.

🇧🇩 **বাংলা:** প্রতিটি প্রোফাইল ও রিকোয়েস্টে "Report" বাটন এবং পারস্পরিক "Block"। বারবার অভিযুক্তদের অ্যাডমিন কিউতে এনে রিভিউ ও সাসপেন্ড করা হবে — কারণ শুধু ব্লক করলে অপব্যবহারকারী অন্যদের টার্গেট করতেই থাকে।

---

### 8. Freshness & Trust Signals

Stale data — dead numbers, donors who already donated last week still showing "available" — is the documented #1 killer of every BD directory. We have the raw materials (`last_donation_date`, `donation_records`, `availability_status`); we just need to compute and surface trust.

| Signal | Definition | Source / new field |
|---|---|---|
| **Eligibility / freshness** | `eligible = last_donation_date IS NULL OR now() - last_donation_date >= interval` | already in `src/lib/eligibility.ts` (note: current 90-day flat rule should be **gender-aware** — BD norm is ~120d men / ~180d women) |
| **Last active** | Update on login/action; auto-`is_paused` after long inactivity; show "active 3d ago" | new `profiles.last_active_at` |
| **Verified badge** | From verification ladder tier ≥3 | `donors.verification_level` / `verified_badge` |
| **Donation count** | `COUNT(donation_records)` per donor → milestone badges | derived from existing `donation_records` |
| **Response rate** | accepted ÷ received `blood_requests` (a "very responsive" cue) | derived from `blood_requests` |
| **No-show / reliability** | track `CANCELLED`-after-accept; suspend repeat offenders (Roktoshare model) | `donors.no_show_count` |

Surface **last-active + verified badge** on `DonorCard`, and **rank fresher, verified, more-responsive donors higher** in search. This turns our current "exact-match, newest-first" list into a genuine *trust*-ordered list — the clearest differentiator versus Bangladesh's stale, unverified directories.

🇧🇩 **বাংলা:** পুরোনো/মৃত ডেটাই দেশের সব ডিরেক্টরির মূল সমস্যা। আমাদের কাছে `last_donation_date`, `donation_records` আছে — তা থেকে যোগ্যতা/ফ্রেশনেস, "শেষ সক্রিয়", verified ব্যাজ, দানের সংখ্যা ও রেসপন্স রেট দেখান, এবং সার্চে নতুন-যাচাইকৃত-দ্রুত সাড়াদানকারী রক্তদাতাদের উপরে রাখুন।

---

### 9. Surface the Legal Boundary (cheap risk mitigation)

A pure donor-*connector* that only matches people and refers the actual donation to a DGHS-licensed centre is doing **recruitment/coordination, not regulated blood-banking** under the Safe Blood Transfusion Act 2002 — *as long as it never collects, stores, types, or transfuses blood.* (This is a reasonable inference, not a court ruling; a BD legal review is advisable.) Make the line explicit in-product:

> "This app only connects people. It does not collect, store, test, or transfuse blood. Donate at a licensed centre — and never pay for blood."

Static copy in the footer/about/request flow; no schema change; it manages expectations and keeps us clearly on the right side of the law.

🇧🇩 **বাংলা:** শুধুমাত্র সংযোগকারী অ্যাপ — রক্ত সংগ্রহ/সংরক্ষণ/পরীক্ষা/সঞ্চালন করি না; দান হবে লাইসেন্সপ্রাপ্ত কেন্দ্রে। এই বার্তা ফুটারে রাখা সস্তা অথচ কার্যকর ঝুঁকি-প্রশমন।

---

### Priority Roadmap

1. **Fix the RLS leak + reveal-on-accept** (highest risk, low effort) — stop `mobile` reaching anon/non-accepted callers; gate contact on `ACCEPTED`.
2. **Phone-OTP gate on requesting** + consent checkbox at signup (`phone_verified_at`, `consent_to_contact_at`).
3. **Report/block tables + rate limiting + admin safety queue** with a `paid_solicitation` reason.
4. **Donor self-service controls** (`phone_visibility`, `is_paused`, `deleted_at`).
5. **Trust/freshness signals** (`last_active_at`, donation count, response rate, gender-aware eligibility, verified badge) surfaced and used for ranking.
6. **Phase 2:** masked relay; **architectural:** PDPO Article 29 in-country replica review.

🇧🇩 **বাংলা:** অগ্রাধিকার: (১) RLS ফাঁস ঠিক করে reveal-on-accept; (২) রিকোয়েস্টে ফোন-OTP ও সম্মতি; (৩) রিপোর্ট/ব্লক, রেট-লিমিট ও অ্যাডমিন সেফটি কিউ; (৪) রক্তদাতার নিজস্ব প্রাইভেসি কন্ট্রোল; (৫) ট্রাস্ট/ফ্রেশনেস সিগন্যাল ও র‍্যাঙ্কিং; (৬) মাস্কড রিলে ও PDPO Article 29 অনুযায়ী দেশীয় রেপ্লিকা।

---

## Phased Roadmap & Success Metrics

This roadmap sequences work by **value-per-effort and dependency order**, not feature glamour. The guiding principle from the research is blunt: in Bangladesh, blood directories fail because of **stale data, exposed phone numbers, and zero feedback loop** — not because they lack maps or AI. So we fix trust, freshness, and privacy first, instrument everything, and defer ML until we have data to train it on. Effort is rough developer-weeks for a small team (1–2 engineers), assuming our current stack (**Next.js 16**, **React 19**, **Tailwind v4**, **Supabase/Postgres + RLS**, **Vercel**) with no new heavy dependencies unless noted.

🇧🇩 **বাংলা:** প্রথমে বিশ্বাস, তথ্যের সতেজতা ও গোপনীয়তা ঠিক করব — ম্যাপ বা AI পরে। বাংলাদেশে রক্তদাতা খোঁজার অ্যাপগুলো ব্যর্থ হয় পুরোনো নম্বর, খোলা ফোন নম্বর আর কোনো ফলোআপ না থাকার কারণে; তাই আমরা সেগুলোই আগে সমাধান করব এবং সবকিছু পরিমাপ করব।

---

### Phase 0 — Quick Wins & Correctness (Weeks 1–2)

**Goal:** Fix what is medically wrong or structurally leaky in the current app, with near-zero new infrastructure. These are config/logic changes that make the product *honest* before we scale it.

🇧🇩 **বাংলা:** যা চিকিৎসাগতভাবে ভুল বা গোপনীয়তায় ফাঁকফোকর আছে, সেগুলো আগে ঠিক করব — নতুন কোনো বড় অবকাঠামো ছাড়াই।

| Feature | What it does | Effort |
|---|---|---|
| **Gender-aware eligibility** | Replace flat `DONATION_ELIGIBILITY_DAYS = 90` with BD-correct intervals: ~120 days (men) / ~180 days (women). Add a `sex` field to `donors` and pass it into `calculateEligibility()`. | ~2 days |
| **Filter ineligible donors from search** | Search currently *shows* an eligibility badge but still lists ineligible donors. Exclude (or de-rank) donors inside their cooldown so requesters never contact someone who can't donate. | ~1 day |
| **Close the phone-exposure RLS hole** | The `"Profiles of approved donors viewable"` policy grants anon `SELECT` on the whole `profiles` row incl. `mobile`. Restrict the public path to a view that omits `mobile`; reveal contact only on an `ACCEPTED` request. | ~3 days |
| **Activate the unused `COMPLETED` status** | Accept currently sets `ACCEPTED` and stops. Add a "donation received" confirmation that moves the request to `COMPLETED` and writes the `donation_record` — this is the data spine for every later KPI. | ~3 days |
| **"Voluntary only — never pay" notice + legal boundary copy** | Static UI on request/donor pages: anti-paid-donation warning and "this app only connects people; donate at a licensed centre." | ~1 day |
| **Donor self-service: pause + delete** | A one-tap "pause my availability" and a "delete my donor data" action (PDPO 2025 deletion right). | ~2 days |

🇧🇩 **বাংলা:** ৯০ দিনের নিয়ম পুরুষ ১২০ / নারী ১৮০ দিনে বদলাও; অযোগ্য দাতাদের সার্চ থেকে সরাও; ফোন নম্বরের RLS ফাঁক বন্ধ করো; "donation received" নিশ্চিতকরণ চালু করো যাতে প্রতিটি অনুরোধ COMPLETED অবস্থায় গিয়ে দান-রেকর্ড তৈরি করে — এটাই পরবর্তী সব মেট্রিকের ভিত্তি।

> **Why this is Phase 0:** The 90-day rule routes requests to donors who are still iron-depleted; the RLS hole exposes numbers to scrapers; and without `COMPLETED` we can never measure a single fulfilled request. All three are cheap to fix and block everything downstream.

---

### Phase 1 — Trust, Verification & Notifications (Weeks 3–8)

**Goal:** Make donors *real and reachable* and close the loop with notifications. This is where the app stops being another stale directory.

🇧🇩 **বাংলা:** দাতাদের যাচাই করে বাস্তব ও নাগালযোগ্য করা, আর নোটিফিকেশন দিয়ে পুরো চক্রটা সম্পূর্ণ করা — এখানেই অ্যাপটা সাধারণ পুরোনো ডিরেক্টরি থেকে আলাদা হয়।

| Feature | What it does | Effort |
|---|---|---|
| **Phone OTP verification** | Gate *requesting* (not browsing) behind a verified phone via Supabase phone auth or a BD SMS gateway. Kills fake/stale numbers — the #1 directory failure. | ~1 week |
| **SMS notification spine** | Integrate one BD SMS gateway (Bangla templates, sender-ID registered). SMS is the only near-universal channel (~26% rural smartphone use). Foundation for all messaging. | ~1 week |
| **Eligibility-aware re-engagement SMS** | When a donor crosses `last_donation_date + interval`, send "you can donate again." Highest-ROI retention lever in the evidence. | ~3 days |
| **Impact / past-use message** | On `COMPLETED`, send "your blood was used for a patient on DATE — thank you." (Thai TEXT RCT: 9-month return rose 16.9 → 22.4 per 100 donor-yrs.) | ~2 days |
| **Reveal-on-accept contact + verified badge** | Donor accepts a request before contact is shared; show a **Verified** badge (OTP-verified, admin-reviewed). | ~4 days |
| **Anti-abuse layer** | `reports` + `blocks` tables, per-user request rate limits, and a report-reason for `paid_solicitation`/`harassment`/`spam`, surfaced in the existing admin panel. | ~1 week |
| **Freshness signals** | `last_active_at`, donation count (from `donation_records`), and response rate (accepted/received). Auto-pause donors inactive > N days. | ~3 days |

🇧🇩 **বাংলা:** ফোন OTP দিয়ে অনুরোধ যাচাই করো (ব্রাউজিং নয়); SMS গেটওয়ে বসাও — এটাই বাংলাদেশের একমাত্র সর্বজনীন চ্যানেল; যোগ্যতা ফিরে এলে আর দান সম্পন্ন হলে SMS পাঠাও; অনুরোধ গ্রহণ করার পরই যোগাযোগ নম্বর দেখাও।

> **Timing caution (load-bearing):** Impact info delivered ~10 days *before* re-eligibility made donors **63% less likely** to return. Schedule the "thank you / blood used" message right after donation, and the "you're eligible again" nudge only *on* the eligibility date — never overlap them.

🇧🇩 **বাংলা:** সতর্কতা: যোগ্যতার ১০ দিন আগে impact-বার্তা পাঠালে দাতা ফিরে আসার সম্ভাবনা ৬৩% কমে — তাই ধন্যবাদ-বার্তা দানের পরপরই, আর "আবার দান করতে পারবেন" বার্তা ঠিক যোগ্যতার দিনেই পাঠাতে হবে।

---

### Phase 2 — Geo, Map, Structured Requests & Analytics (Weeks 9–18)

**Goal:** Replace free-text location with structured geography, broadcast urgent needs to many donors at once, and visualize coverage. This is the first phase that needs data accumulated in Phases 0–1.

🇧🇩 **বাংলা:** ফ্রি-টেক্সট ঠিকানার বদলে কাঠামোবদ্ধ বিভাগ/জেলা/উপজেলা আনব, জরুরি প্রয়োজন একসাথে অনেক দাতাকে পাঠাব, আর কাভারেজ ম্যাপে দেখাব।

| Feature | What it does | Effort |
|---|---|---|
| **Structured location** | Division → district → upazila cascading dropdowns replacing the free-text `ilike`. The single most-requested missing feature ("O+ donor in Mirpur"). | ~1 week |
| **Combined blood-group + district filter** | First-class **AND** filter (group *and* area together), with blood-compatibility expansion (e.g. O- request also surfaces nothing wider, but A+ request shows A+/A-/O+/O-). | ~4 days |
| **Broadcast / SOS request** | New open request type (`blood_type` + `district`, no fixed `donor_id`) that fans out via SMS/push to matching *eligible* donors; donors accept in-app. Beats browse-and-call-one. | ~1.5 weeks |
| **BD choropleth map** | SVG choropleth (8 divisions / 64 districts) via `@vnedyalk0v/react19-simple-maps` or hand-rolled `d3-geo`; TopoJSON + mapshaper-simplified geometry in `/public` (sub-100KB for low-end Android). Color districts by available-donor count. | ~1.5 weeks |
| **Blood-group distribution charts** | Recharts donut/bar (with `react-is` override for React 19) fed from a Supabase aggregate RPC. | ~3 days |
| **Smart-match ranking RPC** | Postgres scoring function: compatibility + distance + recency/eligibility + responsiveness + availability → ranked list. No ML. | ~1 week |
| **Structured `blood_requests` fields** | Add `blood_type`, `units`, `hospital`, `urgency`, `needed_by` columns (currently only free-text `notes`). Unlocks triage *and* forecasting later. | ~3 days |

🇧🇩 **বাংলা:** রক্তের গ্রুপ ও জেলা একসাথে ফিল্টার করা; জরুরি অনুরোধ একসাথে অনেক যোগ্য দাতাকে পাঠানো; ৬৪ জেলার ম্যাপে দাতার সংখ্যা রঙে দেখানো — এসবই এই ধাপের মূল কাজ।

> **Stack note:** Avoid Mapbox/deck.gl (cost + WebGL overkill for 64 polygons) and avoid Leaflet unless we need pan/zoom over a real basemap (it forces SSR-off + ~140KB). A static SVG choropleth is the right default.

---

### Phase 3 — AI Assistance (Weeks 19–26)

**Goal:** Add narrowly-scoped, high-value Claude features now that structured data exists. Everything here is bounded Q&A or extraction — no autonomous decisions.

🇧🇩 **বাংলা:** কাঠামোবদ্ধ তথ্য তৈরি হওয়ার পর সীমিত ও উচ্চমূল্যের AI ফিচার যোগ করা — সবই নিয়ন্ত্রিত প্রশ্নোত্তর বা তথ্য-আহরণ, কোনো স্বয়ংক্রিয় সিদ্ধান্ত নয়।

| Feature | What it does | Effort |
|---|---|---|
| **NLP request parser** | Parse messy bilingual text ("Urgent! B+ 2 bag lagbe, Dhaka Medical, kalker moddhe") into `{blood_group, units, hospital, district, urgency, deadline}` via Claude structured output. Auto-populates the Phase 2 columns. | ~1 week |
| **Bilingual eligibility & compatibility assistant** | Claude (strong Bengali: Sonnet 4.6 / Haiku 4.5) answers "who can donate to whom" and screens age/weight/interval. Informational only, with a "not medical advice — final screening at the blood bank" disclaimer; cache the system prompt with `cache_control`. | ~1 week |
| **Solicitation classifier** | Classify request `notes` for payment/solicitation language; feed flags into the admin queue (never auto-ban). | ~3 days |
| **Optional NID/OCR verification badge** | Optional, incentivized (not mandatory): user uploads NID, OCR prefills name/number, store only a hash + verified flag. Porichoy access is gated, so a commercial reseller or self-hosted Tesseract is more realistic for a small org. | ~1.5 weeks |

🇧🇩 **বাংলা:** এলোমেলো বাংলা-ইংরেজি অনুরোধকে কাঠামোবদ্ধ তথ্যে রূপান্তর; "কে কাকে রক্ত দিতে পারে" নিয়ে দ্বিভাষিক সহায়ক (এটি চিকিৎসা-পরামর্শ নয়); টাকা চাওয়ার ভাষা শনাক্ত করে অ্যাডমিনকে জানানো।

> **Cost discipline:** Use Haiku 4.5 ($1/$5 per 1M) for the chatbot/classifier and Sonnet 4.6 ($3/$15) only where quality matters; prompt-cache the eligibility-rules + compatibility-chart system prompt (cache reads ~0.1× input). The assistant must never auto-approve donors or give clinical clearance.

---

### Phase 4 — Scale, Partnerships & Predictive (Weeks 27+)

**Goal:** Turn the platform from a tool into infrastructure — partnerships, recurring-patient support, and the ML that finally has enough history to be worth training.

🇧🇩 **বাংলা:** অ্যাপটিকে একটি টুল থেকে অবকাঠামোতে রূপান্তর — সংস্থার সাথে অংশীদারিত্ব, নিয়মিত রোগীর সহায়তা, আর এতদিনে যথেষ্ট ডেটা জমার পর প্রকৃত পূর্বাভাস-মডেল।

| Feature | What it does | Effort |
|---|---|---|
| **Thalassemia / recurring-need rosters** | Let chronic patients (~70,000 nationally, many transfusing monthly) build a small roster of compatible repeat donors with scheduled, eligibility-aligned reminders. The most predictable, highest-value demand. | ~2 weeks |
| **Org / campus partnerships** | Verified organization accounts, CSV bulk donor import (dedup by phone), and drive landing pages — mirrors Badhan/Sandhani's campus-unit model. | ~2–3 weeks |
| **Demand forecasting** | Once 6–12 months of structured request events exist: start with a per-district + group seasonal moving average, then Prophet/ARIMA in a small Python job. Skip deep learning until volume justifies it. | ~2 weeks (after data) |
| **Gamification & milestones** | Badges (1st/5th/10th donation from `donation_records`), shareable OG-image donor card, opt-in district leaderboard. Engagement layer, lower evidence — ship after the proven SMS levers. | ~1.5 weeks |
| **PDPO Article 29 data-localization** | Evaluate a Bangladesh-region replica / in-country synchronized copy of personal data (US-hosted Supabase/Vercel does not satisfy Article 29). Enforcement phases in ~May 2027. | Investigation + ~2 weeks |
| **PWA push** | Secondary channel for smartphone app users at near-zero marginal cost. | ~1 week |

🇧🇩 **বাংলা:** থ্যালাসেমিয়া রোগীদের জন্য নিয়মিত দাতার তালিকা; ক্যাম্পাস/সংস্থার সাথে অংশীদারিত্ব ও বাল্ক ইম্পোর্ট; যথেষ্ট ডেটা জমলে জেলা-ভিত্তিক চাহিদা পূর্বাভাস; আর PDPO ২০২৫ অনুযায়ী বাংলাদেশের ভেতরে ডেটার একটি কপি রাখার পরিকল্পনা (প্রয়োগ ~মে ২০২৭)।

---

### Success Metrics & KPIs

We can only measure what we instrument. Phase 0's `COMPLETED` status + `donation_records` linkage is the precondition for nearly every KPI below. Track these from day one and review monthly.

🇧🇩 **বাংলা:** যা পরিমাপ করব না, তা উন্নত করা যাবে না। প্রতিটি অনুরোধ COMPLETED অবস্থায় যাওয়া আর দান-রেকর্ড তৈরি — এটাই প্রায় সব মেট্রিকের পূর্বশর্ত।

#### North-Star & Outcome Metrics

| Metric | Definition | Why it matters | Target direction |
|---|---|---|---|
| **Fulfilled requests** | Count of `blood_requests` reaching `COMPLETED` (donation confirmed) | The one true outcome — blood actually given | The North Star; grow month-over-month |
| **% requests answered** | Share of requests with ≥1 donor `ACCEPTED` | Measures matching power, not just listings | ↑ toward 90%+ |
| **Time-to-first-response** | Median time from request creation → first `ACCEPTED` | The 3am-emergency metric; BD baseline is brutal (~19–24h/bag in studies) | ↓ to hours, then minutes |
| **Time-to-fulfillment** | Median request → `COMPLETED` | End-to-end speed | ↓ |

🇧🇩 **বাংলা:** মূল লক্ষ্য — কতগুলো অনুরোধ সত্যিই রক্তদানে শেষ হলো; কত শতাংশ অনুরোধে অন্তত একজন দাতা রাজি হলো; আর প্রথম সাড়া পেতে কত সময় লাগল (জরুরি অবস্থার আসল মাপকাঠি)।

#### Trust & Quality Metrics

| Metric | Definition | Target direction |
|---|---|---|
| **Donor verification rate** | Share of active donors with OTP-verified phone | ↑ toward 100% |
| **Repeat-donor rate** | Donors with ≥2 confirmed donations | ↑ (the retention payoff of SMS impact messaging) |
| **Data freshness** | Share of donors `last_active_at` within N days / not auto-paused | ↑ (directly attacks the stale-list problem) |
| **Coverage by district** | # of available, eligible donors per district × blood group | Fill the empty-district gaps (the choropleth surfaces these) |
| **Abuse rate** | Reports per 1,000 requests; `paid_solicitation` flags | ↓ |
| **Donor opt-out / churn** | Donors pausing or deleting after contact | ↓ (proxy for harassment/spam health) |

🇧🇩 **বাংলা:** যাচাইকৃত দাতার হার, পুনরায় দান করা দাতার হার, তথ্যের সতেজতা, প্রতিটি জেলায় কাভারেজ, আর অপব্যবহারের হার — এগুলোই বিশ্বাস ও গুণমানের পরিমাপ।

> **Honest-baseline rule:** Do not report a fulfillment rate until `COMPLETED` is wired and requesters actually confirm receipt. A directory that *looks* full but never confirms outcomes is exactly the BD failure mode we're trying to beat. Self-reported availability without verification inflates every number.

🇧🇩 **বাংলা:** COMPLETED চালু না হওয়া পর্যন্ত পূর্ণতার হার রিপোর্ট করো না — যাচাই ছাড়া স্ব-ঘোষিত তথ্য সব সংখ্যা ফুলিয়ে দেয়, আর সেটাই বাংলাদেশের পুরোনো ব্যর্থতা।

---

### Top 5 Things To Do Next Week

A concrete, do-it-now list — all Phase 0, all small, all high-leverage.

🇧🇩 **বাংলা:** এই সপ্তাহেই করার মতো ৫টি সুনির্দিষ্ট কাজ — সবই ছোট, সবই উচ্চ-প্রভাব।

1. **Fix the eligibility interval.** Make `DONATION_ELIGIBILITY_DAYS` gender-aware (120 men / 180 women) in `src/lib/eligibility.ts`, add `sex` to `donors`, and **filter ineligible donors out of search** so no one contacts an ineligible donor.
   🇧🇩 **বাংলা:** যোগ্যতার নিয়ম লিঙ্গভেদে ঠিক করো (পুরুষ ১২০ / নারী ১৮০ দিন) এবং অযোগ্য দাতাদের সার্চ থেকে সরাও।

2. **Plug the phone-exposure RLS hole.** Stop the `"Profiles of approved donors viewable"` policy from returning `mobile` to anonymous callers; expose a `mobile`-free view publicly.
   🇧🇩 **বাংলা:** বেনামি ব্যবহারকারীর কাছে দাতার ফোন নম্বর ফাঁস হওয়ার RLS ফাঁকটি বন্ধ করো।

3. **Activate `COMPLETED`.** Add a "donation received" confirmation that moves a request to `COMPLETED` and writes the `donation_record`. This unlocks every KPI.
   🇧🇩 **বাংলা:** "donation received" নিশ্চিতকরণ যোগ করো যা অনুরোধকে COMPLETED করে ও দান-রেকর্ড লেখে — এতে সব মেট্রিক চালু হয়।

4. **Ship the "never pay for blood" + legal-boundary notice** on the request/donor pages, plus a donor "pause my availability" toggle.
   🇧🇩 **বাংলা:** "রক্তের জন্য টাকা দেবেন না" সতর্কবার্তা ও "এই অ্যাপ শুধু সংযোগ করে" নোটিশ দাও, আর দাতার জন্য "availability বন্ধ রাখুন" টগল যোগ করো।

5. **Stand up the instrumentation.** Start logging request lifecycle events (created → accepted → completed/cancelled, with timestamps) so the KPI dashboard has real data the moment Phase 1 begins.
   🇧🇩 **বাংলা:** অনুরোধের প্রতিটি ধাপ (তৈরি → গৃহীত → সম্পন্ন/বাতিল) টাইমস্ট্যাম্পসহ লগ করা শুরু করো, যাতে Phase 1 শুরু হলেই KPI ড্যাশবোর্ডে প্রকৃত তথ্য থাকে।

---

## Appendix — Research Confidence & Key Caveats / পরিশিষ্ট

This dossier favors **honesty over hype**. The strongest, best-sourced conclusions are the *qualitative patterns* (privacy-by-default, eligibility-aware freshness, the stale-data failure mode, SMS-first reach, heuristics-over-ML). The weakest evidence is in **headline numbers**. Treat the following as **self-reported / indicative, not audited**:

- Facebook/Meta Blood Donations sign-ups (global 100M+ / Bangladesh ~11M), and the "~1,400 BD Facebook groups" figure (**unverified**).
- LifeBank and Damu Sasa hospital/units/lives-saved counts (inconsistent across sources).
- Turkey Kızılay self-sufficiency (~82% operator vs ~50% one academic source) and donor counts.
- Wateen 520k users, Clara ~20k/month & ~90% accuracy, "WhatsApp 98% open rate" (vendor marketing).
- BD SMS pricing (~0.30–0.50 BDT/SMS) — approximate vendor-listed market rates.
- WHO "~31% voluntary donation in Bangladesh" — 2016/2017 vintage.

**Peer-reviewed (higher confidence):** Zipline Rwanda delivery-time −61% / expiry −67% (*Lancet Global Health* 2022); reminder ~1 week before deferral-end is most effective (Gemelli et al., *Transfusion* 2021); SMS reminders are cheaper but phone calls more effective among compliers (Guangzhou RCT, *BMC Public Health* 2020).

**Medical/legal items to re-verify before shipping:** exact donation interval rules (whole-blood ~90–120 days; gender differences), the Safe Blood Transfusion Act 2002 / Rules and what an independent connector may legally do, and the Personal Data Protection Ordinance 2025 obligations. The in-app chatbot must be framed as **guidance, not medical clearance**.

🇧🇩 **বাংলা:** এই দলিল **হাইপের চেয়ে সততা**-কে গুরুত্ব দিয়েছে। সবচেয়ে শক্তিশালী সিদ্ধান্তগুলো গুণগত প্যাটার্ন (গোপনীয়তা-ডিফল্ট, যোগ্যতা-সচেতন হালনাগাদ, বাসি-ডেটা সমস্যা, SMS-নির্ভর নাগাল, ML-এর বদলে হিউরিস্টিক)। দুর্বলতম প্রমাণ হলো বড় বড় সংখ্যায় — উপরের তালিকার সংখ্যাগুলো স্ব-ঘোষিত, নিরীক্ষিত নয়। চিকিৎসা/আইনি বিষয়গুলো (রক্তদানের ব্যবধান, Safe Blood Transfusion Act 2002, Personal Data Protection Ordinance 2025) বাস্তবায়নের আগে আবার যাচাই করুন; অ্যাপের চ্যাটবটকে অবশ্যই "পরামর্শ" হিসেবে উপস্থাপন করতে হবে, "চিকিৎসা-ছাড়পত্র" নয়।

---

## Primary references / প্রধান সূত্র

**Bangladesh:** badhan.org · sandhani · bloodbank.org.bd · donatebloodbd.com · Bloodman / rokto.co · Roktalap · DGHS BBMS
**Government / national systems:** e-RaktKosh (India, eraktkosh.mohfw.gov.in) · DGHS Bangladesh
**Global best practice:** redcrossblood.org (American Red Cross) · blood.co.uk (NHS Give Blood) · Lifeblood (Australia) · Türk Kızılay (kanver.org) · PMI "Ayo Donor" (Indonesia) · Japanese Red Cross "Love Blood"
**P2P / volunteer:** Simply Blood (India) · Friends2Support · BloodConnect · Khoon · donors.pk (Pakistan) · Hamro Blood Bank (Nepal)
**Innovation:** Facebook/Meta Blood Donations · Google + American Red Cross Maps locator · LifeBank (Nigeria) · Zipline · Damu Sasa (Kenya)
**Evidence:** WHO Bangladesh blood-safety data · *Lancet Global Health* (Zipline Rwanda) · *Transfusion* 2021 (reminder timing) · *BMC Public Health* 2020 (Guangzhou RCT) · McElfresh et al. EC'20 / *Nature Machine Intelligence* (FB matching)

_This is a living document. As features ship and real usage data accrues, revisit the roadmap, replace self-reported benchmarks with our own metrics, and re-verify medical/legal specifics._
