# San Diego Amazing Homes → Real Estate Intelligence Platform

**Date:** 2026-02-17

## Goals

1. Drive traffic for San Diego home buyers and sellers  
2. Generate leads for Rosamelia  
3. Support Baja property interest as a secondary path  
4. Build in stages with low-cost data sources first  

## Current Stack (unchanged)

- Next.js 14 App Router  
- Tailwind  
- Supabase  
- Markdown/JSON neighborhood content  
- Matchmaker, newsletter subscriptions  

**No rebuild of the current site.** Phases add capability without removing existing pages.

---

## Phase Overview

| Phase | Focus | Data / integrations |
|-------|--------|----------------------|
| **1 – Foundation** | Schema, service layer, adapter stubs | Supabase tables; placeholder adapters (RentCast, Redfin, Zillow, Baja) |
| 2 – Listings | Listing cache, images, sync | RentCast or MLS-style feed; optional Baja manual entries |
| 3 – Market data | Neighborhood stats, reports | Redfin/Zillow or RentCast metrics; market report generator |
| 4 – Engagement | Saved searches, saved homes, leads | Lead events, preferences, newsletter issue tracking |
| 5 – Agents & automation | Scheduled jobs, report generation | agent_runs; cron or Supabase Edge Functions |
| 6 – Frontend evolution | Dashboards, lead capture | New UI on top of existing pages; no removal of current routes |

---

## Phase 1 – Foundation (implemented)

### 1.1 Supabase schema (recommended)

- **listing_cache** — Cached listings from feeds (external_id, source, neighborhood, price, beds, baths, etc.).  
- **listing_images** — Images per listing (listing_id, url, sort_order).  
- **neighborhood_market_stats** — Time-series stats per neighborhood (median_price, inventory, days_on_market, period, source).  
- **market_reports** — Generated reports (slug, title, content/sections, generated_at).  
- **saved_searches** — User/anonymous saved filters and optional notify.  
- **saved_homes** — User/anonymous saved listings.  
- **user_preferences** — Preferences keyed by user or anonymous_id.  
- **lead_events** — Events for lead attribution (type, email/anonymous_id, payload, source_page).  
- **newsletter_issues** — Issue metadata and send tracking (slug, sent_at, recipient_count).  
- **agent_runs** — Runs of background jobs (agent_type, status, config, started_at, finished_at, result/error).  

Existing tables **newsletter_subscribers** and **contact_submissions** remain unchanged.

### 1.2 Deliverables

- SQL migration files under `supabase/migrations/`  
- Service layer: `lib/listings/`, `lib/market/`, `lib/agents/`, `lib/email/`  
- Placeholder adapters: RentCast, Redfin, Zillow, Baja manual listings  
- TODO comments where live API keys and production integrations will go  
- This doc + implementation notes (file tree, migration summary, adapter stubs)  

### 1.3 Out of scope for Phase 1

- No full frontend redesign  
- No removal of current pages  
- No live API keys or production third-party calls  

---

## File Tree (Phase 1)

```
sandiegoamazinghomes/
├── docs/
│   ├── Upgrade-Plan-Real-Estate-Intelligence-2026-02-17.md   (this file)
│   └── Phase-1-Implementation-Notes-2026-02-17.md
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
└── (existing app/, components/, content/, data/, scripts/ unchanged)
```

---

## Next steps (Phases 2+)

- Phase 2: Wire listing adapters to `listing_cache` and `listing_images`; optional sync API or cron.  
- Phase 3: Ingest neighborhood stats; link market report generator to `market_reports`.  
- Phase 4: API routes or client for saved searches/homes; persist lead_events from forms and matchmaker.  
- Phase 5: Schedule agent_runs (e.g. Supabase cron or Vercel); implement runner.  
- Phase 6: New dashboard/lead-capture UI alongside existing pages.  
