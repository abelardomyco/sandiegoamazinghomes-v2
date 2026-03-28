-- Phase 1: neighborhood_market_stats + market_reports

-- Neighborhood market stats: time-series metrics per neighborhood (from Redfin, Zillow, RentCast, etc.).
CREATE TABLE IF NOT EXISTS neighborhood_market_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_slug TEXT NOT NULL,
  median_price INTEGER,
  inventory INTEGER,
  days_on_market INTEGER,
  sold_count INTEGER,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  raw_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (neighborhood_slug, period_start, period_end, source)
);

CREATE INDEX IF NOT EXISTS idx_neighborhood_market_stats_slug ON neighborhood_market_stats (neighborhood_slug);
CREATE INDEX IF NOT EXISTS idx_neighborhood_market_stats_period ON neighborhood_market_stats (period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_neighborhood_market_stats_source ON neighborhood_market_stats (source);

-- Market reports: generated monthly or on-demand (e.g. from scripts/generate-market-report.js).
CREATE TABLE IF NOT EXISTS market_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  sections_json JSONB,
  content_md TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_market_reports_slug ON market_reports (slug);
CREATE INDEX IF NOT EXISTS idx_market_reports_generated ON market_reports (generated_at);
