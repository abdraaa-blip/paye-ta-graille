import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";

const patchSchema = z
  .object({
    mark_all_read: z.boolean().optional(),
    ids: z.array(z.string().uuid()).max(100).optional(),
    acknowledge_ids: z.array(z.string().uuid()).max(100).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.mark_all_read && (!data.ids || data.ids.length === 0) && (!data.acknowledge_ids || data.acknowledge_ids.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ids ou acknowledge_ids ou mark_all_read requis.",
      });
    }
  });

export async function GET() {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const { data, error } = await session.supabase
    .from("user_notifications")
    .select("id, kind, title, body, cta_href, meta, read_at, acknowledged_at, acknowledged_by_user_id, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    if (error.code === "42P01") {
      return jsonError("notifications_unavailable", "Notifications in-app indisponibles pour l’instant.", 503);
    }
    return jsonError("notifications_fetch_failed", error.message, 400);
  }

  const unreadCount = (data ?? []).reduce((acc, row) => acc + (row.read_at ? 0 : 1), 0);
  return NextResponse.json({ notifications: data ?? [], unread_count: unreadCount });
}

export async function PATCH(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(
    session.user.id,
    "notifications_patch",
    60,
    60_000,
    "Trop d’actions notifications en peu de temps. Réessaie dans une minute.",
  );
  if (limited) return limited;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Corps JSON invalide.", 400);
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.flatten().formErrors.join("; "), 400);
  }

  const nowIso = new Date().toISOString();
  let q = session.supabase
    .from("user_notifications")
    .update({ read_at: nowIso })
    .eq("user_id", session.user.id)
    .is("read_at", null);

  if (!parsed.data.mark_all_read && parsed.data.ids && parsed.data.ids.length > 0) {
    q = q.in("id", parsed.data.ids);
  }

  const { error } = await q;
  if (error) {
    return jsonError("notifications_update_failed", error.message, 400);
  }

  if (parsed.data.acknowledge_ids && parsed.data.acknowledge_ids.length > 0) {
    const { error: ackError } = await session.supabase
      .from("user_notifications")
      .update({
        acknowledged_at: nowIso,
        acknowledged_by_user_id: session.user.id,
        read_at: nowIso,
      })
      .eq("user_id", session.user.id)
      .in("id", parsed.data.acknowledge_ids)
      .is("acknowledged_at", null);
    if (ackError) {
      return jsonError("notifications_ack_failed", ackError.message, 400);
    }
  }

  return await GET();
}
