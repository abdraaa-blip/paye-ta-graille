import {
  clearInviteAttributionState,
  hydrateInviteAttributionFromCookies,
  peekInviteRefForAttribution,
  peekInviteTokenForAttribution,
} from "@/lib/invite-attribution";
import { trackGrowthEvent } from "@/lib/growth-events";

/** Un seul envoi par session navigateur après login (ou fin onboarding avec session). */
export async function emitInviteAttributionOnce(context: string): Promise<void> {
  hydrateInviteAttributionFromCookies();
  const ref = peekInviteRefForAttribution();
  if (!ref) return;
  const invToken = peekInviteTokenForAttribution();
  const ok = await trackGrowthEvent({
    event: "invite_attribution",
    context,
    metadata: invToken ? { ref, inv_token: invToken } : { ref },
  });
  if (ok) clearInviteAttributionState();
}
