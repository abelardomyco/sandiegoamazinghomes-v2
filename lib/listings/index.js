/**
 * Listings service layer.
 * Phase 1: foundation only. Existing data remains in data/listings.json;
 * this layer will later integrate listing_cache and adapters.
 */

const cache = require("./cache");
const images = require("./images");

module.exports = {
  ...cache,
  ...images,
};
