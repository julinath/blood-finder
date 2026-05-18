# 01 — Project Overview

## এক বাক্যে

**Blood Finder** একটা web app যেখানে কেউ verified blood donor খুঁজে directly request পাঠাতে পারে, এবং যে কেউ donor হিসেবে register করতে পারে।

---

## কী সমস্যা solve করছে?

বাংলাদেশে blood donor খুঁজতে সাধারণত মানুষ Facebook post, fame group, বা contacts-এর উপর depend করে। এতে —

- **দেরি হয়** — জরুরি situation-এ valuable মিনিট নষ্ট হয়।
- **Verified না** — কেউ আদৌ donor কিনা, available কিনা, কাছে আছেন কিনা — কিছুই sure না।
- **Central database নাই** — একই request 10 জায়গায় post হয়, contact হারিয়ে যায়।

**Blood Finder** এই তিনটাই solve করে:

| সমস্যা | আমাদের সমাধান |
|---|---|
| দেরি | One-click search (blood type + location) → instant list |
| Verify নাই | Donor admin approval ছাড়া public list-এ আসে না |
| Central না | সবকিছু এক জায়গায় — search, request, donation history |

---

## কারা ব্যবহার করবে?

| User Type | অনুমতি |
|---|---|
| **Guest** (login ছাড়া) | Donor search ও donor profile view |
| **Logged-in User** | Donor-দের request পাঠাতে পারে |
| **Donor** | নিজের request receive ও accept/decline করতে পারে |
| **Admin** | নতুন donor approve/reject, user-দের admin বানানো |

> **মনে রাখো:** একজন logged-in user নিজেই donor হতে পারে — তখন সে দুটো role একসাথে পালন করে।

---

## সব Feature এক জায়গায়

### Public (login ছাড়া)
- ✅ Home page-এ hero, stats (verified donors, available now), Featured 6 donors, "How it works", "Why donate" section
- ✅ `/donors` page-এ সব approved donor browse + filter (blood type, location)
- ✅ `/donor/[id]` — individual donor-এর public profile (নাম, blood type, location, last donation date)

### Logged-in User
- ✅ Email/password বা Google দিয়ে register/login
- ✅ Profile page — নিজের নাম, mobile, location update
- ✅ Dashboard — sent ও received blood requests দেখা
- ✅ Donor-কে request পাঠানো (এক ক্লিকে)
- ✅ নিজের sent pending request cancel করা

### Donor (User হয়ে register করার পর donor হবে)
- ✅ "Become Donor" form — blood type + location + mobile দিয়ে apply
- ✅ Form auto-prefill হয় profile data থেকে
- ✅ Availability toggle — available/unavailable mark
- ✅ Received request accept/decline
- ✅ Donation history (automatic record)

### Admin
- ✅ `/admin` panel access (navbar-এ আসবে)
- ✅ Pending donor approve বা reject
- ✅ Recent blood request list দেখা
- ✅ সব user-এর list, admin role grant/revoke

---

## কী Technology দিয়ে বানানো হয়েছে?

(বিস্তারিত [02-tech-stack.md](02-tech-stack.md)-এ আছে)

```
Frontend Framework  : Next.js 16 (React-based)
Language            : TypeScript
Styling             : Tailwind CSS
Database            : PostgreSQL (Supabase-এর managed instance)
Authentication      : Supabase Auth (Email + Google OAuth)
Hosting             : Vercel
Version Control     : Git + GitHub
```

---

## কেন web app, desktop app না?

আমাদের আগের project Java JavaFX-এ desktop app ছিল (এখনো `desktop-app` branch-এ আছে)। কিন্তু desktop app-এর কিছু সীমাবদ্ধতা:

| Desktop App-এর সমস্যা | Web App-এর সমাধান |
|---|---|
| User-কে install করতে হয় (JDK ইত্যাদি লাগে) | যেকোনো browser দিয়ে ব্যবহার |
| Data শুধু এক laptop-এ থাকে | সবার data central database-এ — যে কেউ যেকোনো জায়গা থেকে access |
| Update দিলে সবাইকে আবার download করতে হয় | একবার deploy → সবাই auto-update পায় |
| Mobile user-রা ব্যবহার করতে পারে না | Mobile browser দিয়েও কাজ করে |
| Internet ছাড়া অন্য কারো donor list দেখা যায় না | Public URL — যে কেউ visit করতে পারে |

আমাদের project-এর nature এমন যে blood donor সবার থাকা দরকার — তাই web app-ই perfect choice।

---

## Live এ গিয়ে দেখো

🌐 **https://blood-finder-bangladesh.vercel.app**

---

## পরবর্তী পড়া

পরের doc-এ আমরা দেখব **কোন tool কেন বেছেছি** — [02-tech-stack.md](02-tech-stack.md)
