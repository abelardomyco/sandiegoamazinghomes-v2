# Update Report — San Diego Amazing Homes

**Date:** 2026-03-15  
**Site:** San Diego Amazing Homes (SDAH)  
**Project path:** `Websites/sandiegoamazinghomes/`

This report summarizes the current state of the San Diego Amazing Homes Next.js site. A PDF copy is provided alongside this file in `docs/update-reports/`. To regenerate: `node scripts/generate-update-report-pdf.js Update-Report-San-Diego-Amazing-Homes-2026-03-15`.

---

## 1. Overview

| Item | Value |
|------|--------|
| **Path** | `sandiegoamazinghomes/` |
| **Dev server** | Port **3001** — `npm run dev` or `next dev -p 3001` |
| **Start (production)** | `npm run start` — `next start -p 3001` |
| **Local URL** | http://localhost:3001 |

**Stack:** Next.js 14 (App Router), Tailwind CSS, `@tailwindcss/typography`, Embla carousels, Mapbox (market heat map). Content in `content/` (Markdown + JSON); images in `public/images/`. Supabase for newsletter and contact. No mock data in production paths.

---

## 2. Routes and pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.js` | Homepage: hero, carousels (Instagram + Gallery), neighborhoods teaser, matchmaker CTA, Baja section, contact |
| `/about` | `app/about/page.js` | About Us (Rosamelia, Abelardo, Royal California logo) |
| `/neighborhoods` | `app/neighborhoods/page.js` | Neighborhood list with filter (region, vibe tags), score summaries |
| `/neighborhoods/[slug]` | `app/neighborhoods/[slug]/page.js` | Neighborhood detail: hero, prose, LiveabilityScorecard |
| `/homes` | `app/homes/page.js` | Listings (RentCast or placeholder) |
| `/homes/[id]` | `app/homes/[id]/page.js` | Property detail |
| `/map` | `app/map/page.js` | Map view of listings |
| `/market` | `app/market/page.js` | Market dashboard: stat band, charts, matrix, rankings, Human Design, Chinese zodiac (layered intelligence) |
| `/market/heat-map` | `app/market/heat-map/page.js` | Full-screen market heat map |
| `/matchmaker` | `app/matchmaker/page.js` | Lifestyle matchmaker quiz |
| `/matches` | `app/matches/page.js` | Match results (top neighborhoods, fit %) |
| `/newsletter` | `app/newsletter/page.js` | Newsletter index, subscribe form |
| `/newsletter/[slug]` | `app/newsletter/[slug]/page.js` | Newsletter issue |

**API:** `POST /api/subscribe` (newsletter), geocode and astrology-charts as needed.

---

## 3. Key features

- **Market dashboard (/market):** Compact stat band (Median Price, Active Listings, DOM, $/Sq Ft, Sales Volume, Price Reduction Rate), side-by-side charts, neighborhood market matrix (scatter), compact ranking panels (Hottest, Cooling, Best Value), Archetypal Modifiers, Human Design layer, Chinese Zodiac layer. Data from `lib/market-data.js` and `data/market-placeholder.json`.
- **Neighborhoods:** 16 neighborhoods from `content/neighborhoods/_index.json`; scores (Strong/Less); LiveabilityScorecard on detail.
- **Header/footer:** Dark theme, nav, mobile menu, newsletter link, Instagram.
- **Listings:** RentCast integration or placeholder; listing cards and detail pages.
- **Baja section:** La Escondida image, Baja Land Company logo, CTA.

---

## 4. Content and data

- **content/** — Neighborhoods (`_index.json` + `{slug}.md`), newsletter, events. No mock data.
- **public/images/** — Neighborhoods, gallery, Instagram, Baja assets.
- **data/market-placeholder.json** — Market snapshot, trends, leaderboards, neighborhood heat metrics for dashboard and matrix.
- **lib/market-data.js** — getMarketSnapshot, getMarketStatBandData, getNeighborhoodHeatMetricsForMatrix, getLeaderboards, etc.

---

## 5. How to run

```bash
cd sandiegoamazinghomes
npm install
npm run dev
```

Dev server: **http://localhost:3001** (port 3001; The Baja Land Company uses 3000 so both can run at once).

---

## 6. Summary

San Diego Amazing Homes is a lifestyle and neighborhood discovery site for the San Diego area. It runs on **port 3001** and includes neighborhoods (scores, filters, detail pages), matchmaker, newsletter (Supabase), listings/map, and a dense market dashboard with stat band, charts, neighborhood matrix, and layered modules (Asteroids, Human Design, Chinese Zodiac). Update reports and PDFs are in **`docs/update-reports/`**.
