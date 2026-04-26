/** Segments analytics / jetons d’invitation (`ref=friend_<source>`). */
export const INVITE_FRIEND_SOURCES = [
  "accueil",
  "decouvrir",
  "repas",
  "repas_matched",
  "repas_confirmed",
  "repas_completed",
] as const;

export type InviteFriendSource = (typeof INVITE_FRIEND_SOURCES)[number];

export function isInviteFriendSource(s: string): s is InviteFriendSource {
  return (INVITE_FRIEND_SOURCES as readonly string[]).includes(s);
}
