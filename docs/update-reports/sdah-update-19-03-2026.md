# SDAH Update Report — 2026-03-19

**Context note:** Work performed on **2026-03-18, 7:10pm** (local). This report file was created the next day; timestamps should be interpreted accordingly.

## Summary

This update focused on making the blog feel more human + decision-driven, and turning `/market` into a high-signal dashboard users can read in seconds.

## Blog

- **De-duped posts**
  - Removed `content/blog/relocating-to-san-diego.md` (duplicate topic).
  - Kept `content/blog/moving-to-san-diego-everything-you-need-to-know.md`.
  - Updated `content/blog/_list.json` to remove the duplicate entry.

- **Tone pass (all current posts)**
  - Light edits to make voice more natural and local (less templated), without changing structure or claims.
  - Files touched include the full set listed in `docs/Blog-Tone-Refinement-2026-03-19.md`.

- **Added 3 new decision-driven articles**
  - `content/blog/where-can-you-still-find-value-san-diego-real-estate.md`
  - `content/blog/condo-vs-house-san-diego-what-makes-sense.md`
  - `content/blog/what-800k-1m-1-5m-get-you-san-diego.md`
  - Updated `content/blog/_list.json` to include the new posts (newest first).

## Market page (/market)

- **Quick-signals redesign**
  - Replaced bulky chart feel with compact, high-signal components:
    - Market pulse strip (inline): `components/market/MarketPulseBar.js`
    - Snapshot cards (1–2 lines): `components/market/MarketSnapshotCards.js`
    - Mini neighborhood grid (labels only): `components/market/MiniNeighborhoodGrid.js`
    - Rotating micro-insights: `components/market/RotatingInsights.js`
  - Removed bottom-of-page conversion modules on `/market` (new listings alert, Ask Rosamelia widget, CTA button row, and “Notify me” newsletter UI) to keep the page purely insight-driven and higher trust.

- **Heat map**
  - `components/market/MarketHeatMap.js` simplified to a single **composite strength** view (no metric toggles).
  - **Removed heat map preview from `/market`** because without a Mapbox token it collapses to a low-signal fallback list (many rows at ~50%).
  - **Map pages removed for now** (redirects):
    - `/market/heat-map` → `/market`
    - `/neighborhoods/map` → `/neighborhoods`
    - `/map` → `/`

- **Homes pages**
  - **Homes/listings pages removed for now** (redirects):
    - `/homes` → `/`
    - `/homes/[id]` → `/`
  - Removed `/homes` from header/footer navigation and removed `/homes` + `/homes/[id]` URLs from sitemap output.

## Dev server

- SDAH runs at `http://localhost:3001` via `npm run dev`.

## Documentation added/updated

- Added: `docs/Blog-Dedupe-Relocating-vs-Moving-2026-03-19.md`
- Added: `docs/Blog-Tone-Refinement-2026-03-19.md`
- Added: `docs/Blog-Decision-Driven-Articles-2026-03-19.md`
- Added: `docs/Market-Page-Quick-Signals-Redesign-2026-03-19.md`
- Updated: `docs/Agent-Handoff.md`

