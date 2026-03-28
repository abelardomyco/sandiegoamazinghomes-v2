# Phase 1 Foundations — Implementation Notes

**Goal:** Drive traffic and generate leads for Rosamelia’s San Diego real estate business; support Baja property interest as a secondary path. Foundation only — no frontend redesign, no map or homes page implementation.

---

## 1. Where the RentCast API key goes

- **Env:** Add to `.env.local` (do not commit):
  - `RENTCAST_API_KEY=your-key`  
  - Optional: `RENTCAST_RAPIDAPI_KEY` if using RapidAPI host; `RENTCAST_BASE_URL` to override API base (e.g. `https://api.rentcast.io/v1`).
- **Usage:** `lib/listings/rentcast.js` reads the key via `getApiKey()`. If the key is missing, `searchListings()` and `getListingById()` return `[]` and `null` respectively (no throw).
- **Reference:** RentCast free developer tier — e.g. [RapidAPI: RentCast](https://rapidapi.com/realty-in-us-realty-in-us-default/api/rentcast). Adjust base URL and paths in the adapter when you have the exact endpoint docs.

---

## 2. What is live now

- **Service layer:** Present and wired:
  - `lib/listings/` — cache, images, **rentcast.js** (canonical adapter), adapters (rentcast re-export, baja-manual placeholder).
  - `lib/market/` — stats, reports, adapters (redfin, zillow, rentcast placeholders).
  - `lib/agents/` — runner, market-data-agent, content-agent, lead-agent (Phase 3 scaffold; not required for “foundation only” but present).
  - `lib/email/` — newsletter issue tracking.
- **RentCast adapter:** Implemented in `lib/listings/rentcast.js`: `getApiKey()`, `isConfigured()`, `searchListings(options)`, `getListingById(id)`, `normalizeListing(raw)`. Fails gracefully when the API key is missing.
- **Supabase:** Existing app usage (e.g. newsletter subscription) unchanged. Migrations for Phase 1 tables are in place and can be run when you are ready (see “Migration SQL” below).
- **Existing site:** All current pages and flows (matchmaker, newsletter subscribe, neighborhoods, etc.) are unchanged.

---

## 3. What is placeholder

- **RentCast HTTP calls:** In `rentcast.js`, `searchListings` and `getListingById` use placeholder base URL/paths. Replace with the real RentCast (or RapidAPI) base URL and paths once you have the API docs. Response field names may differ — `normalizeListing()` includes TODOs and alternate field names (e.g. `listingId`, `formattedAddress`, `bedrooms`).
- **Redfin market data:** `lib/market/adapters/redfin.js` — stub only; no API key or requests. For Phase 2: add env key and implement `fetchRedfinMarketData()` for market reports/newsletter.
- **Baja manual listings:** `lib/listings/adapters/baja-manual.js` — stub; `fetchBajaManualListings()` returns `[]`. For Phase 2: wire to admin form, CSV, or CMS and return normalized rows with `source: "baja_manual"`.
- **Listings on the site:** Listing data for the current site still comes from existing sources (e.g. `data/listings.json` and existing `lib/listings.js`). No switch to RentCast or Supabase `listing_cache` in Phase 1.

---

## 4. What should be built in Phase 2

- **RentCast integration:** Point `searchListings` / `getListingById` at real RentCast (or RapidAPI) endpoints; confirm response shape and update `normalizeListing()` if needed. Optionally sync results into `listing_cache` via the existing cache layer and a small sync job or agent.
- **Redfin market data:** Add `REDFIN_API_KEY` (or equivalent), implement `fetchRedfinMarketData()`, and persist results into `neighborhood_market_stats` for market reports and newsletter.
- **Baja manual listings:** Implement `fetchBajaManualListings()` (e.g. from Supabase table or JSON/CMS) and normalize to listing_cache shape; keep `source: "baja_manual"` for the secondary Baja path.
- **Homes/listings UI:** When ready, wire the homes list and detail pages to `listing_cache` (and/or RentCast) without rebuilding the rest of the site.
- **Map:** Implement or wire the map to listing data from the service layer when you move to that phase.
- **Agents/cron:** Use the existing agent scaffolding (e.g. Market Data Agent) to run listing and stats sync on a schedule (e.g. Vercel Cron or Supabase Edge Functions).

---

## 5. Proposed file tree (Phase 1 foundation)

```
lib/
  listings/
    index.js              # Service exports (cache, images)
    rentcast.js           # RentCast adapter: getApiKey, searchListings, getListingById, normalizeListing
    cache.js              # listing_cache read/write
    images.js             # listing_images read/write
    adapters/
      index.js
      rentcast.js         # Re-exports from ../rentcast.js (for agents)
      baja-manual.js      # Placeholder: Baja manual listings
      README.md
  market/
    index.js
    stats.js              # neighborhood_market_stats
    reports.js            # market_reports
    adapters/
      index.js
      redfin.js           # Placeholder: Redfin market data
      zillow.js
      rentcast.js
      README.md
  agents/
    index.js
    runner.js             # startRun, finishRun (agent_runs)
    README.md
  email/
    index.js
    newsletter.js         # newsletter_issues
    README.md
supabase/
  migrations/
    20260217000001_listing_cache_listing_images.sql
    20260217000002_neighborhood_market_stats_market_reports.sql
    20260217000003_saved_searches_saved_homes_user_preferences.sql
    20260217000004_lead_events_newsletter_issues_agent_runs.sql
    README.md
docs/
  Phase-1-Foundations-Implementation-Notes.md   # This file
```

---

## 6. Migration SQL (summary)

Run in order (Supabase SQL Editor or `supabase db push`):

1. **20260217000001** — `listing_cache`, `listing_images`
2. **20260217000002** — `neighborhood_market_stats`, `market_reports`
3. **20260217000003** — `saved_searches`, `saved_homes`, `user_preferences`
4. **20260217000004** — `lead_events`, `newsletter_issues`, `agent_runs`

Existing tables (`newsletter_subscribers`, `contact_submissions`) are not modified. Full SQL is in `supabase/migrations/` as above.

---

## 7. Next steps

1. Add `RENTCAST_API_KEY` to `.env.local` when you have a key; confirm RentCast endpoint docs and update base URL/paths in `lib/listings/rentcast.js` if needed.
2. Run the four migrations when you are ready to use the new tables.
3. In Phase 2, implement live RentCast calls, Redfin market adapter, and Baja manual source; then wire listings and map to the service layer as needed.
