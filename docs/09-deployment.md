# 09 — Deployment (Vercel + GitHub workflow)

আমাদের code কীভাবে internet-এ live হয় — এই doc-এ।

---

## Big picture

```
Local laptop                GitHub                  Vercel
─────────────              ────────                  ───────
write code  ─── git push ─►  repo  ─── webhook ─►  detects push
                                                   ▼
                                                   builds
                                                   ▼
                                                   deploys
                                                   ▼
                                              new URL live (~1 min)
```

**কোনো manual deploy command না।** Push করলেই Vercel auto-detect করে।

---

## প্রথমবার setup (একবারের কাজ)

### 1. GitHub repo

Code GitHub-এ থাকতে হবে। Already at: https://github.com/julinath/blood-finder

### 2. Vercel account
- https://vercel.com → Sign up (GitHub দিয়ে sign in সহজ)
- Free tier — small project-এর জন্য enough

### 3. Vercel-এ project import
- Vercel dashboard → "Add New" → "Project"
- GitHub repo list থেকে `blood-finder` select
- Framework auto-detect: Next.js ✓
- **Environment Variables** add (নিচে দেখো)
- "Deploy" চাপো

### 4. Environment Variables

Vercel automatically `.env.local` দেখে না (security)। Manually add করতে হয়:

Vercel dashboard → Project → Settings → Environment Variables

| Name | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxxxx.supabase.co | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGc... | Production, Preview, Development |

Save → Vercel automatically redeploy with new vars।

### 5. Domain
- Default URL: `blood-finder-julinath.vercel.app` (auto-generated)
- আমাদের আছে: `blood-finder-bangladesh.vercel.app` (custom alias)
- Custom domain (যেমন .com) add করা যায় — paid plan-এ free, free plan-এ DNS configuration লাগে

---

## Daily workflow

### Local-এ changes:
```bash
# নতুন feature add বা bug fix করার পর:
git add <file>            # specific file stage
git commit -m "feat: ..."  # commit
git push origin main       # GitHub-এ push
```

### Vercel-এ কী হয় background-এ:
1. GitHub-এ push detect হয় (webhook)
2. Vercel এ build trigger হয়:
   - `npm install` (যদি dependencies বদলায়)
   - `npm run build` (Next.js production build)
3. ১-২ মিনিটে build complete
4. New version live হয়
5. Old version 24 hours পর্যন্ত accessible থাকে (rollback-এর জন্য)

Vercel dashboard → Deployments — সব history দেখা যায়।

---

## Preview Deployments

Branch বা PR push করলে Vercel আলাদা URL বানিয়ে দেয় — production ছাড়াই test করা যায়।

```bash
git checkout -b feature/new-thing
# কাজ করো
git push -u origin feature/new-thing
# GitHub-এ Pull Request open
# Vercel automatically preview URL দেয়
```

PR comments-এ Vercel bot URL post করে — কেউ click করে review করতে পারে।

---

## Logs দেখা

### Build logs
Vercel dashboard → Deployments → click any → "Building" tab — পুরো build output।

### Runtime logs
Vercel dashboard → Project → Logs tab — server runtime-এর সব `console.log`, errors।

`console.log` থেকে data debug করার সহজ way।

---

## কোনো changes Vercel-এ যাচ্ছে না কেন?

Common reasons:

| Symptom | Solution |
|---|---|
| Push হয়েছে কিন্তু Vercel deploy হয়নি | Vercel Deployments tab check — error থাকতে পারে |
| Build failing | Build logs দেখো — সাধারণত TypeScript error বা missing env var |
| Deploy successful কিন্তু site পুরোনো | Browser cache clear (Ctrl+Shift+R) |
| Env var change করেছ কিন্তু effect নাই | Settings → Env Vars → Save করার পর "Redeploy" trigger লাগে |

---

## যখন build fail

Local-এ আগে test করতে:
```bash
npm run build       # Next.js production build (Node 20+ needed)
```

Common errors:
- **TypeScript error** — `npx tsc --noEmit` দিয়ে আগে fix
- **Lint error** — `npm run lint` দিয়ে check
- **Missing env var** — Local-এ `.env.local`-এ আছে কিনা verify

---

## Rollback

কোনো deploy production-এ break করলে:
- Vercel dashboard → Deployments
- পুরোনো একটা working deployment-এ "..." menu → "Promote to Production"
- Instant rollback (no rebuild)

---

## Supabase deployment — কোনো কাজ লাগে?

**না।** Supabase already cloud-hosted। আমরা শুধু local code-এর Vercel link। Database/schema/auth সব Supabase-এ already running।

কিন্তু:
- Schema change করলে → Supabase SQL editor-এ আবার run
- Auth provider config change করলে → Supabase dashboard-এ update
- New API key generate করলে → Vercel env vars update

---

## Production checklist

Before going to production-grade (এখন বা future-এ):

- [ ] HTTPS automatic — Vercel ✓
- [ ] Environment variables — Vercel ✓
- [ ] Database backup — Supabase free tier-এ daily backup
- [ ] Error logging — `console.log` + Vercel logs (basic)
- [ ] Rate limiting — Supabase default + extra layer optional
- [ ] CDN — Vercel ✓
- [ ] Custom domain — optional
- [ ] Email verification on signup — Supabase configurable
- [ ] OAuth providers — Google added (others optional)

---

## পরবর্তী পড়া

Demo + Q&A → [10-presenting.md](10-presenting.md)
