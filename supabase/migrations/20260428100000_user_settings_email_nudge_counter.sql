-- Compteur journalier (calendrier Europe/Paris) pour les e-mails transactionnels type « repas proposé ».
alter table public.user_settings
  add column if not exists nudge_email_day_paris text
    check (nudge_email_day_paris is null or nudge_email_day_paris ~ '^\d{4}-\d{2}-\d{2}$'),
  add column if not exists nudge_email_sent_today int not null default 0
    check (nudge_email_sent_today >= 0 and nudge_email_sent_today <= 6);
