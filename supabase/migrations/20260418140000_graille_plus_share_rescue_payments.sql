-- Modules Graille+ : partage culinaire, anti-gaspillage, journal paiements (Stripe).

-- ---------------------------------------------------------------------------
-- Partage de graille
-- ---------------------------------------------------------------------------
create table if not exists public.share_offers (
  id uuid primary key default gen_random_uuid(),
  host_user_id uuid not null references auth.users (id) on delete cascade,
  host_display_name text not null,
  host_photo_url text,
  city text not null,
  title text not null,
  dish_type text,
  allergens text,
  quantity_parts integer not null check (quantity_parts > 0 and quantity_parts <= 99),
  mode text not null check (mode in ('gift', 'chip_in')),
  chip_in_amount_cents integer check (chip_in_amount_cents is null or chip_in_amount_cents >= 0),
  status text not null default 'active' check (status in ('active', 'closed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint share_offers_chip_in_amount check (
    (mode = 'gift' and chip_in_amount_cents is null)
    or (mode = 'chip_in' and chip_in_amount_cents is not null and chip_in_amount_cents > 0)
  )
);

create index if not exists share_offers_city_lower_idx
  on public.share_offers (lower(trim(city)));
create index if not exists share_offers_host_idx on public.share_offers (host_user_id);
create index if not exists share_offers_status_idx on public.share_offers (status);

create table if not exists public.share_reservations (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.share_offers (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  parts integer not null default 1 check (parts > 0),
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (offer_id, user_id)
);

create index if not exists share_reservations_offer_idx on public.share_reservations (offer_id);
create index if not exists share_reservations_user_idx on public.share_reservations (user_id);

-- ---------------------------------------------------------------------------
-- Seconde graille (surplus)
-- ---------------------------------------------------------------------------
create table if not exists public.food_rescue_listings (
  id uuid primary key default gen_random_uuid(),
  publisher_user_id uuid not null references auth.users (id) on delete cascade,
  publisher_display_name text not null,
  publisher_photo_url text,
  city text not null,
  description text not null,
  price_cents integer not null default 0 check (price_cents >= 0 and price_cents <= 50000),
  window_start timestamptz,
  window_end timestamptz,
  max_claims integer not null default 1 check (max_claims > 0 and max_claims <= 20),
  status text not null default 'active' check (status in ('active', 'claimed_out', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists food_rescue_city_lower_idx
  on public.food_rescue_listings (lower(trim(city)));
create index if not exists food_rescue_publisher_idx on public.food_rescue_listings (publisher_user_id);
create index if not exists food_rescue_status_idx on public.food_rescue_listings (status);

create table if not exists public.food_rescue_claims (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.food_rescue_listings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

create index if not exists food_rescue_claims_listing_idx on public.food_rescue_claims (listing_id);
create index if not exists food_rescue_claims_user_idx on public.food_rescue_claims (user_id);

-- ---------------------------------------------------------------------------
-- Paiements (journal — mise à jour via webhook Stripe avec service role)
-- ---------------------------------------------------------------------------
create table if not exists public.payment_ledger (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  meal_id uuid references public.meals (id) on delete set null,
  payer_user_id uuid not null references auth.users (id) on delete cascade,
  payee_user_id uuid references auth.users (id) on delete set null,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'eur',
  status text not null default 'pending' check (
    status in ('pending', 'processing', 'succeeded', 'failed', 'canceled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_ledger_payer_idx on public.payment_ledger (payer_user_id);
create index if not exists payment_ledger_meal_idx on public.payment_ledger (meal_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.share_offers enable row level security;
alter table public.share_reservations enable row level security;
alter table public.food_rescue_listings enable row level security;
alter table public.food_rescue_claims enable row level security;
alter table public.payment_ledger enable row level security;

drop policy if exists "share_offers_select" on public.share_offers;
create policy "share_offers_select" on public.share_offers
  for select using (
    host_user_id = auth.uid()
    or (
      status = 'active'
      and host_user_id <> auth.uid()
      and exists (
        select 1 from public.profiles me
        where me.id = auth.uid()
          and me.city is not null
          and length(trim(me.city)) > 0
          and lower(trim(me.city)) = lower(trim(share_offers.city))
      )
    )
  );

drop policy if exists "share_offers_insert" on public.share_offers;
create policy "share_offers_insert" on public.share_offers
  for insert with check (auth.uid() = host_user_id);

drop policy if exists "share_offers_update" on public.share_offers;
create policy "share_offers_update" on public.share_offers
  for update using (auth.uid() = host_user_id);

drop policy if exists "share_reservations_select" on public.share_reservations;
create policy "share_reservations_select" on public.share_reservations
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from public.share_offers o
      where o.id = share_reservations.offer_id and o.host_user_id = auth.uid()
    )
  );

drop policy if exists "share_reservations_insert" on public.share_reservations;
create policy "share_reservations_insert" on public.share_reservations
  for insert with check (auth.uid() = user_id);

drop policy if exists "food_rescue_listings_select" on public.food_rescue_listings;
create policy "food_rescue_listings_select" on public.food_rescue_listings
  for select using (
    publisher_user_id = auth.uid()
    or (
      status = 'active'
      and publisher_user_id <> auth.uid()
      and exists (
        select 1 from public.profiles me
        where me.id = auth.uid()
          and me.city is not null
          and length(trim(me.city)) > 0
          and lower(trim(me.city)) = lower(trim(food_rescue_listings.city))
      )
    )
  );

drop policy if exists "food_rescue_listings_insert" on public.food_rescue_listings;
create policy "food_rescue_listings_insert" on public.food_rescue_listings
  for insert with check (auth.uid() = publisher_user_id);

drop policy if exists "food_rescue_listings_update" on public.food_rescue_listings;
create policy "food_rescue_listings_update" on public.food_rescue_listings
  for update using (auth.uid() = publisher_user_id);

drop policy if exists "food_rescue_claims_select" on public.food_rescue_claims;
create policy "food_rescue_claims_select" on public.food_rescue_claims
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from public.food_rescue_listings l
      where l.id = food_rescue_claims.listing_id and l.publisher_user_id = auth.uid()
    )
  );

drop policy if exists "food_rescue_claims_insert" on public.food_rescue_claims;
create policy "food_rescue_claims_insert" on public.food_rescue_claims
  for insert with check (auth.uid() = user_id);

drop policy if exists "payment_ledger_select" on public.payment_ledger;
create policy "payment_ledger_select" on public.payment_ledger
  for select using (
    payer_user_id = auth.uid()
    or payee_user_id = auth.uid()
    or exists (
      select 1 from public.meals m
      where m.id = payment_ledger.meal_id
        and (m.host_user_id = auth.uid() or m.guest_user_id = auth.uid())
    )
  );

drop policy if exists "payment_ledger_insert_as_payer" on public.payment_ledger;
create policy "payment_ledger_insert_as_payer" on public.payment_ledger
  for insert with check (auth.uid() = payer_user_id);

-- Mise à jour des statuts : webhook Stripe via service role (bypass RLS)

comment on table public.share_offers is 'Partage culinaire — offre repas maison (Graille+)';
comment on table public.share_reservations is 'Réservations parts sur une offre partage';
comment on table public.food_rescue_listings is 'Seconde graille — surplus publié';
comment on table public.food_rescue_claims is 'Réservation récupération surplus';
comment on table public.payment_ledger is 'Journal paiements Stripe (écriture principale via service role)';
