# Phase 4 — Refinement, Conversion & Quality Upgrades

**Date:** 2026-02-17

## Goals

- More premium, trustworthy feel
- Stronger lead generation for Rosamelia
- Less overbuilt sections
- Stronger newsletter and market intelligence
- Clearer neighborhood identity

---

## 1. Neighborhood image upgrade

**lib/neighborhood-images.js**

- **3–5 curated images per neighborhood** from `public/images/neighborhoods/{slug}/`. Preferred names (in order): hero, lifestyle, homes, coast, village, map; then any other `.jpg`/`.webp` in the folder, sorted, up to 5 total.
- **Area-specific fallback:** If a neighborhood has no folder, the app tries `public/images/neighborhoods/_fallbacks/{region-slug}/` (e.g. coastal, north-county, urban-core, south-bay, inland). First image found is used as hero.
- **Global fallback:** If no slug folder and no region fallback, use `/images/cropped-SDAH-web-banner.png`.
- **Hero for list/detail:** `getNeighborhoodHeroPath(slug, region)` now accepts optional `region` for fallback. List and map pages pass `n.region`.
- **Detail page** already uses `getNeighborhoodImagePaths(slug)` for the carousel; no change needed beyond the lib.
- **README** at `public/images/neighborhoods/README.md` updated with _fallbacks and preferred filenames.

---

## 2. Matchmaker simplification

- **Floating + inline:** Unchanged; 3 questions (Budget, Lifestyle, Commute). Results show top 3 neighborhoods with fit %.
- **Results CTAs:** Added **“View on map”** next to **“See homes”** — both use `/homes?neighborhoods=...` and `/map?neighborhoods=...`.
- **Matchmaker page** (`/matchmaker`): Short one-line intro: “Three quick questions to get your top neighborhoods—then see homes or view on the map.” No full-page emphasis.

---

## 3. Market page improvement

**app/market/page.js**

- **Header:** “San Diego County Market Intelligence” with a short editorial intro and link to the monthly newsletter.
- **Report month** derived from current date for the newsletter link (`getReportMonth()`).
- **Sections:** Same components (MarketSnapshot, InventoryTrend, HotNeighborhoods, MonthlyHighlights); added `aria-labelledby` and a clear “View map” link next to Browse homes and Newsletter.
- **Lead capture** at bottom via **LeadCaptureMarket** (“Get monthly San Diego market updates”, “Ask Rosamelia about the market”).

---

## 4. Newsletter quality upgrade

**lib/market-report-generator.js**

- **New sections:** Market Snapshot, Hot Neighborhoods, **Inventory Shifts**, **Buyer & Seller Takeaway**, **Featured Homes**, **Rosamelia’s Insight**. Removed generic Price Trends / Luxury / First-Time Buyer as standalone; folded takeaway into one section.
- **Tone:** More local, direct, and useful (e.g. “San Diego continues to draw coastal and lifestyle buyers…”, “If you’re buying: get pre-approved…”, “I’ve been helping buyers and sellers here for decades…”).
- **Inventory Shifts:** Uses inventory level to suggest tight / eased / middle; includes link to browse listings.
- **Featured Homes:** Single blurb with links to /homes and /map and “reach out” for a tailored list.
- **Rosamelia’s Insight:** One paragraph in first person, with CTA to contact.
- **Closing:** Single line of links (Matchmaker, neighborhoods, homes, Contact Rosamelia). Title set to “San Diego County Market Update”.

---

## 5. Lead capture refinement

- **LeadCaptureMarket** (`components/lead/LeadCaptureMarket.js`): Used on `/market`. “Stay in the loop” — “Get monthly San Diego market updates” (→ /newsletter), “Ask Rosamelia about the market” (→ /#contact).
- **LeadCaptureArea** (`components/lead/LeadCaptureArea.js`): “Ask Rosamelia about this area” with optional `areaName`. Used on neighborhood detail page below Next steps.
- **Neighborhood detail:** Next steps now lead with “See homes” (→ `/homes?neighborhoods={slug}`), then Matchmaker; **LeadCaptureArea** added below with `areaName={meta.name}`.
- **Homes page:** Bottom CTA block updated: “Questions or want to schedule a showing? Get monthly San Diego market updates.” Two buttons: “Contact Rosamelia”, “Get market updates” (→ /newsletter).
- **Property detail:** Keeps **PropertyCTA**; **SaveHomeButton** added next to price (see below).

---

## 6. Save and recommendation groundwork

- **lib/lead-anonymous-id.js:** Returns a persistent `anonymous_id` from `sessionStorage` (or generates one) for lead events when user is not logged in.
- **SaveHomeButton** (`components/lead/SaveHomeButton.js`): On property detail page. Calls `POST /api/lead/saved-home` with `anonymous_id`, `external_id` (listing id), `source`. Shows “Saved” after success.
- **SaveSearchButton** (`components/lead/SaveSearchButton.js`): On `/homes` in **HomesDiscovery**, next to the “X homes” count. Calls `POST /api/lead/saved-search` with `anonymous_id`, `filters_json` (priceMin/Max, bedsMin, bathsMin, propertyType, neighborhood), `name`. Shows “Saved” after success.
- No account UI; no recommendations UI yet. Triggers are in place for future use (e.g. GET /api/lead/recommendations).

---

## Files touched (summary)

| Area | Files |
|------|--------|
| Neighborhood images | `lib/neighborhood-images.js`, `app/neighborhoods/page.js`, `app/neighborhoods/map/page.js`, `public/images/neighborhoods/README.md` |
| Matchmaker | `components/matchmaker/MatchmakerWidget.js`, `app/matchmaker/page.js` |
| Market | `app/market/page.js` |
| Newsletter | `lib/market-report-generator.js` |
| Lead capture | `components/lead/LeadCaptureMarket.js`, `components/lead/LeadCaptureArea.js`, `app/neighborhoods/[slug]/page.js`, `app/homes/page.js` |
| Save/recommendation | `lib/lead-anonymous-id.js`, `components/lead/SaveHomeButton.js`, `components/lead/SaveSearchButton.js`, `app/homes/[id]/page.js`, `components/homes/HomesDiscovery.js` |
| Unused | `components/market/MarketSection.js` (optional wrapper for future use) |

---

## Preserved

- Existing routes and architecture; no full rewrites.
- Styling kept consistent with the rest of the site.
- Lead API and agent scaffolding unchanged; only UI hooks and copy added.
