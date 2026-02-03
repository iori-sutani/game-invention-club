# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint (next/core-web-vitals + next/typescript)
```

Supabase setup: copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Run `supabase/migrations/001_initial_schema.sql` in Supabase dashboard or CLI.

## Architecture

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS. Japanese community platform for sharing creative game inventions ("ゲーム発明会").

### Design System

Retro pixel-art / NES aesthetic. All UI uses this consistently:

- **Fonts**: Press Start 2P (primary), DotGothic16 (fallback) — loaded in `app/layout.tsx`, configured as `font-pixel` in Tailwind
- **Color schemes** in `tailwind.config.ts`: `retro.*` (blues/purples), `mario.*` (game-inspired), `pixel.*` (cyan/purple/pink/orange)
- **CSS primitives** in `app/globals.css`: `.pixel-text`, `.pixel-box`, `.pixel-card`, `.pixel-button`, `.pixel-corners`, `.nes-container`, `.scanlines-bg`, `.pixel-pattern-bg`, `.animate-float`, `.animate-glow`
- Root layout applies SVG pixelation filter, background pixel pattern, and scanline overlay

### Backend (Supabase)

- **Client**: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server-side with cookie management)
- **Middleware**: `lib/supabase/middleware.ts` called from `middleware.ts` — refreshes auth session on every request
- **Types**: `types/database.ts` — auto-generated Supabase types, plus utility types (`User`, `Game`, `Tag`, `Like`, `GameWithDetails`)
- **Schema**: `supabase/migrations/001_initial_schema.sql` — tables: `users`, `games`, `tags`, `game_tags`, `likes` with RLS policies and triggers

### Auth Flow

GitHub OAuth via Supabase Auth:
1. `Header.tsx` calls `supabase.auth.signInWithOAuth({ provider: 'github' })`
2. Callback at `app/api/auth/callback/route.ts` exchanges code, creates/updates user record
3. `middleware.ts` refreshes session on every request
4. `submit/page.tsx` gates on auth — redirects to GitHub login if unauthenticated

### API Routes

All under `app/api/`:
- `games/route.ts` — GET (list with search/tag filter), POST (create)
- `games/[id]/route.ts` — GET, PUT, DELETE (single game)
- `games/[id]/like/route.ts` — POST, DELETE (like/unlike)
- `tags/route.ts` — GET (list with search)
- `users/me/route.ts` — GET (current user)
- `users/[id]/route.ts` — GET (user profile)
- `users/[id]/games/route.ts` — GET (user's games)

Auth-required routes check `supabase.auth.getUser()` and look up the user via `github_id`. RLS enforces row-level authorization.

### Current Integration State

The API routes and database are fully implemented, but **frontend pages are not yet connected to the API**:
- `games/page.tsx` uses a hardcoded `dummyGames` array instead of fetching from `/api/games`
- `submit/page.tsx` logs form data to console instead of POSTing to `/api/games`
- Home page stats are hardcoded
- Image upload to Supabase Storage is not implemented
- Like buttons and user profile pages are not built yet
