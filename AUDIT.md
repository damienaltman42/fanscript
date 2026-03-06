# 🔍 AUDIT PRODUIT — FanScript

> **Date :** 6 mars 2026  
> **Réalisé par :** Constelie (AI Product Auditor)  
> **Version auditée :** commit `f6d3c82` (dernier en date)

---

## 📋 Résumé Exécutif

FanScript est un outil de copywriting IA destiné aux créateurs de contenu adulte. En 4 sprints, un MVP fonctionnel a été livré avec 5 outils de génération, un système d'auth, de billing et une i18n sur 8 langues. La base technique est solide (NestJS + Prisma + Next.js) mais le projet manque de tests, de monitoring, et plusieurs points de friction UX/sécurité freinent la conversion.

**Score global :** 6.5/10

| Dimension | Score | Commentaire |
|-----------|-------|-------------|
| Complétude des features | 7/10 | MVP complet, bon socle |
| Qualité technique | 5/10 | Pas de tests, dette existante |
| Sécurité | 5/10 | Endpoints basiques, manques critiques |
| UX/UI | 6/10 | Belle interface, parcours incomplets |
| Fiabilité | 5/10 | Pas de monitoring, gestion d'erreurs minimale |

---

## 1. REVUE DES RÉALISATIONS

### ✅ Features Développées

#### Backend (NestJS + Prisma)
| Feature | Statut | Notes |
|---------|--------|-------|
| Auth (register/login) | ✅ Complet | JWT + bcrypt (10 rounds) |
| Génération de captions | ✅ Complet | 5 variations (PRO), structured output Zod |
| Génération de bios | ✅ Complet | Short/long, 4 variations (PRO) |
| Génération de DM Scripts | ✅ Complet | Multi-scénario, conversion tips |
| Génération d'idées de contenu | ✅ Complet | 3 catégories (viral/monétisation/rétention) |
| Génération de hashtags | ✅ Complet | 3 sets (full/compact/trending) |
| Quota FREE (10/mois) | ✅ Complet | Vérification en DB par mois |
| Historique des générations | ✅ Complet (API) | Endpoint `/generate/history` opérationnel |
| Stripe Checkout | ✅ Complet | Plans PRO et BUSINESS |
| Stripe Portal | ✅ Complet | Gestion abonnement self-serve |
| Stripe Webhook | ✅ Complet | checkout.session.completed + subscription.deleted |
| Modèle par plan | ✅ Complet | FREE=gpt-4o-mini, PRO=gpt-4o, BUSINESS=gpt-4.1 |

#### Frontend (Next.js 14 + Tailwind)
| Feature | Statut | Notes |
|---------|--------|-------|
| Landing page | ✅ Complet | Stats, demo live, features, testimonials |
| Page de pricing | ✅ Complet | 3 plans, highlight PRO |
| Register / Login | ✅ Complet | Forms complets |
| Dashboard | ✅ Complet | Sidebar tools, controls, résultats riches |
| Sélecteur de plateforme | ✅ Complet | 6 plateformes |
| Sélecteur de ton | ✅ Complet | 6 tons |
| Slider NSFW (1-5) | ✅ Complet | Labels couleurs par niveau |
| Copy-to-clipboard | ✅ Complet | Toast de confirmation |
| Barre de progression usage | ✅ Complet | Visible dans nav |
| Upsell sidebar | ✅ Complet | Déclenché à 8/10 générations |
| i18n 8 langues | ✅ Complet (dashboard) | EN/FR/ES/IT/DE/PT/ZH/JA |

### ⚠️ Features Partiellement Implémentées

| Feature | Problème |
|---------|---------|
| Historique (UI) | Endpoint API existe, **aucune page UI** pour le consulter |
| Comptage tokens | Champ `tokens` dans DB toujours à `0` — non implémenté |
| Plan detection checkout | `/register?plan=PRO` — la query string n'est pas gérée côté UI |
| Landing i18n | Landing page et pricing page **en dur en anglais** — pas de sélecteur de langue |

### ❌ Features Absentes (par rapport aux engagements README)
| Feature | Statut |
|---------|--------|
| "API access" Business | Mentionné dans pricing, **pas d'endpoint `/api/` avec clé API** |
| "Bulk generation" Business | Mentionné dans pricing, **non implémenté** |
| Email verification | Non implémenté |
| Password reset | Non implémenté |

---

## 2. QUALITÉ TECHNIQUE

### 🧪 Couverture de Tests : **0%**

Aucun fichier `.spec.ts` ou `.test.ts` dans le code source du projet. C'est le point de dette technique le plus critique.

**Impact :** Tout refactoring ou montée de version de dépendance est risqué. Impossible de garantir la non-régression.

### 📦 Stack & Dépendances

```
NestJS + Prisma + PostgreSQL
Next.js 14.1.0 (légèrement daté — 15.x sorti)
OpenAI Agents SDK (@openai/agents)
Stripe
Tailwind CSS
bcryptjs
zod (v4)
```

**Points positifs :**
- Utilisation du SDK OpenAI Agents + structured output (Zod) → réponses fiables et typées
- Monorepo pnpm bien structuré (apps/ + packages/)
- TypeScript strict partout
- Schéma Prisma propre et lisible

**Points négatifs :**
- `tokens: 0` hardcodé dans saveGeneration() — pas de tracking coût OpenAI
- Pas de `try/catch` autour des appels OpenAI → une erreur API fait planter la requête sans message utile
- `webhook` Stripe : `subscription.deleted` utilise `updateMany` sans vérifier que le record existe
- JWT secret non mentionné dans `.env.example` → risque de déploiement avec valeur par défaut
- Pas de validation DTO complète : `nsfwLevel` accepte n'importe quelle valeur sans guard
- `ecosystem.config.js` (PM2) présent mais incomplet/non documenté

### 📊 Performance

- Pas d'index Prisma sur `Generation.userId` + `createdAt` → requête quota mal optimisée à l'échelle
- Les appels OpenAI sont synchrones (pas de streaming) → temps de réponse ~3-8s
- Pas de cache → chaque génération identique coûte un appel API
- Pas de queue (Bull/BullMQ) pour les génération lourdes

### 🔐 Sécurité

| Point | Statut | Criticité |
|-------|--------|-----------|
| Pas de rate limiting sur les endpoints | ❌ | 🔴 Haute |
| Pas de validation du nsfwLevel (doit être 1-5) | ❌ | 🟡 Moyenne |
| Pas d'email de vérification | ❌ | 🟡 Moyenne |
| Pas de CORS configuré explicitement | ❌ | 🟡 Moyenne |
| Pas de helmet (headers HTTP sécurité) | ❌ | 🟡 Moyenne |
| Pas de refresh token | ❌ | 🟡 Moyenne |
| JWT secret dans .env non validé au démarrage | ❌ | 🟡 Moyenne |
| bcrypt 10 rounds (standard) | ✅ | 🟢 OK |
| Stripe webhook signature vérifiée | ✅ | 🟢 OK |
| Passwords hashés | ✅ | 🟢 OK |

---

## 3. POINTS DE FRICTION UX

| Friction | Impact | Priorité |
|----------|--------|----------|
| Pas de page historique | Les PRO/Business ne voient jamais leurs générations passées | 🔴 Haute |
| Landing page en anglais uniquement | Perte des visiteurs non-anglophones | 🔴 Haute |
| Pas d'onboarding (aucun wizard) | Churn élevé sur les nouveaux utilisateurs | 🔴 Haute |
| Pas de password reset | Bloquant pour réengager les utilisateurs perdus | 🔴 Haute |
| "Plan=PRO" query string ignorée | L'upgrade flow post-register est cassé | 🟠 Haute |
| Pas de prévisualisation des plans avec features détaillées | Frein à l'upgrade | 🟡 Moyenne |
| Pas de feedback sur la qualité des générations (👍/👎) | Impossible d'améliorer les prompts | 🟡 Moyenne |
| Token counter toujours à 0 | Pas de transparence sur les coûts pour Business | 🟡 Moyenne |
| Pas de mode "favori" sur les générations | Impossible de retrouver les bons résultats | 🟡 Moyenne |
| Pas d'export (PDF, Google Docs) | Friction dans l'adoption quotidienne | 🟢 Basse |

---

## 4. BENCHMARK CONCURRENTS

### OnlyFans (2016, ~$1.3B de revenus en 2023)
- **Modèle :** Abonnement mensuel + PPV + tips (creator garde 80%)
- **4M créateurs, 370M utilisateurs enregistrés**
- **Outils créateurs :** Analytics de base, messagerie, scheduling
- **Lacune :** Zéro outil de copywriting IA natif → **marché ouvert pour FanScript**

### Fansly (2020, Baltimore)
- **Modèle :** Tiers d'abonnement + bundles + live stream
- **Différenciateur :** Tiers gratuits pour acquisition, bundles multi-contenu
- **Lacune :** Pas d'outil IA non plus → FanScript peut s'y imposer

### Patreon (2013, SaaS créateur généraliste)
- **Modèle :** Membership + tiers + posts exclusifs
- **Outils :** Analytics avancées, community features, polling
- **Lacune côté FanScript :** Moins d'outils spécifiquement orientés "conversion"

### Ko-fi (2012, donation + shop)
- **Modèle :** Tips + boutique + commissions + memberships
- **Différenciateur :** 0% commission sur tips, shop physique/digital
- **Lacune côté FanScript :** Pas d'outil IA, audience plus "art/illustration"

### Outils IA concurrents directs
| Outil | Features | Prix | Gap vs FanScript |
|-------|---------|------|-----------------|
| **Copy.ai** | Copywriting généraliste | $36/mo | Non spécialisé adulte |
| **Jasper** | Long-form copywriting | $49/mo | Non spécialisé adulte, trop cher |
| **FanFuel** | Scripts OF (basique) | $29/mo | Pas de DM, pas de hashtags, pas d'i18n |
| **OFSuite** | Messages automatisés | $99/mo | Automation, pas génération IA |
| **Scrile** | Plateforme + outils | Custom | B2B, pas SaaS créateur |

**Conclusion benchmark :** FanScript est **positionné dans un créneau peu encombré** — la convergence IA + copywriting + spécialisation adulte est quasiment inexistante. L'avantage à consolider rapidement.

---

## 5. NOUVELLES FEATURES PRIORISÉES (MoSCoW)

### 🔴 MUST HAVE (Impact élevé, effort faible-moyen)

#### M1 — Page Historique UI
- Voir, relire, copier les 50 dernières générations
- Filtres par type (caption, bio, etc.)
- Effort : S | Valeur : M

#### M2 — Rate Limiting API
- `@nestjs/throttler` sur tous les endpoints
- Prévention du scraping et des abus
- Effort : XS | Valeur : M

#### M3 — Password Reset par Email
- Flow classique : email → token → reset
- Effort : M | Valeur : M

#### M4 — Helmet + CORS sécurisés
- `@nestjs/helmet` + config CORS stricte
- Effort : XS | Valeur : M

#### M5 — Landing i18n
- Appliquer le système de traduction existant à la landing et pricing
- Effort : S | Valeur : M

#### M6 — Fix upgrade flow (plan=PRO query string)
- Pré-sélectionner le plan au register si `?plan=PRO`
- Effort : XS | Valeur : M

---

### 🟠 SHOULD HAVE (Impact moyen-élevé, effort moyen)

#### S1 — Onboarding Wizard (3 étapes)
- Étape 1 : plateforme principale
- Étape 2 : niche + niveau NSFW par défaut
- Étape 3 : 1ère génération guidée
- **Impacteur rétention majeur** — réduit le churn J0
- Effort : M | Valeur : H

#### S2 — Feedback 👍/👎 sur les générations
- Base de données d'exemples "bons" vs "mauvais"
- Fine-tuning futur + amélioration prompts
- Effort : S | Valeur : H

#### S3 — Traduction automatique des générations
- Générer en anglais puis traduire via API DeepL/OpenAI
- Améliore la qualité pour les langues non-anglaises
- Effort : M | Valeur : M

#### S4 — Streaming des réponses OpenAI (SSE)
- Afficher les tokens au fur et à mesure → UX "live"
- Réduit la perception du temps de chargement
- Effort : M | Valeur : H

#### S5 — Tracking des coûts OpenAI (tokens)
- Implémenter le comptage tokens réel dans `saveGeneration`
- Dashboard admin pour monitorer les coûts
- Effort : S | Valeur : M

#### S6 — Favoris / Bookmarks
- Marquer une génération comme favorite
- Section "Mes meilleurs" dans l'historique
- Effort : S | Valeur : M

#### S7 — Export PDF / TXT
- "Télécharger mes captions" en 1 clic
- Effort : S | Valeur : M

#### S8 — API Key pour Business
- Endpoint `/api/v1/generate/*` avec clé API (comme promis sur pricing)
- Effort : M | Valeur : H

---

### 🟡 COULD HAVE (Impact moyen, effort moyen-élevé)

#### C1 — Scheduling de contenu (intégration calendrier)
- Créer un calendrier de posts dans l'app
- Assigner des générations à des dates
- **Différenciateur fort vs concurrents purement copywriting**
- Effort : L | Valeur : H

#### C2 — Templates personnalisés
- Créer et sauvegarder ses propres templates de prompts
- "Mon style de caption préféré"
- Effort : M | Valeur : M

#### C3 — "Creator Profile" pour mémoriser le contexte
- Sauvegarder : niche, plateforme principale, ton préféré, nsfwLevel
- Ne plus avoir à tout re-saisir
- Effort : S | Valeur : H

#### C4 — Mode "A/B Test" de captions
- Générer 2 versions différentes et voir laquelle performe le mieux
- Intégration analytics (ou simple tracking manuel)
- Effort : L | Valeur : H

#### C5 — Génération d'idées de prix (PPV pricing)
- Suggérer des prix pour les contenus PPV selon la niche et la concurrence
- Effort : S | Valeur : M

#### C6 — Chrome Extension
- Générer une caption directement depuis l'interface OnlyFans/Fansly
- Effort : L | Valeur : H (différenciateur)

#### C7 — Analytics dashboard créateur
- Voir ses générations les plus utilisées, les topics récurrents
- Effort : M | Valeur : M

#### C8 — Multi-profils (pour agences)
- Gérer plusieurs créateurs sous un même compte Business
- Effort : L | Valeur : H (B2B unlock)

---

### ⚪ WON'T HAVE (pour l'instant)

- Génération d'images IA (hors scope légal adulte complexe)
- Marketplace de "best captions" (modération trop lourde)
- App mobile native (PWA suffisant en v1)

---

## 6. MATRICE RICE — PRIORISATION

> RICE = (Reach × Impact × Confidence) / Effort

| Feature | Reach | Impact | Conf. | Effort | RICE Score |
|---------|-------|--------|-------|--------|------------|
| M2 - Rate Limiting | 10 | 7 | 9 | 1 | **630** |
| M4 - Helmet/CORS | 10 | 7 | 9 | 1 | **630** |
| M6 - Fix upgrade flow | 8 | 8 | 9 | 1 | **576** |
| M5 - Landing i18n | 9 | 6 | 8 | 2 | **216** |
| M1 - Page Historique | 8 | 7 | 8 | 2 | **224** |
| S4 - Streaming SSE | 10 | 8 | 7 | 3 | **187** |
| C3 - Creator Profile | 9 | 8 | 8 | 2 | **288** |
| S1 - Onboarding Wizard | 10 | 9 | 8 | 3 | **240** |
| S2 - Feedback 👍/👎 | 10 | 7 | 7 | 2 | **245** |
| S8 - API Key Business | 3 | 9 | 8 | 3 | **72** |
| C1 - Scheduling | 7 | 9 | 6 | 5 | **75.6** |
| C6 - Chrome Extension | 6 | 9 | 7 | 5 | **75.6** |

---

## 7. PLAN D'ACTION RECOMMANDÉ

### Sprint 1 (immédiat — 1 semaine)
- [ ] Rate Limiting + Helmet + CORS
- [ ] Fix upgrade flow
- [ ] Index Prisma sur Generation
- [ ] Validation DTO nsfwLevel (pipe NestJS)

### Sprint 2 (court terme — 2 semaines)
- [ ] Password Reset
- [ ] Page Historique UI
- [ ] Landing i18n complète
- [ ] Creator Profile (sauvegarde préférences)

### Sprint 3 (moyen terme — 3 semaines)
- [ ] Onboarding Wizard
- [ ] Streaming SSE des réponses OpenAI
- [ ] Feedback 👍/👎
- [ ] Tracking tokens réels

### Sprint 4 (moyen terme — 3 semaines)
- [ ] API Key Business
- [ ] Export PDF/TXT
- [ ] Favoris / Bookmarks
- [ ] Templates personnalisés

### Sprint 5+ (long terme)
- [ ] Scheduling calendrier
- [ ] Chrome Extension
- [ ] Multi-profils (B2B)
- [ ] A/B Testing

---

## 8. RECOMMANDATIONS MONITORING

| Outil | Usage recommandé | Priorité |
|-------|----------------|----------|
| **Sentry** | Error tracking frontend + backend | 🔴 Immédiat |
| **PostHog** | Analytics produit + funnel conversion | 🟠 Sprint 1 |
| **Uptime Robot** | Monitoring disponibilité API | 🟠 Sprint 1 |
| **Logflare/Axiom** | Centralisation des logs NestJS | 🟡 Sprint 2 |
| **Stripe Dashboard** | MRR, churn déjà disponible | ✅ Déjà disponible |

---

*Audit généré automatiquement par Constelie — FanScript v1.0*
