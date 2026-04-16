-- ---------------------------------------------------------------------------
-- Growth analytics minimal (événements produit, sans tracking tiers)
-- ---------------------------------------------------------------------------
create table if not exists public.growth_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_name text not null check (char_length(event_name) >= 3 and char_length(event_name) <= 120),
  context text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_events_user_created_idx on public.growth_events (user_id, created_at desc);
create index if not exists growth_events_event_created_idx on public.growth_events (event_name, created_at desc);

alter table public.growth_events enable row level security;

drop policy if exists "growth_events_select_own" on public.growth_events;
create policy "growth_events_select_own" on public.growth_events
  for select using (auth.uid() = user_id);

drop policy if exists "growth_events_insert_own" on public.growth_events;
create policy "growth_events_insert_own" on public.growth_events
  for insert with check (auth.uid() = user_id);

comment on table public.growth_events is 'Événements growth produit (conversion, rétention, invitation), scope utilisateur.';
