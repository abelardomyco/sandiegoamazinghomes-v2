/**
 * Neighborhood market stats service.
 * Reads/writes neighborhood_market_stats table.
 * TODO: Production — ingest from Redfin, Zillow, or RentCast adapters; schedule via agent_runs.
 */

function getSupabase() {
  try {
    const mod = require("../supabase");
    return (mod.createServerClient && mod.createServerClient()) || (mod.default && mod.default.createServerClient && mod.default.createServerClient()) || null;
  } catch (_) {
    return null;
  }
}

/**
 * Get latest stats for a neighborhood (or all) in a period.
 * @param {object} options - { neighborhood_slug?, period_start?, period_end?, source?, limit? }
 */
async function getNeighborhoodStats(options = {}) {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase.from("neighborhood_market_stats").select("*").order("period_end", { ascending: false });
  if (options.neighborhood_slug) query = query.eq("neighborhood_slug", options.neighborhood_slug);
  if (options.period_start) query = query.gte("period_end", options.period_start);
  if (options.period_end) query = query.lte("period_start", options.period_end);
  if (options.source) query = query.eq("source", options.source);
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) {
    console.error("[market/stats] getNeighborhoodStats error:", error);
    return [];
  }
  return data || [];
}

/**
 * Insert or replace one row of neighborhood stats (unique on slug + period + source).
 */
async function upsertNeighborhoodStats(row) {
  const supabase = getSupabase();
  if (!supabase || !row || !row.neighborhood_slug || !row.period_start || !row.period_end) return null;
  const { data, error } = await supabase.from("neighborhood_market_stats").upsert(row, {
    onConflict: "neighborhood_slug,period_start,period_end,source",
    ignoreDuplicates: false,
  });
  if (error) {
    console.error("[market/stats] upsertNeighborhoodStats error:", error);
    return null;
  }
  return data?.[0] ?? null;
}

module.exports = {
  getNeighborhoodStats,
  upsertNeighborhoodStats,
};
