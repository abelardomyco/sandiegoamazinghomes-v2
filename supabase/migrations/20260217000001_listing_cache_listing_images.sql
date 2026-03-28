-- Phase 1: listing_cache + listing_images
-- Run with: supabase db push (or paste into SQL Editor)

-- Listing cache: synced from RentCast, MLS-style feeds, or Baja manual.
CREATE TABLE IF NOT EXISTS listing_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  neighborhood_slug TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'CA',
  zip TEXT,
  price INTEGER,
  beds INTEGER,
  baths NUMERIC(4,1),
  sqft INTEGER,
  property_type TEXT,
  status TEXT DEFAULT 'active',
  listing_url TEXT,
  raw_json JSONB,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source, external_id)
);

CREATE INDEX IF NOT EXISTS idx_listing_cache_source ON listing_cache (source);
CREATE INDEX IF NOT EXISTS idx_listing_cache_neighborhood ON listing_cache (neighborhood_slug);
CREATE INDEX IF NOT EXISTS idx_listing_cache_status ON listing_cache (status);
CREATE INDEX IF NOT EXISTS idx_listing_cache_fetched ON listing_cache (fetched_at);

-- Listing images: one row per image per listing.
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listing_cache (id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (listing_id, sort_order)
);

CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images (listing_id);
