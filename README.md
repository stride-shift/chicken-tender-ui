# TenderRender Frontend

React frontend for the TenderRender tender management platform. South African government tenders evaluated against client-specific rubrics.

## Quick Start

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` with your Supabase credentials.

## Documentation

**For AI agents and detailed documentation, start with `README.org`.**

| Document | Purpose |
|----------|---------|
| `README.org` | Navigation hub, reading order, all doc links |
| `ARCHITECTURE.org` | System design, components, data flow |
| `DATABASE.org` | Schema, enums, JSONB structures |
| `FUNCTIONS.org` | RPC function signatures |
| `DOCUMENTATION_PHILOSOPHY.org` | Documentation standards |

Quick references in `src/*/quick_reference.org` contain implementation details.

## Tech Stack

Vite + React 19 • TypeScript • Tailwind CSS 4 • TanStack Query • Supabase RPC

## Project IDs

- Supabase: `weylrgoywbqgkvpndzra`
- GitHub: `stride-shift/chicken-tender-ui`

## Deployment (Vercel)

**Status:** Repo pushed, Vercel account created, awaiting Pro plan decision.

**To continue deployment:**

1. Resolve Pro plan requirement (team decision on public vs private repo)
2. Import `stride-shift/chicken-tender-ui` in Vercel dashboard
3. Set environment variables before first deploy:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_DEV_CLIENT_CODE=pragma` (temporary auth bypass)
4. Deploy

**Note:** `vercel.json` already configured for React Router SPA routing. Auth system still needs implementation for production use.
