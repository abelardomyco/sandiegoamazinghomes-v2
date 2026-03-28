# Phase 3 Agents — Scaffold

**Date:** 2026-02-17

## Overview

Three agent modules plus runner and lead API routes. No email sending connected.

---

## 1. Market Data Agent

**File:** `lib/agents/market-data-agent.js`

- **run(config)** — startRun("market_data") → fetch listings + trend data → normalize → write to Supabase → finishRun.
- **fetchAllListings(config)** — Calls RentCast and Baja manual adapters (stubs return [] until API keys). Normalizes to `listing_cache` row shape.
- **fetchAllTrendData(config)** — Calls RentCast, Redfin, Zillow market adapters (stubs return []). Normalizes to `neighborhood_market_stats` row shape with period_start/period_end.
- **Writes:** `listing_cache` (upsertListings), `neighborhood_market_stats` (upsertNeighborhoodStats per row).

**CLI:** `node scripts/run-agent.js market_data`

---

## 2. Content Agent

**File:** `lib/agents/content-agent.js`

- **generateNewsletterDraft(options)** — Builds report from `getMarketSnapshot()` + `getNeighborhoodIndex()`, uses `lib/market-report-generator.js` buildReport(), writes to `market_reports` and `newsletter_issues`. No file write to content/newsletter (optional later).
- **generateMarketReportDraft(options)** — Same as newsletter draft (single draft for both).
- **generateNeighborhoodSummaries(options)** — Per-neighborhood summary from latest `getNeighborhoodStats()` + content; optional `writeToSupabase` writes to `market_reports` with slug `neighborhood-{slug}`.
- **run(config)** — startRun("content") → newsletter draft + neighborhood summaries (write to Supabase only if config.writeNeighborhoodSummaries).

**Shared:** `lib/market-report-generator.js` — buildReport(input, neighborhoods) returns { slug, title, date, body, sections_json }. Used by content-agent and can be used by scripts/generate-market-report.js.

**CLI:** `node scripts/run-agent.js content [--month=04] [--year=2026] [--write-neighborhood-summaries]`

---

## 3. Lead Agent

**File:** `lib/agents/lead-agent.js`

- **recordLeadEvent({ event_type, email?, anonymous_id?, payload_json?, source_page? })** — Inserts into `lead_events`. At least one of email or anonymous_id required.
- **recordNeighborhoodClick({ neighborhood_slug, email?, anonymous_id?, source_page? })** — Wrapper that records event_type "neighborhood_click" with payload.
- **saveSavedSearch({ user_id?, anonymous_id?, name?, filters_json?, notify? })** — Inserts into `saved_searches`.
- **saveSavedHome({ user_id?, anonymous_id?, listing_id?, external_id?, source?, notes? })** — Inserts into `saved_homes`.
- **getPersonalizedRecommendations({ email?, anonymous_id? })** — Stub: reads recent lead_events for that identifier, returns neighborhood slugs from neighborhood_click events; returns { neighborhoods, homes, message }. No email.

**API routes (scaffold):**

| Method | Route | Body/Query | Purpose |
|--------|--------|------------|--------|
| POST | /api/lead/event | event_type, email?, anonymous_id?, payload_json?, source_page? | Store any lead event |
| POST | /api/lead/neighborhood-click | neighborhood_slug, email?, anonymous_id?, source_page? | Track neighborhood click |
| POST | /api/lead/saved-search | user_id?, anonymous_id?, name?, filters_json?, notify? | Save search |
| POST | /api/lead/saved-home | user_id?, anonymous_id?, listing_id?, external_id?, source?, notes? | Save home |
| GET | /api/lead/recommendations | email= or anonymous_id= | Personalized recommendations (stub) |

---

## Runner

- **startRun(agentType, config)** — Insert into `agent_runs`, return run id.
- **finishRun(runId, { success, result_summary?, error_message? })** — Update run status and finished_at.

---

## File tree (added/updated)

```
lib/
  agents/
    index.js           (exports runner + marketDataAgent, contentAgent, leadAgent)
    runner.js
    market-data-agent.js
    content-agent.js
    lead-agent.js
    README.md
  market-report-generator.js   (buildReport for content-agent + script)
app/api/lead/
  event/route.js
  neighborhood-click/route.js
  saved-search/route.js
  saved-home/route.js
  recommendations/route.js
scripts/
  run-agent.js          (CLI: market_data | content)
```

---

## Production TODOs

- Enable listing/market adapters with RENTCAST_API_KEY, REDFIN_*, ZILLOW_*.
- Wire Market Data and Content agents to Vercel Cron or Supabase Edge Functions.
- Connect email sending for newsletter (set sent_at, recipient_count in newsletter_issues).
- Enrich getPersonalizedRecommendations (saved_homes, saved_searches, neighborhood names from content).
