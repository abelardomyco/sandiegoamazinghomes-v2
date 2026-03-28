# SDAH Update Report — 16-03-2026 9:43 pm

**Date:** 16 March 2026, 9:43 pm  
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

## 3. Recent changes (through 16-03-2026)

### Blog content

- **Eight articles** in `content/blog/` (see `_list.json`). Newest: Moving to San Diego: Everything You Need to Know; Best Neighborhoods in San Diego (2026 Guide); Is Now a Good Time to Buy in San Diego?; Renting vs Buying (2026); First-Time Homebuyer Guide; Down Payment; First-Time Buyer; Relocating to San Diego. All follow local tone, mandatory structure (Opening, Reality Check, San Diego–Specific Breakdown, Practical Guidance, Local Insight, Conclusion), and internal links to /market, /neighborhoods, /homes, #contact where appropriate.
- **Categories:** Buying, Neighborhoods, Relocating.

### About page

- **Bio layout:** Two-column grid removed from About sections; content uses full width with `max-w-4xl` so bios (Rosamelia, Abelardo) are no longer squeezed on large screens. File: `app/about/page.js`.

---

## 4. Blog articles (current)

| Slug | Title | Category |
|------|--------|----------|
| moving-to-san-diego-everything-you-need-to-know | Moving to San Diego: Everything You Need to Know | Relocating |
| best-neighborhoods-san-diego-2026 | Best Neighborhoods in San Diego (2026 Guide) | Neighborhoods |
| good-time-to-buy-san-diego | Is Now a Good Time to Buy in San Diego? | Buying |
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

*Report generated 16 March 2026, 9:43 pm. See also: `docs/Agent-Handoff.md`, earlier reports in `docs/update-reports/`.*
