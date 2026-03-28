# SDAH Update Report — 20-02-2026 2:00 pm

**Date:** 20 February 2026, 2:00 pm  
**Site:** San Diego Amazing Homes (SDAH)  
**Project path:** `Websites/sandiegoamazinghomes/`

This report summarizes the current state of the San Diego Amazing Homes Next.js site and recent changes.

---

## 1. Overview

| Item | Value |
|------|--------|
| **Path** | `sandiegoamazinghomes/` |
| **Dev server** | Port **3001** — `npm run dev` (via `scripts/dev-3001.js` or `next dev -p 3001`) |
| **Start (production)** | `npm run start` — `next start -p 3001` |
| **Local URL** | http://localhost:3001 |

**Stack:** Next.js 14 (App Router), Tailwind CSS, `@tailwindcss/typography`, Embla carousels, Mapbox. Content in `content/`; images in `public/images/`. Supabase for contact and newsletter. No mock data in production paths.

---

## 2. Routes and pages

| Route | Description |
|-------|-------------|
| `/` | Homepage: hero, carousels, neighborhoods teaser, matchmaker CTA, Baja section, contact |
| `/about` | About Us — Rosamelia (agent), Abelardo (media/marketing), Royal California logo; bio layout fixed for full-width readability |
| `/neighborhoods`, `/neighborhoods/[slug]` | Neighborhood list and detail with LiveabilityScorecard |
| `/homes`, `/homes/[id]` | Listings and property detail |
| `/map` | Map view of listings |
| `/market` | Market dashboard — stat band, charts (price/sqft, DOM, sales volume), neighborhood scoreboard, rankings, mortgage, featured homes |
| `/market/heat-map` | Full-screen market heat map |
| `/matchmaker`, `/matches` | Lifestyle matchmaker and results |
| `/blog`, `/blog/[slug]` | Blog — San Diego real estate for buyers and relocators (main nav) |
| `/newsletter`, `/newsletter/[slug]` | Newsletter index and issues; still available, not in main nav |

---

## 3. Recent changes (20-02-2026)

### Blog content

- **Three articles added/updated** to match a strict local tone and structure (no fluff, San Diego–specific, practical guidance):
  1. **First-Time Homebuyer Guide (San Diego Edition)** — `first-time-homebuyer-guide-san-diego` — pre-approval, neighborhoods where first-timers win (Mission Valley, North Park, Chula Vista, Eastlake, Bonita), practical steps, local insight.
  2. **How Much Do You Need for a Down Payment in San Diego?** — `down-payment-san-diego` — revised to same format: reality check (20% myth), numbers by area, where you buy changes everything, practical guidance, bottom line. Internal links to /market, /neighborhoods, /homes, #contact.
  3. **Renting vs Buying in San Diego (2026)** — `renting-vs-buying-san-diego-2026` — rent vs buy tradeoffs, 2026-oriented numbers, coastal/inland/urban breakdown, when buying starts to make sense.
- **List:** `content/blog/_list.json` updated; five posts total (newest first). See `docs/Blog-Articles-Batch-2026-02-20.md`.

### About page layout

- **Bios no longer squeezed.** Each bio section used a 2-column grid with only one content block, so on large screens the block was limited to half width. Fix: removed `grid grid-cols-1 lg:grid-cols-2` from both sections and set the content wrapper to `max-w-4xl` so the photo + bio block has full width (up to a comfortable reading width). File: `app/about/page.js`.

---

## 4. Blog articles (current)

| Slug | Title | Category |
|------|--------|----------|
| renting-vs-buying-san-diego-2026 | Renting vs Buying in San Diego (2026) | Buying |
| first-time-homebuyer-guide-san-diego | First-Time Homebuyer Guide (San Diego Edition) | Buying |
| down-payment-san-diego | How Much Do You Need for a Down Payment in San Diego? | Buying |
| first-time-buyer-san-diego | First-Time Home Buyer in San Diego: What You Need to Know | Buying |
| relocating-to-san-diego | Relocating to San Diego: Neighborhoods and Schools | Relocating |

---

## 5. Content and data

- **content/** — Neighborhoods, blog (`_list.json` + `*.md`), newsletter, events.
- **public/images/** — Neighborhoods, gallery, Instagram, Baja, agent/brand assets.
- **data/market-placeholder.json** — Snapshot, trends, leaderboards, `neighborhoodHeatMetrics`, `neighborhoodMedianPrices`, hottest/cooling/bestValue, fastestSellingAreas.

---

## 6. How to run

```bash
cd sandiegoamazinghomes
npm run dev
```

Open http://localhost:3001. Do not run SDAH on port 3000 (reserved for The Baja Land Company).

---

## 7. Related docs

- **Blog batch:** `docs/Blog-Articles-Batch-2026-02-20.md`
- **Earlier update:** `docs/update-reports/sdah-update-3-17-26-7-05pm.md`
- **Handoff:** `docs/Agent-Handoff.md`
- **Ports:** `Websites/README-PORTS.md` (if present)
