# Blood Finder — Project Documentation

> **লেখক:** জুলি নাথ (Juli Nath) ও Team
> **University:** Rangamati Science and Technology University (RSTU)
> **Department:** Computer Science & Engineering
> **Semester:** 2nd
> **Course Project:** Blood Finder — Web Application

---

## এই Documentation কেন?

আমাদের team আগে শুধু **C/C++ দিয়ে competitive programming** করেছিল — কোনো real project করার অভিজ্ঞতা ছিল না। এই project-এ আমরা একদম নতুন একটা **web app** বানিয়েছি, যেখানে অনেক unfamiliar tools এসেছে: Next.js, TypeScript, React, Supabase, PostgreSQL, Vercel, Git, ইত্যাদি।

এই docs folder এমনভাবে লেখা যাতে —

- যে কেউ (শুধু C/C++ জানে) **শূন্য থেকে** এই project পুরোটা বুঝতে পারে।
- টিচারকে confidence-এর সাথে present করা যায়।
- কোনো team member নতুন join করলেও সহজে onboard হতে পারে।

প্রতিটা doc-এ technical term (যেমন `function`, `component`, `database`) English-এই রাখা হয়েছে — কারণ এগুলো actual code-এর শব্দ। বাকি ব্যাখ্যা বাংলায়।

---

## কীভাবে পড়বে — পড়ার ক্রম

| # | File | বিষয় |
|---|------|------|
| 1 | [01-project-overview.md](01-project-overview.md) | Blood Finder কী, কেন, কারা ব্যবহার করবে, কী কী feature |
| 2 | [02-tech-stack.md](02-tech-stack.md) | কোন tool কেন ব্যবহার করেছি — Next.js, React, TS, Tailwind, Supabase, Vercel |
| 3 | [03-setup-guide.md](03-setup-guide.md) | নিজের কম্পিউটারে project চালানোর full guide (Node install থেকে শুরু) |
| 4 | [04-project-structure.md](04-project-structure.md) | কোন folder-এ কী আছে — full code tour |
| 5 | [05-database.md](05-database.md) | Supabase / PostgreSQL — tables, RLS, triggers ব্যাখ্যা |
| 6 | [06-authentication.md](06-authentication.md) | Login কীভাবে কাজ করে — session, cookie, OAuth |
| 7 | [07-how-it-works.md](07-how-it-works.md) | একটা page browser-এ render হওয়া পর্যন্ত পুরো journey |
| 8 | [08-feature-walkthroughs.md](08-feature-walkthroughs.md) | প্রতিটি feature — code level-এ step-by-step trace |
| 9 | [09-deployment.md](09-deployment.md) | Vercel-এ deploy + GitHub workflow + env variables |
| 10 | [10-presenting.md](10-presenting.md) | টিচারকে demo দেওয়ার script + common questions-এর উত্তর |

---

## Quick Facts

```
Live URL    : https://blood-finder-bangladesh.vercel.app
Repository  : https://github.com/julinath/blood-finder
Language    : TypeScript (JavaScript-এর strict version)
Framework   : Next.js 16 (React-based)
Database    : Supabase (managed PostgreSQL)
Hosting     : Vercel (free tier)
Auth        : Supabase Auth (Email/Password + Google OAuth)
```

---

## প্রথমবার পড়ার সময় suggestion

1. **01 → 02** পড়ো — what এবং why বুঝে নাও
2. **03** follow করে নিজের laptop-এ project চালাও — হাতে-কলমে না করলে শেখা হবে না
3. তারপর **04 → 08** পড়তে পড়তে actual code-এর সাথে মিলিয়ে দেখো
4. **09** পড়ে deploy পর্যন্ত বুঝে নাও
5. Present-এর আগে **10** পড়ো — যা যা জিজ্ঞেস হতে পারে তা আগে practice হবে

> **মনে রাখো:** প্রথম পড়ায় ৪০% বুঝলেই enough। code চালাতে চালাতে বাকিটা ধীরে ধীরে clear হবে।
