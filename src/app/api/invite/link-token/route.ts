import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api/errors";
import { rateLimitForUser } from "@/lib/api/rate-limit";
import { requireSession } from "@/lib/api/session";
import { INVITE_FRIEND_SOURCES } from "@/lib/invite-friend-sources";
import { inviteLinkSigningConfigured, mintInviteLinkToken } from "@/lib/invite-link-token";

const querySchema = z.object({
  source: z.enum(INVITE_FRIEND_SOURCES),
});

/**
 * Jeton signé pour liens d’invitation personnels (identifie l’inviteur côté serveur après inscription de l’invité·e).
 * Sans `PTG_INVITE_LINK_SECRET` (≥16 car.) : `{ token: null }` — les liens restent anonymes comme avant.
 */
export async function GET(request: Request) {
  const session = await requireSession();
  if (!session.ok) return session.response;

  const limited = await rateLimitForUser(session.user.id, "invite_link_token_get", 30, 60_000);
  if (limited) return limited;

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({ source: url.searchParams.get("source") ?? "" });
  if (!parsed.success) {
    return jsonError("validation_error", "Paramètre source invalide.", 400);
  }

  if (!inviteLinkSigningConfigured()) {
    return NextResponse.json({ token: null as string | null });
  }

  const token = mintInviteLinkToken(session.user.id, parsed.data.source);
  if (!token) {
    return NextResponse.json({ token: null as string | null });
  }

  return NextResponse.json({ token });
}
