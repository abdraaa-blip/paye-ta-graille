import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireModuleTrust } from "@/lib/api/module-trust";
import { requireSession } from "@/lib/api/session";
import { getStripe } from "@/lib/stripe-server";
import { PAYMENT_MOODS, paymentMoodCheckoutDescription } from "@/lib/payment-mood";

const bodySchema = z
  .object({
    meal_id: z.string().uuid(),
    amount_cents: z.coerce.number().int().min(100).max(500_000),
    payment_mood: z.enum(PAYMENT_MOODS).optional(),
  })
  .strict();

function publicOrigin(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  return "http://localhost:3000";
}

export async function POST(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const trust = await requireModuleTrust(session.user, session.supabase);
  if (!trust.ok) return trust.response;

  const stripe = getStripe();
  if (!stripe) {
    return jsonError(
      "payments_unconfigured",
           "Paiement en ligne non configuré (clé Stripe manquante).",
      503,
    );
  }

  const limited = await rateLimitForUser(session.user.id, "payments_checkout", 20, 60_000);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Corps JSON invalide.", 400);
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.flatten().formErrors.join("; "), 400);
  }

  const { meal_id, amount_cents, payment_mood } = parsed.data;

  const { data: meal, error: mErr } = await session.supabase
    .from("meals")
    .select("id, host_user_id, guest_user_id")
    .eq("id", meal_id)
    .single();

  if (mErr || !meal) {
    return jsonError("not_found", "Repas introuvable.", 404);
  }

  const uid = session.user.id;
  const isHost = meal.host_user_id === uid;
  const isGuest = meal.guest_user_id === uid;
  if (!isHost && !isGuest) {
    return jsonError("forbidden", "Tu ne fais pas partie de ce repas.", 403);
  }

  const payee_user_id = isHost ? meal.guest_user_id : meal.host_user_id;
  if (!payee_user_id) {
    return jsonError("meal_incomplete", "Le repas n’a pas encore d’autre participant.", 400);
  }

  const origin = publicOrigin();

  const moodLine = payment_mood ? paymentMoodCheckoutDescription(payment_mood) : "";
  const lineDescription = [moodLine, "Paiement sécurisé via Stripe (sous réserve des CGU)."]
    .filter(Boolean)
    .join(" ");

  const stripeMetadata: Record<string, string> = {
    meal_id,
    payer_user_id: uid,
    payee_user_id,
    amount_cents: String(amount_cents),
  };
  if (payment_mood) stripeMetadata.payment_mood = payment_mood;

  let checkoutSession: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Contribution repas (Paye ta graille)",
              description: lineDescription,
            },
            unit_amount: amount_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/repas/${meal_id}?checkout=success`,
      cancel_url: `${origin}/paiement-repas?checkout=cancel`,
      client_reference_id: meal_id,
      metadata: stripeMetadata,
    });
  } catch (e) {
    console.error("[stripe checkout]", e);
    return jsonError("stripe_error", "Stripe a refusé la session. Réessaie ou vérifie la config.", 502);
  }

  if (!checkoutSession.url) {
    return jsonError("stripe_error", "URL de paiement indisponible.", 502);
  }

  const ledgerMeta: Record<string, unknown> = { created_via: "checkout" };
  if (payment_mood) ledgerMeta.payment_mood = payment_mood;

  const { data: ledger, error: insErr } = await session.supabase
    .from("payment_ledger")
    .insert({
      stripe_checkout_session_id: checkoutSession.id,
      meal_id,
      payer_user_id: uid,
      payee_user_id,
      amount_cents,
      currency: "eur",
      status: "pending",
      metadata: ledgerMeta,
    })
    .select("id")
    .single();

  if (insErr) {
    console.error("[payment_ledger insert]", insErr);
    return jsonError(
      "ledger_failed",
      "Session créée mais enregistrement interne impossible. Contacte le support avec l’heure du paiement.",
      500,
    );
  }

  return NextResponse.json({ url: checkoutSession.url, ledger_id: ledger.id });
}
