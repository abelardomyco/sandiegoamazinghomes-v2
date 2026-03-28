# Redfin-style Home Discovery System

**Date:** 2026-03-14

## Summary

A home discovery system was added with listing search, map view, filters, and property detail pages. Data is placeholder JSON; the structure is ready for a future MLS API.

## Routes

| Route | Description |
|-------|-------------|
| `/homes` | Search + filters + scrolling results panel + Mapbox map with markers and clustering |
| `/homes/[id]` | Property detail: gallery, map, description, nearby neighborhoods, CTA to contact agent |
| `/map` | Full map view of all listings; click marker to open property page |

## Features

### Map view (Mapbox GL JS)
- **ListingsMap** (`components/homes/ListingsMap.js`): GeoJSON source with `cluster: true`; circle + symbol layers for clusters; unclustered points for single listings. Click cluster to zoom in; click point to scroll to card (/homes) or navigate to property (/map). Cursor pointer on hover. Requires `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` in `.env.local`; shows message if missing.

### Filters
- **HomeFilters** (`components/homes/HomeFilters.js`): Min/max price, beds, baths, property type, neighborhood (area). All optional. Used on `/homes`; filtering is client-side over initial listing set.

### Results panel
- Scrolling list of **ListingCard** components: image, price, beds/baths, neighborhood name, link to `/homes/[id]`. Clicking a map marker scrolls the corresponding card into view.

### Property page
- **PropertyGallery**: First image prominent; thumbnails for multiple images.
- **PropertyMap**: Single-marker map for the listing (Mapbox).
- Description, beds/baths/sqft, property type.
- **Nearby neighborhoods**: Same region as listing’s neighborhood; links to `/neighborhoods/[slug]`.
- **CTA**: “Contact Rosamelia” links to `/#contact`.

## Data source

- **Placeholder:** `data/listings.json` — array of listing objects.
- **Schema (per listing):** `id`, `address`, `city`, `state`, `zip`, `neighborhood` (slug), `price`, `beds`, `baths`, `sqft`, `propertyType`, `lat`, `lng`, `images[]`, `description`.
- **lib/listings.js:** `getListings(filters)`, `getListingById(id)`, `getPropertyTypes()`, `getNeighborhoodSlugsFromListings()`, `loadListings()`. Filters: priceMin, priceMax, bedsMin, bathsMin, propertyType, neighborhood.

Later: replace loading from `data/listings.json` with MLS API client; keep the same interface so components need minimal changes.

## Files added

- `data/listings.json` — placeholder listings (8 entries)
- `lib/listings.js` — listing read + filter helpers
- `components/homes/ListingsMap.js` — Mapbox map, clusters, markers
- `components/homes/ListingCard.js` — result card
- `components/homes/HomeFilters.js` — filter controls
- `components/homes/HomesDiscovery.js` — /homes layout: filters + results + map
- `components/homes/PropertyGallery.js` — image gallery on detail page
- `components/homes/PropertyMap.js` — single-property map
- `components/homes/MapPageClient.js` — /map client wrapper
- `app/homes/layout.js` — max-width container for /homes
- `app/homes/page.js` — homes index
- `app/homes/[id]/page.js` — property detail
- `app/map/layout.js` — map page container
- `app/map/page.js` — map page

## Nav and sitemap

- **Header:** “Homes” and “Map” added to main nav.
- **Sitemap:** `/homes`, `/map`, and `/homes/[id]` for each listing in `data/listings.json`.

## Env

- **.env.example:** `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` added. Set in `.env.local` for map and /map to work; without it, a message is shown instead of the map.

## Dependency

- **mapbox-gl** (^3.6.0) — added to `package.json`.
