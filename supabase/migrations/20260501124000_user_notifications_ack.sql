-- ACK persistant des alertes in-app (qui, quand).

alter table if exists public.user_notifications
  add column if not exists acknowledged_at timestamptz,
  add column if not exists acknowledged_by_user_id uuid references auth.users (id) on delete set null;

create index if not exists user_notifications_user_ack_created_idx
  on public.user_notifications (user_id, acknowledged_at, created_at desc);

comment on column public.user_notifications.acknowledged_at is 'Horodatage de prise en charge explicite d’une notification.';
comment on column public.user_notifications.acknowledged_by_user_id is 'Utilisateur ayant marqué la notification comme prise en charge.';
