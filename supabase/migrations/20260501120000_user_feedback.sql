-- Feedback utilisateur MVP (1 réponse par thème).

create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('first_experience', 'first_meal', 'overall_like')),
  score integer not null check (score between 1 and 5),
  choice text check (char_length(choice) <= 40),
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, kind)
);

create index if not exists user_feedback_user_kind_idx
  on public.user_feedback (user_id, kind);

alter table public.user_feedback enable row level security;

drop policy if exists "user_feedback_select_own" on public.user_feedback;
create policy "user_feedback_select_own"
  on public.user_feedback
  for select
  using (auth.uid() = user_id);

drop policy if exists "user_feedback_insert_own" on public.user_feedback;
create policy "user_feedback_insert_own"
  on public.user_feedback
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_feedback_update_own" on public.user_feedback;
create policy "user_feedback_update_own"
  on public.user_feedback
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.user_feedback is 'Evaluations UX MVP (première expérience, premier repas, avis global).';
