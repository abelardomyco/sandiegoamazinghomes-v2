-- Phase 1: saved_searches, saved_homes, user_preferences
-- user_id can be UUID from Supabase Auth later; anonymous_id for unauthenticated users.

CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  anonymous_id TEXT,
  name TEXT,
  filters_json JSONB NOT NULL DEFAULT '{}',
  notify BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT saved_searches_owner CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_anonymous ON saved_searches (anonymous_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_updated ON saved_searches (updated_at);

CREATE TABLE IF NOT EXISTS saved_homes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  anonymous_id TEXT,
  listing_id UUID REFERENCES listing_cache (id) ON DELETE SET NULL,
  external_id TEXT,
  source TEXT NOT NULL DEFAULT 'cache',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT saved_homes_owner CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_saved_homes_user ON saved_homes (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_homes_anonymous ON saved_homes (anonymous_id);
CREATE INDEX IF NOT EXISTS idx_saved_homes_listing ON saved_homes (listing_id);

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  anonymous_id TEXT UNIQUE,
  preferences_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_preferences_owner CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences (user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_anonymous ON user_preferences (anonymous_id);
