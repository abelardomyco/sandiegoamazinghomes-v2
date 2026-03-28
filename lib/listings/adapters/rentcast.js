/**
 * RentCast adapter — re-exports from canonical lib/listings/rentcast.js.
 * Use lib/listings/rentcast.js for searchListings, getListingById, normalizeListing.
 */

const rentcast = require("../rentcast");

async function fetchRentCastListings(options = {}) {
  return rentcast.searchListings(options);
}

function normalizeRentCastListing(item) {
  return rentcast.normalizeListing(item);
}

module.exports = {
  ...rentcast,
  fetchRentCastListings,
  normalizeRentCastListing,
};
