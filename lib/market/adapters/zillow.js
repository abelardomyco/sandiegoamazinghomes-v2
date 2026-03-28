/**
 * Zillow public metrics adapter (stub).
 * TODO: Production — use Zillow's public market data or official API if available; add ZILLOW_API_KEY if required.
 * Returns neighborhood/ZIP-level metrics for neighborhood_market_stats.
 */

const SOURCE = "zillow";

/**
 * Fetch market metrics from Zillow for given areas.
 * @param {object} options - { zips?, neighborhood_slugs?, period_start?, period_end? }
 * @returns {Promise<Array>} Rows for neighborhood_market_stats.
 */
async function fetchZillowMarketData(options = {}) {
  // TODO: Production — const apiKey = process.env.ZILLOW_API_KEY; if (!apiKey) return [];
  // TODO: Production — call Zillow API or use documented public metrics; map to neighborhood_market_stats shape.
  return [];
}

module.exports = {
  fetchZillowMarketData,
  SOURCE,
};
