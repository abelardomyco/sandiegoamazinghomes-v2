# Map pages removed (temporary) — 2026-03-19

## Goal

Temporarily remove all Mapbox-backed “map pages” and related navigation so the site stays high-trust and doesn’t surface map UIs without a token.

## What changed

- **Removed header/footer map navigation**
  - `components/Header.js`: removed `/map` and `/neighborhoods/map` from the primary nav.
  - `components/Footer.js`: removed `/map` and `/neighborhoods/map` from the quick links list.

- **Removed map routes from sitemap**
  - `app/sitemap.js`: removed `/map`, `/neighborhoods/map`, and `/market/heat-map` from sitemap output.

- **Disabled map pages by redirect**
  - `app/map/page.js`: redirects to `/homes`.
  - `app/neighborhoods/map/page.js`: redirects to `/neighborhoods`.
  - `app/market/heat-map/page.js`: redirects to `/market`.

- **Removed map CTA component usage surface**
  - `components/neighborhoods/NeighborhoodMap.js`: returns `null` (no CTA to map route).

- **Removed “full-screen heat map” link**
  - `components/market/MarketMatrix.js`: replaced the link to `/market/heat-map` with a link back to `/market`.

## Notes / next steps

- Mapbox components + token plumbing are still present in the codebase (e.g. homes/neighborhood map components) but **are no longer reachable via the primary nav, sitemap, or map routes**.
- If/when map pages return, re-enable routes and add back nav links intentionally (and confirm token + UX).

