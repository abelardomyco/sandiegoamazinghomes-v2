# Interactive San Diego Neighborhood Map (Mapbox)

**Date:** 2026-02-17

## Summary

An interactive Mapbox map at **/neighborhoods/map** shows San Diego County neighborhoods as polygon overlays. Clicking a polygon opens a neighborhood card with image, scores, link to the neighborhood page, and a "See Homes" button.

## Features

- **Mapbox GL** — Same token as `/map` and `/homes` (`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`).
- **Polygon overlays** — One fill + outline layer per neighborhood from `data/neighborhoods-geo.json`.
- **Hover** — Cursor pointer; fill opacity increases on hover.
- **Click** — Opens a card (top-left on mobile, top-right on desktop) with:
  - Hero image (fallback: site banner)
  - Neighborhood name and region
  - Short intro
  - Scores (top 6 from liveability)
  - **Neighborhood page** link → `/neighborhoods/[slug]`
  - **See Homes** button → `/homes?neighborhoods=[slug]`
- **Close** — X on the card closes it.

## Files

- **`data/neighborhoods-geo.json`** — GeoJSON FeatureCollection; each feature has `properties.slug`, `properties.name` and a Polygon. Approximate bounds for 16 neighborhoods; can be replaced with real boundary data.
- **`app/neighborhoods/map/page.js`** — Server page; reads geo JSON and neighborhood index, passes to client component.
- **`components/neighborhoods/NeighborhoodsMapMapbox.js`** — Client Mapbox map: source + fill/line layers, click → set selected slug, render card.
- **`components/neighborhoods/NeighborhoodMapCard.js`** — Card UI: image, scores, link, "See Homes" button, close.
- **`components/neighborhoods/NeighborhoodMap.js`** — Placeholder on `/neighborhoods` replaced with CTA "Open neighborhood map" → `/neighborhoods/map`.

## Nav and SEO

- **Header:** New link "Area Map" (Layers icon) → `/neighborhoods/map`.
- **Sitemap:** `/neighborhoods/map` added to `app/sitemap.js`.

## Geo data

Polygons in `data/neighborhoods-geo.json` are approximate boxes for each area. For production, replace with official boundaries (e.g. City of San Diego Open Data or SANDAG) and match `properties.slug` to `content/neighborhoods/_index.json`.
