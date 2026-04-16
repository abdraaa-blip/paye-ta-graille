-- ---------------------------------------------------------------------------
-- Mémoire personnelle des lieux (privé) + signaux agrégés "naturels"
-- ---------------------------------------------------------------------------
create table if not exists public.user_place_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  place_key text not null check (char_length(place_key) >= 3 and char_length(place_key) <= 320),
  place_id text,
  name text not null check (char_length(name) >= 1 and char_length(name) <= 200),
  address text,
  lat double precision,
  lng double precision,
  personal_score int check (personal_score between 1 and 5),
  would_return boolean,
  private_note text check (private_note is null or char_length(private_note) <= 500),
  recommend_public boolean not null default false,
  visits_count int not null default 1 check (visits_count >= 0),
  last_meal_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, place_key)
);

create index if not exists upm_user_updated_idx on public.user_place_memories (user_id, updated_at desc);
create index if not exists upm_place_key_idx on public.user_place_memories (place_key);

create or replace function public.set_updated_at_user_place_memories()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_place_memories_updated_at on public.user_place_memories;
create trigger trg_user_place_memories_updated_at
before update on public.user_place_memories
for each row execute function public.set_updated_at_user_place_memories();

alter table public.user_place_memories enable row level security;

drop policy if exists "upm_select_own" on public.user_place_memories;
create policy "upm_select_own" on public.user_place_memories
  for select using (auth.uid() = user_id);

drop policy if exists "upm_insert_own" on public.user_place_memories;
create policy "upm_insert_own" on public.user_place_memories
  for insert with check (auth.uid() = user_id);

drop policy if exists "upm_update_own" on public.user_place_memories;
create policy "upm_update_own" on public.user_place_memories
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop view if exists public.place_reputation_signals;
create view public.place_reputation_signals as
select
  place_key,
  max(name) as name,
  max(address) as address,
  count(*) filter (where recommend_public) as public_reco_count,
  avg(personal_score::numeric) filter (where recommend_public and personal_score is not null) as avg_public_score
from public.user_place_memories
group by place_key;

comment on table public.user_place_memories is 'Mémoire privée des lieux par utilisateur (notes perso, envie de revenir, recommandation opt-in).';
comment on view public.place_reputation_signals is 'Signal agrégé doux de recommandation (opt-in), sans exposer d’avis individuels.';
