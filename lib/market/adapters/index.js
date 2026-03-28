/**
 * Market data adapters — aggregate for stats ingest.
 * TODO: Production — call fetch* with real keys and persist via lib/market/stats.
 */

const redfin = require("./redfin");
const zillow = require("./zillow");
const rentcast = require("./rentcast");

module.exports = {
  redfin,
  zillow,
  rentcast,
};
