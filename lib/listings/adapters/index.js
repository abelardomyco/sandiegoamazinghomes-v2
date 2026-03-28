/**
 * Listings adapters — aggregate for sync jobs.
 * TODO: Production — call fetchRentCastListings() / fetchBajaManualListings() with real keys and persist via lib/listings/cache.
 */

const rentcast = require("./rentcast");
const bajaManual = require("./baja-manual");

module.exports = {
  rentcast,
  bajaManual,
};
