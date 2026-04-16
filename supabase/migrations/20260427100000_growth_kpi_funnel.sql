-- Étend la vue KPI : funnel auth → découverte → repas (agrégats journaliers).
create or replace view public.growth_kpi_daily as
select
  date_trunc('day', created_at)::date as day,
  count(*) as events_total,
  count(*) filter (where event_name = 'next_action_click') as next_action_clicks,
  count(*) filter (where event_name = 'discover_propose_click') as propose_clicks,
  count(*) filter (where event_name in ('invite_link_copied', 'invite_native_shared')) as invite_actions,
  count(*) filter (where event_name = 'partners_page_view') as partners_page_views,
  count(*) filter (
    where event_name = 'partners_cta_click' and coalesce(metadata->>'cta', '') = 'mailto'
  ) as partners_cta_mailto,
  count(*) filter (
    where event_name = 'partners_cta_click' and coalesce(metadata->>'cta', '') = 'graille_plus'
  ) as partners_cta_graille_plus,
  count(*) filter (where event_name in ('auth_otp_verified', 'auth_magic_link_exchange')) as funnel_auth_success,
  count(*) filter (where event_name = 'discover_viewed') as funnel_discover_views,
  count(*) filter (where event_name = 'meal_proposed') as funnel_meals_proposed,
  count(*) filter (where event_name = 'meal_venue_submitted') as funnel_meal_venues,
  count(*) filter (where event_name = 'meal_status_updated') as funnel_meal_status_updates,
  count(*) filter (where event_name = 'onboarding_completed') as funnel_onboarding_done,
  count(*) filter (where event_name = 'accueil_viewed') as funnel_accueil_views,
  count(distinct user_id) as active_users
from public.growth_events
group by 1
order by 1 desc;

comment on view public.growth_kpi_daily is
  'Agrégats journaliers growth: funnel produit, partenaires, utilisateurs actifs.';
