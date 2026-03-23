# 🚀 Pilot-Âge App — SaaS Platform

> Plateforme d'accompagnement des salariés aidants en entreprise

**Domain:** [app.pilot-age.fr](https://app.pilot-age.fr)  
**Site vitrine:** [pilot-age.fr](https://pilot-age.fr)

## Stack technique

- **Framework:** Next.js 16 App Router (React 19)
- **Language:** TypeScript (strict)
- **Styles:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL + Auth + Realtime + pgvector)
- **Hosting:** Vercel
- **Animations:** Framer Motion
- **Charts:** Recharts (shadcn/ui charts)

## Modules

1. **Questionnaire anonyme** — Type Kahoot, temps réel via QR code
2. **Dashboard entreprise** — Stats anonymisées, export PDF, comparaison temporelle
3. **Espace formation** — Vidéos, guides, outils, simulateurs
4. **Assistante sociale IA** — Agent conversationnel (OpenAI + RAG)
5. **Admin Pilot-Âge** — Back-office complet

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values.

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Jaune Pilot-Âge | `#FFCF02` | Accent, boutons primaires |
| Noir | `#181818` | Texte, sidebar |
| Blanc cassé | `#F7F7F5` | Fond global |
| Gris texte | `#6B6B6B` | Texte secondaire |
| Succès | `#2D6A4F` | Validations |
| Erreur | `#C1121F` | Alertes |

---

*Pilot-Âge © 2026 — Alex Lopez & Laëtitia Galanakis*
