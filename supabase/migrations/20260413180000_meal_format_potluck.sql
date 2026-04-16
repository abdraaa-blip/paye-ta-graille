-- Repas duo vs repas groupe (coordination « qui ramène quoi ») — MVP
-- format = 'group' active le module potluck ; 'duo' = pas d’organisation partagée.

alter table public.meals
  add column if not exists format text not null default 'duo'
 check (format in ('duo', 'group'));

alter table public.meals
  add column if not exists potluck jsonb;

comment on column public.meals.format is 'duo = classique hôte+invité ; group = repas collectif avec rôles (potluck)';
comment on column public.meals.potluck is 'JSON { mode, assignments } — réservé si format = group';
