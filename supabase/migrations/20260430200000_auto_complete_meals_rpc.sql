-- Clôture batch confirmed → completed (cron). Aligné avec src/lib/meals/meal-auto-complete.ts :
-- fin de créneau = window_end si >= window_start, sinon window_start ; puis now() >= fin + p_grace_hours.
create or replace function public.auto_complete_confirmed_meals(p_grace_hours int)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated int := 0;
begin
  if p_grace_hours is null or p_grace_hours < 0 then
    p_grace_hours := 24;
  end if;

  with eligible as (
    select m.id
    from public.meals m
    where m.status = 'confirmed'
      and m.guest_user_id is not null
      and m.window_start is not null
      and (
        case
          when m.window_end is not null and m.window_end >= m.window_start then m.window_end
          else m.window_start
        end
      ) <= now() - make_interval(hours => p_grace_hours)
  )
  update public.meals m
  set status = 'completed',
      updated_at = now()
  from eligible e
  where m.id = e.id
    and m.status = 'confirmed';

  get diagnostics v_updated = row_count;
  return coalesce(v_updated, 0);
end;
$$;

revoke all on function public.auto_complete_confirmed_meals(int) from public;
grant execute on function public.auto_complete_confirmed_meals(int) to service_role;

comment on function public.auto_complete_confirmed_meals(int) is
  'Cron: passe en completed les repas confirmed dont la fin de fenêtre + p_grace_hours est dépassée. Réservé service_role.';
