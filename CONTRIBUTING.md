# Contribuer à Paye ta graille

1. **Node 20+** · `npm ci` avant toute PR.  
2. `npm run lint` et `npm run typecheck` doivent passer.  
3. **Pas** de secrets dans le dépôt : uniquement `.env.example` pour les noms de variables.  
4. **RLS** : toute nouvelle table exposée au client doit avoir des policies revues.  
5. Alignement produit : `docs/BLUEPRINT_PRODUIT_FINAL_MVP.md` et `docs/PRODUCT_SPEC.md`.

Les grandes décisions sont tracées dans `docs/DECISIONS_PRODUIT_LOG.md`.
