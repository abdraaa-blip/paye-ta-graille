import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";
import { tagKeyToProfileCategory } from "@/lib/tag-options";

/** Ligne profil manquante (trigger non applique ou compte ancien) : creation minimale cote API. */
function defaultDisplayName(user: User): string {
  const meta = user.user_metadata as { display_name?: string } | undefined;
  const fromMeta = typeof meta?.display_name === "string" ? meta.display_name.trim() : "";
  const fromEmail = user.email?.split("@")[0]?.trim() ?? "";
  const raw = fromMeta || fromEmail || "Gourmand·e";
  const base = raw.slice(0, 80);
  return base.length >= 2 ? base : "Gourmand·e";
}

/** Évite javascript:/data: dans les avatars ; http seulement localhost en dev. */
const profilePhotoUrl = z
  .string()
  .max(2000)
  .url()
  .refine((u) => {
    try {
      const p = new URL(u);
      if (p.protocol === "https:") return true;
      return (
        process.env.NODE_ENV !== "production" &&
        p.protocol === "http:" &&
        (p.hostname === "localhost" || p.hostname === "127.0.0.1")
      );
    } catch {
      return false;
    }
  }, "URL photo : https obligatoire (http://localhost autorisé en dev).");

const patchSchema = z
  .object({
    display_name: z.string().min(2).max(80).optional(),
    photo_url: z
      .union([profilePhotoUrl, z.literal(""), z.null()])
      .optional()
      .transform((v) => (v === undefined ? undefined : v === "" ? null : v)),
    city: z.string().min(1).max(120).nullable().optional(),
    radius_km: z.number().int().min(5).max(200).optional(),
    /** WGS84 — les deux null efface la position ; les deux nombres la fixent. */
    latitude: z.number().gte(-90).lte(90).nullable().optional(),
    longitude: z.number().gte(-180).lte(180).nullable().optional(),
    social_intent: z.enum(["ami", "ouvert", "dating_leger"]).optional(),
    meal_intent: z.enum(["invite", "partage", "etre_invite"]).optional(),
    meal_with_preference: z
      .enum(["tout_le_monde", "profils_similaires", "decouvrir_styles"])
      .optional(),
    tags: z.array(z.string().min(1).max(40)).max(24).optional(),
    nudge_level: z.enum(["calme", "normal", "off"]).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const latU = data.latitude !== undefined;
    const lngU = data.longitude !== undefined;
    if (latU !== lngU) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "latitude et longitude : envoyer les deux clés ensemble (ou aucune).",
      });
      return;
    }
    if (latU && (data.latitude === null) !== (data.longitude === null)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pour effacer la position, mets latitude et longitude à null.",
      });
    }
  });

export async function GET() {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const fetchRes = await session.supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  if (fetchRes.error) {
    return jsonError("profile_fetch_failed", fetchRes.error.message, 500);
  }

  let data = fetchRes.data;
  if (!data) {
    const display_name = defaultDisplayName(session.user);
    const ins = await session.supabase
      .from("profiles")
      .insert({ id: session.user.id, display_name })
      .select("*")
      .single();

    if (ins.error) {
      const retry = await session.supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
      if (retry.error) {
        return jsonError("profile_fetch_failed", retry.error.message, 500);
      }
      if (!retry.data) {
        return jsonError(
          "profile_missing",
          "Impossible de creer ton profil. Verifie les migrations Supabase (table profiles et trigger handle_new_user).",
          500,
        );
      }
      data = retry.data;
    } else if (ins.data) {
      data = ins.data;
    } else {
      return jsonError("profile_missing", "Profil introuvable apres creation.", 500);
    }
  }

  let tags: { tag_key: string; category: string }[] = [];
  const tagRes = await session.supabase
    .from("profile_tags")
    .select("tag_key, category")
    .eq("profile_id", session.user.id);
  if (!tagRes.error && tagRes.data) tags = tagRes.data;

  const settingsRes = await session.supabase
    .from("user_settings")
    .select("nudge_level, locale")
    .eq("user_id", session.user.id)
    .maybeSingle();
  const settings = settingsRes.error ? null : settingsRes.data;

  return NextResponse.json({ profile: data, tags, settings });
}

export async function PATCH(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = rateLimitForUser(session.user.id, "profile_patch", 24, 60_000);
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

  const { tags, nudge_level, ...profileFields } = parsed.data;
  const updates = Object.fromEntries(
    Object.entries(profileFields).filter(([, v]) => v !== undefined),
  );

  if (Object.keys(updates).length > 0) {
    const { error } = await session.supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", session.user.id);

    if (error) {
      return jsonError("profile_update_failed", error.message, 400);
    }
  }

  if (tags) {
    await session.supabase.from("profile_tags").delete().eq("profile_id", session.user.id);
    if (tags.length > 0) {
      const rows = tags.map((tag_key) => ({
        profile_id: session.user.id,
        tag_key,
        category: tagKeyToProfileCategory(tag_key),
      }));
      const { error: tagErr } = await session.supabase.from("profile_tags").insert(rows);
      if (tagErr) {
        return jsonError("tags_update_failed", tagErr.message, 400);
      }
    }
  }

  const settingsRow: { user_id: string; updated_at: string; nudge_level?: string } = {
    user_id: session.user.id,
    updated_at: new Date().toISOString(),
  };
  if (nudge_level !== undefined) {
    settingsRow.nudge_level = nudge_level;
  }
  await session.supabase.from("user_settings").upsert(settingsRow, { onConflict: "user_id" });

  return await GET();
}

