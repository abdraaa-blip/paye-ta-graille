-- Extension MVP : discover sécurisé, lieux, messages (chat), signalements, trigger profil, garde-fous repas.
-- Si le trigger sur auth.users échoue (droits), exécuter le bloc « handle_new_user » depuis le SQL Editor Supabase (rôle postgres).

-- ---------------------------------------------------------------------------
-- Profil auto à l'inscription (idempotent)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  dn text;
begin
  dn := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    split_part(coalesce(new.email, 'user'), '@', 1),
    'Gourmand·e'
  );
  insert into public.profiles (id, display_name)
  values (new.id, dn)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Tables annexes
-- ---------------------------------------------------------------------------
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nudge_level text not null default 'normal' check (nudge_level in ('calme', 'normal', 'off')),
  locale text not null default 'fr',
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_tags (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  tag_key text not null,
  category text not null,
  primary key (profile_id, tag_key)
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals (id) on delete cascade,
  place_id text,
  name text not null,
  address text,
  lat double precision,
  lng double precision,
  chosen_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (meal_id)
);

create table if not exists public.meal_messages (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(body) >= 1 and char_length(body) <= 4000),
  created_at timestamptz not null default now()
);

create index if not exists meal_messages_meal_idx on public.meal_messages (meal_id);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  detail text not null check (char_length(detail) >= 10 and char_length(detail) <= 4000),
  contact text,
  meal_id uuid references public.meals (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Contraintes repas
-- ---------------------------------------------------------------------------
alter table public.meals
  drop constraint if exists meals_distinct_pair;
alter table public.meals
  add constraint meals_distinct_pair check (guest_user_id is null or host_user_id <> guest_user_id);

alter table public.meals
  drop constraint if exists meals_proposed_needs_guest;
alter table public.meals
  add constraint meals_proposed_needs_guest check (status <> 'proposed' or guest_user_id is not null);

-- ---------------------------------------------------------------------------
-- Garde-fous transitions + rôles (variante chat A : lieu confirmé avant échanges)
-- ---------------------------------------------------------------------------
create or replace function public.validate_meal_row()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if tg_op = 'UPDATE' then
    if old.id is distinct from new.id
      or old.host_user_id is distinct from new.host_user_id
      or old.guest_user_id is distinct from new.guest_user_id
      or old.created_at is distinct from new.created_at
    then
      raise exception 'immutable_meal_fields' using errcode = '23514';
    end if;

    if old.status is distinct from new.status then
      if old.status = 'proposed' and new.status = 'matched' then
        if uid <> old.guest_user_id then
          raise exception 'only_guest_accepts' using errcode = '23514';
        end if;
      elsif old.status = 'proposed' and new.status = 'cancelled' then
        if uid <> old.host_user_id and uid <> old.guest_user_id then
          raise exception 'forbidden' using errcode = '23514';
        end if;
      elsif old.status = 'matched' and new.status = 'venue_proposed' then
        if uid <> old.host_user_id then
          raise exception 'only_host_sets_venue_flow' using errcode = '23514';
        end if;
      elsif old.status = 'matched' and new.status = 'cancelled' then
        if uid <> old.host_user_id and uid <> old.guest_user_id then
          raise exception 'forbidden' using errcode = '23514';
        end if;
      elsif old.status = 'venue_proposed' and new.status = 'venue_confirmed' then
        if uid <> old.guest_user_id then
          raise exception 'only_guest_confirms_venue' using errcode = '23514';
        end if;
      elsif old.status = 'venue_proposed' and new.status = 'cancelled' then
        if uid <> old.host_user_id and uid <> old.guest_user_id then
          raise exception 'forbidden' using errcode = '23514';
        end if;
      elsif old.status = 'venue_confirmed' and new.status = 'confirmed' then
        if uid <> old.host_user_id and uid <> old.guest_user_id then
          raise exception 'forbidden' using errcode = '23514';
        end if;
      elsif old.status = 'venue_confirmed' and new.status = 'cancelled' then
        if uid <> old.host_user_id and uid <> old.guest_user_id then
          raise exception 'forbidden' using errcode = '23514';
        end if;
      elsif old.status = 'confirmed' and new.status = 'completed' then
        if uid <> old.host_user_id and uid <> old.guest_user_id then
          raise exception 'forbidden' using errcode = '23514';
        end if;
      elsif old.status = 'confirmed' and new.status = 'cancelled' then
        if uid <> old.host_user_id and uid <> old.guest_user_id then
          raise exception 'forbidden' using errcode = '23514';
        end if;
      else
        raise exception 'invalid_status_transition' using errcode = '23514';
      end if;
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists meals_validate_update on public.meals;
create trigger meals_validate_update
  before update on public.meals
  for each row
  execute function public.validate_meal_row();

-- ---------------------------------------------------------------------------
-- Discover : RPC security definer (pas de lecture globale profiles)
-- ---------------------------------------------------------------------------
create or replace function public.discover_profiles(p_limit integer default 20)
returns table (
  id uuid,
  display_name text,
  photo_url text,
  city text,
  social_intent text,
  meal_intent text,
  radius_km integer
)
language sql
security definer
set search_path = public
stable
as $$
  select
    p.id,
    p.display_name,
    p.photo_url,
    p.city,
    p.social_intent,
    p.meal_intent,
    p.radius_km
  from public.profiles me
  join public.profiles p on p.id <> me.id
  where me.id = auth.uid()
    and me.city is not null
    and length(trim(me.city)) > 0
    and p.city is not null
    and length(trim(p.city)) > 0
    and lower(trim(me.city)) = lower(trim(p.city))
  order by p.updated_at desc nulls last
  limit greatest(1, least(coalesce(p_limit, 20), 50));
$$;

revoke all on function public.discover_profiles(integer) from public;
grant execute on function public.discover_profiles(integer) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS nouvelles tables
-- ---------------------------------------------------------------------------
alter table public.user_settings enable row level security;
alter table public.profile_tags enable row level security;
alter table public.venues enable row level security;
alter table public.meal_messages enable row level security;
alter table public.reports enable row level security;

drop policy if exists "user_settings_own" on public.user_settings;
create policy "user_settings_own" on public.user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "profile_tags_own" on public.profile_tags;
create policy "profile_tags_own" on public.profile_tags
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists "venues_select" on public.venues;
create policy "venues_select" on public.venues
  for select using (
    exists (
      select 1 from public.meals m
      where m.id = meal_id
        and (auth.uid() = m.host_user_id or auth.uid() = m.guest_user_id)
    )
  );

drop policy if exists "venues_insert" on public.venues;
create policy "venues_insert" on public.venues
  for insert with check (
    exists (
      select 1 from public.meals m
      where m.id = meal_id
        and auth.uid() = m.host_user_id
        and m.status in ('matched', 'venue_proposed')
    )
  );

drop policy if exists "venues_update" on public.venues;
create policy "venues_update" on public.venues
  for update using (
    exists (
      select 1 from public.meals m
      where m.id = meal_id
        and auth.uid() = m.host_user_id
    )
  );

drop policy if exists "meal_messages_select" on public.meal_messages;
create policy "meal_messages_select" on public.meal_messages
  for select using (
    exists (
      select 1 from public.meals m
      where m.id = meal_messages.meal_id
        and (auth.uid() = m.host_user_id or auth.uid() = m.guest_user_id)
        and m.status in ('venue_confirmed', 'confirmed', 'completed')
    )
  );

drop policy if exists "meal_messages_insert" on public.meal_messages;
create policy "meal_messages_insert" on public.meal_messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.meals m
      where m.id = meal_id
        and (auth.uid() = m.host_user_id or auth.uid() = m.guest_user_id)
        and m.status in ('venue_confirmed', 'confirmed')
    )
  );

drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists "reports_select_own" on public.reports;
create policy "reports_select_own" on public.reports
  for select using (auth.uid() = reporter_id);

comment on function public.discover_profiles(integer) is 'Liste profils même ville (exact, insensible casse) — MVP';
comment on table public.meal_messages is 'Chat repas — ouvert à partir de venue_confirmed (matrice A)';
comment on table public.reports is 'Signalements MVP — lecture limitée au reporter';
