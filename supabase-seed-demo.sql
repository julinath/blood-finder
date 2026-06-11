-- ============================================================================
-- DEMO / TEST DATA — fake donors to exercise the map, availability board & stats
-- ============================================================================
-- Run in the Supabase SQL Editor. Safe to re-run (it clears its own demo rows
-- first). Demo donors are marked by `user_id IS NULL` (real donors always have
-- a user_id), so they are trivial to remove.
--
--   TO REMOVE ALL DEMO DATA:
--   delete from donors where user_id is null;
--
-- NOTE: these appear on the LIVE site too — delete them before real launch.
-- ============================================================================

-- 1) clear any previous demo rows so this script is idempotent
delete from donors where user_id is null;

-- 2) insert demo donors spread across districts with varied blood groups
insert into donors
  (user_id, blood_type, location, district, availability_status, is_approved, last_donation_date)
select
  null::uuid,
  -- weighted blood-group mix (O+/B+/A+ most common, AB- rarest)
  (array[
    'O_POS','O_POS','O_POS','O_POS','B_POS','B_POS','B_POS',
    'A_POS','A_POS','A_POS','AB_POS','O_NEG','O_NEG','A_NEG','B_NEG','AB_NEG'
  ])[1 + floor(random() * 16)::int],
  d.area || ', ' || d.district,
  d.district,
  case when random() < 0.82 then 'AVAILABLE' else 'UNAVAILABLE' end,
  true,
  case when random() < 0.5 then null
       else (current_date - (floor(random() * 240))::int) end
from (values
  ('Dhaka','Mohakhali',16),
  ('Chattogram','Agrabad',12),
  ('Sylhet','Zindabazar',8),
  ('Khulna','Khalishpur',7),
  ('Cumilla','Kandirpar',6),
  ('Rajshahi','Shaheb Bazar',6),
  ('Gazipur','Tongi',6),
  ('Bogura','Sherpur Road',5),
  ('Mymensingh','Ganginarpar',5),
  ('Narayanganj','Fatullah',5),
  ('Rangpur','Jahaj Company',4),
  ('Barishal','Nathullabad',4),
  ('Jashore','Chanchra',3),
  ('Dinajpur','Maldah Patti',3),
  ('Cox''s Bazar','Kolatoli',3),
  ('Noakhali','Maijdee',3),
  ('Tangail','Park Bazar',3),
  ('Feni','Trunk Road',2),
  ('Pabna','Athghori',2),
  ('Kushtia','N S Road',2),
  ('Sirajganj','S S Road',2),
  ('Moulvibazar','Choumohona',2),
  ('Habiganj','Shaistanagar',2),
  ('Faridpur','Janipur',2),
  ('Jamalpur','Sakhipara',2),
  ('Chandpur','Bishnudi',2),
  ('Brahmanbaria','Kandipara',2),
  ('Kishoreganj','Gourango Bazar',2),
  ('Sunamganj','Old Bus Stand',1),
  ('Patuakhali','New Market',1),
  ('Chapai Nawabganj','Boro Indara',1),
  ('Netrokona','Mojupur',1),
  ('Bandarban','Balaghata',1),
  ('Rangamati','Banarupa',1),
  ('Naogaon','Bridge Ghat',1),
  ('Satkhira','Sultanpur',1),
  ('Lakshmipur','Bus Stand',1),
  ('Gaibandha','D B Road',1)
) as d(district, area, cnt)
cross join generate_series(1, d.cnt);
