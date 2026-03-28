/**
 * RentCast market stats adapter (stub).
 * TODO: Production — same RENTCAST_API_KEY as listings; use neighborhood or ZIP metrics endpoint.
 */

const SOURCE = "rentcast";

/**
 * Fetch neighborhood/region market stats from RentCast.
 * @param {object} options - { neighborhood_slugs?, period_start?, period_end? }
 * @returns {Promise<Array>} Rows for neighborhood_market_stats.
 */
async function fetchRentCastMarketData(options = {}) {
  // TODO: Production — const apiKey = process.env.RENTCAST_API_KEY; if (!apiKey) return [];
  // TODO: Production — call RentCast market stats endpoint; map to neighborhood_market_stats shape.
  return [];
}

module.exports = {
  fetchRentCastMarketData,
  SOURCE,
};
