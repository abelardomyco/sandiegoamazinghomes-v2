# Phase 1 Foundation — Implementation Notes

**Date:** 2026-02-17

## File tree (added)

```
sandiegoamazinghomes/
├── docs/
│   ├── Upgrade-Plan-Real-Estate-Intelligence-2026-02-17.md
│   └── Phase-1-Implementation-Notes-2026-02-17.md (this file)
├── supabase/
│   └── migrations/
│       ├── 20260217000001_listing_cache_listing_images.sql
│       ├── 20260217000002_neighborhood_market_stats_market_reports.sql
│       ├── 20260217000003_saved_searches_saved_homes_user_preferences.sql
│       ├── 20260217000004_lead_events_newsletter_issues_agent_runs.sql
│       └── README.md
├── lib/
│   ├── listings/
│   │   ├── index.js
│   │   ├── cache.js
│   │   ├── images.js
│   │   └── adapters/
│   │       ├── index.js
│   │       ├── rentcast.js
│   │       ├── baja-manual.js
│   │       └── README.md
│   ├── market/
│   │   ├── index.js
│   │   ├── stats.js
│   │   ├── reports.js
│   │   └── adapters/
│   │       ├── index.js
│   │       ├── redfin.js
│   │       ├── zillow.js
│   │       ├── rentcast.js
│   │       └── README.md
│   ├── agents/
│   │   ├── index.js
│   │   ├── runner.js
│   │   └── README.md
│   └── email/
│       ├── index.js
│       ├── newsletter.js
│       └── README.md
```

No existing pages or routes were removed. Current data (`data/listings.json`, `content/`) is unchanged.

---

## Migration SQL summary

| File | Tables | Purpose |
|------|--------|--------|
| `20260217000001_...` | `listing_cache`, `listing_images` | Cached listings from feeds; images per listing |
| `20260217000002_...` | `neighborhood_market_stats`, `market_reports` | Time-series stats per neighborhood; generated reports |
| `20260217000003_...` | `saved_searches`, `saved_homes`, `user_preferences` | User/anonymous saved data |
| `20260217000004_...` | `lead_events`, `newsletter_issues`, `agent_runs` | Lead attribution; issue tracking; job run log |

Run in order (1 → 4). Existing `newsletter_subscribers` and `contact_submissions` are not modified.

---

## Adapter stubs

| Adapter | Location | TODO (production) |
|---------|----------|-------------------|
| RentCast (listings) | `lib/listings/adapters/rentcast.js` | `RENTCAST_API_KEY`; call listings endpoint; normalize to `listing_cache` shape |
| Baja manual | `lib/listings/adapters/baja-manual.js` | Wire to admin/CSV/CMS; source `baja_manual` |
| Redfin | `lib/market/adapters/redfin.js` | `REDFIN_*` or public data; map to `neighborhood_market_stats` |
| Zillow | `lib/market/adapters/zillow.js` | `ZILLOW_*` if API; map to `neighborhood_market_stats` |
| RentCast (market) | `lib/market/adapters/rentcast.js` | Same key as listings; neighborhood metrics endpoint |

All stubs return empty arrays or no-op until wired with live keys and endpoints.

---

## Service layer usage

- **Listings:** `require("@/lib/listings")` → `getCachedListings(options)`, `upsertListings(listings)`, `getImagesByListingId(id)`, `setImagesForListing(id, images)`.
- **Market:** `require("@/lib/market")` → `getNeighborhoodStats(options)`, `upsertNeighborhoodStats(row)`, `getMarketReportBySlug(slug)`, `upsertMarketReport({ slug, ... })`.
- **Agents:** `require("@/lib/agents")` → `startRun(agentType, config)`, `finishRun(runId, result)`.
- **Email:** `require("@/lib/email")` → `upsertNewsletterIssue({ slug, ... })`, `getNewsletterIssueBySlug(slug)`.

Services use `createServerClient()` from `lib/supabase.js` when available (env: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`). If Supabase is not configured, they return empty results or no-op.

---

## Where live API keys and production integrations go

- **RentCast:** `.env.local` → `RENTCAST_API_KEY`; in `lib/listings/adapters/rentcast.js` and `lib/market/adapters/rentcast.js`.
- **Redfin:** `.env.local` → `REDFIN_API_KEY` (or equivalent); in `lib/market/adapters/redfin.js`.
- **Zillow:** `.env.local` → `ZILLOW_API_KEY` if required; in `lib/market/adapters/zillow.js`.
- **Supabase:** Already used; optional `SUPABASE_SERVICE_ROLE_KEY` for server-side writes (see `.env.example`).
- **Email provider:** Future; e.g. `RESEND_API_KEY` when sending newsletter; set `sent_at` and `recipient_count` in `newsletter_issues`.

---

## Next steps (Phase 2+)

- Run migrations in Supabase (Dashboard SQL Editor or `supabase db push`).
- Phase 2: Implement RentCast (or MLS-style) listing sync; persist to `listing_cache`/`listing_images`.
- Phase 3: Ingest neighborhood stats; link `scripts/generate-market-report.js` to `market_reports` and optionally `newsletter_issues`.
- Phase 4: API routes for saved searches/homes and lead_events from forms/matchmaker.
- Phase 5: Schedule agent_runs (cron/Edge Functions); call adapters and runner.
- Phase 6: Frontend evolution (dashboards, lead capture) without removing current pages.
