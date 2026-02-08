# Nutri Platform (Foundation Scaffold)

This repo is a **foundation monorepo scaffold** for a comprehensive food nutrition platform specializing in diets.
It includes:

- **Web** (Next.js): tab-based navigation (Home, Recipes, Meal Plans, Diets, Blog, About, Profile)
- **Admin** (Next.js): admin console shell for CRUD workflows
- **Mobile** (Expo + expo-router): matching tab-based navigation
- **API** (Express + TypeScript + MongoDB): OIDC-ready auth middleware + CRUD router factory

> Positioning: this is the **platform baseline**—navigation, structure, and API plumbing—ready for you to wire into your real dataset and production identity configuration.

## Repo structure

- `apps/web` — public web experience
- `apps/admin` — CRUD/admin console
- `apps/mobile` — iOS/Android/web via Expo
- `apps/api` — REST API (MongoDB)
- `packages/shared` — shared types/constants
- `packages/ui` — shared minimal UI primitives

## Local startup

### 1) Configure environment

Copy the repo-level env file:

```bash
cp .env.example .env
```

Populate `MONGO_URI` and (optionally) OIDC values.

### 2) Install dependencies

```bash
pnpm i
```

### 3) Run all apps (dev)

```bash
pnpm dev
```

By default:
- Web: `http://localhost:3001`
- Admin: `http://localhost:3002`
- API: `http://localhost:3000/api/health`
- Mobile: run `pnpm -C apps/mobile dev`

## Auth model (foundation)

The API supports:
- **OIDC JWT validation** (configure `OIDC_AUTHORITY` + `OIDC_AUDIENCE`)
- **Local dev escape hatch**: set `ALLOW_DEV_USER_HEADER=true` and send `X-Dev-User: todd` (grants `*` permissions for fast iteration)

## CRUD endpoints (foundation)

All routes are mounted under `/api`:
- `/api/foods`
- `/api/nutrition-facts`
- `/api/recipes`
- `/api/recipes/:id/publish`
- `/api/diets`
- `/api/blog-posts`
- `/api/blog-posts/:id/publish`
- `/api/meal-plans`

Each collection supports: list/get/create/update/soft-delete.

## What’s next (recommended execution)

1. Implement RBAC persistence (users/roles/permissions) and map OIDC `sub` → user.
2. Wire Admin tables to API with pagination/filter/sort.
3. Implement rich UX: recipe detail, diet detail, meal plan calendar + grocery list.
4. Add SEO for web (sitemap, metadata), plus caching and observability.
