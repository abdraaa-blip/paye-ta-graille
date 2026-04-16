# Paiement Stripe — à activer quand tu es prête

Fichier interne (pas une page du site).

## Prérequis `.env.local` (serveur uniquement)

- `SUPABASE_SERVICE_ROLE_KEY` — **sans** `#` devant la ligne, sinon le webhook ne met pas à jour `payment_ledger`.
- `STRIPE_SECRET_KEY` — mode test : `sk_test_...` (Dashboard → Developers → API keys).
- `STRIPE_WEBHOOK_SECRET` — après création du webhook (ou `stripe listen` en local → `whsec_...`).

Redémarrer le serveur après modification.

## Webhook

- URL prod : `https://<ton-domaine>/api/stripe/webhook`
- Événements utiles : `checkout.session.completed`, `checkout.session.expired`
- Local : [Stripe CLI](https://stripe.com/docs/stripe-cli) — `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Rappel

Sans ces trois variables, **Partage** et **Seconde graille** peuvent fonctionner ; le flux **Checkout** renvoie « non configuré » ou le journal reste bloqué en `pending` sans webhook + service role.
