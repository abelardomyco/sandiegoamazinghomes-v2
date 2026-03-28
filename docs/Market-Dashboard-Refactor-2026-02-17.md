# Market Dashboard Refactor — Housing Intelligence (/market)

**Date:** 2026-02-17  
**Scope:** San Diego Amazing Homes — `/market` page only (port 3001).

## Summary

Refactored the /market page into a tighter, denser housing intelligence dashboard: less whitespace, better charts, single destination analytics feel, higher information density without clutter.

## Changes

### 1. Data layer (`lib/market-data.js`)

- **`getMarketStatBandData()`** — Returns 6 metrics plus optional deltas for the top stat band: medianPrice, activeListings, daysOnMarket, pricePerSqft, salesVolume, priceReductionRate; deltas from trend arrays (medianPriceDelta, activeListingsDelta, daysOnMarketDelta, salesVolumeDelta, priceReductionRateDelta).
- **`getNeighborhoodHeatMetricsForMatrix()`** — Returns an array of neighborhood objects with slug, name, priceGrowth, inventoryPressure, daysOnMarket, priceReductions, and a computed **marketStrength** score (weighted: 0.35 priceGrowth, 0.25 inventoryPressure, 0.25 daysOnMarket, 0.15 priceReductions). Used by the market matrix and rankings.

### 2. New components (`components/market/`)

- **MarketStatBand** — Compact row of 6 stat cards (Median Price, Active Listings, Days on Market, $/Sq Ft, Sales Volume, Price Reduction Rate) with optional delta indicators.
- **MarketChartsRow** — Two charts side by side on desktop: median price 12mo and inventory trend (or price per sq ft), with YoY delta badges; reduced height, research-dashboard feel.
- **MarketMatrix** — Single scatter chart: x = price growth, y = inventory pressure, point size = market strength, color = market strength (green/teal/amber/red). Replaces the multi-toggle heat map on /market. Hover shows neighborhood name and strength; points link to neighborhood pages. Link to full-screen heat map retained.
- **CompactRankingPanels** — One row of three tight leaderboard cards: Hottest Neighborhoods, Cooling Neighborhoods, Best Value Areas (top 5 each).

### 3. Page layout (`app/market/page.js`)

- **Removed:** MarketSnapshot, PriceTrendCharts, 4× CompactTrendChart grid, DaysOnMarketChart, MarketHeatMap section, HottestNeighborhoods/CoolingNeighborhoods/BestValueAreas/LuxuryMarket grid, HomesSellingFast, duplicate NeighborhoodLeaderboards + Luxury + Rental block.
- **New flow:** Header (tighter) → MarketStatBand → MarketChartsRow → BuyerAdvantageMeter → MarketMatrix → CompactRankingPanels → Mortgage + Featured (2-col) → RosameliaInsight → PriceChangeWatch + MortgagePaymentSnapshot (2-col) → Affordability + Luxury + Rental (3-col) → NewListingsAlert → MonthlyHighlights → CTAs → AskRosameliaWidget → LeadCaptureMarket.
- **Imports:** Removed getMarketSnapshot, getNeighborhoodGeoJson, getNeighborhoodHeatMetrics; added getMarketStatBandData, getNeighborhoodHeatMetricsForMatrix. Removed MarketSnapshot, PriceTrendCharts, DaysOnMarketChart, MarketHeatMap, HottestNeighborhoods, BestValueAreas, CoolingNeighborhoods, CompactTrendChart, NeighborhoodLeaderboards.

## Files touched

- `lib/market-data.js` — New helpers and exports.
- `app/market/page.js` — Layout and data wiring.
- `components/market/MarketStatBand.js` — New.
- `components/market/MarketChartsRow.js` — New.
- `components/market/MarketMatrix.js` — New.
- `components/market/CompactRankingPanels.js` — New.

## Notes

- Full-screen heat map remains at `/market/heat-map`; link from matrix.
- No mock data added; all metrics from existing placeholder/trend data.
- Client/server: stat band and charts row accept serializable props only; matrix and rankings use client components where needed.
