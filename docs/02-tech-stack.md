# 02 — Tech Stack (কোন tool কেন)

এই page-এর লক্ষ্য: প্রতিটা technology-র **কী এবং কেন** clear করা — যাতে টিচার "Why X?" জিজ্ঞেস করলে confidence-এর সাথে উত্তর দিতে পারো।

---

## প্রথমে — কতগুলো layer আছে?

একটা modern web app-এর সাধারণত **৩টা layer** থাকে:

```
┌────────────────────────────────┐
│  Frontend (Browser-এ চলে)       │  ← user যা দেখে — buttons, forms
├────────────────────────────────┤
│  Backend (Server-এ চলে)         │  ← logic, validation, security
├────────────────────────────────┤
│  Database (Server-এ থাকে)       │  ← সব data permanent store
└────────────────────────────────┘
```

C/C++ -এ একটা program-এ সবই এক জায়গায় থাকে। Web app-এ এই তিনটা আলাদা machine-এ চলে — এই কারণেই concepts অনেক বেশি।

---

## আমাদের Tech Stack সারসংক্ষেপ

| Layer | Tool | কাজ |
|---|---|---|
| Language | **TypeScript** | কোড লেখার ভাষা (JavaScript + types) |
| UI Library | **React** | Component-based UI বানানো |
| Framework | **Next.js 16** | React-কে production-ready বানায় |
| Styling | **Tailwind CSS** | দ্রুত design করার utility classes |
| Backend (Auth + DB) | **Supabase** | Backend-as-a-Service |
| Database | **PostgreSQL** | Relational database (Supabase-এর ভিতরে) |
| Hosting | **Vercel** | Production deploy |
| Version Control | **Git + GitHub** | Code history + team collaboration |

---

## 1. TypeScript — কেন JavaScript না?

**JavaScript** হল browser-এর native language। কিন্তু সমস্যা: JavaScript-এ কোনো type checking নাই।

```js
// JavaScript (problem)
function add(a, b) {
  return a + b
}
add(5, 10)        // 15  ✓
add("5", "10")    // "510" — string concat! কোনো error নাই
```

**TypeScript** = JavaScript + types। C/C++ এর `int x = 5;` এর মতো।

```ts
// TypeScript
function add(a: number, b: number): number {
  return a + b
}
add(5, 10)        // 15
add("5", "10")    // ❌ compile-time error
```

### কেন বেছেছি
- Bug ধরা পড়ে compile-এ, runtime-এ না — অনেক time save
- IDE অনেক বেশি smart suggestion দেয়
- বড় project-এ refactor সহজ হয়
- C/C++ background-এ static typing familiar feel — adjust করা সহজ

> Browser আসলে JavaScript-ই চালায়। আমরা `.ts` লিখি, Next.js automatic build-এ `.js`-এ convert করে দেয়।

---

## 2. React — কেন HTML+JS দিয়ে না?

পুরোনো way-তে HTML আর JavaScript আলাদা থাকত। প্রতি button click-এ manually DOM update করতে হত — repetitive ও error-prone।

**React** এনেছে **component** + **state** ধারণা:

```tsx
// Component = একটা reusable UI piece
function Button({ label }) {
  return <button>{label}</button>
}

// State = component-এর "মনে রাখা" data
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

State বদলালে React নিজে নিজে শুধু সেই অংশ re-render করে — manual DOM manipulation লাগে না।

### কেন বেছেছি
- বর্তমানে সবচেয়ে popular UI library (industry standard)
- Component reuse → কম code, কম bug
- Next.js-এর সাথে natively কাজ করে

---

## 3. Next.js — React-ই তো ছিল, framework কেন?

React নিজে শুধু UI library — সে জানে না:

- URL route কীভাবে handle করবে?
- প্রথম page load-এ HTML কোথা থেকে আসবে (SEO-এর জন্য)?
- API endpoint কীভাবে বানাবে?
- Production-এ deploy কীভাবে হবে?

**Next.js** এই সব কাজ একসাথে handle করে। এটাই বর্তমানে React-এর সবচেয়ে popular framework।

### Next.js আমাদের যা দেয়:

| Feature | আমরা যেখানে ব্যবহার করেছি |
|---|---|
| **File-based routing** | `src/app/donors/page.tsx` → `/donors` URL |
| **Server Components** | Home page server-এ render হয় (fast first load) |
| **Server Actions** | Form submit হলে server-এ function চলে (security) |
| **Proxy (middleware)** | প্রতি request-এ auth check |
| **Image optimization** | Image auto-optimize হয় |
| **Built-in TypeScript support** | `.ts/.tsx` directly চলে |

### Routing example

C/C++ -এ যেমন `int main()` থেকে শুরু হয়, Next.js-এ একটা folder = একটা URL:

```
src/app/
├── page.tsx           → URL: /
├── donors/page.tsx    → URL: /donors
├── admin/page.tsx     → URL: /admin
└── donor/[id]/page.tsx → URL: /donor/123 (dynamic)
```

কোনো route config file লেখা লাগে না — folder structure-ই config।

---

## 4. Tailwind CSS — CSS file লিখি না কেন?

পুরোনো CSS-এ এমন হত:

```html
<button class="my-button">Click</button>
```
```css
/* আলাদা file-এ */
.my-button {
  background: red;
  padding: 10px 20px;
  border-radius: 8px;
}
```

দুই file-এ ঘুরে বেড়াতে হত। বড় project-এ অনেক class name conflict হত।

**Tailwind** এটা solve করে — সব styling **utility class** দিয়ে inline:

```tsx
<button className="bg-red-600 px-5 py-2 rounded-lg text-white hover:bg-red-700">
  Click
</button>
```

প্রতিটা class single কাজ করে: `bg-red-600` = background red, `px-5` = padding-x 5 unit, ইত্যাদি।

### কেন বেছেছি
- কোনো CSS file maintain করা লাগে না
- design consistent থাকে (predefined sizes, colors)
- speed অনেক বেশি — design about thinking-এর সময় কমে
- production build-এ unused classes বাদ পড়ে — bundle size ছোট

---

## 5. Supabase — Backend নিজে লিখি না কেন?

Traditional way-তে backend লিখতে যা যা দরকার হত:

- API server (Node.js/Express)
- Database server (PostgreSQL)
- Authentication system (sign up, login, password reset, OAuth)
- Email service (verification email)
- File storage
- Hosting backend server-এর জন্য

প্রতিটার জন্য আলাদা setup, আলাদা code, আলাদা maintenance।

**Supabase** এই সব এক platform-এ দেয় — এটাকে বলে **Backend-as-a-Service (BaaS)**।

### Supabase যা যা handle করছে আমাদের জন্য:

| কাজ | Supabase-এর provision |
|---|---|
| Database | PostgreSQL (managed, scalable) |
| Auth | Email/password + Google OAuth — ready |
| API | Auto-generated REST API every table-এর জন্য |
| Realtime | Live data updates (আমরা ব্যবহার করি না, কিন্তু আছে) |
| Storage | File upload (আমরা ব্যবহার করি না, কিন্তু আছে) |
| Security | Row Level Security (RLS) — database-এই permission |
| SQL Editor | Browser-এ গিয়ে SQL run করা যায় |

### কেন বেছেছি
- Free tier আমাদের project-এর জন্য enough
- কোনো backend code লেখা লাগে না — সব frontend থেকে directly call করি
- Auth ready — register/login/Google sign-in সব built-in
- Browser-এ database explore করা যায় (UI table editor)

---

## 6. PostgreSQL — কেন SQLite/MySQL না?

| Database | কেমন |
|---|---|
| **SQLite** | File-based, single-user, ছোট project-এর জন্য (আমাদের আগের desktop app-এ ছিল) |
| **MySQL** | Server-based, popular, কিন্তু complex auth/permission |
| **PostgreSQL** | Server-based, **most powerful** open-source DB, advanced features (RLS, JSON, triggers) |

Supabase Postgres-এর উপর built — সরাসরি SQL-এ access করা যায়। আমাদের code-এ আমরা directly SQL লিখি না, কিন্তু schema (`supabase-schema.sql`) SQL-এই লেখা।

### Postgres-এর যেসব feature আমরা ব্যবহার করেছি:
- **Tables, columns, foreign keys** — basic relational structure
- **CHECK constraints** — column-level validation (blood_type only 8 values)
- **Indexes** — search performance বাড়ানো
- **Triggers** — auto run on insert (নতুন user create হলে profile auto create)
- **Row Level Security (RLS)** — কে কোন row দেখতে পারবে
- **SECURITY DEFINER functions** — admin check করতে recursion ভাঙা

বিস্তারিত [05-database.md](05-database.md)-এ।

---

## 7. Vercel — Hosting কী, কোথায় চলে?

Code লেখা হল, কিন্তু সেটা internet-এ accessible হবে কীভাবে?

পুরোনো way: নিজে server ভাড়া নেওয়া (DigitalOcean / AWS), Linux config, nginx setup, SSL certificate manage — অনেক কাজ।

**Vercel** — Next.js-এর creator company — এই সব automate করে দিয়েছে।

### আমাদের workflow:

```
1. Code change কর local-এ
2. git push origin main
3. Vercel automatic detect করে
4. Build চালায়
5. ১-২ মিনিটে live URL update
```

সব এই workflow-এ automatic — কোনো manual deploy command না।

### Vercel-এর সুবিধা:
- Free tier — small project-এর জন্য enough
- HTTPS / SSL automatic
- CDN — পৃথিবীর যে কোনো প্রান্ত থেকে fast load
- Preview deployments — pull request করলে আলাদা URL মেলে test-এর জন্য
- Build logs, runtime logs সব dashboard-এ

বিস্তারিত [09-deployment.md](09-deployment.md)-এ।

---

## 8. Git + GitHub — কী এবং কেন

**Git** = code-এর history record করার tool (local-এ)
**GitHub** = সেই history online-এ host করার platform

কেন দরকার:
- Code-এর প্রত্যেকটা change-এর backup
- Mistake হলে আগের version-এ ফিরে যাওয়া
- Team-এ মিলে কাজ করা — কে কী change করেছে track করা
- Vercel deploy-এর জন্য GitHub repo-ই source

আমাদের commit message-এর format:
```
feat: নতুন feature
fix: bug fix
refactor: code structure change, behavior একই
chore: trivial / cleanup
```

---

## Stack — পুরোটা একসাথে

```
┌─────────────────────────────────────────────────────────┐
│  USER BROWSER                                            │
│  • Loads HTML/CSS/JS from Vercel                         │
│  • React + Tailwind render করে UI                       │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────────┐
│  VERCEL (Next.js running)                                │
│  • proxy.ts — auth check                                 │
│  • Server Components/Actions execute                    │
│  • Supabase-এ data request পাঠায়                       │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────────┐
│  SUPABASE                                                │
│  • Auth (session validate)                               │
│  • PostgreSQL (read/write)                               │
│  • RLS policies enforce করে — কে কী দেখবে               │
└─────────────────────────────────────────────────────────┘
```

---

## "Why?" প্রশ্নের উত্তর (Cheat Sheet)

| টিচার যা জিজ্ঞেস করতে পারে | এক লাইনের উত্তর |
|---|---|
| Why Next.js? | React-কে production-ready বানায় — routing, SSR, server actions সব built-in |
| Why TypeScript? | Compile-time type safety, fewer bugs, better tooling — C++ -এর static typing-এর মতো |
| Why Tailwind? | Utility-first — দ্রুত consistent design, কোনো CSS file maintain করা লাগে না |
| Why Supabase? | Free, complete BaaS — backend code লিখতে হয় না, RLS দিয়ে database-এই security |
| Why PostgreSQL? | Industry-standard, RLS-এর মতো advanced security, Supabase-এর native DB |
| Why Vercel? | Next.js-এর creator-এর platform — git push করলেই auto deploy |
| Why GitHub? | Industry standard version control + Vercel-এর integration |

---

## পরবর্তী পড়া

পরের doc-এ আমরা দেখব **কীভাবে এই tools গুলো install করে project run করতে হয়** — [03-setup-guide.md](03-setup-guide.md)
