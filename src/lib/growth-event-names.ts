/**
 * Liste unique des événements growth acceptés par `POST /api/growth/event` et par `trackGrowthEvent`.
 * Toute nouvelle entrée : ajouter ici uniquement.
 * D’autres noms peuvent être insérés côté serveur (ex. `auth_magic_link_exchange` dans `/auth/callback`) — ne pas les ajouter ici.
 */
export const GROWTH_EVENT_NAMES = [
  "accueil_viewed",
  "auth_otp_verified",
  "auth_page_viewed",
  "discover_propose_click",
  "discover_viewed",
  "feedback_submitted",
  "growth_alert_acknowledged",
  "invite_attribution",
  "invite_link_copied",
  "invite_native_shared",
  "invite_share_opened",
  "lieux_copy_place",
  "lieux_maps_open",
  "lieux_memory_optin_public",
  "lieux_memory_save",
  "lieux_nearby_click",
  "lieux_place_picked",
  "lieux_search",
  "meal_proposed",
  "meal_status_updated",
  "meal_venue_submitted",
  "module_payment_checkout_start",
  "module_rescue_claim",
  "module_rescue_publish",
  "module_share_publish",
  "module_share_reserve",
  "next_action_click",
  "nudge_level_updated",
  "onboarding_completed",
  "onboarding_started",
  "onboarding_step_completed",
  "partners_cta_click",
  "partners_page_view",
  "repas_refresh_click",
  "ritual_card_click",
  "ritual_card_seen",
  "surprise_graille_rolled",
] as const;

export type GrowthEventName = (typeof GROWTH_EVENT_NAMES)[number];
