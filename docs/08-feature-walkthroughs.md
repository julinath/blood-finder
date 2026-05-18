# 08 — Feature Walkthroughs (code level)

এই doc-এ প্রতিটা মূল feature step-by-step trace করব — কোন file, কোন function, কোন table touch হয়।

প্রতিটা walkthrough নিজে নিজে demo-এর সময় চালিয়ে verify করো।

---

## Feature 1: Donor Search (Home page)

### User experience
User home page-এ যায় → hero দেখে → stats দেখে → "Featured Donors" section-এ ৬টা donor card → search form দিয়ে filter করতে পারে → কোনো card click করলে donor profile।

### Code trace

**1. Browser → `/` →**
[`src/proxy.ts`](../src/proxy.ts) checks: public route, pass.

**2. Server component runs:**
[`src/app/page.tsx`](../src/app/page.tsx)
- `createClient()` — Supabase server client
- `count: 'exact', head: true` দিয়ে দুটো count fetch:
  - Total approved donors
  - Currently available donors
- Sections assemble: `<Hero />`, `<StatsStrip donorCount=... />`, heading, `<DonorSearch preview />`, `<HowItWorks />`, `<WhyDonate />`

```tsx
export const revalidate = 60   // stats cache 1 minute
```

**3. Client component (`DonorSearch preview`):**
[`src/components/DonorSearch.tsx`](../src/components/DonorSearch.tsx)
- `useEffect` চালু হয় browser-এ
- Supabase query: approved + available donors, limit 6
- Skeleton loader → real cards-এ replace

**4. Search:**
User form submit করলে `search()` called → same query but with filter → results state update → re-render।

**5. Card click:**
`<Link href={'/donor/${donor.id}'}>` — navigation।

### Tables touched
- `donors` (select with `is_approved = true`)
- `profiles` (joined for name)

### RLS
- `"Approved donors are viewable by everyone"` — anon allowed

---

## Feature 2: User Registration

### User experience
Home → Register → name + email + password → submit → toast "Welcome!" → dashboard।

### Code trace

**1. Browser → `/register` →** proxy: public, pass.

**2. Page:**
[`src/app/(auth)/register/page.tsx`](../src/app/(auth)/register/page.tsx)
- Client component, form state
- Submit calls:
  ```ts
  supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } }
  })
  ```

**3. Supabase side:**
- `auth.users` table-এ row insert
- **Trigger** `handle_new_user` fires automatically
- `profiles` row created with id + email + full_name

**4. Redirect:**
- `router.push('/dashboard?flash=registered')`
- Browser `/dashboard?flash=registered` load
- `Flash` component "Welcome!" toast দেখায়

### Tables touched
- `auth.users` (Supabase auto)
- `profiles` (via trigger)

---

## Feature 3: Login (Email/Password)

[`src/app/(auth)/login/page.tsx`](../src/app/(auth)/login/page.tsx)
- Email + password form
- `supabase.auth.signInWithPassword(...)` call
- Success → session cookie set → redirect to `/dashboard?flash=login-ok`
- Failure → inline error message

### Tables touched
- `auth.users` (read for password verification, Supabase internal)

---

## Feature 4: Google OAuth Login

[`src/app/(auth)/login/page.tsx`](../src/app/(auth)/login/page.tsx) — Google button
- `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ... }})`
- Browser redirect-এ Google → Google login → back to Supabase → back to `/auth/callback`

[`src/app/auth/callback/route.ts`](../src/app/auth/callback/route.ts)
- URL থেকে `code` extract
- `supabase.auth.exchangeCodeForSession(code)` — session create
- Redirect `/dashboard`

### Tables touched
- `auth.users` (insert for new Google user)
- `profiles` (via trigger)

---

## Feature 5: Become Donor (post-refactor)

### User experience
Logged-in user → `/become-donor` → form pre-filled with mobile + location from profile → submit → toast "Donor application submitted" → dashboard।

### Code trace

**1. Browser → `/become-donor` →** proxy: protected route, user logged in, pass.

**2. Server component:**
[`src/app/(main)/become-donor/page.tsx`](../src/app/(main)/become-donor/page.tsx)
- Auth check, redirect if no user
- Fetch profile (mobile, location) + check if already donor
- If already donor → "Already registered" message
- Else → pass defaults to client form

**3. Client form:**
[`src/app/(main)/become-donor/_components.tsx`](../src/app/(main)/become-donor/_components.tsx)
- `useActionState(registerAsDonor, null)` for server action binding
- `defaultValue={defaults.mobile}` etc. for prefill
- "Pre-filled from your profile" hint দেখায় if any default present

**4. Server action runs on submit:**
[`src/app/(main)/become-donor/actions.ts`](../src/app/(main)/become-donor/actions.ts)
- Validate: blood_type valid enum, location non-empty, mobile valid format
- Check existing donor (race condition safety)
- Pull existing profile, upsert with synced mobile + location
- Insert donors row (is_approved: false)
- `revalidatePath('/profile')`, `revalidatePath('/dashboard')`, `revalidatePath('/become-donor')`
- `redirect('/dashboard?flash=donor-pending')`

### Tables touched
- `profiles` (upsert — sync mobile, location, keep full_name)
- `donors` (insert — new row, awaiting approval)

### Why server action?
- Validation server-side — can't be bypassed
- `revalidatePath` invalidates `/profile` cache → user immediately sees updated mobile/location
- Cleaner code than manual fetch + state management

---

## Feature 6: Browse `/donors` (full list)

[`src/app/donors/page.tsx`](../src/app/donors/page.tsx)
- Server component with own hero band
- Renders `<DonorSearch />` (no preview prop, so full limit 60)

[`src/components/DonorSearch.tsx`](../src/components/DonorSearch.tsx) without preview:
- Limit 60 instead of 6
- Shows "N donors found" count
- No "Browse all" CTA

### Tables touched
- `donors` (with filter)
- `profiles` (joined)

---

## Feature 7: View Donor Profile (`/donor/[id]`)

[`src/app/donor/[id]/page.tsx`](../src/app/donor/[id]/page.tsx)
- Server component
- Param `id` থেকে donor lookup
- Public info display: name, blood type, location, last donation
- "Request blood" button → `/request?donor={id}` (login required)

### Tables touched
- `donors` (single row)
- `profiles` (for name)

### RLS
- Anyone can view if `is_approved = true`

---

## Feature 8: Send Blood Request

[`src/app/(main)/request/page.tsx`](../src/app/(main)/request/page.tsx)
- Logged-in only (proxy enforces)
- Reads `?donor=<id>` query param
- Fetches donor info to display
- Optional notes field
- Submit → insert into `blood_requests` (status PENDING)
- Redirect to dashboard

### Tables touched
- `donors` (read for display)
- `blood_requests` (insert)

### Constraint enforced
- Unique index `(requester_id, donor_id) where status = 'PENDING'` — can't double-submit

---

## Feature 9: Dashboard

### User experience
Login user-এর landing page। Three sections:
- Donor status (if applicable): approved / pending, availability toggle, last donation
- Sent requests (যেগুলো আমি পাঠিয়েছি)
- Received requests (যদি আমি donor হই)

### Code trace

[`src/app/(main)/dashboard/page.tsx`](../src/app/(main)/dashboard/page.tsx) (server)
- Auth check
- Parallel fetches:
  - User-এর donor row (if any)
  - Sent requests (joined with donor info)
  - Received requests (if user is donor)
  - Donation history (if user is donor)
- Pass all to client components

[`src/app/(main)/dashboard/_components.tsx`](../src/app/(main)/dashboard/_components.tsx) (client)
- Renders sections
- Action buttons: cancel sent request, accept/decline received request, toggle availability
- Each button → server action

[`src/app/(main)/dashboard/actions.ts`](../src/app/(main)/dashboard/actions.ts)
- `cancelRequest(id)` — UPDATE status='CANCELLED'
- `acceptRequest(id)` — UPDATE status='ACCEPTED', insert donation record, update donor.last_donation_date
- `declineRequest(id)` — UPDATE status='CANCELLED' (with note)
- `setAvailability(status)` — UPDATE donor row

### Tables touched
- `donors` (read for status, write for availability toggle / last_donation_date)
- `blood_requests` (read both directions, write for status changes)
- `donation_records` (insert on accept)

---

## Feature 10: Admin Panel

[`src/app/admin/page.tsx`](../src/app/admin/page.tsx) (server)
- Auth + admin check
- Three sections:
  - Pending donors (is_approved = false)
  - Recent blood requests
  - All users (latest 100)

[`src/app/admin/_components.tsx`](../src/app/admin/_components.tsx) (client)
- DonorApprovalActions: Approve / Reject buttons
- UserAdminToggle: Make admin / Revoke admin

[`src/app/admin/actions.ts`](../src/app/admin/actions.ts)
- `requireAdmin()` helper — auth + admin check OR throw
- `approveDonor(donorId)` — UPDATE donors SET is_approved=true
- `rejectDonor(donorId)` — DELETE donors row
- `setUserAdmin(userId, makeAdmin)` — UPDATE profiles.is_admin

### Tables touched
- `donors` (update/delete)
- `blood_requests` (read only)
- `profiles` (read all, update is_admin)

### RLS
- "Admins can view all donors/requests/profiles" + write policies allow these operations
- Recursion broken via `public.is_admin(uid)` SECURITY DEFINER function

---

## Feature 11: Profile Edit

[`src/app/(main)/profile/page.tsx`](../src/app/(main)/profile/page.tsx) (server)
- Fetch profile + donor (if any)
- Pass to `<ProfileSection>`

[`src/app/(main)/profile/_components.tsx`](../src/app/(main)/profile/_components.tsx) (client)
- Two forms:
  - Profile (name, mobile, location) — uses `useActionState(updateProfile)`
  - Donor location (only if user is donor) — uses `useActionState(updateDonorLocation)`
- Each form shows success/error feedback banner

[`src/app/(main)/profile/actions.ts`](../src/app/(main)/profile/actions.ts)
- `updateProfile` — validate, upsert profiles, revalidatePath
- `updateDonorLocation` — validate, update donors.location, revalidatePath

### Tables touched
- `profiles` (upsert)
- `donors` (update for location)

---

## Common patterns to remember

### Pattern 1: Server page fetches data, passes to client form

```tsx
// page.tsx (server)
const profile = await supabase.from('profiles').select(...)
return <ClientForm defaults={profile} />

// _components.tsx (client)
'use client'
export function ClientForm({ defaults }) {
  // form with defaultValue=defaults.x
}
```

### Pattern 2: Server action with useActionState

```tsx
'use client'
import { someAction } from './actions'
const [state, action] = useActionState(someAction, null)
return <form action={action}>...</form>
```

### Pattern 3: Flash messages via URL query

```ts
// In action
redirect('/dashboard?flash=donor-pending')

// In layout
<Flash />  // reads ?flash=key and shows toast
```

### Pattern 4: Admin check pattern

```ts
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profile?.is_admin) throw new Error('Forbidden')
  return { supabase, user }
}
```

---

## পরবর্তী পড়া

Deployment workflow → [09-deployment.md](09-deployment.md)
