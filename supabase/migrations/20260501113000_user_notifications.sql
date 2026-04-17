-- Notifications in-app (MVP): lecture utilisateur + marquage lu/non-lu.

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (
    kind in (
      'meal_proposed',
      'meal_reminder_24h',
      'meal_reminder_2h',
      'meal_auto_completed',
      'report_received'
    )
  ),
  title text not null check (char_length(title) between 1 and 140),
  body text not null check (char_length(body) between 1 and 1200),
  cta_href text,
  meta jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists user_notifications_user_read_created_idx
  on public.user_notifications (user_id, read_at, created_at desc);

alter table public.user_notifications enable row level security;

drop policy if exists "user_notifications_select_own" on public.user_notifications;
create policy "user_notifications_select_own"
  on public.user_notifications
  for select
  using (auth.uid() = user_id);

drop policy if exists "user_notifications_update_own" on public.user_notifications;
create policy "user_notifications_update_own"
  on public.user_notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.user_notifications is 'Notifications in-app visibles dans /moi (MVP).';
