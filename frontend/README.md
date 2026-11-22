# BlackCode Devs — Website (Next.js)

The marketing site and careers/admin frontend for [blackcodedev.com](https://blackcodedev.com), rebuilt with
**Next.js 16 (App Router) + TypeScript**. The UI is the same as the original static HTML site. All data comes
from the API in [`../backend`](../backend/README.md).

## Quick start

```bash
cd frontend
cp .env.example .env.local   # then fill in values
npm install
npm run dev                  # http://localhost:3000
```

| Script          | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack)     |
| `npm run build` | Production build                     |
| `npm start`     | Serve the production build           |
| `npm run lint`  | ESLint (Next.js + TypeScript rules)  |

Requires Node.js 20.9+.

## Environment variables

| Variable              | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (local: `http://localhost:4000`).               |

Only non-secret values belong here. The admin API key is **never** stored in the frontend. It is typed into
the admin page and kept in memory only.

## Routes

| Route      | Page                                              | Old URL (308 redirect)          |
| ---------- | ------------------------------------------------- | ------------------------------- |
| `/`        | Home                                              | `/index.html`                   |
| `/about`   | About us                                          | `/aboutus.html`                 |
| `/team`    | Our team                                          | `/ourteam.html`                 |
| `/careers` | Open jobs + apply form (jobs rendered on server)  | `/careers.html`                 |
| `/contact` | Contact form + FAQ                                | `/contactus.html`               |
| `/admin`   | Applications & jobs admin (`noindex`)             | `/admin-applications.html`      |

`/sitemap.xml`, `/robots.txt` (disallows `/admin`) and `/manifest.webmanifest` are generated from `src/app`.

## Project structure

```
src/
  app/                    Routes (App Router). Pages stay thin and compose components.
    layout.tsx            Root layout + site-wide SEO metadata
    sitemap.ts robots.ts manifest.ts not-found.tsx
  components/
    layout/               Navbar, Footer, PageShell (shared page frame)
    ui/                   Reusable building blocks (PageHero, ScrollReveal, Particles, StatCounter, icons…)
    sections/             Presentational pieces for a specific page (ProjectCard, LeaderCard)
  features/               Interactive features with their own state
    careers/              Server data loader, JobBoard, JobCard, ApplicationModal
    contact/              ContactForm, FaqAccordion
    admin/                AdminDashboard, tables, shared JobFormModal (add + edit), CV download
  content/                Page copy as typed data (services, projects, team, FAQs…)
  config/                 site.ts (brand, nav, contact, socials), env.ts (public env)
  lib/                    types.ts, http.ts (fetch helpers), api-client.ts (typed API client)
  hooks/                  useScrolledPast, useLockBodyScroll, useEscapeKey
  styles/pages/           Page stylesheets, each scoped under `.page-<name>`
  assets/images/          Images imported by components (optimised by next/image)
```

### Conventions

- **Update text in `src/content`**, not in JSX. To add a project, service, team member or FAQ, add an entry
  to the array and the page renders it.
- **Server Components by default.** Only components that need state, effects or event handlers have
  `'use client'` (Navbar, forms, modals, animations). This keeps the JS bundle small.
- **One component per concern, no copy-paste.** Navbar/Footer live once in `PageShell`. The hero, cards and
  the admin job form (add and edit) are shared components.
- **All backend calls go through `src/lib/api-client.ts`**. It is the only file that knows API routes.
- **State** is local and explicit: `useState` per feature, a `Remote<T>` union for request status in the
  admin page, and modal state lifted to the closest parent (`JobBoard`, `AdminDashboard`).

### Styling

The original CSS was kept as-is so the design is the same. Each page's stylesheet is scoped under a wrapper
class (`.page-home`, `.page-about`, …) and its `@keyframes` are prefixed, so pages cannot override each other's
styles. This matters because Next.js keeps recently visited pages mounted in the background. `globals.css`
holds only the reset and base body styles. Navbar and footer styles sit next to their components.

## Performance & SEO

- Images use `next/image` (WebP/AVIF, responsive sizes, lazy loading, blur placeholders).
- Font Awesome CDN (~100 KB + fonts) was replaced with two inline SVG icons.
- Pages are statically prerendered. Careers jobs are fetched on the server and cached with
  `cacheLife('minutes')`, so they are indexable and show without a loading spinner. Failed fetches are cached
  for only a few seconds.
- Per-page titles, descriptions and canonical URLs, plus Open Graph, Twitter and Organization JSON-LD.
- Animations respect `prefers-reduced-motion`.

## Security

- Security headers (HSTS, `X-Frame-Options`, `nosniff`, Referrer and Permissions policy) are set in
  `next.config.ts`. The `X-Powered-By` header is off.
- React escapes all API data. CVs are downloaded through the authenticated admin endpoint.
- The contact form has a hidden honeypot field to catch bots.
- External links use `rel="noopener noreferrer"`.
- The CV type and size (PDF/DOC/DOCX, 10 MB or less) are checked in the browser before upload. The backend
  still enforces them.

## Deploying on Vercel

1. Create a Vercel project from this repo and set **Root Directory** to `frontend`.
2. Set `NEXT_PUBLIC_API_URL` to the backend deployment URL. The frontend domain must also be listed in
   the backend's `CORS_ORIGINS`.
3. When the preview looks right, move the `blackcodedev.com` domain to this project. Old `.html` URLs
   redirect automatically.
