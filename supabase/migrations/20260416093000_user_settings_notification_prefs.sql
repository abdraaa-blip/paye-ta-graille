alter table public.user_settings
  add column if not exists nudge_quiet_start_hour int not null default 22
    check (nudge_quiet_start_hour >= 0 and nudge_quiet_start_hour <= 23),
  add column if not exists nudge_quiet_end_hour int not null default 8
    check (nudge_quiet_end_hour >= 0 and nudge_quiet_end_hour <= 23),
  add column if not exists nudge_max_per_day int not null default 1
    check (nudge_max_per_day >= 0 and nudge_max_per_day <= 6);
