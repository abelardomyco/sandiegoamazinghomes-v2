/**
 * Homes list data layer for /homes and /homes/[id].
 *
 * DATA FLOW (listing source clarity):
 * 1. RentCast live: When RENTCAST_API_KEY is set, getListingsForPage() and getListingByIdForPage()
 *    call the RentCast adapter. On success, listings are from the live API (rentcast_live).
 * 2. Placeholder fallback: When RentCast is not configured or the API call fails, listings come
 *    from data/listings.json (placeholder). This is intentional fallback only — do not present
 *    placeholder data as final/live. The frontend receives dataSource: 'rentcast_live' | 'placeholder'
 *    so the UI can show "Live listings" vs "Sample data" clearly.
 * 3. Cache: Supabase listing_cache is used by the market-data-agent to store RentCast results;
 *    /homes does NOT read from cache — it is either RentCast live or file placeholder.
 *
 * Unified listing shape (display): id, address, city, state, zip, neighborhood, price, beds, baths,
 * sqft, lotSize, propertyType, status, images[], description, lat, lng.
 * Placeholder listings: SDAH/banner image URLs are replaced with neutral placeholder images.
 * FALLBACK: Only when live data is unavailable do we use data/listings.json. Placeholder mode
 * must not be presented as production data — see dataSource and "Sample data" UI.
 */

const {
  getListings,
  getListingById,
  getPropertyTypes,
  getNeighborhoodSlugsFromListings,
  loadListings,
} = require("./listings");
const rentcast = require("./listings/rentcast");
const { pickPhotos, pickDescription } = rentcast;

/** Neutral placeholder when listing has no photo. Do NOT use SDAH banner for listings. */
const FALLBACK_LISTING_IMAGE = "/images/placeholder-listing.svg";

/** Curated fallback images for listings (no real photo). Used so placeholder cards look distinct. */
const PLACEHOLDER_LISTING_IMAGES = [
  "/images/placeholder-listing.svg",
  "/images/placeholder-listing.svg", // second variant can be added later
];

/** Returns true if URL is the site banner or similar — must not be used for listing images. */
function isBannerOrNonListingImage(url) {
  if (!url || typeof url !== "string") return true;
  const u = url.toLowerCase();
  return u.includes("sdah") || u.includes("banner") || u.includes("cropped-sdah");
}

/** Map RentCast normalized row to unified display shape. Uses pickPhotos/pickDescription for full extraction. */
function rentcastToUnified(row) {
  if (!row) return null;
  const raw = row.raw_json || {};
  const photos = pickPhotos(raw);
  const images = photos.length > 0 ? photos : [FALLBACK_LISTING_IMAGE];
  const description = pickDescription(raw);
  return {
    id: String(row.external_id),
    address: row.address || "",
    city: row.city || "",
    state: row.state || "CA",
    zip: row.zip || "",
    neighborhood: row.neighborhood_slug || null,
    price: row.price,
    beds: row.beds,
    baths: row.baths,
    sqft: row.sqft,
    lotSize: row.lot_sqft != null ? row.lot_sqft : null,
    propertyType: row.property_type || null,
    status: row.status || null,
    images,
    description,
    lat: raw.latitude != null ? Number(raw.latitude) : (raw.lat != null ? Number(raw.lat) : null),
    lng: raw.longitude != null ? Number(raw.longitude) : (raw.lng != null ? Number(raw.lng) : null),
  };
}

/**
 * Map placeholder listing (data/listings.json) to unified shape.
 * FALLBACK ONLY — used when RentCast is not configured or API fails. Do not style as production data.
 * Replaces banner URLs with curated home-image placeholder.
 */
function placeholderToUnified(listing, indexForImage = 0) {
  if (!listing) return null;
  let images = Array.isArray(listing.images) && listing.images.length
    ? listing.images.filter((url) => !isBannerOrNonListingImage(url))
    : [];
  if (images.length === 0) {
    const idx = Math.abs(indexForImage) % PLACEHOLDER_LISTING_IMAGES.length;
    images = [PLACEHOLDER_LISTING_IMAGES[idx] || FALLBACK_LISTING_IMAGE];
  }
  return {
    id: String(listing.id),
    address: listing.address || "",
    city: listing.city || "",
    state: listing.state || "CA",
    zip: listing.zip || "",
    neighborhood: listing.neighborhood || null,
    price: listing.price,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft,
    lotSize: listing.lotSize != null ? Number(listing.lotSize) : null,
    propertyType: listing.propertyType || null,
    status: listing.status || "active",
    images,
    description: listing.description || "",
    lat: listing.lat != null ? Number(listing.lat) : null,
    lng: listing.lng != null ? Number(listing.lng) : null,
  };
}

/**
 * Get listings for /homes. Uses RentCast live when configured, else placeholder (data/listings.json).
 * Returns dataSource so the UI can show "Live listings" vs "Sample data" clearly.
 * @param {object} options - { neighborhoods?: string[] } from searchParams
 * @returns {Promise<{ listings: Array, dataSource: 'rentcast_live' | 'placeholder' }>}
 */
async function getListingsForPage(options = {}) {
  const filters = {};
  if (Array.isArray(options.neighborhoods) && options.neighborhoods.length > 0) {
    filters.neighborhoods = options.neighborhoods;
  }

  if (rentcast.isConfigured()) {
    try {
      const list = await rentcast.searchListings({ limit: 200 });
      const unified = list.map((row) => rentcastToUnified(row)).filter(Boolean);
      let out = unified;
      if (filters.neighborhoods && filters.neighborhoods.length > 0) {
        const set = new Set(filters.neighborhoods);
        out = unified.filter((l) => l.neighborhood && set.has(l.neighborhood));
      }
      return { listings: out, dataSource: "rentcast_live" };
    } catch (_) {
      // Fall through to placeholder on error — do not expose as live
    }
  }

  const fromPlaceholder = getListings(filters);
  const listings = fromPlaceholder.map((l, i) => placeholderToUnified(l, i)).filter(Boolean);
  return { listings, dataSource: "placeholder" };
}

/**
 * Get a single listing by id for /homes/[id]. Tries RentCast first if configured, then placeholder.
 * @param {string} id - Listing id (external_id for RentCast, or id from placeholder)
 * @returns {Promise<object|null>} Unified listing or null
 */
async function getListingByIdForPage(id) {
  if (!id) return null;

  if (rentcast.isConfigured()) {
    try {
      const row = await rentcast.getListingById(id);
      if (row) return rentcastToUnified(row);
    } catch (_) {}
  }

  const fromPlaceholder = getListingById(id);
  return fromPlaceholder ? placeholderToUnified(fromPlaceholder, 0) : null;
}

/**
 * Get property types for filter dropdown from a list of unified listings.
 */
function getPropertyTypesFromList(listings) {
  const set = new Set();
  (listings || []).forEach((l) => {
    if (l.propertyType) set.add(l.propertyType);
  });
  return Array.from(set).sort();
}

/**
 * Get neighborhood slugs present in listings; merge with content index for names.
 */
function getNeighborhoodSlugsFromList(listings) {
  const set = new Set();
  (listings || []).forEach((l) => {
    if (l.neighborhood) set.add(l.neighborhood);
  });
  return Array.from(set).sort();
}

/**
 * Debug-safe: report whether RentCast is configured (API key present). Does NOT call the API.
 * To verify live data is actually used: set RENTCAST_API_KEY, restart server, open /homes — if you see
 * "Live listings" badge and real addresses/photos, live data is connected; otherwise check server logs.
 * @returns {{ configured: boolean, message: string }}
 */
function getListingsSourceStatus() {
  const configured = rentcast.isConfigured();
  return {
    configured,
    message: configured
      ? "RentCast API key is set. Open /homes to verify live data (look for 'Live listings' badge)."
      : "RentCast API key not set. Listings use placeholder fallback (data/listings.json).",
  };
}

module.exports = {
  getListingsForPage,
  getListingByIdForPage,
  getPropertyTypesFromList,
  getNeighborhoodSlugsFromList,
  getListings,
  getListingById,
  getPropertyTypes,
  getNeighborhoodSlugsFromListings,
  loadListings,
  getListingsSourceStatus,
  placeholderToUnified,
  rentcastToUnified,
};
