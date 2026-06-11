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
-- The donor search filters by district as often as by blood group.
create index if not exists donors_search_district_idx
  on donors (is_approved, availability_status, district, blood_type);
create index if not exists blood_requests_requester_idx
  on blood_requests (requester_id, created_at desc);
create index if not exists blood_requests_donor_idx
  on blood_requests (donor_id, created_at desc);
create index if not exists donation_records_donor_idx
  on donation_records (donor_id, donation_date desc);
-- Covering indexes for the remaining foreign keys (performance advisor).
create index if not exists donation_records_request_idx
  on donation_records (request_id);
create index if not exists donation_records_requester_idx
  on donation_records (requester_id);

-- ============================================================================
-- Auto-create profile on signup
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger functions are invoked by triggers, never via the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

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

revoke execute on function public.bump_donation_count() from public, anon, authenticated;

-- ============================================================================
-- Complete a blood request — the REQUESTER (who received the blood) confirms
-- the donation actually happened. The donor must NOT be able to confirm their
-- own donations, otherwise they could inflate their public donation count.
-- Mirrors record_emergency_donation: the receiver attests, the donor gets the
-- credit. Flips ACCEPTED → COMPLETED and inserts the donation record in one
-- atomic step (the trigger above then bumps donation_count/last_donation_date).
-- ============================================================================

create or replace function public.complete_blood_request(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_donor_id uuid;
  v_requester uuid;
  v_status text;
begin
  select donor_id, requester_id, status into v_donor_id, v_requester, v_status
    from blood_requests where id = p_request_id;
  if v_donor_id is null then
    raise exception 'Request not found';
  end if;
  if v_requester is null or v_requester <> auth.uid() then
    raise exception 'Only the requester can confirm the donation';
  end if;
  if v_status <> 'ACCEPTED' then
    raise exception 'Request is not in an accepted state';
  end if;
  update blood_requests set status = 'COMPLETED' where id = p_request_id;
  insert into donation_records (donor_id, requester_id, request_id, donation_date)
  values (v_donor_id, v_requester, p_request_id, current_date);
end;
$$;

revoke all on function public.complete_blood_request(uuid) from public, anon;
grant execute on function public.complete_blood_request(uuid) to authenticated;

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
revoke execute on function public.admin_delete_user(uuid) from anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- Policy style notes:
--   * ONE permissive policy per table/action (the multiple-policy split costs
--     a per-row OR evaluation on every query — Supabase performance lint).
--   * auth.uid()/auth.role() always wrapped in a scalar subquery
--     `(select auth.uid())` so Postgres evaluates them once per statement,
--     not once per row (auth_rls_initplan lint).

-- ---- Profiles ----
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Profiles viewable by self" on profiles;
drop policy if exists "Profiles of approved donors viewable" on profiles;
drop policy if exists "Profiles viewable by authenticated users" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Users can insert own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Admins can update any profile" on profiles;
drop policy if exists "profiles_select" on profiles;
drop policy if exists "profiles_insert" on profiles;
drop policy if exists "profiles_update" on profiles;

-- Any signed-in user may read profiles (covers self + admin); anonymous
-- visitors only see profiles of approved donors — and only the columns
-- granted to anon at the bottom of this file (no email/mobile).
create policy "profiles_select" on profiles for select using (
  (select auth.role()) = 'authenticated'
  or exists (
    select 1 from donors
    where donors.user_id = profiles.id and donors.is_approved = true
  )
);

-- Allow the app to self-heal a missing profile row (auth callback / become-donor
-- upserts use this). The `with check` confines it to your own row.
create policy "profiles_insert" on profiles for insert
  with check ((select auth.uid()) = id);

create policy "profiles_update" on profiles for update
  using ((select auth.uid()) = id or public.is_admin((select auth.uid())))
  with check ((select auth.uid()) = id or public.is_admin((select auth.uid())));

-- ---- Donors ----
drop policy if exists "Approved donors are viewable by everyone" on donors;
drop policy if exists "Admins can view all donors" on donors;
drop policy if exists "Users can view own donor record" on donors;
drop policy if exists "Users can insert own donor record" on donors;
drop policy if exists "Users can update own donor record" on donors;
drop policy if exists "Admins can update any donor" on donors;
drop policy if exists "Admins can delete donors" on donors;
drop policy if exists "donors_select" on donors;
drop policy if exists "donors_insert" on donors;
drop policy if exists "donors_update" on donors;
drop policy if exists "donors_delete" on donors;

create policy "donors_select" on donors for select using (
  is_approved = true
  or (select auth.uid()) = user_id
  or public.is_admin((select auth.uid()))
);

create policy "donors_insert" on donors for insert
  with check ((select auth.uid()) = user_id);

create policy "donors_update" on donors for update
  using ((select auth.uid()) = user_id or public.is_admin((select auth.uid())))
  with check ((select auth.uid()) = user_id or public.is_admin((select auth.uid())));

create policy "donors_delete" on donors for delete
  using (public.is_admin((select auth.uid())));

-- ---- Blood requests ----
drop policy if exists "Users can view own requests" on blood_requests;
drop policy if exists "Admins can view all requests" on blood_requests;
drop policy if exists "Logged in users can create requests" on blood_requests;
drop policy if exists "Requesters can cancel own pending requests" on blood_requests;
drop policy if exists "Donors and admins can update requests" on blood_requests;
drop policy if exists "blood_requests_select" on blood_requests;
drop policy if exists "blood_requests_insert" on blood_requests;
drop policy if exists "blood_requests_update" on blood_requests;

create policy "blood_requests_select" on blood_requests for select using (
  (select auth.uid()) = requester_id
  or (select auth.uid()) = public.donor_user_id(donor_id)
  or public.is_admin((select auth.uid()))
);

create policy "blood_requests_insert" on blood_requests for insert
  with check ((select auth.uid()) = requester_id);

create policy "blood_requests_update" on blood_requests for update
  using (
    (select auth.uid()) = requester_id
    or (select auth.uid()) = public.donor_user_id(donor_id)
    or public.is_admin((select auth.uid()))
  )
  with check (
    (select auth.uid()) = requester_id
    or (select auth.uid()) = public.donor_user_id(donor_id)
    or public.is_admin((select auth.uid()))
  );

-- ---- Donation records ----
drop policy if exists "Relevant users can view donation records" on donation_records;
drop policy if exists "Admins can view all donation records" on donation_records;
drop policy if exists "System can insert donation records" on donation_records;
drop policy if exists "Donors can insert own donation records" on donation_records;
drop policy if exists "donation_records_select" on donation_records;
drop policy if exists "donation_records_insert" on donation_records;

create policy "donation_records_select" on donation_records for select using (
  (select auth.uid()) = requester_id
  or (select auth.uid()) = public.donor_user_id(donor_id)
  or public.is_admin((select auth.uid()))
);

-- Only the donor of a record may insert it (matches the donation flows).
create policy "donation_records_insert" on donation_records for insert
  with check ((select auth.uid()) = public.donor_user_id(donor_id));

-- ============================================================================
-- Column-level grants for anonymous visitors
-- ============================================================================
-- Anonymous clients may only read the public donor-card columns. Email,
-- mobile and is_admin (profiles) plus sex/age/weight/health_conditions
-- (donors) are unreadable without signing in — app queries must therefore
-- select explicit columns (see DONOR_CARD_SELECT in src/types/index.ts).

revoke select on table public.donors from anon;
grant select (id, user_id, blood_type, location, district, availability_status,
              last_donation_date, donation_count, is_approved, created_at)
  on public.donors to anon;

revoke select on table public.profiles from anon;
grant select (id, full_name, location, district, created_at)
  on public.profiles to anon;
