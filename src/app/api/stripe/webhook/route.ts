import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !whSecret) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 503 });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ error: "Service base indisponible." }, { status: 503 });
  }

  const raw = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (e) {
    console.error("[stripe webhook verify]", e);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const sess = event.data.object as Stripe.Checkout.Session;
        const sessionId = sess.id;
        const pi = typeof sess.payment_intent === "string" ? sess.payment_intent : sess.payment_intent?.id ?? null;
        const { error } = await admin
          .from("payment_ledger")
          .update({
            status: "succeeded",
            stripe_payment_intent_id: pi,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_checkout_session_id", sessionId);
        if (error) console.error("[webhook ledger update succeeded]", error);
        break;
      }
      case "checkout.session.expired": {
        const sess = event.data.object as Stripe.Checkout.Session;
        await admin
          .from("payment_ledger")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("stripe_checkout_session_id", sess.id);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("[stripe webhook handler]", e);
    return NextResponse.json({ received: true, error: "handler" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
