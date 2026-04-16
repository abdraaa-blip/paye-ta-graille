-- Plafond e-mail « repas proposé » sans race : réserver le slot (FOR UPDATE) avant l’appel Resend.
create or replace function public.reserve_meal_email_nudge_slot(p_user_id uuid, p_day_paris text)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_day text;
  v_count int;
  v_max int;
begin
  if p_day_paris !~ '^\d{4}-\d{2}-\d{2}$' then
    return false;
  end if;

  insert into public.user_settings (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select us.nudge_email_day_paris, us.nudge_email_sent_today, us.nudge_max_per_day
    into v_day, v_count, v_max
  from public.user_settings us
  where us.user_id = p_user_id
  for update;

  if not found then
    return false;
  end if;

  if v_max is null or v_max <= 0 then
    return false;
  end if;

  if v_day is null or v_day is distinct from p_day_paris then
    update public.user_settings
    set nudge_email_day_paris = p_day_paris,
        nudge_email_sent_today = 0,
        updated_at = now()
    where user_id = p_user_id;
    v_count := 0;
  end if;

  if v_count >= v_max then
    return false;
  end if;

  update public.user_settings
  set nudge_email_sent_today = v_count + 1,
      nudge_email_day_paris = p_day_paris,
      updated_at = now()
  where user_id = p_user_id;

  return true;
end;
$$;

create or replace function public.release_meal_email_nudge_slot(p_user_id uuid, p_day_paris text)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  update public.user_settings
  set nudge_email_sent_today = greatest(0, nudge_email_sent_today - 1),
      updated_at = now()
  where user_id = p_user_id
    and nudge_email_day_paris is not distinct from p_day_paris;
end;
$$;

revoke all on function public.reserve_meal_email_nudge_slot(uuid, text) from public;
revoke all on function public.release_meal_email_nudge_slot(uuid, text) from public;
grant execute on function public.reserve_meal_email_nudge_slot(uuid, text) to service_role;
grant execute on function public.release_meal_email_nudge_slot(uuid, text) to service_role;
