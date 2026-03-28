/**
 * Redfin market data adapter (stub).
 * TODO: Production — add REDFIN_API_KEY or use Redfin's public market data if available; ensure compliance with ToS.
 * Returns neighborhood-level metrics: median_price, inventory, days_on_market, sold_count for a period.
 */

const SOURCE = "redfin";

/**
 * Fetch market stats for a region or list of neighborhoods from Redfin.
 * @param {object} options - { region?, neighborhood_slugs?, period_start?, period_end? }
 * @returns {Promise<Array>} Rows for neighborhood_market_stats (neighborhood_slug, median_price, inventory, days_on_market, sold_count, period_start, period_end, source).
 */
async function fetchRedfinMarketData(options = {}) {
  // TODO: Production — const apiKey = process.env.REDFIN_API_KEY; if (!apiKey) return [];
  // TODO: Production — call Redfin data endpoint; map response to neighborhood_market_stats shape.
  return [];
}

module.exports = {
  fetchRedfinMarketData,
  SOURCE,
};
