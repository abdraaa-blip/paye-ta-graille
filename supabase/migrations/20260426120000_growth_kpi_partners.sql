-- Partenaires & funnel dans la vue KPI journalière (agrégat global, lecture via service role ou scripts).
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
  count(distinct user_id) as active_users
from public.growth_events
group by 1
order by 1 desc;

comment on view public.growth_kpi_daily is
  'Agrégats journaliers growth: actions clés, funnel partenaires (vues + CTA), utilisateurs actifs.';
