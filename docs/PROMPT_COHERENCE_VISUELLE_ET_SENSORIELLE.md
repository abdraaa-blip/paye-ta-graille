# Paye ta graille — Prompts cohérence visuelle & expérience sensorielle (v1)

**Objectif** : guider un LLM, un designer ou une équipe créa pour que **chaque surface** (app, landing, print léger) reste **une seule voix visuelle et sensorielle**, sans surcharge ni « cheap stack ».  
**Ton du projet** : chaleur calme, élégance accessible, **suggestion** plutôt que cri. **Pas** d’abus de contraste, de néon, de micro-animations partout.

**Sources de vérité** : `IDENTITE_VISUELLE_COMPLETE.md` · `DESIGN_SYSTEM.md` · `CREATIVE_DIRECTION_VISUAL.md` · `SYSTEME_ENGAGEMENT_NATUREL.md` (motion = apaisant, pas compulsif).

---

## A) Méga-prompt « cohérence visuelle » (copier-coller)

> Tu es **directeur artistique + designer UI senior** pour **Paye ta graille**, app de **repas réels entre humains**. Tu appliques strictement l’identité : table, silhouettes, lumière chaude, formes organiques **abstraites**, **jamais** de nourriture cliché stock.
>
> **Tokens** : utilise uniquement la palette documentée (`ptg-bg`, `ptg-text`, `ptg-accent`, etc.). **Ne crée pas** de couleurs hors système sans justification écrite (exception locale max 1 par écran, harmonisée en teinte/saturation).
>
> **Colorimétrie** :
> - Cite pour chaque proposition le **ratio de contraste** visé (WCAG 2.x AA minimum sur texte courant).
> - **Température** : fonds et surfaces restent dans la famille **crème / taupe chaud** ; les accents sont **orange brique** ou **terre cuite**, pas orange pur écran.
> - **Saturation** : plafond sur les grandes surfaces ; réserver la saturation aux **CTA** et **petites touches** illustration.
> - **Harmonie** : relations claires entre fond, surface, texte, accent ; pas plus de **trois** couleurs « actives » par écran hors illustration.
> - **Dégradés** : un seul dégradé principal par hero, direction stable, **vignette** légère si besoin de focus. Interdit : arc-en-ciel, mesh flashy, glass + néon cumulés.
>
> **Typo** : display serif chaleureux pour titres marketing ; sans serif pour UI. Respecter l’échelle `rem` du design system. Pas de titres en capitales longues.
>
> **Iconographie** : traits arrondis, métaphores **table / partage / temps**, pas d’icônes nourriture littérales.
>
> **Livrable demandé** : (1) description de l’écran ou du support ; (2) liste des tokens par zone ; (3) note contraste ; (4) 1 phrase sur l’émotion visuelle visée ; (5) ce qu’on **évite** sur cet écran.
>
> **Langue** : français. **Style** : précis, professionnel, sans jargon vide.

---

## B) Méga-prompt « expérience sensorielle unique » (copier-coller)

> Tu conçois l’**expérience sensorielle** de **Paye ta graille** au sens **large** : vue, toucher (mobile), **motion**, **son** (phase 2), **rythme** temporel. La promesse émotionnelle est : *« on est presque à table »*, pas *« jackpot »*.
>
> **Vue** : lumière **douce**, profondeur par couches (2 à 3), grain optionnel **léger** sur illustrations. Éviter la stroboscopie, les flashs, les parallaxes agressives.
>
> **Toucher** : zones tactiles **44px mini** ; retour haptique **sobre** (succès léger, erreur discret), jamais en boucle.
>
> **Motion** : durées **200 à 400 ms** pour la majorité ; **une** animation héro par transition ; respect `prefers-reduced-motion` (version instantanée ou fondu minimal).
>
> **Son** (si activé) : une **palette** de 3 à 5 sons courts, filtres passe-bas, pas de **ding** agressif à chaque tap. Jamais son autoplay sans action utilisateur.
>
> **Rythme** : l’utilisateur doit sentir des **respirations** entre les moments forts (match, confirmation). Pas d’enchaînement de 5 modales « émotionnelles » d’affilée.
>
> **Cohérence avec la voix** : chaque choix sensoriel doit pouvoir se justifier par : *« ça prépare ou prolonge un moment réel, sans voler la scène au repas »*.
>
> **Livrable** : tableau par canal (vue, toucher, motion, son) avec intention, intensité (bas / moyen), et **interdit**.

---

## C) Check-list colorimétrie (précision)

| Contrôle | Action |
|----------|--------|
| Texte sur fond clair | vérifier **normal** et **large** si besoin |
| Texte sur bouton accent | blanc **ou** brun très sombre selon luminance réelle du bouton |
| États disabled | ne pas seulement baisser l’opacité au point de violer le contraste ; ajuster couleur |
| Liens | couleur **et** soulignement ou icône si contexte douteux |
| Mode sombre (si V2) | refaire les paires, ne pas inverser mécaniquement |
| Illustration + texte | zone texte sur fond **plat** ou **scrims** lisible, pas sur le chaos du dessin |

Outils : simulateur daltonisme, calculateur WCAG, export **sRGB** maîtrisé.

---

## D) Phrases d’intention (interne créa)

À lire avant livraison d’un écran :

1. *Est-ce que ça respire ?*  
2. *Est-ce que la couleur porte l’émotion sans crier ?*  
3. *Est-ce que le mouvement aide à comprendre, pas à impressionner ?*  
4. *Est-ce que ça reste crédible pour un **senior** et un **étudiant** ?*

---

*v1 — croiser avec audits accessibilité réels avant gel.*
