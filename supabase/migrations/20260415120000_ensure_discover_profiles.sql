-- RPC discover (idempotent) — complète les projets n’ayant appliqué que le schéma core.
-- Même logique que 20260412140000_mvp_discover_venues_messages_reports.sql

create or replace function public.discover_profiles(p_limit integer default 20)
returns table (
  id uuid,
  display_name text,
  photo_url text,
  city text,
  social_intent text,
  meal_intent text,
  radius_km integer
)
language sql
security definer
set search_path = public
stable
as $$
  select
    p.id,
    p.display_name,
    p.photo_url,
    p.city,
    p.social_intent,
    p.meal_intent,
    p.radius_km
  from public.profiles me
  join public.profiles p on p.id <> me.id
  where me.id = auth.uid()
    and me.city is not null
    and length(trim(me.city)) > 0
    and p.city is not null
    and length(trim(p.city)) > 0
    and lower(trim(me.city)) = lower(trim(p.city))
  order by p.updated_at desc nulls last
  limit greatest(1, least(coalesce(p_limit, 20), 50));
$$;

revoke all on function public.discover_profiles(integer) from public;
grant execute on function public.discover_profiles(integer) to authenticated;

comment on function public.discover_profiles(integer) is 'Liste profils même ville (exact, insensible casse) — MVP';
