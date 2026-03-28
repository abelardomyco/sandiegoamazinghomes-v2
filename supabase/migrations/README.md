# Supabase migrations

Phase 1 foundation tables for the real estate intelligence platform.

## Order

1. `20260217000001_listing_cache_listing_images.sql`
2. `20260217000002_neighborhood_market_stats_market_reports.sql`
3. `20260217000003_saved_searches_saved_homes_user_preferences.sql`
4. `20260217000004_lead_events_newsletter_issues_agent_runs.sql`

## How to run

- **Supabase CLI:** `supabase db push` (or link project and migrate).
- **Dashboard:** SQL Editor → paste each file in order and run.

Existing tables (`newsletter_subscribers`, `contact_submissions`) are not modified.
