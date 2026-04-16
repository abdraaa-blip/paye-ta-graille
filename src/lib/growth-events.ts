export type GrowthEventName =
  | "ritual_card_seen"
  | "ritual_card_click"
  | "next_action_click"
  | "invite_share_opened"
  | "invite_link_copied"
  | "invite_native_shared"
  | "discover_propose_click"
  | "repas_refresh_click"
  | "nudge_level_updated"
  | "module_share_publish"
  | "module_share_reserve"
  | "module_rescue_publish"
  | "module_rescue_claim"
  | "module_payment_checkout_start";

type EventPayload = {
  event: GrowthEventName;
  context?: string;
  metadata?: Record<string, unknown>;
};

export async function trackGrowthEvent(payload: EventPayload): Promise<void> {
  try {
    await fetch("/api/growth/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Silencieux: l'UI ne doit jamais casser si la télémétrie échoue.
  }
}
