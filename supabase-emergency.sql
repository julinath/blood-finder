-- ============================================================================
-- Emergency Request Board  —  run AFTER supabase-schema.sql in the Supabase SQL Editor.
-- Safe to re-run: every statement is idempotent.
-- ============================================================================

-- ---- Structured location -----------------------------------------------------
-- Add a `district` column for area matching. The free-text `location` stays as
-- the finer area/landmark detail.
alter table donors   add column if not exists district text;
alter table profiles add column if not exists district text;

-- ---- Tables ------------------------------------------------------------------

-- Public "needs board": one row per emergency blood need.
create table if not exists emergency_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references profiles(id) on delete cascade,
  requester_name text not null,                       -- snapshot, so the public feed can show it
  patient_problem text not null,
  blood_type text not null,
  units_needed int not null default 1,
  hemoglobin numeric(3,1),
  needed_on date,
  district text not null,
  hospital text not null,
  urgency text not null default 'URGENT',
  status text not null default 'OPEN',
  created_at timestamp with time zone default now()
);

-- Contact number lives in a SEPARATE table so RLS can hide it until a donor offers.
create table if not exists emergency_contacts (
  request_id uuid primary key references emergency_requests(id) on delete cascade,
  contact_phone text not null
);

-- A donor saying "আমি রক্ত দিতে পারবো" on a request.
create table if not exists emergency_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references emergency_requests(id) on delete cascade,
  donor_id uuid references profiles(id) on delete cascade,
  status text not null default 'OFFERED',
  created_at timestamp with time zone default now()
);

-- Safety / fraud / no-show reports → admin queue (never public).
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete cascade,
  request_id uuid references emergency_requests(id) on delete set null,
  reported_user_id uuid references profiles(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'OPEN',
  created_at timestamp with time zone default now()
);

-- ---- Enum-like CHECK constraints (idempotent) -------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'emergency_requests_blood_type_check') then
    alter table emergency_requests add constraint emergency_requests_blood_type_check
      check (blood_type in ('A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'emergency_requests_status_check') then
    alter table emergency_requests add constraint emergency_requests_status_check
      check (status in ('OPEN','FULFILLED','CANCELLED','EXPIRED'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'emergency_requests_urgency_check') then
    alter table emergency_requests add constraint emergency_requests_urgency_check
      check (urgency in ('URGENT','HIGH','NORMAL'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'emergency_requests_units_check') then
    alter table emergency_requests add constraint emergency_requests_units_check
      check (units_needed between 1 and 20);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'emergency_offers_status_check') then
    alter table emergency_offers add constraint emergency_offers_status_check
      check (status in ('OFFERED','CONFIRMED','DONATED','DECLINED'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'reports_status_check') then
    alter table reports add constraint reports_status_check
      check (status in ('OPEN','REVIEWED','RESOLVED'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'reports_reason_check') then
    alter table reports add constraint reports_reason_check
      check (reason in ('NO_SHOW','ASKED_FOR_PAYMENT','FAKE_REQUEST','ABUSIVE','OTHER'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'reports_details_len_check') then
    alter table reports add constraint reports_details_len_check
      check (details is null or char_length(details) <= 500);
  end if;
end $$;

-- One offer per donor per request.
create unique index if not exists emergency_offers_unique
  on emergency_offers (request_id, donor_id);

-- Lookup indexes for the board.
create index if not exists emergency_requests_feed_idx
  on emergency_requests (status, district, blood_type, created_at desc);
create index if not exists emergency_offers_request_idx
  on emergency_offers (request_id);
create index if not exists emergency_offers_donor_idx
  on emergency_offers (donor_id, created_at desc);
create index if not exists donors_district_idx on donors (district);

-- ---- Helper functions (SECURITY DEFINER — bypass RLS to avoid recursion) ----
create or replace function public.emergency_requester(req_id uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select requester_id from public.emergency_requests where id = req_id;
$$;
revoke all on function public.emergency_requester(uuid) from public;
grant execute on function public.emergency_requester(uuid) to anon, authenticated;

create or replace function public.has_offered(req_id uuid, uid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.emergency_offers where request_id = req_id and donor_id = uid
  );
$$;
revoke all on function public.has_offered(uuid, uuid) from public;
grant execute on function public.has_offered(uuid, uuid) to anon, authenticated;

create or replace function public.emergency_is_open(req_id uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.emergency_requests where id = req_id and status = 'OPEN'
  );
$$;
revoke all on function public.emergency_is_open(uuid) from public;
grant execute on function public.emergency_is_open(uuid) to anon, authenticated;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table emergency_requests enable row level security;
alter table emergency_contacts enable row level security;
alter table emergency_offers   enable row level security;
alter table reports            enable row level security;

-- ---- emergency_requests ----
drop policy if exists "Open requests are public" on emergency_requests;
drop policy if exists "Logged-in users can create requests" on emergency_requests;
drop policy if exists "Requesters and admins can update requests" on emergency_requests;

create policy "Open requests are public"
  on emergency_requests for select
  using (status = 'OPEN' or auth.uid() = requester_id or public.is_admin(auth.uid()));

create policy "Logged-in users can create requests"
  on emergency_requests for insert
  with check (auth.uid() = requester_id);

create policy "Requesters and admins can update requests"
  on emergency_requests for update
  using (auth.uid() = requester_id or public.is_admin(auth.uid()))
  with check (auth.uid() = requester_id or public.is_admin(auth.uid()));

-- ---- emergency_contacts (phone hidden until you're requester / have offered / admin) ----
drop policy if exists "Contact visible after offering" on emergency_contacts;
drop policy if exists "Requester can add contact" on emergency_contacts;

-- The requester and admins can always read the contact. A donor who offered can
-- read it ONLY while the request is still OPEN — so cancelling/fulfilling the
-- request immediately revokes contact access for everyone who offered.
create policy "Contact visible after offering"
  on emergency_contacts for select
  using (
    public.emergency_requester(request_id) = auth.uid()
    or public.is_admin(auth.uid())
    or (
      public.has_offered(request_id, auth.uid())
      and public.emergency_is_open(request_id)
    )
  );

create policy "Requester can add contact"
  on emergency_contacts for insert
  with check (public.emergency_requester(request_id) = auth.uid());

-- ---- emergency_offers ----
drop policy if exists "Offers visible to donor, requester, admin" on emergency_offers;
drop policy if exists "Donors can offer" on emergency_offers;
drop policy if exists "Donor, requester, admin can update offers" on emergency_offers;

create policy "Offers visible to donor, requester, admin"
  on emergency_offers for select
  using (
    auth.uid() = donor_id
    or public.emergency_requester(request_id) = auth.uid()
    or public.is_admin(auth.uid())
  );

-- Can only offer on a request that exists AND is still OPEN. This (with the
-- contacts policy above) stops one account from inserting offers against every
-- request id to harvest contact numbers from closed/arbitrary requests.
create policy "Donors can offer"
  on emergency_offers for insert
  with check (auth.uid() = donor_id and public.emergency_is_open(request_id));

create policy "Donor, requester, admin can update offers"
  on emergency_offers for update
  using (
    auth.uid() = donor_id
    or public.emergency_requester(request_id) = auth.uid()
    or public.is_admin(auth.uid())
  );

-- Defense-in-depth: cap how fast a single account can create offers, to slow
-- any bulk contact-scraping attempt that survives the OPEN-status gate.
create or replace function public.limit_emergency_offers()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (
    select count(*) from public.emergency_offers
    where donor_id = new.donor_id and created_at > now() - interval '1 hour'
  ) >= 25 then
    raise exception 'Too many offers in a short time. Please try again later.';
  end if;
  return new;
end;
$$;

drop trigger if exists emergency_offers_rate_limit on emergency_offers;
create trigger emergency_offers_rate_limit
  before insert on emergency_offers
  for each row execute function public.limit_emergency_offers();

-- ---- reports ----
drop policy if exists "Reporters and admins can view reports" on reports;
drop policy if exists "Logged-in users can report" on reports;
drop policy if exists "Admins can update reports" on reports;

create policy "Reporters and admins can view reports"
  on reports for select
  using (auth.uid() = reporter_id or public.is_admin(auth.uid()));

-- You can only report in the context of a request you are involved in (you
-- posted it, or you offered on it) — stops filing defamatory reports against
-- arbitrary users / flooding the admin queue.
create policy "Logged-in users can report"
  on reports for insert
  with check (
    auth.uid() = reporter_id
    and request_id is not null
    and (
      public.emergency_requester(request_id) = auth.uid()
      or public.has_offered(request_id, auth.uid())
    )
  );

create policy "Admins can update reports"
  on reports for update
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
