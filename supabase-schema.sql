-- Run this in Supabase SQL Editor.
-- Safe to re-run: every statement is idempotent.

-- ============================================================================
-- Tables
-- ============================================================================

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  mobile text,
  location text,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);

-- Donors
create table if not exists donors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  blood_type text not null,
  location text not null,
  availability_status text default 'AVAILABLE',
  last_donation_date date,
  is_approved boolean default false,
  created_at timestamp with time zone default now()
);

-- Columns added after the original release (idempotent for existing DBs).
alter table profiles add column if not exists district text;
alter table donors add column if not exists district text;
alter table donors add column if not exists sex text;
alter table donors add column if not exists age integer;
alter table donors add column if not exists weight_kg integer;
alter table donors add column if not exists health_conditions text;
alter table donors add column if not exists donation_count integer not null default 0;

-- Blood Requests
create table if not exists blood_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references profiles(id) on delete cascade,
  donor_id uuid references donors(id) on delete cascade,
  status text default 'PENDING',
  notes text,
  created_at timestamp with time zone default now()
);

-- Donation Records (immutable)
create table if not exists donation_records (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references donors(id) on delete cascade,
  requester_id uuid references profiles(id) on delete cascade,
  request_id uuid references blood_requests(id) on delete cascade,
  donation_date date not null,
  created_at timestamp with time zone default now()
);

-- ============================================================================
-- Enum-like CHECK constraints (PostgreSQL doesn't easily add native enums later)
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'donors_blood_type_check') then
    alter table donors add constraint donors_blood_type_check
      check (blood_type in ('A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'donors_availability_check') then
    alter table donors add constraint donors_availability_check
      check (availability_status in ('AVAILABLE','UNAVAILABLE'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'blood_requests_status_check') then
    alter table blood_requests add constraint blood_requests_status_check
      check (status in ('PENDING','ACCEPTED','CANCELLED','COMPLETED'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'donors_sex_check') then
    alter table donors add constraint donors_sex_check
      check (sex is null or sex in ('MALE','FEMALE','OTHER'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'donors_age_check') then
    alter table donors add constraint donors_age_check
      check (age is null or age between 16 and 70);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'donors_weight_check') then
    alter table donors add constraint donors_weight_check
      check (weight_kg is null or weight_kg between 30 and 250);
  end if;
end $$;

-- Prevent duplicate PENDING requests from the same user to the same donor.
create unique index if not exists blood_requests_unique_pending
  on blood_requests (requester_id, donor_id)
  where status = 'PENDING';

-- Helpful lookup indexes for the search and dashboard queries.
create index if not exists donors_search_idx
  on donors (is_approved, availability_status, blood_type);
create index if not exists blood_requests_requester_idx
  on blood_requests (requester_id, created_at desc);
create index if not exists blood_requests_donor_idx
  on blood_requests (donor_id, created_at desc);
create index if not exists donation_records_donor_idx
  on donation_records (donor_id, donation_date desc);

-- ============================================================================
-- Auto-create profile on signup
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert, or update if the row already exists (e.g. Google re-login where
  -- the trigger fired previously without a `full_name`). Mobile-number
  -- registrations carry `mobile` in the signup metadata.
  insert into public.profiles (id, full_name, email, mobile)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    ),
    new.email,
    nullif(new.raw_user_meta_data->>'mobile', '')
  )
  on conflict (id) do update
    set full_name = case
          when profiles.full_name is null or profiles.full_name = ''
            then excluded.full_name
          else profiles.full_name
        end,
        email = excluded.email,
        mobile = coalesce(profiles.mobile, excluded.mobile);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- Donation count — kept in sync by trigger on donation_records
-- ============================================================================

create or replace function public.bump_donation_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update donors
    set donation_count = donation_count + 1,
        last_donation_date = greatest(coalesce(last_donation_date, new.donation_date), new.donation_date)
  where id = new.donor_id;
  return new;
end;
$$;

create or replace trigger on_donation_record_created
  after insert on donation_records
  for each row execute procedure public.bump_donation_count();

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table profiles enable row level security;
alter table donors enable row level security;
alter table blood_requests enable row level security;
alter table donation_records enable row level security;

-- ---- Helper functions (SECURITY DEFINER) ----------------------------------
-- These run with the function owner's permissions and skip RLS, which is the
-- canonical way to break recursive policy references (e.g. an "admin can view
-- all profiles" check that itself queries `profiles`).
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = uid), false);
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

-- Returns the donor row's user_id without invoking donor RLS. Used by
-- blood_requests / donation_records policies to avoid cross-table recursion.
create or replace function public.donor_user_id(d_id uuid)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select user_id from public.donors where id = d_id;
$$;

revoke all on function public.donor_user_id(uuid) from public;
grant execute on function public.donor_user_id(uuid) to anon, authenticated;

-- Admins can permanently delete a user account. Deleting from auth.users
-- cascades to profiles → donors → blood_requests etc. SECURITY DEFINER is
-- required because the authenticated role has no access to auth.users; the
-- is_admin gate + self-delete guard keep it safe.
create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Only admins can delete users';
  end if;
  if target_user_id = auth.uid() then
    raise exception 'You cannot delete your own account';
  end if;
  if public.is_admin(target_user_id) then
    raise exception 'Revoke admin access before deleting an admin';
  end if;
  delete from auth.users where id = target_user_id;
end;
$$;

revoke all on function public.admin_delete_user(uuid) from public;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- ---- Profiles ----
-- Drop old permissive policy if it exists, then re-create tighter ones.
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Profiles viewable by self" on profiles;
drop policy if exists "Profiles of approved donors viewable" on profiles;
drop policy if exists "Profiles viewable by authenticated users" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Users can insert own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Admins can update any profile" on profiles;

create policy "Profiles viewable by self"
  on profiles for select
  using (auth.uid() = id);

create policy "Profiles viewable by authenticated users"
  on profiles for select
  using (auth.role() = 'authenticated');

-- Anonymous visitors may see profiles of approved donors (for the public search).
create policy "Profiles of approved donors viewable"
  on profiles for select
  using (exists (select 1 from donors where user_id = profiles.id and is_approved = true));

create policy "Admins can view all profiles"
  on profiles for select
  using (public.is_admin(auth.uid()));

-- Allow the app to self-heal a missing profile row (auth callback / become-donor
-- upserts use this). The `with check` confines it to your own row.
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can update any profile"
  on profiles for update
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---- Donors ----
drop policy if exists "Approved donors are viewable by everyone" on donors;
drop policy if exists "Admins can view all donors" on donors;
drop policy if exists "Users can view own donor record" on donors;
drop policy if exists "Users can insert own donor record" on donors;
drop policy if exists "Users can update own donor record" on donors;
drop policy if exists "Admins can update any donor" on donors;
drop policy if exists "Admins can delete donors" on donors;

create policy "Approved donors are viewable by everyone"
  on donors for select
  using (is_approved = true);

create policy "Users can view own donor record"
  on donors for select
  using (auth.uid() = user_id);

create policy "Admins can view all donors"
  on donors for select
  using (public.is_admin(auth.uid()));

create policy "Users can insert own donor record"
  on donors for insert
  with check (auth.uid() = user_id);

create policy "Users can update own donor record"
  on donors for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can update any donor"
  on donors for update
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "Admins can delete donors"
  on donors for delete
  using (public.is_admin(auth.uid()));

-- ---- Blood requests ----
drop policy if exists "Users can view own requests" on blood_requests;
drop policy if exists "Admins can view all requests" on blood_requests;
drop policy if exists "Logged in users can create requests" on blood_requests;
drop policy if exists "Requesters can cancel own pending requests" on blood_requests;
drop policy if exists "Donors and admins can update requests" on blood_requests;

create policy "Users can view own requests"
  on blood_requests for select
  using (
    auth.uid() = requester_id
    or auth.uid() = public.donor_user_id(donor_id)
  );

create policy "Admins can view all requests"
  on blood_requests for select
  using (public.is_admin(auth.uid()));

create policy "Logged in users can create requests"
  on blood_requests for insert
  with check (auth.uid() = requester_id);

create policy "Requesters can cancel own pending requests"
  on blood_requests for update
  using (auth.uid() = requester_id)
  with check (auth.uid() = requester_id);

create policy "Donors and admins can update requests"
  on blood_requests for update
  using (
    auth.uid() = public.donor_user_id(donor_id)
    or public.is_admin(auth.uid())
  );

-- ---- Donation records ----
drop policy if exists "Relevant users can view donation records" on donation_records;
drop policy if exists "Admins can view all donation records" on donation_records;
drop policy if exists "System can insert donation records" on donation_records;
drop policy if exists "Donors can insert own donation records" on donation_records;

create policy "Relevant users can view donation records"
  on donation_records for select
  using (
    auth.uid() = requester_id
    or auth.uid() = public.donor_user_id(donor_id)
  );

create policy "Admins can view all donation records"
  on donation_records for select
  using (public.is_admin(auth.uid()));

-- Only the donor of a record may insert it (matches the "accept request" flow).
create policy "Donors can insert own donation records"
  on donation_records for insert
  with check (auth.uid() = public.donor_user_id(donor_id));
