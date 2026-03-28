# Phase 5: UI Simplification, Navigation Cleanup, Density (2026-02-17)

Refinement pass: denser layout, consolidated nav, matchmaker de-emphasized, image fallbacks, and graceful Mapbox handling. No route rewrites or app rebuild.

## 1. Matchmaker removed from primary UX

- **Header:** `/matchmaker` and `/matches` removed from main navigation.
- **Route:** `/matchmaker` kept for legacy; `metadata.robots = "noindex, follow"`; page is a minimal shell directing users to homepage and floating assistant.
- **Primary flow:** Homepage → quick lifestyle questions (floating widget) → suggested neighborhoods/homes. Matchmaker is not a major destination.

## 2. Consolidated header navigation

- **Top-level nav:** Home, Neighborhoods, Homes, Market, About, then **More** (dropdown), then **Contact**.
- **More dropdown:** Map, Area Map, Newsletter (no Matchmaker or Baja in top nav).
- **Mobile:** Same main links; “More” group with Map, Area Map, Newsletter; Contact.
- **File:** `components/Header.js`.

## 3. Vertical spacing compressed

- **Homepage:** Tighter hero (py-3 pb-2, mb-2), smaller headings (text-2xl/3xl → text-lg/2xl), “Looking for a house” / “Want to list your home” blocks: py-4, gap-3, p-3, text-sm/xs, link to /homes and /#contact. Contact and Instagram/Gallery/Baja/Neighborhoods sections: py-4–5, smaller headings and margins.
- **Market page:** space-y-5, header pb-4, shorter intro copy; sections use rounded-lg, p-4, text-base, mb-3.
- **Market components:** MarketSnapshot, InventoryTrend, HotNeighborhoods, MonthlyHighlights: p-4, rounded-lg, compact stat text and list spacing. LeadCaptureMarket: p-4, text-base, mb-1/mb-3.

## 4. Market page denser and editorial

- **Layout:** Two-column grid on lg: (1) Market Snapshot + Inventory Trend, (2) Hot Neighborhoods + Monthly Trends. Tighter section spacing (space-y-5, gap-4).
- **Content:** Shorter header copy; “Full report: monthly newsletter” link. Compact stat cards and list items; line-clamp on blurbs/summaries where appropriate.

## 5. Image fallback behavior

- **Neighborhoods:** Resolution order documented in code and README: (1) `public/images/neighborhoods/{slug}/` (e.g. hero.jpg), (2) region fallback `_fallbacks/{region-slug}/`, (3) global banner. `lib/neighborhood-images.js` has a top-of-file comment; `public/images/neighborhoods/README.md` has an “Image resolution order” section.
- **Listings:** SDAH banner no longer used as default listing image. New neutral placeholder: `public/images/placeholder-listing.svg` (house icon + “No image”). Used in:
  - `lib/homes-data.js`: FALLBACK_LISTING_IMAGE for RentCast and placeholder listings.
  - `components/homes/ListingCard.js`: same path when listing has no image.
  - `components/homes/PropertyGallery.js`: when images array is empty.
  - `app/homes/[id]/page.js`: when listing.images is empty.

## 6. Graceful Mapbox fallback

- **Component:** `components/ui/MapboxFallback.js` — message “Interactive map is temporarily unavailable” and CTAs: View homes, Browse neighborhoods, Contact Rosamelia. No raw “Map requires NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN…” in main UI.
- **Usage:** ListingsMap, PropertyMap, NeighborhoodsMapMapbox render MapboxFallback when token is missing.
- **Docs:** Where the token is read (`app/map/page.js`, `app/homes/page.js`, `app/homes/[id]/page.js`, `app/neighborhoods/map/page.js`), added comment: “Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env.local for interactive map; see .env.example.”

## 7. Homepage conversion cleanup

- “Looking for a house?” and “Want to list your home?” blocks tightened: smaller padding, shorter copy, “Browse homes or get in touch” / “Sell with an agent who knows San Diego,” link to /homes and /#contact. Contact section: shorter heading and supporting text.

## 8. Architecture

- Refinement only; no full rebuild. Existing routes and components kept; spacing, copy, nav, and fallbacks updated.

## Files touched

- `app/page.js` — spacing, hero, CTA blocks, contact/gallery/Baja/neighborhoods sections.
- `app/market/page.js` — spacing, header copy, 2-col grid for snapshot+trend and hot+monthly.
- `app/matchmaker/page.js` — noindex, minimal shell (already done earlier).
- `app/homes/page.js`, `app/homes/[id]/page.js`, `app/neighborhoods/map/page.js`, `app/map/page.js` — Mapbox token comment.
- `components/Header.js` — consolidated nav + More dropdown (already done earlier).
- `components/market/*` — tighter padding and typography.
- `components/lead/LeadCaptureMarket.js` — denser block.
- `components/ui/MapboxFallback.js` — fallback UI (already done earlier).
- `components/homes/ListingsMap.js`, `PropertyMap.js`, `components/neighborhoods/NeighborhoodsMapMapbox.js` — use MapboxFallback when no token.
- `lib/homes-data.js` — FALLBACK_LISTING_IMAGE; `lib/neighborhood-images.js` — resolution-order comment.
- `components/homes/ListingCard.js`, `PropertyGallery.js` — listing placeholder image.
- `public/images/placeholder-listing.svg` — new asset.
- `public/images/neighborhoods/README.md` — image resolution order section.
