# Live Data Verification & Listing Normalization

**Date:** 2026-02-17

## Developer note: current live-data status

**As of this implementation, listings are in FALLBACK mode unless the RentCast API is connected.**

- **FALLBACK:** When `RENTCAST_API_KEY` is not set (or the API returns an error), `/homes` and `/homes/[id]` use **placeholder data** from `data/listings.json`. The UI shows a **"Sample data"** badge on `/homes` so users and developers can see that listings are not live.
- **LIVE:** When `RENTCAST_API_KEY` is set and the RentCast API returns successfully, the app uses **live listing data** and shows a **"Live listings"** badge. The frontend receives `dataSource: 'rentcast_live'`.
- **How to verify:** Set `RENTCAST_API_KEY` in `.env.local`, restart the dev server, and open `/homes`. If you see the green **"Live listings"** badge and real addresses/photos, live data is connected. If you see the amber **"Sample data"** badge, the key is missing or the API call failed — check the terminal for `[RentCast]` logs (in development) to see why.

No production secrets or API keys are documented here. The implementation is debug-safe: status is visible in the UI and optional server logs only in development.

---

## 1. RentCast integration audit

### Data flow (end-to-end)

1. **Config check:** `lib/listings/rentcast.js` exports `isConfigured()` which returns `true` only when `RENTCAST_API_KEY` or `RENTCAST_RAPIDAPI_KEY` is set in the environment.
2. **Listings list:** `getListingsForPage()` in `lib/homes-data.js` calls `rentcast.searchListings({ limit: 200 })` when configured. On success it returns `{ listings, dataSource: 'rentcast_live' }`. On missing key or API error it falls back to `data/listings.json` and returns `{ listings, dataSource: 'placeholder' }`.
3. **Single listing:** `getListingByIdForPage(id)` tries `rentcast.getListingById(id)` first when configured; on failure or missing key it uses `getListingById(id)` from `lib/listings.js` (file-based placeholder).
4. **Frontend:** The `/homes` page passes `dataSource` to `HomesDiscovery`, which shows "Live listings" or "Sample data" accordingly. The `/homes/[id]` page does not show the badge; listing content is the same unified shape either way.

### API usage

- **Base URL:** `RENTCAST_BASE_URL` or default `https://api.rentcast.io/v1`.
- **Endpoints used:** `GET /listings?limit=...` (search), `GET /listings/:id` (detail).
- **Auth:** Header `X-Api-Key: <RENTCAST_API_KEY>`.
- **Verification:** In development, the adapter logs to the terminal when the key is missing, when the response is not OK, or when an error is thrown, and when live listings are returned. No logging in production.

### Clarification: cache vs live vs placeholder

- **Live:** Direct response from RentCast API, normalized and returned to the frontend.
- **Cache:** Supabase `listing_cache` is used only by the **market-data-agent** (background job). The `/homes` and `/map` pages do **not** read from cache; they use either RentCast live or file placeholder.
- **Placeholder:** `data/listings.json` — used only when live data is unavailable. Clearly separated in code with comments and `dataSource: 'placeholder'`.

---

## 2. Listing normalization

### Unified display shape (homes-data.js)

All listings (live or placeholder) are normalized to:

- **id** — string
- **address** — full or partial street (or empty)
- **city**, **state**, **zip**
- **neighborhood** — slug (e.g. `la-jolla`) or null
- **price** — number
- **beds**, **baths**, **sqft** — numbers or null
- **lotSize** — square feet (optional)
- **propertyType** — string (e.g. Single Family) or null
- **status** — listing status (e.g. active, pending) or null
- **images** — array of image URLs; if empty or no real photos, `[/images/placeholder-listing.svg]`
- **description** — string
- **lat**, **lng** — numbers or null

### RentCast normalizer (lib/listings/rentcast.js)

- **normalizeListing(raw)** maps many common field variants: id/listingId/listing_id, address/formattedAddress/street/streetAddress/line1, city/cityName, zip/zipCode/postalCode, price/listPrice, beds/bedrooms, baths/bathrooms, sqft/squareFootage/sqftLiving, lotSqft/lotSize/lotSquareFootage, propertyType/type/homeType, status/listingStatus/statusType, and stores `raw_json` for display-layer extraction.
- **pickPhotos(raw)** returns an array of image URLs from `raw.photos`, `raw.images`, `raw.media`, or single `raw.image`/`raw.photo`/etc. Only URLs starting with `http` are kept.
- **pickDescription(raw)** returns text from `raw.description`, `raw.details`, `raw.remarks`, or similar.

### Placeholder normalization

- **placeholderToUnified()** maps `data/listings.json` entries to the same unified shape. Any image URL containing "sdah" or "banner" is replaced with the curated placeholder so the site banner is never used as a listing photo. Optional `lotSize` and `status` are read from the placeholder file if present.

---

## 3. Frontend rendering

- **ListingCard** (/homes): Shows price, address (or city), beds/baths/sqft, optional lot (in acres when > 0), property type and status when present, neighborhood or city. "Photo not available" chip when the image is the placeholder SVG.
- **Property detail** (/homes/[id]): Title uses address or "Address on request" plus city/state/zip. Price, optional status badge, and property facts (beds, baths, sqft, lot in acres, property type). **PropertyGallery** shows a "Photo not available" overlay when `hasRealPhotos` is false (no real listing photos).
- **Fallback images:** Only `/images/placeholder-listing.svg` (or future curated home placeholders) are used when listing photos are missing. The SDAH banner is never used for listings.

---

## 4. Fallback logic (code comments)

- In **homes-data.js**: "FALLBACK: Only when live data is unavailable do we use data/listings.json. Placeholder mode must not be presented as production data."
- In **placeholderToUnified()**: "FALLBACK ONLY — used when RentCast is not configured or API fails. Do not style as production data."
- In **rentcast.js**: On missing key or API error, the adapter returns `[]` or `null` and (in development) logs a short message so developers know why fallback is used.

---

## 5. Debug-safe status helper

- **getListingsSourceStatus()** in `lib/homes-data.js` returns `{ configured: boolean, message: string }` without calling the API. Use it to show a developer note (e.g. in a dev-only footer or admin panel): "RentCast API key is set" vs "RentCast API key not set. Listings use placeholder fallback." Actual live vs fallback is determined at request time and reflected in the "Live listings" / "Sample data" badge on `/homes`.

---

## Files touched

| File | Change |
|------|--------|
| lib/listings/rentcast.js | pickAddress, pickPhotos, pickDescription; normalizeListing extended (lot_sqft, status, many field variants); dev-only logging on missing key / non-OK / error / success |
| lib/homes-data.js | rentcastToUnified uses pickPhotos, pickDescription; adds lotSize, status to unified shape; placeholderToUnified adds lotSize, status; getListingsSourceStatus(); fallback comments |
| components/homes/ListingCard.js | lot size (acres), property type, status line |
| app/homes/[id]/page.js | addressLine, cityStateZip, propertyFacts (incl. lot), status badge, hasRealPhotos, PropertyGallery(hasRealPhotos) |
| components/homes/PropertyGallery.js | PLACEHOLDER_IMAGE; hasRealPhotos prop; "Photo not available" overlay when placeholder only |
| docs/Live-Data-Verification-2026-02-17.md | This implementation note |
