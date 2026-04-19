/**
 * Déclenche localement ou sur preview/prod : GET /api/cron/meal-reminders
 * (rappels e-mail J-24 / J-2h + clôture auto confirmed→completed) avec Authorization: Bearer CRON_SECRET.
 *
 * Usage : PTG_BASE_URL=http://127.0.0.1:3000 CRON_SECRET=xxx node scripts/trigger-meal-reminders.mjs
 */
const base = (process.env.PTG_BASE_URL ?? "http://127.0.0.1:3000").trim().replace(/\/+$/, "");
const secret = process.env.CRON_SECRET?.trim();
if (!secret) {
  console.error("CRON_SECRET manquant.");
  process.exit(1);
}

const url = new URL("/api/cron/meal-reminders", base).toString();
let res;
try {
  res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secret}`,
      Accept: "application/json",
    },
  });
} catch (err) {
  console.error("Requête cron impossible (réseau / serveur arrêté) :", err?.message ?? err);
  process.exit(1);
}
const text = await res.text();
console.log(res.status, text);
process.exit(res.ok ? 0 : 1);
