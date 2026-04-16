-- Rappels e-mail J-24 / J-2h (repas `confirmed`) — idempotence par colonnes.
alter table public.meals
  add column if not exists reminder_24h_sent_at timestamptz,
  add column if not exists reminder_2h_sent_at timestamptz;
