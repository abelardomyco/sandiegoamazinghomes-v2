-- Phase 1: lead_events, newsletter_issues, agent_runs

CREATE TABLE IF NOT EXISTS lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  email TEXT,
  anonymous_id TEXT,
  payload_json JSONB,
  source_page TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT lead_events_identifier CHECK (email IS NOT NULL OR anonymous_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_lead_events_type ON lead_events (event_type);
CREATE INDEX IF NOT EXISTS idx_lead_events_email ON lead_events (email);
CREATE INDEX IF NOT EXISTS idx_lead_events_anonymous ON lead_events (anonymous_id);
CREATE INDEX IF NOT EXISTS idx_lead_events_created ON lead_events (created_at);

-- Newsletter issue send tracking (links to content/newsletter/{slug}.md).
CREATE TABLE IF NOT EXISTS newsletter_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  sent_at TIMESTAMPTZ,
  recipient_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_issues_slug ON newsletter_issues (slug);
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_sent ON newsletter_issues (sent_at);

-- Background job / agent run log (market report generation, listing sync, etc.).
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  config_json JSONB,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  result_summary TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_type ON agent_runs (agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs (status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_started ON agent_runs (started_at);
