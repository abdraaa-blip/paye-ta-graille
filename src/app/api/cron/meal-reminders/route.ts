import { NextResponse } from "next/server";
import { notifyUserMealReminder } from "@/lib/email/meal-reminder-notify";
import {
  isMealAutoCompleteEnabled,
  isMissingAutoCompleteRpc,
  mealAutoCompleteGraceHours,
  mealClosingReferenceMs,
} from "@/lib/meals/meal-auto-complete";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const PARIS = "Europe/Paris";

type MealRow = {
  id: string;
  host_user_id: string;
  guest_user_id: string | null;
  window_start: string;
  window_end: string | null;
  reminder_24h_sent_at: string | null;
  reminder_2h_sent_at: string | null;
};

/**
 * Cron horaire (Vercel Cron) : rappels e-mail (J-24 / J-2h) + clôture auto `confirmed` → `completed`
 * après fin de créneau + grâce (`PTG_MEAL_AUTO_COMPLETE_GRACE_HOURS`, défaut 24 h).
 * Sécuriser avec `Authorization: Bearer CRON_SECRET`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ ok: false, error: "cron_disabled" }, { status: 503 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "no_service_role" }, { status: 503 });
  }

  const { data: meals, error } = await admin
    .from("meals")
    .select(
      "id, host_user_id, guest_user_id, window_start, window_end, reminder_24h_sent_at, reminder_2h_sent_at",
    )
    .eq("status", "confirmed")
    .not("guest_user_id", "is", null)
    .not("window_start", "is", null)
    .gt("window_start", new Date().toISOString());

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const now = Date.now();
  let claimed24 = 0;
  let claimed2 = 0;

  for (const raw of (meals ?? []) as MealRow[]) {
    const t = new Date(raw.window_start).getTime();
    const hoursUntil = (t - now) / 3_600_000;
    const whenLabel = new Date(raw.window_start).toLocaleString("fr-FR", {
      timeZone: PARIS,
      dateStyle: "medium",
      timeStyle: "short",
    });

    if (!raw.reminder_24h_sent_at && hoursUntil > 23 && hoursUntil <= 25) {
      const { data: claimed, error: upErr } = await admin
        .from("meals")
        .update({ reminder_24h_sent_at: new Date().toISOString() })
        .eq("id", raw.id)
        .is("reminder_24h_sent_at", null)
        .select("id")
        .maybeSingle();

      if (upErr || !claimed) continue;

      claimed24 += 1;
      const p24 = [
        notifyUserMealReminder({
          userId: raw.host_user_id,
          mealId: raw.id,
          kind: "24h",
          whenLabel,
        }),
      ];
      if (raw.guest_user_id) {
        p24.push(
          notifyUserMealReminder({
            userId: raw.guest_user_id,
            mealId: raw.id,
            kind: "24h",
            whenLabel,
          }),
        );
      }
      await Promise.all(p24);
    }

    if (!raw.reminder_2h_sent_at && hoursUntil > 1 && hoursUntil <= 3) {
      const { data: claimed, error: upErr } = await admin
        .from("meals")
        .update({ reminder_2h_sent_at: new Date().toISOString() })
        .eq("id", raw.id)
        .is("reminder_2h_sent_at", null)
        .select("id")
        .maybeSingle();

      if (upErr || !claimed) continue;

      claimed2 += 1;
      const p2 = [
        notifyUserMealReminder({
          userId: raw.host_user_id,
          mealId: raw.id,
          kind: "2h",
          whenLabel,
        }),
      ];
      if (raw.guest_user_id) {
        p2.push(
          notifyUserMealReminder({
            userId: raw.guest_user_id,
            mealId: raw.id,
            kind: "2h",
            whenLabel,
          }),
        );
      }
      await Promise.all(p2);
    }
  }

  let autoCompleted = 0;
  let autoCompleteError: string | null = null;
  let autoCompleteUsedFallback = false;
  if (isMealAutoCompleteEnabled()) {
    const graceHours = mealAutoCompleteGraceHours();
    const { data: rpcCount, error: rpcErr } = await admin.rpc("auto_complete_confirmed_meals", {
      p_grace_hours: graceHours,
    });

    if (!rpcErr) {
      autoCompleted = Number(rpcCount ?? 0) || 0;
    } else if (isMissingAutoCompleteRpc(rpcErr)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[meal-reminders] auto_complete RPC (fallback Node):", rpcErr.message);
      }
      autoCompleteUsedFallback = true;

      const graceMs = graceHours * 3_600_000;
      const cutoff = Date.now() - graceMs;
      const { data: toClose, error: closeErr } = await admin
        .from("meals")
        .select("id, window_start, window_end")
        .eq("status", "confirmed")
        .not("guest_user_id", "is", null)
        .not("window_start", "is", null);

      if (closeErr) {
        autoCompleteError = closeErr.message;
      } else {
        for (const row of toClose ?? []) {
          const ref = mealClosingReferenceMs(row.window_start, row.window_end ?? null);
          if (!Number.isFinite(ref) || ref > cutoff) continue;

          const { data: updated, error: upErr } = await admin
            .from("meals")
            .update({ status: "completed", updated_at: new Date().toISOString() })
            .eq("id", row.id)
            .eq("status", "confirmed")
            .select("id")
            .maybeSingle();

          if (!upErr && updated) autoCompleted += 1;
        }
      }
    } else {
      autoCompleteError = rpcErr.message;
      if (process.env.NODE_ENV !== "production") {
        console.warn("[meal-reminders] auto_complete RPC:", rpcErr.message);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    scanned: meals?.length ?? 0,
    reminders_24h_claimed: claimed24,
    reminders_2h_claimed: claimed2,
    auto_completed: autoCompleted,
    auto_complete_error: autoCompleteError,
    auto_complete_used_fallback: autoCompleteUsedFallback,
  });
}
