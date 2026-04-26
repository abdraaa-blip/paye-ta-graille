import type { GrowthEventName } from "@/lib/growth-event-names";

export type { GrowthEventName };
export { GROWTH_EVENT_NAMES } from "@/lib/growth-event-names";

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
