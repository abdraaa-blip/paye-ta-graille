export type GrowthEventName =
  | "onboarding_started"
  | "onboarding_step_completed"
  | "onboarding_completed"
  | "accueil_viewed"
  | "auth_page_viewed"
  | "auth_otp_verified"
  | "discover_viewed"
  | "meal_proposed"
  | "meal_venue_submitted"
  | "meal_status_updated"
  | "ritual_card_seen"
  | "ritual_card_click"
  | "next_action_click"
  | "invite_share_opened"
  | "invite_link_copied"
  | "invite_native_shared"
  | "invite_attribution"
  | "discover_propose_click"
  | "repas_refresh_click"
  | "nudge_level_updated"
  | "module_share_publish"
  | "module_share_reserve"
  | "module_rescue_publish"
  | "module_rescue_claim"
  | "module_payment_checkout_start"
  | "partners_page_view"
  | "partners_cta_click";

type EventPayload = {
  event: GrowthEventName;
  context?: string;
  metadata?: Record<string, unknown>;
};

export async function trackGrowthEvent(payload: EventPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/growth/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return res.ok;
  } catch {
    // Silencieux: l'UI ne doit jamais casser si la télémétrie échoue.
    return false;
  }
}
