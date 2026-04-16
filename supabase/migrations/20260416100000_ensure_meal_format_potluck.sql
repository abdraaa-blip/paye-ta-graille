-- Idempotent : repare les bases ou la migration 20260413180000 na pas ete executee (evite erreurs sur GET /api/meals).
alter table public.meals
  add column if not exists format text not null default 'duo'
    check (format in ('duo', 'group'));

alter table public.meals
  add column if not exists potluck jsonb;
