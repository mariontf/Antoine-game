# Sildia Contest — Guide de mise en route

## 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → New project
2. Choisir un nom (ex: `sildia-contest`) et un mot de passe
3. Dans **SQL Editor**, coller et exécuter le contenu de `supabase-setup.sql`
4. Dans **Storage** → New bucket → nommer `logos`, cocher **Public**

## 2. Récupérer les clés Supabase

Dans **Project Settings > API** :
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Configurer les variables d'environnement

Modifier `.env.local` :
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## 4. Lancer en local

```bash
npm run dev
```
Ouvrir http://localhost:3000

## 5. Ajouter le lien vidéo tutoriel

Dans `components/HowToCreate.tsx`, ligne 9 :
```ts
const TUTORIAL_URL = 'https://www.youtube.com/watch?v=VOTRE_ID'
```

## 6. Déployer sur Vercel (recommandé, gratuit)

```bash
npm install -g vercel
vercel
```
Puis ajouter les variables d'environnement dans le dashboard Vercel.

---

## Structure du projet

```
sildia-contest/
├── app/page.tsx          — Page principale
├── components/
│   ├── HeroSection.tsx   — Hero + countdown
│   ├── ContestRules.tsx  — Règles du concours
│   ├── HowToCreate.tsx   — Guide génération logo IA
│   ├── SubmitForm.tsx    — Formulaire dépôt logo
│   ├── GalleryGrid.tsx   — Galerie + déclencheur vote
│   ├── VoteModal.tsx     — Modal classement top 3
│   └── Leaderboard.tsx   — Podium + scores Borda
├── lib/supabase.ts       — Client Supabase + types
└── supabase-setup.sql    — Script SQL à exécuter une fois
```
