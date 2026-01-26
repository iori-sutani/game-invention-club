# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run linting
```

## Architecture

This is a Next.js 15 application (App Router) with React 19, TypeScript, and Tailwind CSS. The project is a Japanese community platform for sharing creative game inventions.

### Key Design System

The app uses a retro pixel-art aesthetic with:

- **Press Start 2P** font (Google Fonts) for all text
- Custom CSS classes in `app/globals.css`:
  - `.pixel-text` - Font with text shadow
  - `.pixel-corners` - Clip-path for pixelated corner effect
  - `.pixel-button` - Styled buttons with active press effect
  - `.animate-float`, `.animate-glow` - Animation utilities
- CRT scanline overlay effect (inline CSS on each page)
- Color palette: cyan (`#22d3ee`), purple (`#a855f7`), pink (`#ec4899`)

### Page Structure

- `app/page.tsx` - Landing page with hero section, feature cards, and stats
- `app/games/page.tsx` - Game listing with search and tag filtering (uses dummy data)
- `app/submit/page.tsx` - Game submission form with tag selection

### Current State

This is a frontend-only MVP. The games page uses hardcoded dummy data in `dummyGames` array. The submit form logs to console but doesn't persist data.

**Planned backend features (not yet implemented):**

- Supabase/Firebase integration
- GitHub OAuth authentication
- Comments and likes functionality
