import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

export async function GET() {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "payments_ledger_list", 30, 60_000);
  if (limited) return limited;

  const { data, error } = await session.supabase
    .from("payment_ledger")
    .select("id, meal_id, amount_cents, currency, status, stripe_checkout_session_id, created_at")
    .or(`payer_user_id.eq.${session.user.id},payee_user_id.eq.${session.user.id}`)
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) {
    if (error.message.includes("payment_ledger") || error.code === "42P01") {
      return NextResponse.json({ entries: [] });
    }
    return jsonError("ledger_list_failed", "Impossible de charger l’historique.", 500);
  }

  return NextResponse.json({ entries: data ?? [] });
}
