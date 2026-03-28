/**
 * Market Data Agent
 * Fetches listing/property data from RentCast, normalizes and caches in Supabase.
 * Prepares neighborhood market stats (from adapters or derived from listings).
 * Logs runs in agent_runs. No email sending.
 */

const { startRun, finishRun } = require("./runner");
const { upsertListings } = require("../listings/cache");
const { setImagesForListing } = require("../listings/images");
const { upsertNeighborhoodStats } = require("../market/stats");
const rentcastListings = require("../listings/adapters/rentcast");
const bajaListings = require("../listings/adapters/baja-manual");
const rentcastMarket = require("../market/adapters/rentcast");
const redfinMarket = require("../market/adapters/redfin");
const zillowMarket = require("../market/adapters/zillow");

const AGENT_TYPE = "market_data";

/** Extract image URLs from raw_json (RentCast-style photos array or single image). */
function extractImageUrls(raw) {
  if (!raw || typeof raw !== "object") return [];
  if (Array.isArray(raw.photos) && raw.photos.length > 0) {
    return raw.photos.map((p) => (typeof p === "string" ? p : p.url || p.src)).filter(Boolean);
  }
  if (typeof raw.image === "string" && raw.image) return [raw.image];
  if (Array.isArray(raw.images)) {
    return raw.images.map((u) => (typeof u === "string" ? u : u.url || u.src)).filter(Boolean);
  }
  return [];
}

/**
 * Normalize adapter listing to listing_cache row (ensure required fields).
 */
function normalizeListingRow(row) {
  return {
    external_id: String(row.external_id || ""),
    source: String(row.source || "manual"),
    neighborhood_slug: row.neighborhood_slug ?? null,
    address: row.address ?? null,
    city: row.city ?? null,
    state: row.state ?? "CA",
    zip: row.zip ?? null,
    price: row.price != null ? Number(row.price) : null,
    beds: row.beds != null ? Number(row.beds) : null,
    baths: row.baths != null ? Number(row.baths) : null,
    sqft: row.sqft != null ? Number(row.sqft) : null,
    property_type: row.property_type ?? null,
    status: row.status ?? "active",
    listing_url: row.listing_url ?? null,
    raw_json: row.raw_json ?? null,
    fetched_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Normalize adapter stats row to neighborhood_market_stats shape.
 */
function normalizeStatsRow(row, periodStart, periodEnd) {
  return {
    neighborhood_slug: String(row.neighborhood_slug || row.slug || ""),
    median_price: row.median_price != null ? Number(row.median_price) : null,
    inventory: row.inventory != null ? Number(row.inventory) : null,
    days_on_market: row.days_on_market != null ? Number(row.days_on_market) : null,
    sold_count: row.sold_count != null ? Number(row.sold_count) : null,
    period_start: periodStart,
    period_end: periodEnd,
    source: String(row.source || "manual"),
    raw_json: row.raw_json ?? row,
  };
}

/**
 * Fetch listings from all configured adapters and merge.
 * RentCast: uses limit 200 by default if not specified.
 */
async function fetchAllListings(config = {}) {
  const list = [];
  if (config.sources !== false) {
    const rentcastOpts = { limit: 200, ...(config.rentcast || {}) };
    const [rentcast, baja] = await Promise.all([
      rentcastListings.fetchRentCastListings(rentcastOpts),
      bajaListings.fetchBajaManualListings(),
    ]);
    list.push(
      ...rentcast.map((r) => normalizeListingRow(r)),
      ...baja.map((b) => normalizeListingRow(bajaListings.normalizeBajaListing(b)))
    );
  }
  return list.filter((r) => r.external_id);
}

/**
 * Fetch trend/stats from market adapters and merge.
 */
async function fetchAllTrendData(config = {}) {
  const now = new Date();
  const periodEnd = config.period_end || now.toISOString().slice(0, 10);
  const periodStart = config.period_start || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const rows = [];
  const [rentcast, redfin, zillow] = await Promise.all([
    rentcastMarket.fetchRentCastMarketData({ ...config.rentcast, period_start: periodStart, period_end: periodEnd }),
    redfinMarket.fetchRedfinMarketData({ ...config.redfin, period_start: periodStart, period_end: periodEnd }),
    zillowMarket.fetchZillowMarketData({ ...config.zillow, period_start: periodStart, period_end: periodEnd }),
  ]);
  for (const r of rentcast) rows.push(normalizeStatsRow(r, periodStart, periodEnd));
  for (const r of redfin) rows.push(normalizeStatsRow(r, periodStart, periodEnd));
  for (const r of zillow) rows.push(normalizeStatsRow(r, periodStart, periodEnd));
  return rows;
}

/**
 * Derive neighborhood_market_stats from listing list (inventory + median price per slug).
 * Used when trend adapters return no data. One row per neighborhood_slug for current month.
 */
function deriveNeighborhoodStatsFromListings(listings, periodStart, periodEnd) {
  const bySlug = {};
  for (const row of listings) {
    const slug = row.neighborhood_slug || "unknown";
    if (!bySlug[slug]) bySlug[slug] = { prices: [], count: 0 };
    bySlug[slug].count += 1;
    if (row.price != null && row.price > 0) bySlug[slug].prices.push(row.price);
  }
  const rows = [];
  for (const [neighborhood_slug, data] of Object.entries(bySlug)) {
    const median_price =
      data.prices.length > 0
        ? data.prices.slice().sort((a, b) => a - b)[Math.floor(data.prices.length / 2)]
        : null;
    rows.push({
      neighborhood_slug,
      median_price,
      inventory: data.count,
      days_on_market: null,
      sold_count: null,
      period_start: periodStart,
      period_end: periodEnd,
      source: "rentcast_derived",
      raw_json: null,
    });
  }
  return rows;
}

/**
 * Run the market data agent: fetch from RentCast → normalize → cache in Supabase → images → neighborhood stats.
 * Logs to agent_runs.
 */
async function run(config = {}) {
  const runResult = await startRun(AGENT_TYPE, config);
  const runId = runResult?.id;
  try {
    const listings = await fetchAllListings(config);
    const now = new Date();
    const periodEnd = config.period_end || now.toISOString().slice(0, 10);
    const periodStart =
      config.period_start ||
      new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

    let listingCount = 0;
    let imageCount = 0;
    if (listings.length > 0) {
      const out = await upsertListings(listings);
      listingCount = out.inserted + out.updated;
      for (const row of out.rows || []) {
        const urls = extractImageUrls(row.raw_json);
        if (urls.length > 0) {
          await setImagesForListing(row.id, urls.map((url) => ({ url })));
          imageCount += urls.length;
        }
      }
    }

    const trendRows = await fetchAllTrendData(config);
    let statsCount = 0;
    for (const row of trendRows) {
      const ok = await upsertNeighborhoodStats(row);
      if (ok) statsCount++;
    }
    if (trendRows.length === 0 && listings.length > 0) {
      const derived = deriveNeighborhoodStatsFromListings(listings, periodStart, periodEnd);
      for (const row of derived) {
        const ok = await upsertNeighborhoodStats(row);
        if (ok) statsCount++;
      }
    }

    const summary = `Listings: ${listingCount} upserted; ${imageCount} images. Stats: ${statsCount} rows.`;
    if (runId) await finishRun(runId, { success: true, result_summary: summary });
    return { success: true, result_summary: summary };
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (runId) await finishRun(runId, { success: false, error_message: msg });
    return { success: false, error_message: msg };
  }
}

module.exports = {
  run,
  fetchAllListings,
  fetchAllTrendData,
  normalizeListingRow,
  normalizeStatsRow,
  AGENT_TYPE,
};
