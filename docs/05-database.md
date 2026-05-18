# 05 — Database (Supabase / PostgreSQL)

এই doc-এ আমাদের পুরো database design ব্যাখ্যা — কী table আছে, কেন আছে, কীভাবে link করা, এবং security কী।

পুরো schema আছে: [`supabase-schema.sql`](../supabase-schema.sql)

---

## Refresher — Relational database কী?

- **Table** = একটা Excel sheet-এর মতো (rows + columns)
- **Row** = একটা record (যেমন একজন user)
- **Column** = সেই record-এর attribute (নাম, email, ...)
- **Primary key** = row-কে uniquely identify করার field (সাধারণত `id`)
- **Foreign key** = এক table-এর row অন্য table-এর row-কে reference করে

আমাদের database **PostgreSQL** (Supabase-এর ভিতরে)। ৪টা table আছে।

---

## আমাদের ৪টা Table

```
┌──────────────┐     ┌──────────────┐
│  profiles    │◄────│   donors     │
└──────────────┘     └──────────────┘
       ▲                    ▲
       │                    │
       │            ┌───────┴────────┐
       │            │                │
┌──────┴──────────────┐    ┌─────────────────────┐
│   blood_requests    │───►│  donation_records   │
└─────────────────────┘    └─────────────────────┘
```

---

## Table 1: `profiles`

প্রতিটা signed-in user-এর extra info।

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  mobile text,
  location text,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);
```

| Column | Type | কেন |
|---|---|---|
| `id` | UUID | Supabase Auth-এর `auth.users.id`-র সাথে link |
| `full_name` | text | NOT NULL — অবশ্যই নাম থাকতে হবে |
| `email` | text | Auth থেকে copy |
| `mobile` | text | Optional |
| `location` | text | Optional |
| `is_admin` | boolean | Admin role check |
| `created_at` | timestamp | কখন create — auto |

> `auth.users` Supabase-এর built-in table যেখানে email/password/Google OAuth credentials থাকে। আমরা সেটাকে touch করি না — আমাদের `profiles` সেটার extension।

---

## Table 2: `donors`

যারা donor হয়েছে তাদের data।

```sql
create table donors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  blood_type text not null,
  location text not null,
  availability_status text default 'AVAILABLE',
  last_donation_date date,
  is_approved boolean default false,
  created_at timestamp with time zone default now()
);
```

| Column | কেন |
|---|---|
| `user_id` | কোন user → unique মানে একজন user একটাই donor record |
| `blood_type` | A_POS/A_NEG/... (CHECK constraint দিয়ে limited) |
| `location` | কোথায় available (profile-এর location-এর সাথে sync করি) |
| `availability_status` | AVAILABLE/UNAVAILABLE — toggle করা যায় |
| `last_donation_date` | শেষ blood কবে দিয়েছে (eligibility calc-এর জন্য) |
| `is_approved` | Admin approve করার আগে public-এ আসে না |

### CHECK constraint কী?

```sql
alter table donors add constraint donors_blood_type_check
  check (blood_type in ('A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'));
```

C/C++ এর `enum`-এর মতো — শুধু এই 8টা value insert হতে পারে। অন্য কিছু insert করতে গেলে database error দেবে। **Data integrity** — invalid data কখনো DB-তে ঢুকবে না।

---

## Table 3: `blood_requests`

একজন user অন্য donor-কে blood request পাঠালে এখানে record হয়।

```sql
create table blood_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references profiles(id) on delete cascade,
  donor_id uuid references donors(id) on delete cascade,
  status text default 'PENDING',
  notes text,
  created_at timestamp with time zone default now()
);
```

| Column | কেন |
|---|---|
| `requester_id` | কে request পাঠাচ্ছে |
| `donor_id` | কোন donor-এর কাছে |
| `status` | PENDING / ACCEPTED / CANCELLED / COMPLETED |
| `notes` | Optional message |

### Unique index — duplicate PENDING রোধ

```sql
create unique index blood_requests_unique_pending
  on blood_requests (requester_id, donor_id)
  where status = 'PENDING';
```

একই user একই donor-কে দুটো pending request পাঠাতে পারবে না। তবে cancelled হলে আবার পাঠাতে পারে।

---

## Table 4: `donation_records`

Donor request accept করলে এখানে একটা permanent record তৈরি হয়।

```sql
create table donation_records (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references donors(id) on delete cascade,
  requester_id uuid references profiles(id) on delete cascade,
  request_id uuid references blood_requests(id) on delete cascade,
  donation_date date not null,
  created_at timestamp with time zone default now()
);
```

> এটা **immutable** ভাবা — accept করার পর change/delete করি না। Donation history-এর জন্য।

---

## Foreign Key + Cascade

```sql
user_id uuid references profiles(id) on delete cascade
```

মানে — যদি profile delete হয়, তাহলে সেই user-এর donor row-ও automatic delete হবে। C/C++ এর pointer cleanup নিজেদের করতে হয়; এখানে DB নিজেই handle করে।

---

## Indexes — Search fast করার জন্য

```sql
create index donors_search_idx
  on donors (is_approved, availability_status, blood_type);
```

DonorSearch query (`is_approved=true AND availability='AVAILABLE'`) যাতে fast হয়। Database একটা lookup tree বানিয়ে রাখে।

> Index ছাড়া DB সব rows scan করে (O(n))। Index দিয়ে O(log n)। ১০-এ লক্ষ rows হলে অনেক difference।

---

## Trigger — Auto profile creation

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### বাংলায়:

- যখনই `auth.users`-এ কোনো new user insert হয় (register / Google sign-in)…
- Automatically `profiles` table-এ corresponding row insert হবে।
- Email + full_name (Google থেকে এলে) copy হবে।
- Profile already থাকলে শুধু email update — মানুষের নিজে দেওয়া নাম মুছবে না।

এটা না থাকলে আমাদের code-এ প্রতিবার manually profile create করতে হত। Trigger automate করে।

---

## Row Level Security (RLS) — সবচেয়ে important

### কী?

Default-এ Supabase-এর API public। মানে যে কেউ frontend থেকে API call করে যেকোনো data পেতে/বদলাতে পারে — disaster!

**RLS** = database-এর ভিতরেই row-level permission। প্রতি query-এ Postgres নিজে check করে — এই user কি এই row read/write করতে পারে?

আমরা প্রতিটা table-এ RLS enable করেছি:

```sql
alter table profiles enable row level security;
alter table donors enable row level security;
alter table blood_requests enable row level security;
alter table donation_records enable row level security;
```

### Policy কী?

প্রতি table-এ "কে কী করতে পারবে" এমন rules:

```sql
-- কে নিজের profile দেখতে পারবে
create policy "Profiles viewable by self"
  on profiles for select
  using (auth.uid() = id);

-- কে নিজের profile update করতে পারবে
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

- `auth.uid()` = currently logged-in user-এর id
- `using` = "কোন rows visible" (SELECT/UPDATE/DELETE)
- `with check` = "নতুন/updated row-এ কী constraints" (INSERT/UPDATE)

### আমাদের সব policy এক জায়গায়

**`profiles`:**
- Self-এর profile read করা যাবে
- Admin সব profile read করতে পারবে
- Authenticated user-রা একে অপরের profile দেখতে পারবে (donor profile display-এর জন্য)
- Approved donor-দের profile anonymous-ও দেখতে পারবে (public donor browse)
- Self-এর profile update + insert
- Admin যে কারো profile update (e.g. someone-কে admin বানানো)

**`donors`:**
- Approved donor-রা public-এ visible
- Self-এর own donor record visible (even if not approved)
- Admin সবগুলো দেখতে পারে
- Self-এর own record insert/update
- Admin যে কারো record update বা delete

**`blood_requests`:**
- Self-এর pathano OR self-এর কাছে আসা request visible
- Admin সবগুলো দেখে
- Logged-in user request insert করতে পারে
- Requester own pending cancel
- Donor (যার কাছে request এসেছে) status update + admin সব

**`donation_records`:**
- Requester + donor + admin দেখতে পারে
- শুধু donor own record insert (accept flow)

### SECURITY DEFINER function — recursion ভাঙা

একটা subtle problem আছে। ধরো admin check করতে গেলে `profiles`-এর `is_admin` লাগে। কিন্তু সেই query নিজেই RLS-এর under। যদি RLS-এ "admin সব দেখতে পারে" policy থাকে, সেই check আবার admin check trigger করে — **infinite recursion!**

Solution: একটা SQL function বানাই যেটা RLS bypass করে check করে:

```sql
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer    -- ← এই keyword RLS bypass করে
stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = uid), false);
$$;
```

`SECURITY DEFINER` মানে function-টা owner-এর permission-এ run করে (not caller-এর) — RLS skip। তারপর policy-গুলোতে এই function call করি:

```sql
create policy "Admins can view all profiles"
  on profiles for select
  using (public.is_admin(auth.uid()));
```

একই trick আমরা `donor_user_id()` function-এও use করেছি।

---

## Schema কীভাবে evolve করি?

`supabase-schema.sql` **idempotent** — re-run safe:
- `create table if not exists`
- `drop policy if exists` → তারপর `create policy`
- `do $$ ... if not exists ... end $$` patterns

মানে কোনো change করতে চাইলে:
1. `supabase-schema.sql` edit করি
2. Supabase SQL Editor-এ পুরোটা আবার run
3. সব আপডেট হয়, পুরোনো data নষ্ট হয় না

> **Production data থাকা DB-তে blindly run করার আগে test DB-তে চালাও।** কোনো `drop column` করলে data হারাবে।

---

## পরবর্তী পড়া

Authentication কীভাবে কাজ করে → [06-authentication.md](06-authentication.md)
