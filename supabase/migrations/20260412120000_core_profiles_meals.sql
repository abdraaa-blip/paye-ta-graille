-- Paye ta graille — schéma minimal V1 (à appliquer sur projet Supabase)
-- Après application : vérifier RLS dans SQL Editor + tests depuis l'app.

-- Extensions utiles plus tard : postgis

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  photo_url text,
  city text,
  radius_km integer not null default 10 check (radius_km > 0 and radius_km <= 200),
  social_intent text not null default 'ouvert' check (social_intent in ('ami', 'ouvert', 'dating_leger')),
  meal_intent text not null default 'partage' check (meal_intent in ('invite', 'partage', 'etre_invite')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'proposed' check (
    status in (
      'proposed',
      'matched',
      'venue_proposed',
      'venue_confirmed',
      'confirmed',
      'completed',
      'cancelled'
    )
  ),
  host_user_id uuid not null references auth.users (id) on delete cascade,
  guest_user_id uuid references auth.users (id) on delete set null,
  window_start timestamptz,
  window_end timestamptz,
  budget_band text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meals_host_idx on public.meals (host_user_id);
create index if not exists meals_guest_idx on public.meals (guest_user_id);
create index if not exists meals_status_idx on public.meals (status);

alter table public.profiles enable row level security;
alter table public.meals enable row level security;

-- Profiles : chaque utilisateur lit et met à jour son propre profil.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Meals : host et guest voient les repas où ils participent.
drop policy if exists "meals_select_participants" on public.meals;
create policy "meals_select_participants" on public.meals
  for select using (auth.uid() = host_user_id or auth.uid() = guest_user_id);

-- Inserts : seulement en tant qu'host (MVP). Affiner pour guest plus tard.
drop policy if exists "meals_insert_as_host" on public.meals;
create policy "meals_insert_as_host" on public.meals
  for insert with check (auth.uid() = host_user_id);

drop policy if exists "meals_update_participants" on public.meals;
create policy "meals_update_participants" on public.meals
  for update using (auth.uid() = host_user_id or auth.uid() = guest_user_id);

-- TODO discover : policy lecture profils autres utilisateurs (ville + filtres) via RPC sécurisée ou vue,
-- pas "using (true)" sur profiles sans garde-fous.

comment on table public.profiles is 'Profil utilisateur — une ligne par auth.users';
comment on table public.meals is 'Repas duo — machine d''états V1';
