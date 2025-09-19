# Multi-tenant SaaS Starter (Next.js + Supabase + shadcn/ui)

A minimal starter that supports multi-tenant SaaS using subdomains or path-based routing with Supabase auth and RLS.

## Tech
- Next.js 14 (App Router, TypeScript)
- Supabase (Auth + Postgres + RLS) via `@supabase/ssr`
- Tailwind CSS + shadcn/ui

## Prerequisites
- Node.js 18+
- A Supabase project (copy the URL and anon key)

## Setup (Windows PowerShell)
1. Copy env file
```powershell
Copy-Item .env.example .env.local
```
2. Fill in values in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_DOMAIN=localhost:3000
```
3. Install dependencies
```powershell
npm install
```
4. (Optional) Apply database schema in Supabase SQL Editor using `supabase/schema.sql`.

## Develop
```powershell
npm run dev
```
Open http://localhost:3000

## Multi-tenant routing
- Subdomain: `tenant.localhost:3000` rewrites to `/o/tenant`
- Path-based: `/o/tenant/...` works directly

## Project structure
- `src/app` – App Router pages
- `src/lib/supabase` – SSR/browser clients
- `src/components/ui` – shadcn/ui components
- `supabase/schema.sql` – orgs & memberships with RLS

## Notes
- Auth UI and organization CRUD are minimal placeholders; extend as needed.
- Add custom domain resolution table if you need apex domains per org.