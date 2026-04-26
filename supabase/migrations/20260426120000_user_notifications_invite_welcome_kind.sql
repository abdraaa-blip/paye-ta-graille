-- Ajoute le type invite_link_welcome + aligne la contrainte sur les kinds utilisés côté app (in-app.ts).

alter table public.user_notifications drop constraint if exists user_notifications_kind_check;

alter table public.user_notifications add constraint user_notifications_kind_check check (
  kind in (
    'meal_proposed',
    'meal_reminder_24h',
    'meal_reminder_2h',
    'meal_auto_completed',
    'report_received',
    'growth_feedback_alert',
    'growth_daily_digest',
    'growth_weekly_digest',
    'invite_link_welcome',
    'invite_referral_joined'
  )
);

comment on table public.user_notifications is 'Notifications in-app (MVP) : repas, croissance interne, invitations.';
