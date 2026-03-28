# Route + sitemap cleanup — 2026-03-19

## Goals

- Remove `/matchmaker` from sitemap output (route stays accessible, not indexed).
- Remove `/neighborhoods/map` references and ensure it redirects to `/neighborhoods`.
- Validate no internal links point to disabled routes: `/neighborhoods/map`, `/map`, `/homes`, `/market/heat-map`.

## Changes

### 1) Sitemap

- `app/sitemap.js`: removed `/matchmaker` from the returned sitemap URLs.

### 2) `/neighborhoods/map`

- `app/neighborhoods/map/page.js`: kept as a **redirect-only** route to `/neighborhoods` and set `robots: { index: false, follow: true }`.
- Verified no code references link to `/neighborhoods/map`.

### 3) Internal link validation

- Removed remaining `/map` navigation behavior in matchmaker results (now routes to `/neighborhoods`).
- Removed remaining `/homes/[id]` navigation behavior in listing/map components (now routes to `/#contact`).
- Updated market report generator strings to avoid `/homes` and `/map`.

## Files changed

- `app/sitemap.js`
- `app/neighborhoods/map/page.js`
- `components/matchmaker/MatchmakerWidget.js`
- `components/homes/ListingCard.js`
- `components/homes/MapPageClient.js`
- `lib/market-report-generator.js`
- `scripts/generate-market-report.js`

