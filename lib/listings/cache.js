/**
 * Listing cache service.
 * Reads/writes listing_cache table in Supabase.
 * TODO: Production — use createServerClient() and env SUPABASE_SERVICE_ROLE_KEY for server-side writes.
 */

function getSupabase() {
  try {
    // Next.js: ESM export from lib/supabase.js
    const mod = require("../supabase");
    return (mod.createServerClient && mod.createServerClient()) || (mod.default && mod.default.createServerClient && mod.default.createServerClient()) || null;
  } catch (_) {
    return null;
  }
}

/**
 * Fetch active listings from cache (optionally by source/neighborhood).
 * @param {object} options - { source?, neighborhood_slug?, limit? }
 * @returns {Promise<Array>}
 */
async function getCachedListings(options = {}) {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase
    .from("listing_cache")
    .select("*")
    .eq("status", "active")
    .order("fetched_at", { ascending: false });

  if (options.source) query = query.eq("source", options.source);
  if (options.neighborhood_slug) query = query.eq("neighborhood_slug", options.neighborhood_slug);
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) {
    console.error("[listings/cache] getCachedListings error:", error);
    return [];
  }
  return data || [];
}

/**
 * Upsert a batch of listings into listing_cache.
 * Returns upserted rows (with id, raw_json) so callers can populate listing_images.
 * @param {Array} listings - Array of { external_id, source, ... }
 * @returns {Promise<{ inserted: number, updated: number, rows: Array }>}
 */
async function upsertListings(listings) {
  const supabase = getSupabase();
  if (!supabase || !Array.isArray(listings) || listings.length === 0) {
    return { inserted: 0, updated: 0, rows: [] };
  }

  const { data, error } = await supabase
    .from("listing_cache")
    .upsert(listings, { onConflict: "source,external_id", ignoreDuplicates: false })
    .select("id, external_id, source, raw_json");
  if (error) {
    console.error("[listings/cache] upsertListings error:", error);
    return { inserted: 0, updated: 0, rows: [] };
  }
  const rows = Array.isArray(data) ? data : [];
  return { inserted: rows.length, updated: 0, rows };
}

module.exports = {
  getCachedListings,
  upsertListings,
};
