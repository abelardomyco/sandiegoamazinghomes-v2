# Phase 2 — Routes and Modular Components

**Date:** 2026-02-17

## Routes

| Route | Purpose |
|-------|--------|
| **/homes** | Listings with filters (price, beds, baths, property type, neighborhood) and map |
| **/homes/[id]** | Property detail: gallery, price, beds/baths, description, neighborhood, CTA to contact Rosamelia |
| **/map** | Full-screen map of listings; supports `?neighborhoods=slug1,slug2` |
| **/market** | Market snapshot, inventory trend, hot neighborhoods, monthly highlights |

## Data layer

- **lib/homes-data.js** — Single source for listings on /homes, /homes/[id], and /map:
  - **getListingsForPage(options)** — async. If **RentCast** is configured (`RENTCAST_API_KEY`), uses `lib/listings/rentcast.js`; otherwise uses **lib/listings** + **data/listings.json**. Optional `options.neighborhoods` (array of slugs) filters in both paths. Returns unified listing shape.
  - **getListingByIdForPage(id)** — async. Resolves from RentCast or placeholder; returns one listing or `null`.
  - **rentcastToUnified(row)** / **placeholderToUnified(listing)** — map to unified shape: `id`, `address`, `city`, `state`, `zip`, `neighborhood`, `price`, `beds`, `baths`, `sqft`, `propertyType`, `images`, `description`, `lat`, `lng`.
  - **getPropertyTypesFromList(listings)** / **getNeighborhoodSlugsFromList(listings)** — filter options for /homes.
- **app/map/page.js** — Must be **async** and call **await getListingsForPage(...)** so the map uses the same RentCast/placeholder source as /homes.
- **lib/market-data.js** — `getMarketSnapshot()`, `getInventoryTrend()`, `getHotNeighborhoods()`, `getMonthlyHighlights()` for /market. Uses **data/market-placeholder.json** when live data not connected. Section labels: Market Snapshot, Neighborhood Highlights, Monthly Trends (InventoryTrend: “Monthly Inventory Trend”).

## Components

### Homes
- **HomesDiscovery** — Client: filters state, filtered list, map. Uses HomeFilters, ListingCard, ListingsMap.
- **HomeFilters** — Price min/max, beds, baths, property type, neighborhood (modular).
- **ListingCard** — Image, price, beds/baths/sqft (only non-null shown, joined by “ · ”), neighborhood, link to /homes/[id].
- **PropertyGallery** — Image carousel for detail page.
- **PropertyMap** — Single-property map on detail page.
- **PropertyCTA** — “Contact Rosamelia” block (reusable).
- **PropertyNeighborhood** — Neighborhood link + nearby areas (reusable).

### Market
- **MarketSnapshot** — Median price, inventory, days on market, mortgage rate (props from server).
- **InventoryTrend** — Bar list of inventory over time (placeholder for chart).
- **HotNeighborhoods** — List with link to neighborhood page and “See homes”.
- **MonthlyHighlights** — Titles and summaries with optional link to newsletter.

## Placeholder data

- **data/listings.json** — Existing; used by /homes and /map.
- **data/market-placeholder.json** — Snapshot, inventoryTrend, hotNeighborhoods, monthlyHighlights for /market.

## Nav and SEO

- **Header:** “Market” link (TrendingUp icon) → /market.
- **Sitemap:** /market added to app/sitemap.js.

## Production

- Replace or merge local listings with `listing_cache` (lib/listings/cache).
- Replace market placeholder with lib/market (getNeighborhoodStats, getMarketReportBySlug) and Redfin/Zillow/RentCast adapters.
