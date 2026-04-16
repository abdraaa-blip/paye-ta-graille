-- Position approximative (GPS ou géocodage futur) + découverte par rayon (km).
-- Retombe sur l’égalité de ville si pas de coordonnées complètes.
-- Trie selon meal_with_preference + chevauchement des tags.

alter table public.profiles
  add column if not exists latitude double precision;

alter table public.profiles
  add column if not exists longitude double precision;

comment on column public.profiles.latitude is 'Latitude WGS84 (optionnel) — découverte par rayon avec radius_km';
comment on column public.profiles.longitude is 'Longitude WGS84 (optionnel)';

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
  with me_row as (
    select * from public.profiles where id = auth.uid()
  ),
  ranked as (
    select
      p.id,
      p.display_name,
      p.photo_url,
      p.city,
      p.social_intent,
      p.meal_intent,
      p.radius_km,
      p.updated_at,
      coalesce((
        select count(*)::int
        from public.profile_tags pt1
        inner join public.profile_tags pt2
          on pt1.tag_key = pt2.tag_key and pt1.category = pt2.category
        where pt1.profile_id = (select mr.id from me_row mr)
          and pt2.profile_id = p.id
      ), 0) as tag_overlap
    from public.profiles p
    cross join me_row me
    where p.id <> me.id
      and (
        (
          me.latitude is not null and me.longitude is not null
          and (
            (
              p.latitude is not null and p.longitude is not null
              and (
                6371.0 * acos(
                  least(
                    1.0::double precision,
                    greatest(
                      -1.0::double precision,
                      cos(radians(me.latitude::double precision))
                      * cos(radians(p.latitude::double precision))
                      * cos(
                        radians(p.longitude::double precision)
                        - radians(me.longitude::double precision)
                      )
                      + sin(radians(me.latitude::double precision))
                      * sin(radians(p.latitude::double precision))
                    )
                  )
                )
              ) <= me.radius_km::double precision
            )
            or (
              (p.latitude is null or p.longitude is null)
              and me.city is not null
              and length(trim(me.city)) > 0
              and p.city is not null
              and length(trim(p.city)) > 0
              and lower(trim(me.city)) = lower(trim(p.city))
            )
          )
        )
        or (
          (me.latitude is null or me.longitude is null)
          and me.city is not null
          and length(trim(me.city)) > 0
          and p.city is not null
          and length(trim(p.city)) > 0
          and lower(trim(me.city)) = lower(trim(p.city))
        )
      )
  )
  select
    r.id,
    r.display_name,
    r.photo_url,
    r.city,
    r.social_intent,
    r.meal_intent,
    r.radius_km
  from ranked r
  cross join me_row me
  order by
    case coalesce(me.meal_with_preference, 'tout_le_monde')
      when 'profils_similaires' then -r.tag_overlap
      when 'decouvrir_styles' then r.tag_overlap
      else 0
    end,
    r.updated_at desc nulls last
  limit greatest(1, least(coalesce(p_limit, 20), 50));
$$;

revoke all on function public.discover_profiles(integer) from public;
grant execute on function public.discover_profiles(integer) to authenticated;

comment on function public.discover_profiles(integer) is
  'Profils dans radius_km (si lat/lng) ou même ville ; tri selon préférence table + tags';
