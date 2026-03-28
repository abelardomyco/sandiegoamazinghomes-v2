# Data Visibility & Market Dashboard Improvements

**Date:** 2026-02-17

## 1. Listing data flow and source clarity

### /homes data flow (documented in `lib/homes-data.js`)

- **RentCast live:** When `RENTCAST_API_KEY` is set, `getListingsForPage()` and `getListingByIdForPage()` call the RentCast adapter. On success, returns `{ listings, dataSource: 'rentcast_live' }`.
- **Placeholder fallback:** When RentCast is not configured or the API throws, listings come from `data/listings.json`. Returns `{ listings, dataSource: 'placeholder' }`. Do not present placeholder data as live.
- **Cache:** Supabase `listing_cache` is used by the market-data-agent only. The /homes and /map pages do **not** read from cache; they use either RentCast live or file placeholder.

### Frontend visibility

- **HomesDiscovery** receives `dataSource` and shows a badge: **"Live listings"** (green) or **"Sample data"** (amber) so users know the source.
- **Map page** and **market page** use `getListingsForPage().then(r => r.listings)` and do not show the badge (listings are secondary there).

## 2. Listing credibility

- **No SDAH banner for listings:** In `placeholderToUnified()`, any image URL containing "sdah", "banner", or "cropped-sdah" is filtered out and replaced with the neutral placeholder. `data/listings.json` may still reference the banner; the data layer normalizes it.
- **Fallback image:** `FALLBACK_LISTING_IMAGE = "/images/placeholder-listing.svg"`. Curated set: `PLACEHOLDER_LISTING_IMAGES` (currently one asset; extend for more variety).
- **ListingCard** shows: price, address line (or city), beds/baths/sqft, neighborhood or city, and a "Photo not available" chip when the image is the placeholder SVG.
- **Property detail** uses the same unified shape; images are sanitized in the data layer.

## 3. Market dashboard expansion

### New trend data (`data/market-placeholder.json`)

- **daysOnMarketTrend** — monthly DOM
- **salesVolumeTrend** — monthly sales count
- **priceReductionTrend** — % of listings with price reductions
- **coolingNeighborhoods** — areas with price reductions (slug, name, priceChangePct)

### New getters (`lib/market-data.js`)

- `getDaysOnMarketTrend()`, `getSalesVolumeTrend()`, `getPriceReductionTrend()`, `getCoolingNeighborhoods()`

### New chart sections

- **Median price trend** — existing PriceTrendCharts (12‑mo median + $/sqft).
- **Inventory trend** — compact line chart (CompactTrendChart).
- **Days on market** — DaysOnMarketChart (county avg + fastest-selling areas).
- **Sales volume trend** — compact line chart.
- **Price reduction trend** — compact line chart (%).

### San Diego neighborhood breakdowns

- Single section **"San Diego neighborhood breakdowns"** with:
  - **Hottest neighborhoods** (leaderboards.hottest)
  - **Cooling neighborhoods** (coolingNeighborhoods — price reductions)
  - **Best value areas** (leaderboards.bestValue)
  - **Luxury market** (LuxuryMarket card)
  - **Fastest selling** (HomesSellingFast)

## 4. Market heat map

- **Fourth metric:** **Price reductions** (toggle). Heat: fewer reductions = green, more = red. Data: `neighborhoodHeatMetrics[].priceReductions` in placeholder; getter includes `priceReductions` in `getNeighborhoodHeatMetrics()`.
- **Fallback when Mapbox token missing:** `HeatMapFallback` shows a table of neighborhoods with a color bar per metric and the same metric toggle. No raw developer-only message.

## 5. UI and data density

- **Market page:** Tighter spacing (`space-y-1.5`), compact trend charts in a 2×2 / 4-column grid, clear section headings, dashboard-style hierarchy.
- **Homes:** "Live listings" / "Sample data" badge, tighter card spacing, address and specs prominent on cards.

## Files touched

| Area | Files |
|------|--------|
| Data flow / source | `lib/homes-data.js` (comments, return shape, banner filter, placeholderToUnified) |
| Homes UI | `app/homes/page.js`, `components/homes/HomesDiscovery.js`, `components/homes/ListingCard.js` |
| Map/market listings | `app/map/page.js`, `app/market/page.js` (destructure `listings` from getListingsForPage) |
| Market data | `data/market-placeholder.json` (trends + cooling + priceReductions in heat metrics), `lib/market-data.js` (getters) |
| Market dashboard | `app/market/page.js` (new sections, grid, neighborhood breakdowns), `components/market/CompactTrendChart.js`, `components/market/CoolingNeighborhoods.js` |
| Heat map | `components/market/MarketHeatMap.js` (priceReductions metric, HeatMapFallback when no token), `components/market/HeatMapFallback.js` |
