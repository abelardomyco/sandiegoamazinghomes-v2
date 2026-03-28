/**
 * Market reports service.
 * Reads/writes market_reports table. Can sync with content/newsletter or standalone.
 * TODO: Production — persist output from scripts/generate-market-report.js; link to newsletter_issues.
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
 * Get a market report by slug (e.g. "2026-04").
 */
async function getMarketReportBySlug(slug) {
  const supabase = getSupabase();
  if (!supabase || !slug) return null;
  const { data, error } = await supabase.from("market_reports").select("*").eq("slug", slug).single();
  if (error || !data) return null;
  return data;
}

/**
 * Upsert a market report (slug unique).
 */
async function upsertMarketReport({ slug, title, sections_json, content_md, source_config }) {
  const supabase = getSupabase();
  if (!supabase || !slug) return null;
  const row = {
    slug,
    title: title ?? null,
    sections_json: sections_json ?? null,
    content_md: content_md ?? null,
    source_config: source_config ?? null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("market_reports").upsert(row, { onConflict: "slug" });
  if (error) {
    console.error("[market/reports] upsertMarketReport error:", error);
    return null;
  }
  return data?.[0] ?? null;
}

module.exports = {
  getMarketReportBySlug,
  upsertMarketReport,
};
