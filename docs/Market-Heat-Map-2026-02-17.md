# Market Heat Map

**Date:** 2026-02-17

## Overview

San Diego County **market heat map** colors neighborhoods by market intensity using Mapbox fill layers. Users can toggle among three metrics. Color scale: **green** = accelerating market, **yellow** = neutral, **red** = declining.

## Route

- **Page:** `/market/heat-map`
- **Component:** `components/market/MarketHeatMap.js`
- **Data:** `data/neighborhoods-geo.json` (polygons) + `data/market-placeholder.json` → `neighborhoodHeatMetrics` (per-slug values 0–1 for each metric).

## Metrics (toggle)

| Metric | Meaning | Green | Red |
|--------|---------|--------|-----|
| **Price growth** | YoY price change | Accelerating (positive growth) | Declining (negative) |
| **Inventory pressure** | Supply tightness | Tight (seller’s market) | High supply (buyer’s market) |
| **Days on market** | Speed of sale | Fast (low DOM) | Slow (high DOM) |

Values are normalized to **heatValue** 0–1 per feature (0 = red, 0.5 = yellow, 1 = green). Mapbox fill uses:

`["interpolate", ["linear"], ["get", "heatValue"], 0, "#dc2626", 0.5, "#eab308", 1, "#16a34a"]`

## Data layer

- **lib/market-data.js:** `getNeighborhoodHeatMetrics()` returns `{ [slug]: { priceGrowth, inventoryPressure, daysOnMarket } }` (each 0–1). Reads `data/market-placeholder.json` → `neighborhoodHeatMetrics` array.
- **Placeholder:** All 16 neighborhood slugs have entries; values aligned with `priceChangeWatch`, `fastestSellingAreas`, and `bestValue` / `hottestNeighborhoods` where applicable.

## Map behavior

- Mapbox GL JS: light style, San Diego center, GeoJSON source updated when metric changes (`source.setData(enrichedGeo)`).
- Click neighborhood → `/homes?neighborhoods={slug}`. Hover shows neighborhood name + “View homes”.
- Without `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`, `MapboxFallback` is shown.

## Links

- Market page has a “Market heat map” button linking to `/market/heat-map`.
- Sitemap includes `/market/heat-map`.

## Files touched

| File | Change |
|------|--------|
| `data/market-placeholder.json` | Added `neighborhoodHeatMetrics` (16 slugs × 3 metrics) |
| `lib/market-data.js` | Added `getNeighborhoodHeatMetrics()` |
| `components/market/MarketHeatMap.js` | New: Mapbox fill layer, metric toggle, legend, hover/click |
| `app/market/heat-map/page.js` | New page |
| `app/market/page.js` | Link to Market heat map |
| `app/sitemap.js` | Entry for `/market/heat-map` |
