# 03 — Setup Guide (একদম শূন্য থেকে)

এই guide-এ ধরে নিচ্ছি তোমার laptop-এ Node.js, Git কিছু install নেই। সবকিছু step-by-step শুরু থেকে দেখাব।

> **Estimated time:** ৩০-৪৫ মিনিট (প্রথমবার)

---

## Checklist (যা যা লাগবে)

- [ ] একটা laptop (Windows / Mac / Linux যেকোনোটা চলবে)
- [ ] Internet connection
- [ ] একটা email account (GitHub + Supabase + Vercel signup-এর জন্য)
- [ ] একটু ধৈর্য — প্রথমবার অনেক tool install হবে

---

## Step 1 — Node.js install

**Node.js কী?** — JavaScript-কে browser-এর বাইরে (terminal-এ) চালানোর runtime। Next.js চালাতে Node দরকার।

### Windows / Mac
1. https://nodejs.org যাও
2. **LTS version** (Long Term Support — stable) download করো — currently Node 20+
3. Installer চালাও, default options সব OK

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Verify
Terminal/Command Prompt-এ:
```bash
node --version    # v20.x.x বা higher দেখাবে
npm --version     # 10.x.x বা higher দেখাবে
```

> **npm** হল Node-এর package manager (C/C++ -এ যেমন library link করো, এখানে npm দিয়ে library install হয়)।

---

## Step 2 — Git install

**Git কী?** — Code-এর history রাখার tool।

### Windows
https://git-scm.com/download/win → installer download করো

### Mac
```bash
brew install git
```
(`brew` না থাকলে: https://brew.sh)

### Linux
```bash
sudo apt install git
```

### Verify
```bash
git --version    # git version 2.x.x
```

### Git-এ নাম/email set করো (একবার)
```bash
git config --global user.name "Juli Nath"
git config --global user.email "তোমার@email.com"
```

---

## Step 3 — Code editor (VS Code)

কোনো plain text editor (Notepad ইত্যাদি) দিয়ে কাজ করবে না। আমরা **VS Code** ব্যবহার করি।

1. https://code.visualstudio.com → Download
2. Install করো
3. Extensions install করো (left sidebar-এর icon থেকে):
   - **ESLint**
   - **Tailwind CSS IntelliSense**
   - **TypeScript** (already built-in, কিছু করতে হবে না)

---

## Step 4 — GitHub repo clone

```bash
# তুমি যেই folder-এ project রাখতে চাও সেখানে যাও, যেমন:
cd ~/Projects

# Repo clone করো
git clone https://github.com/julinath/blood-finder.git

# Project folder-এ ঢোকো
cd blood-finder
```

এখন `ls` (Mac/Linux) বা `dir` (Windows) দিলে অনেক files দেখবে। VS Code-এ open করতে:
```bash
code .
```

---

## Step 5 — npm packages install

`package.json` file-এ লেখা আছে কোন কোন library দরকার। সব একসাথে install করতে:

```bash
npm install
```

> এটা প্রথমবার ১-৩ মিনিট সময় নিবে। একটা `node_modules/` folder তৈরি হবে — এখানেই সব library থাকবে। এটা git-এ যায় না (gitignored)।

---

## Step 6 — Supabase project তৈরি

আমাদের database আর auth এই Supabase-এ। নিজের একটা Supabase project তৈরি করতে হবে।

### 6.1 Account তৈরি
1. https://supabase.com → Start your project → Sign up (GitHub দিয়ে sign in সহজ)

### 6.2 নতুন project create
1. Dashboard-এ "New Project" → name দাও (যেমন `blood-finder-test`)
2. Database password — শক্ত একটা পাসওয়ার্ড দিয়ে কোথাও save রাখো
3. Region — `Singapore (Southeast Asia)` বেছে নাও (Bangladesh-এর কাছে)
4. Plan: Free
5. Create — ১-২ মিনিট wait

### 6.3 API keys নাও
Project ready হলে: left sidebar → **Settings** → **API**

দুটো জিনিস copy করতে হবে:
- **Project URL** (`https://xxxxx.supabase.co`)
- **anon public key** (লম্বা `eyJ...` token)

### 6.4 Database schema চালাও

Left sidebar → **SQL Editor** → "New query"

`supabase-schema.sql` file-টা open করে পুরো content copy করো (project folder-এর root-এ আছে), Supabase SQL editor-এ paste করো, **Run** চাপো।

> Success message দেখলেই সব tables + RLS policies তৈরি। কোনো error হলে দেখো error message কী বলছে।

---

## Step 7 — `.env.local` file তৈরি

Project root-এ একটা new file বানাও — name: `.env.local`

ভিতরে এই দুটো line দাও (তোমার নিজের values দিয়ে replace করো):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> **Important:**
> - `.env.local` git-এ commit হয় না (gitignored) — secret data এটাই rule
> - কোনো quote (`"`) দিও না value-র পাশে
> - `NEXT_PUBLIC_` prefix দিলে value browser-এও access পাবে (এই দুটো safe — anon key public-এ থাকার জন্যই বানানো)

---

## Step 8 — Dev server চালাও

```bash
npm run dev
```

কিছুক্ষণ পর terminal-এ দেখাবে:
```
▲ Next.js 16.x.x (Turbopack)
- Local:   http://localhost:3000
✓ Ready in 1.2s
```

Browser-এ http://localhost:3000 open করো — Blood Finder home page দেখবে!

---

## Step 9 — প্রথম user বানাও (test)

1. Site-এ "Register" → email + password দাও
2. Supabase dashboard-এ Authentication → Users → তোমার user দেখবে
3. Site-এ login করো
4. Become a Donor → blood type + location + mobile দিয়ে register
5. Supabase dashboard → Table editor → `donors` table → তোমার row দেখবে (is_approved = false)
6. নিজেকে admin বানাতে — Supabase SQL editor-এ:
   ```sql
   UPDATE profiles SET is_admin = true WHERE email = 'তোমার@email.com';
   ```
7. Site-এ logout করে আবার login করো → navbar-এ "Admin" link দেখবে
8. /admin → তোমার pending donor approve করো
9. Home page-এ গিয়ে refresh — তোমাকে donor list-এ দেখবে

🎉 **Setup complete!**

---

## Step 10 (Optional) — Google OAuth setup

Google দিয়ে login enable করতে চাইলে:

1. Supabase dashboard → Authentication → Providers → Google → Enable
2. Google Cloud Console-এ গিয়ে OAuth client বানাতে হবে (একটু complex — কেউ help নিও)
3. Redirect URL দাও: `https://xxxxx.supabase.co/auth/v1/callback`
4. Client ID + Secret Supabase-এ paste করো

> এটা না করলেও email/password login চলবে — Google login button কাজ করবে না, এতটুকুই।

---

## Common সমস্যা ও সমাধান

### "Cannot find module" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
আগে কোনো dev server চলছে। `Ctrl+C` দিয়ে close করো, বা different port:
```bash
npm run dev -- -p 3001
```

### "Connect timeout to Supabase"
- Internet check করো
- `.env.local`-এর URL ঠিক আছে কিনা verify করো
- Network IPv6 issue হলে:
  ```bash
  NODE_OPTIONS="--dns-result-order=ipv4first" npm run dev
  ```

### Supabase SQL editor-এ "policy already exists"
Schema-টা **idempotent** — re-run safe। কিন্তু কখনো কখনো `drop policy if exists` missing থাকলে error হয়। ওই specific policy drop করে আবার run।

### Page load slow (১০+ second)
Network/Supabase issue। Production (Vercel)-এ এই issue হবে না। উপরের IPv4-first workaround try করো।

---

## কোন command কখন

| Command | কখন |
|---|---|
| `npm install` | প্রথমবার, বা package.json change হলে |
| `npm run dev` | Development-এ — code change করলে auto reload |
| `npm run build` | Production build (Vercel auto করে) |
| `npm run lint` | Code-এ ESLint check |
| `git pull` | GitHub থেকে নতুন changes নিয়ে আসা |
| `git add .` | সব changed file stage করা |
| `git commit -m "message"` | Local-এ commit করা |
| `git push` | GitHub-এ পাঠানো (Vercel auto-deploy চালু হবে) |

---

## পরবর্তী পড়া

Setup হয়ে গেছে। এখন code-এর ভিতরে কী আছে দেখো — [04-project-structure.md](04-project-structure.md)
