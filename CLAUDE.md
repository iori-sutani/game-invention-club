# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint (next/core-web-vitals + next/typescript)
```

No test framework is configured. There are no test scripts or test files.

Supabase setup: copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Run all migration files in `supabase/migrations/` in order (001 → 004) via Supabase dashboard SQL Editor or CLI.

## Architecture

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS. Japanese community platform for sharing creative game inventions ("ゲーム発明会"). All UI text is in Japanese.

All source code lives under `src/`. The `@/` path alias resolves to `src/`.

### Directory Structure

- `src/app/(pages)/` — Frontend pages (Route Group, no URL impact). New pages go here. Home page is `page.tsx` in this directory.
- `src/app/api/` — Backend API routes
- `src/components/` — Shared UI components
- `src/lib/db/` — Supabase SDK client setup (browser `client.ts`, server `server.ts`, `middleware.ts`)
- `src/lib/repositories/` — Data access layer (interfaces + factory)
- `src/lib/repositories/impl/` — Supabase-specific repository implementations
- `src/types/` — TypeScript type definitions
- `supabase/migrations/` — Database migration SQL (Supabase CLI convention, stays at project root)

### Repository Pattern

API routes use a repository pattern to decouple data access from Supabase:

- **Interfaces**: `lib/repositories/interfaces.ts` — defines `IAuthRepository`, `IUserRepository`, `IGameRepository`, `ITagRepository`, `ILikeRepository`
- **Implementations**: `lib/repositories/impl/` — one file per repository (auth, users, games, tags, likes)
- **Factory**: `lib/repositories/index.ts` — `createRepositories()` creates all repository instances from a single server Supabase client
- **Usage in API routes**: Each route handler calls `const { auth, users, games, ... } = await createRepositories()` at the top

When adding new data access, add the method to the interface first, then implement it in the repository under `impl/`.

### Design System

Retro pixel-art / NES aesthetic. All UI uses this consistently:

- **Fonts**: Press Start 2P (primary), DotGothic16 (fallback) — loaded in `app/layout.tsx`, configured as `font-pixel` in Tailwind
- **Color schemes** in `tailwind.config.ts`: `retro.*` (blues/purples), `mario.*` (game-inspired), `pixel.*` (cyan/purple/pink/orange)
- **CSS primitives** in `app/globals.css`: `.pixel-text`, `.pixel-box`, `.pixel-card`, `.pixel-button`, `.pixel-corners`, `.nes-container`, `.scanlines-bg`, `.pixel-pattern-bg`, `.animate-float`, `.animate-glow`
- Root layout applies SVG pixelation filter, background pixel pattern, and scanline overlay

### Backend (Supabase)

- **Client**: `lib/db/client.ts` (browser), `lib/db/server.ts` (server-side with cookie management)
- **Proxy**: `lib/db/middleware.ts` called from `src/proxy.ts` — refreshes auth session on every request. No code should be placed between client creation and `getUser()` call in the proxy.
- **Types**: `types/database.ts` — auto-generated Supabase types, plus utility types (`User`, `Game`, `Tag`, `Like`, `GameWithDetails`)
- **Schema**: `supabase/migrations/` — run in order:
  - `001_initial_schema.sql`: tables (`users`, `games`, `tags`, `game_tags`, `likes`), RLS policies, triggers
  - `002_storage_bucket.sql`: Storage bucket policies for `screenshots`
  - `003_users_insert_policy.sql`: Additional RLS for user creation
  - `004_remove_default_tags.sql`: Cleanup migration

### Auth Flow

GitHub OAuth via Supabase Auth:
1. `Header.tsx` calls `supabase.auth.signInWithOAuth({ provider: 'github' })`
2. Callback at `app/api/auth/callback/route.ts` exchanges code, creates/updates user record in `users` table
3. `src/proxy.ts` refreshes session on every request
4. `submit/page.tsx` gates on auth — redirects to GitHub login if unauthenticated

Auth-required API routes check `auth.getUser()` then look up the internal user via `users.findByGithubId()`. The Supabase Auth user ID maps to `users.github_id`.

### API Routes

All under `src/app/api/`:
- `games/route.ts` — GET (list with search/tag filter), POST (create)
- `games/[id]/route.ts` — GET, PUT, DELETE (single game, ownership check on mutations)
- `games/[id]/like/route.ts` — POST, DELETE (like/unlike)
- `tags/route.ts` — GET (list with search)
- `stats/route.ts` — GET (games_count, users_count, tags_count)
- `upload/route.ts` — POST (upload image to Supabase Storage, max 5MB, jpeg/png/gif/webp only, returns public URL)
- `users/me/route.ts` — GET (current user)
- `users/[id]/route.ts` — GET (user profile with games_count, total_likes)
- `users/[id]/games/route.ts` — GET (user's games)

### Current Integration State

Frontend pages are connected to the API:
- `(pages)/page.tsx` — home page, uses `StatsSection` component
- `(pages)/games/page.tsx` — fetches games/tags from `/api/games` and `/api/tags`, uses `GameCard` component
- `(pages)/submit/page.tsx` — POSTs to `/api/games`, uploads screenshots via `/api/upload`
- `(pages)/users/[id]/page.tsx` — fetches user profile from `/api/users/[id]` and user's games from `/api/users/[id]/games`

Shared components:
- `components/Header.tsx` — navigation, auth UI, avatar links to user profile
- `components/Footer.tsx` — site footer, included in root layout
- `components/GameCard.tsx` — game card with like button, author links to user profile
- `components/StatsSection.tsx` — stats display (games/users/tags counts), fetches from `/api/stats`

Not yet implemented:
- Comment functionality
- Contest functionality

### Supabase Storage Setup

Before using image upload, create a Storage bucket in Supabase Dashboard:
1. Go to Storage → Create bucket
2. Name: `screenshots`, Public: Yes
3. Add RLS policies (see `supabase/migrations/002_storage_bucket.sql` for details)
