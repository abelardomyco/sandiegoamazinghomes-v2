# SDAH Update 3-17-26 7:05pm

**Date:** 2026-03-17  
**Site:** San Diego Amazing Homes (SDAH)  
**Project path:** `Websites/sandiegoamazinghomes/`

This report summarizes the current state of the San Diego Amazing Homes Next.js site. A PDF copy is in `docs/update-reports/`. To regenerate: `node scripts/generate-update-report-pdf.js sdah-update-3-17-26-7-05pm`.

---

## 1. Overview

| Item | Value |
|------|--------|
| **Path** | `sandiegoamazinghomes/` |
| **Dev server** | Port **3001** only — `npm run dev` (runs `scripts/dev-3001.js`) |
| **Start (production)** | `npm run start` — `next start -p 3001` |
| **Local URL** | http://localhost:3001 |

**Stack:** Next.js 14 (App Router), Tailwind CSS, `@tailwindcss/typography`, Embla carousels, Mapbox. Content in `content/`; images in `public/images/`. Supabase for contact/newsletter. No mock data in production paths.

---

## 2. Routes and pages

| Route | Description |
|-------|-------------|
| `/` | Homepage: hero, carousels, neighborhoods teaser, matchmaker CTA, Baja section, contact |
| `/about` | About Us (Rosamelia, Abelardo, Royal California) |
| `/neighborhoods`, `/neighborhoods/[slug]` | Neighborhood list/detail with LiveabilityScorecard |
| `/homes`, `/homes/[id]` | Listings and property detail |
| `/map` | Map view of listings |
| `/market` | **Market dashboard** — stat band, 3 charts (price/sqft, DOM, sales volume), neighborhood scoreboard table, ranking panels, mortgage, featured homes, CTAs |
| `/market/heat-map` | Full-screen market heat map |
| `/matchmaker`, `/matches` | Lifestyle matchmaker and results |
| `/blog`, `/blog/[slug]` | **Blog** — San Diego real estate for buyers and relocators (replaces newsletter in main nav) |
| `/newsletter`, `/newsletter/[slug]` | Still available; not in main nav |

---

## 3. Market page (refactored)

- **Removed:** Human Design layer, Chinese zodiac, archetypal modifiers, astrology overlays; newsletter link and monthly highlights from market page.
- **Neighborhood scoreboard:** Table with neighborhood, median price (per-neighborhood from `neighborhoodMedianPrices`), price trend, days on market, market strength label (Hot/Balanced/Cooling).
- **Charts:** (1) Price per sq ft trend (12 mo), (2) Days on market trend (12 mo), (3) Monthly sales volume. Denser layout; dashboard feel.
- **Data:** `data/market-placeholder.json` includes `neighborhoodMedianPrices` (per-slug median); `lib/market-data.js` exposes `getNeighborhoodScoreboardData()`.

---

## 4. Blog

- **`/blog`** — Index with latest highlight and article list.
- **`/blog/[slug]`** — Post page with prose, prev/next, Back to Blog.
- **Content:** `content/blog/_list.json` and `content/blog/*.md`. Focus: first-time buyers, relocating, neighborhoods, schools.
- **Nav/footer:** "Blog" replaces "Newsletter" in header and footer; Sitemap includes `/blog` and blog post URLs.

---

## 5. Port and dev script

- **Port 3001 only.** Script `scripts/dev-3001.js` runs `npx next dev -p 3001` so SDAH never binds to port 3000 (reserved for The Baja Land Company). See `Websites/README-PORTS.md`.

---

## 6. Content and data

- **content/** — Neighborhoods, blog, newsletter (still present), events.
- **public/images/** — Neighborhoods, gallery, Instagram, Baja assets.
- **data/market-placeholder.json** — Snapshot, trends, leaderboards, `neighborhoodHeatMetrics`, `neighborhoodMedianPrices`, hottest/cooling/bestValue, fastestSellingAreas.

---

## 7. How to run

```bash
cd sandiegoamazinghomes
npm run dev
```

Open http://localhost:3001. Do not run this site on port 3000.

---

*See also: `docs/Agent-Handoff.md`, `Websites/README-PORTS.md`.*
