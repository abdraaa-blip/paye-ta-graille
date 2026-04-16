import { clearInviteAttributionState, peekInviteRefForAttribution } from "@/lib/invite-attribution";
import { trackGrowthEvent } from "@/lib/growth-events";

/** Un seul envoi par session navigateur après login (ou fin onboarding avec session). */
export async function emitInviteAttributionOnce(context: string): Promise<void> {
  const ref = peekInviteRefForAttribution();
  if (!ref) return;
  const ok = await trackGrowthEvent({
    event: "invite_attribution",
    context,
    metadata: { ref },
  });
  if (ok) clearInviteAttributionState();
}
