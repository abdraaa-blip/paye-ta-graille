/** Libellés repas : vocabulaire table, pas jargon technique. */



const LABELS: Record<string, string> = {

  proposed: "Invitation envoyée",

  matched: "Vous êtes d’accord",

  venue_proposed: "Lieu proposé",

  venue_confirmed: "Lieu validé",

  confirmed: "Rendez-vous fixé",

  completed: "Repas passé",

  cancelled: "Annulé",

};



export function mealStatusLabel(status: string): string {

  return LABELS[status] ?? status;

}

