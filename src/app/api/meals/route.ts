import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { notifyGuestMealProposed } from "@/lib/email/meal-proposed-notify";
import { createInAppNotifications } from "@/lib/notifications/in-app";
import { venuesByMealId } from "@/lib/api/meal-venues";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const createSchema = z
  .object({
    guest_user_id: z.string().uuid(),
    window_start: z.string().min(1).max(80).optional(),
    window_end: z.string().min(1).max(80).optional(),
    budget_band: z.string().max(40).optional(),
    /** `group` active le module « qui ramène quoi » sur le détail repas (repas collectif / coordination). */
    format: z.enum(["duo", "group"]).optional(),
  })
  .strict();

export async function GET() {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const { data: mealRows, error } = await session.supabase
    .from("meals")
    .select("id, status, host_user_id, guest_user_id, format, window_start, window_end, budget_band, created_at, updated_at")
    .or(`host_user_id.eq.${session.user.id},guest_user_id.eq.${session.user.id}`)
    .order("updated_at", { ascending: false });

  if (error) {
    return jsonError("meals_list_failed", error.message, 500);
  }

  const meals = mealRows ?? [];
  const venueMap = await venuesByMealId(session.supabase, meals.map((m) => m.id));
  const merged = meals.map((m) => ({
    ...m,
    venues: venueMap.get(m.id) ?? [],
  }));

  return NextResponse.json({ meals: merged });
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(
    session.user.id,
    "meals_create",
    24,
    3_600_000,
    "Tu as proposé beaucoup de repas récemment. Pause un moment avant d’en envoyer d’autres.",
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

  if (parsed.data.guest_user_id === session.user.id) {
    return jsonError("invalid_guest", "Tu ne peux pas te proposer un repas à toi-même.", 400);
  }

  const insert = {
    host_user_id: session.user.id,
    guest_user_id: parsed.data.guest_user_id,
    status: "proposed" as const,
    window_start: parsed.data.window_start ?? null,
    window_end: parsed.data.window_end ?? null,
    budget_band: parsed.data.budget_band ?? null,
    format: parsed.data.format ?? "duo",
    potluck:
      parsed.data.format === "group"
        ? { mode: "free" as const, assignments: {} as Record<string, string> }
        : null,
  };

  const { data, error } = await session.supabase.from("meals").insert(insert).select("*").single();

  if (error) {
    return jsonError("meal_create_failed", error.message, 400);
  }

  const { data: hostProfile } = await session.supabase
    .from("profiles")
    .select("display_name")
    .eq("id", session.user.id)
    .maybeSingle();
  const hostDisplayName = hostProfile?.display_name?.trim() || "Un membre";
  const path = `/repas/${data.id}`;

  void notifyGuestMealProposed({
    mealId: data.id,
    hostDisplayName,
    guestUserId: parsed.data.guest_user_id,
  });

  void createInAppNotifications([
    {
      userId: parsed.data.guest_user_id,
      kind: "meal_proposed",
      title: "Nouveau repas proposé",
      body: `${hostDisplayName} t’a proposé un repas.`,
      ctaHref: path,
      metadata: { meal_id: data.id, kind: "meal_proposed" },
    },
  ]);

  return NextResponse.json({ meal: data }, { status: 201 });
}
