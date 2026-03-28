# Update Report — San Diego Amazing Homes

**Date:** 2026-02-17  
**Site:** San Diego Amazing Homes (SDAH)  
**Local URL:** http://localhost:3001  
**Project path:** `Websites/sandiegoamazinghomes/`

This report summarizes the current state of the San Diego Amazing Homes Next.js site. **A PDF copy is provided alongside this file** in `docs/update-reports/` (same basename, `.pdf`). To regenerate: `npm run docs:update-report:pdf` or `node scripts/generate-update-report-pdf.js Update-Report-San-Diego-Amazing-Homes-2026-02-17`.

---

## Recent changes (this session)

- **About page:** Intro paragraph added at the top: *"San Diego Amazing Homes combines local real estate expertise with digital media and market intelligence to help buyers and sellers better understand the San Diego housing market."*
- **About page — Abelardo Rodriguez:** Section added for Media, Design & Marketing with photo and bio. Photo source: **`public/images/Abelardo-photo.jpg`** (served as `/images/Abelardo-photo.jpg`). Documented in `public/images/Images-README.md`.

---

## 1. Overview

San Diego Amazing Homes is a lifestyle and neighborhood discovery site for San Diego–area home buyers and relocators. It offers neighborhood profiles with liveability scores, a lightweight matchmaker assistant, newsletter with Supabase-backed subscriptions, and integration with The Baja Land Company for Baja California property interest.

**In scope:** Searchable **listings** (`/homes`, `/homes/[id]`, `/map`) with RentCast or placeholder data; **market intelligence** page (`/market`) with editorial layout; **Phase 3 agents** (Market Data + Content); **Phase 4 refinement** (neighborhood images, matchmaker CTAs, lead capture, save home/search); **premium newsletter** template and email-ready summary stored in `market_reports`; Royal California logo from `public/images/royal california logo.jpg`; **About Us** with Rosamelia (agent) and Abelardo (Media, Design & Marketing) and site intro. No email sending yet.

---

## 2. Tech stack

| Item | Value |
|------|--------|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS, `@tailwindcss/typography` |
| **Content** | Markdown in `content/`; JSON indices for neighborhoods, newsletter, events |
| **Images** | `public/images/` (neighborhoods, gallery, Instagram, Baja, Rosa-010.jpg, Abelardo-photo.jpg, royal california logo) |
| **Backend / CMS** | Supabase (newsletter, contact, listing cache, market stats, reports, agent runs) |
| **Listings** | RentCast adapter when `RENTCAST_API_KEY` set; else `data/listings.json` |
| **Scripts** | `sync-to-main.js`, `sync-instagram.js`, `generate-newsletter.js`, `generate-market-report.js`, **`run-agent.js`** (Market Data / Content agents) |

---

## 3. Routes and pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.js` | Homepage: hero, carousels, neighborhoods teaser, matchmaker CTA, Baja section, contact |
| `/about` | `app/about/page.js` | About Us: intro, Rosamelia (agent, photo, Royal California logo), Abelardo (Media, Design & Marketing, photo) |
| `/neighborhoods` | `app/neighborhoods/page.js` | Neighborhood list with filter (region, vibe tags), score summaries |
| `/neighborhoods/[slug]` | `app/neighborhoods/[slug]/page.js` | Neighborhood detail: hero, prose, LiveabilityScorecard |
| `/neighborhoods/map` | `app/neighborhoods/map/page.js` | Interactive Mapbox map with neighborhood polygons and cards |
| `/matchmaker` | `app/matchmaker/page.js` | Lifestyle matchmaker quiz |
| `/matches` | `app/matches/page.js` | Match results (top 3 neighborhoods, fit %, hero images) |
| **`/homes`** | **`app/homes/page.js`** | **Listings: filters, card UI, CTA to contact Rosamelia** |
| **`/homes/[id]`** | **`app/homes/[id]/page.js`** | **Property detail: gallery, facts, description, map, CTA** |
| **`/map`** | **`app/map/page.js`** | **Full-screen listings map** |
| **`/market`** | **`app/market/page.js`** | **Market snapshot, neighborhood highlights, monthly trends** |
| `/newsletter` | `app/newsletter/page.js` | Newsletter index, latest issue, subscribe form |
| `/newsletter/[slug]` | `app/newsletter/[slug]/page.js` | Newsletter issue (prose, sidebar, subscribe) |

**API:** `POST /api/subscribe` — newsletter signup. Lead API routes (scaffold): `POST /api/lead/event`, `/neighborhood-click`, `/saved-search`, `/saved-home`; `GET /api/lead/recommendations`.

---

## 4. Listings and market data layer

- **lib/homes-data.js** — Single source for /homes, /homes/[id], /map. RentCast when `RENTCAST_API_KEY` is set, else `data/listings.json`. Unified shape: id, address, city, state, zip, neighborhood, price, beds, baths, sqft, propertyType, images, description, lat, lng.
- **lib/listings/rentcast.js** — searchListings, getListingById, normalizeListing; fails gracefully without key.
- **lib/market-data.js** — getMarketSnapshot, getInventoryTrend, getHotNeighborhoods, getMonthlyHighlights for /market; uses **data/market-placeholder.json** when live data not connected.

---

## 5. Phase 3 agents

| Agent | Purpose | CLI | Writes |
|-------|---------|-----|--------|
| **Market Data** | Fetch from RentCast → normalize → cache in Supabase → images → neighborhood stats | `npm run agent:run market_data` | `listing_cache`, `listing_images`, `neighborhood_market_stats`, `agent_runs` |
| **Content** | Newsletter draft + market report draft + neighborhood update blurbs; premium 8-section report + email summary | `npm run agent:run content [--month=MM] [--year=YYYY] [--write-neighborhood-summaries]` | `market_reports`, `newsletter_issues`, `agent_runs` |

---

## 6. Phase 4 refinement & newsletter quality

- **Neighborhood images:** 3–5 images per slug from `public/images/neighborhoods/{slug}/`; region fallback; global banner as last resort.
- **Matchmaker:** Results link to “See homes” and “View on map”.
- **Market page:** “San Diego County Market Intelligence” header; LeadCaptureMarket.
- **Lead capture:** LeadCaptureMarket (market), LeadCaptureArea (neighborhoods); CTAs on /homes and /market; “See homes” + “Ask Rosamelia” on neighborhood detail.
- **Save home / save search:** SaveHomeButton, SaveSearchButton; anonymous_id in sessionStorage; POST to /api/lead/saved-home and saved-search.
- **Newsletter template:** Eight sections; email-ready summary in market_reports.source_config.email_summary_md.
- **Newsletter page:** `/newsletter/[slug]` falls back to market_reports when content file is missing.

---

## 7. Neighborhoods (16)

Content and order: `content/neighborhoods/_index.json`. Each neighborhood has slug, name, region, vibeTags, heroImage, shortIntro, featured, and **scores** (1–10). List cards show Strong/Less; detail uses LiveabilityScorecard. **Area Map** at `/neighborhoods/map` (Mapbox polygons). Hero images from `public/images/neighborhoods/{slug}/` or region fallback.

**About page images:** Rosamelia — `public/images/Rosa-010.jpg`; Royal California — `public/images/royal california logo.jpg` (200px under Rosamelia on Home and About). Abelardo — **`public/images/Abelardo-photo.jpg`**.

---

## 8. Supabase

- **Env:** `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in `.env.local`; `.env.example` documents.
- **Tables:** newsletter_subscribers, contact_submissions, listing_cache, listing_images, neighborhood_market_stats, market_reports, newsletter_issues, agent_runs; lead scaffold: lead_events, saved_searches, saved_homes, user_preferences.

---

## 9. Quality and tooling

- **ESLint + Prettier:** `npm run lint`, `npm run format`.
- **Security headers:** X-Frame-Options, X-Content-Type-Options, Referrer-Policy (next.config).
- **Sitemap / robots:** `app/sitemap.js`, `app/robots.js`.

---

## 10. Docs (in `docs/`)

| Doc | Description |
|-----|-------------|
| **`Agent-Handoff.md`** | Brief log for agents. |
| **`update-reports/`** | Update reports and PDF copies (this file + same-name .pdf). |
| Newsletter, Phase 2–4, Visual Redesign, Neighborhood Scores, Market Report Generator, Matchmaker, etc. | See `docs/` for full list. |

---

## 11. How to run

```bash
cd sandiegoamazinghomes
npm install
npm run dev
```

Dev server: **http://localhost:3001** (port 3001 per project rule).

**Agents (optional):**

```bash
npm run agent:run market_data
npm run agent:run content
npm run agent:run content -- --write-neighborhood-summaries
```

Requires `.env.local` with Supabase (and optionally `RENTCAST_API_KEY` for live listings).

---

## 12. Summary

San Diego Amazing Homes includes **listings** (/homes, /homes/[id], /map), **market** page with editorial layout and lead capture, **Phase 3 agents** (Market Data + Content), **Phase 4 refinement** (neighborhood images, matchmaker CTAs, lead modules, save home/search), and a **premium newsletter** (8-section report + email-ready summary). **About Us** includes site intro, Rosamelia (agent, Royal California logo), and Abelardo (Media, Design & Marketing) with photo from `public/images/Abelardo-photo.jpg`. Update reports and PDF copies live in **`docs/update-reports/`**.
