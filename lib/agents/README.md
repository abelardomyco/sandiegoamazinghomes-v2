# Agents (Phase 3)

- **runner.js** — `startRun(agentType, config)`, `finishRun(runId, result)`. Logs to `agent_runs` table. Requires Supabase env vars for logging.
- **market-data-agent.js** — **Market Data Agent (v1):** Fetches listing/property data from RentCast, normalizes and upserts to `listing_cache`, extracts image URLs from `raw_json` and writes to `listing_images`, then writes `neighborhood_market_stats` (from trend adapters or derived from listings when adapters return empty). Run: `marketDataAgent.run(config)` or CLI `npm run agent:run market_data`.
- **content-agent.js** — **Content Agent (v1):** Generates monthly newsletter draft and market report draft (same content), plus short neighborhood update blurbs. Writes to `market_reports` and `newsletter_issues`. Does not send email. Run: `contentAgent.run(config)` or CLI `npm run agent:run content [--month=MM] [--year=YYYY] [--write-neighborhood-summaries]`.
- **lead-agent.js** — Lead events and saved searches/homes (stub). API routes under `/api/lead/*`.
- **scripts/run-agent.js** — CLI loads `.env.local` via dotenv, then runs `market_data` or `content`. Requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or anon key) for Supabase writes.
- **lib/supabase.js** — CJS export so Node scripts can `require()` it; used by runner, cache, stats, reports, newsletter.
- TODO: Production — wire to cron; enable RENTCAST_API_KEY; connect email for newsletter send.
