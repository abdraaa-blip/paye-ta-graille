import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireModuleTrust } from "@/lib/api/module-trust";
import { requireSession } from "@/lib/api/session";

const createSchema = z
  .object({
    description: z.string().min(3).max(2000),
    price_cents: z.coerce.number().int().min(0).max(50_000).optional(),
    window_start: z.string().datetime({ offset: true }).optional(),
    window_end: z.string().datetime({ offset: true }).optional(),
    max_claims: z.coerce.number().int().min(1).max(10).optional(),
  })
  .strict();

export async function GET() {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "food_rescue_list", 60, 60_000);
  if (limited) return limited;

  const trust = await requireModuleTrust(session.user, session.supabase);
  if (!trust.ok) return trust.response;
  const city = trust.profile.city;

  const { data, error } = await session.supabase
    .from("food_rescue_listings")
    .select(
      "id, publisher_user_id, publisher_display_name, publisher_photo_url, city, description, price_cents, window_start, window_end, max_claims, status, created_at",
    )
    .eq("status", "active")
    .neq("publisher_user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(48);

  if (error) {
    return jsonError("rescue_list_failed", "Impossible de charger les surplus pour l’instant.", 500);
  }

  const rows = (data ?? []).filter(
    (o) => o.city && o.city.trim().length > 0 && o.city.trim().toLowerCase() === city.toLowerCase(),
  );

  const listingIds = rows.map((r) => r.id);
  const claimSet = new Set<string>();
  if (listingIds.length > 0) {
    const { data: claims } = await session.supabase
      .from("food_rescue_claims")
      .select("listing_id")
      .eq("user_id", session.user.id)
      .eq("status", "confirmed")
      .in("listing_id", listingIds);
    for (const c of claims ?? []) {
      if (c.listing_id) claimSet.add(c.listing_id);
    }
  }

  const listings = rows.map((r) => {
    const isClaimedByMe = claimSet.has(r.id);
    return {
      id: r.id,
      city: r.city,
      description: r.description,
      price_cents: r.price_cents,
      max_claims: r.max_claims,
      status: r.status,
      created_at: r.created_at,
      window_start: r.window_start,
      window_end: r.window_end,
      is_claimed_by_me: isClaimedByMe,
      // Public anonymat : identité visible seulement aux 2 parties de l’échange.
      publisher_display_name: isClaimedByMe ? r.publisher_display_name : "Membre vérifié",
      publisher_photo_url: isClaimedByMe ? r.publisher_photo_url : null,
    };
  });

  const { data: myListingsRaw, error: myErr } = await session.supabase
    .from("food_rescue_listings")
    .select(
      "id, publisher_user_id, publisher_display_name, publisher_photo_url, city, description, price_cents, window_start, window_end, max_claims, status, created_at",
    )
    .eq("publisher_user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(24);
  if (myErr) {
    return jsonError("rescue_my_list_failed", "Impossible de charger tes annonces pour l’instant.", 500);
  }

  const myListingIds = (myListingsRaw ?? []).map((r) => r.id);
  let claimsByListing = new Map<string, { claimer_user_id: string }[]>();
  if (myListingIds.length > 0) {
    const { data: myClaims, error: myClaimsErr } = await session.supabase
      .from("food_rescue_claims")
      .select("listing_id, user_id")
      .eq("status", "confirmed")
      .in("listing_id", myListingIds);
    if (myClaimsErr) {
      return jsonError("rescue_claims_fetch_failed", "Impossible de charger les récupérations pour l’instant.", 500);
    }
    claimsByListing = new Map<string, { claimer_user_id: string }[]>();
    for (const c of myClaims ?? []) {
      if (!c.listing_id || !c.user_id) continue;
      const arr = claimsByListing.get(c.listing_id) ?? [];
      arr.push({ claimer_user_id: c.user_id });
      claimsByListing.set(c.listing_id, arr);
    }
  }

  const claimerIds = Array.from(
    new Set(
      Array.from(claimsByListing.values())
        .flat()
        .map((x) => x.claimer_user_id),
    ),
  );
  const claimerMap = new Map<string, { id: string; display_name: string | null; photo_url: string | null }>();
  if (claimerIds.length > 0) {
    const { data: profiles } = await session.supabase
      .from("profiles")
      .select("id, display_name, photo_url")
      .in("id", claimerIds);
    for (const p of profiles ?? []) {
      if (p.id) claimerMap.set(p.id, p);
    }
  }

  const my_listings = (myListingsRaw ?? []).map((l) => {
    const claimers = (claimsByListing.get(l.id) ?? []).map((c) => {
      const p = claimerMap.get(c.claimer_user_id);
      return {
        user_id: c.claimer_user_id,
        display_name: p?.display_name ?? "Membre",
        photo_url: p?.photo_url ?? null,
      };
    });
    return {
      id: l.id,
      publisher_display_name: l.publisher_display_name,
      publisher_photo_url: l.publisher_photo_url,
      city: l.city,
      description: l.description,
      price_cents: l.price_cents,
      max_claims: l.max_claims,
      status: l.status,
      created_at: l.created_at,
      window_start: l.window_start,
      window_end: l.window_end,
      claims_count: claimers.length,
      claimers,
    };
  });

  return NextResponse.json({ listings, my_listings });
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(
    session.user.id,
    "food_rescue_create",
    20,
    3_600_000,
    "Tu as beaucoup publié. Une petite pause ?",
  );
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Corps JSON invalide.", 400);
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.flatten().formErrors.join("; "), 400);
  }

  const ws = parsed.data.window_start;
  const we = parsed.data.window_end;
  if ((ws && !we) || (!ws && we)) {
    return jsonError(
      "validation_error",
      "Créneau incomplet : indique le début et la fin (avec fuseau), ou laisse les deux vides.",
      400,
    );
  }
  if (ws && we && new Date(we) <= new Date(ws)) {
    return jsonError("validation_error", "La fin du créneau doit être après le début.", 400);
  }

  const trust = await requireModuleTrust(session.user, session.supabase);
  if (!trust.ok) return trust.response;
  const profile = trust.profile;

  const insert = {
    publisher_user_id: session.user.id,
    publisher_display_name: profile.display_name,
    publisher_photo_url: profile.photo_url,
    city: profile.city,
    description: parsed.data.description.trim(),
    price_cents: parsed.data.price_cents ?? 0,
    window_start: parsed.data.window_start ?? null,
    window_end: parsed.data.window_end ?? null,
    max_claims: parsed.data.max_claims ?? 1,
    status: "active" as const,
  };

  const { data, error } = await session.supabase.from("food_rescue_listings").insert(insert).select("*").single();

  if (error) {
    if (error.message.includes("food_rescue_listings") || error.code === "42P01") {
      return jsonError("schema_missing", "Module Seconde graille non déployé. Applique les migrations Supabase.", 503);
    }
    return jsonError("rescue_create_failed", "Publication impossible pour l’instant.", 400);
  }

  return NextResponse.json({ listing: data }, { status: 201 });
}
