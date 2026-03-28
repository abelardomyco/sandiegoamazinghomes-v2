/**
 * Baja manual listings adapter (stub).
 * TODO: Production — wire to admin form, CSV upload, or CMS. Secondary path for Baja property interest.
 * Data can be stored in listing_cache with source = "baja_manual", or in a dedicated table if preferred.
 */

const SOURCE = "baja_manual";

/**
 * Fetch manually entered Baja listings (e.g. from Supabase table or JSON file).
 * @returns {Promise<Array>} Normalized rows for listing_cache.
 */
async function fetchBajaManualListings() {
  // TODO: Production — read from Supabase table "baja_listings" or content/baja-listings.json; return normalized rows.
  return [];
}

/**
 * Normalize a Baja manual entry to listing_cache shape.
 */
function normalizeBajaListing(item) {
  return {
    external_id: String(item.id ?? item.external_id ?? ""),
    source: SOURCE,
    neighborhood_slug: item.neighborhood_slug ?? item.area ?? null,
    address: item.address ?? item.location ?? "",
    city: item.city ?? "",
    state: item.state ?? "BC",
    zip: item.zip ?? "",
    price: item.price ?? null,
    beds: item.beds ?? null,
    baths: item.baths ?? null,
    sqft: item.sqft ?? null,
    property_type: item.property_type ?? "Land",
    status: item.status ?? "active",
    listing_url: item.url ?? null,
    raw_json: item,
  };
}

module.exports = {
  fetchBajaManualListings,
  normalizeBajaListing,
  SOURCE,
};
