# Phase 3 — Market Data Agent & Content Agent (First Version)

**Date:** 2026-02-17

## Summary

First version of the **Market Data Agent** and **Content Agent** implemented. Modular scripts, no email sending, build for reliability and clarity.

---

## 1. Market Data Agent

**File:** `lib/agents/market-data-agent.js`

### Behavior

1. **Fetch** — Calls RentCast adapter (`lib/listings/adapters/rentcast.js`) with `limit: 200` (configurable via `config.rentcast`). Baja manual adapter returns `[]` until wired.
2. **Normalize** — Each listing is normalized to `listing_cache` row shape via `normalizeListingRow()` (external_id, source, address, city, state, zip, neighborhood_slug, price, beds, baths, sqft, property_type, status, listing_url, raw_json, fetched_at, updated_at).
3. **Cache** — `upsertListings(listings)` writes to Supabase `listing_cache` (unique on `source`, `external_id`). Returns `{ inserted, updated, rows }` with `id` and `raw_json` per row.
4. **Images** — For each upserted row, image URLs are extracted from `raw_json` (e.g. `photos[]`, `image`, `images[]`). `setImagesForListing(listing_id, urls)` replaces rows in `listing_images` for that listing.
5. **Neighborhood stats** — Calls `fetchAllTrendData(config)` (RentCast/Redfin/Zillow market adapters; currently stubs return `[]`). If no trend rows, **derives** stats from the listing set: one row per `neighborhood_slug` with `inventory` (count), `median_price` (median of listing prices), `period_start`/`period_end` (current month), `source: "rentcast_derived"`. Writes to `neighborhood_market_stats`.
6. **Log run** — `startRun("market_data", config)` inserts into `agent_runs`; `finishRun(runId, { success, result_summary })` updates status and `finished_at`. If Supabase is unavailable, run still completes; only DB logging is skipped.

### Dependencies

- `lib/listings/cache.js` — `upsertListings` now returns `rows` with `id`, `raw_json`.
- `lib/listings/images.js` — `setImagesForListing(listingId, images)`.
- `lib/market/stats.js` — `upsertNeighborhoodStats(row)`.
- `lib/listings/adapters/rentcast.js` — `fetchRentCastListings(options)` (uses `searchListings` from `lib/listings/rentcast.js`).

### Env

- **RentCast:** `RENTCAST_API_KEY` (or `RENTCAST_RAPIDAPI_KEY`). If missing, RentCast returns `[]`.
- **Supabase:** `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) for cache, images, stats, and `agent_runs`.

### CLI

```bash
npm run agent:run market_data
# or
node scripts/run-agent.js market_data
```

---

## 2. Content Agent

**File:** `lib/agents/content-agent.js`

### Behavior

1. **Newsletter / market report draft** — `generateNewsletterDraft({ month?, year?, input? })` uses `getMarketSnapshot()` from `lib/market-data.js` (placeholder when no live data), `getNeighborhoodIndex()` from `lib/content.js`, and `buildReport(input, neighborhoods)` from `lib/market-report-generator.js`. Writes one report to `market_reports` (slug e.g. `2026-03`, content_md, sections_json, source_config) and one row to `newsletter_issues` (slug, title, sent_at: null, recipient_count: null). No email sending.
2. **Market report draft** — `generateMarketReportDraft(options)` is the same as `generateNewsletterDraft(options)` (single draft for both).
3. **Neighborhood update blurbs** — `generateNeighborhoodSummaries({ writeToSupabase?: boolean })` loads `getNeighborhoodStats({ limit: 200 })` from Supabase and `getNeighborhoodIndex()`. For each neighborhood, builds a short summary (median price, inventory, days on market from latest stats, or fallback to "Market data pending"). If `writeToSupabase`, upserts to `market_reports` with slug `neighborhood-{slug}` and source_config `{ type: "neighborhood_summary", neighborhood_slug }`.
4. **Run** — `run(config)` starts an agent run, calls `generateNewsletterDraft` and `generateNeighborhoodSummaries`, then finishes the run. Config: `month`, `year`, `writeNeighborhoodSummaries`.

### Dependencies

- `lib/market-report-generator.js` — `buildReport(input, neighborhoods)`.
- `lib/market-data.js` — `getMarketSnapshot()`.
- `lib/content.js` — `getNeighborhoodIndex()`.
- `lib/market/stats.js` — `getNeighborhoodStats(options)`.
- `lib/market/reports.js` — `upsertMarketReport(...)`.
- `lib/email/newsletter.js` — `upsertNewsletterIssue(...)`.

### Env

- **Supabase** for `market_reports`, `newsletter_issues`, `neighborhood_market_stats` (read), `agent_runs`.

### CLI

```bash
npm run agent:run content
npm run agent:run content -- --month=04 --year=2026
npm run agent:run content -- --write-neighborhood-summaries
```

---

## 3. Scripts and Supabase

- **scripts/run-agent.js** — Parses argv for `market_data` or `content`, builds config from `--month=`, `--year=`, `--write-neighborhood-summaries`. Loads `dotenv` from `.env.local`. Exits 0 on success, 1 on failure.
- **lib/supabase.js** — Converted to CommonJS (`module.exports = { createServerClient }`) so `require("../supabase")` works in Node when running the CLI. Next.js still resolves the named export for `import { createServerClient } from "@/lib/supabase"`.
- **dotenv** — Added as devDependency; run-agent loads `.env.local` before requiring agents.

---

## 4. What’s not done

- **Email sending** — Not implemented. `newsletter_issues.sent_at` and `recipient_count` remain null until an email pipeline is added.
- **Lead agent** — Not part of this first version; scaffold remains.
- **Cron / scheduling** — Agents are run manually via CLI. Production can wire to Vercel Cron or Supabase Edge Functions.
- **RentCast market stats** — `lib/market/adapters/rentcast.js` still returns `[]`; neighborhood stats are derived from listings when no trend data is returned.

---

## 5. Files touched

| File | Change |
|------|--------|
| `lib/agents/market-data-agent.js` | RentCast fetch, normalize, cache; image extraction and `listing_images`; derive neighborhood stats; log to agent_runs |
| `lib/agents/content-agent.js` | Docstring update |
| `lib/listings/cache.js` | `upsertListings` returns `rows` with `id`, `raw_json` |
| `lib/supabase.js` | CJS export for Node scripts |
| `package.json` | `dotenv` devDependency |
| `lib/agents/README.md` | Updated for Phase 3 v1 |
| `docs/Phase-3-Implementation-2026-02-17.md` | This doc |
