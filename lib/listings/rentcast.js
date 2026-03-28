/**
 * RentCast listings adapter — Phase 1 foundation.
 * Free developer tier: https://rapidapi.com/realty-in-us-realty-in-us-default/api/rentcast
 *
 * Env: RENTCAST_API_KEY in .env.local (or RENTCAST_RAPIDAPI_KEY if using RapidAPI host header).
 * Fails gracefully if API key is missing (returns [] or null).
 */

const SOURCE = "rentcast";

/**
 * Get API key from env. Prefer RENTCAST_API_KEY; fallback RENTCAST_RAPIDAPI_KEY for RapidAPI.
 * @returns {string|null}
 */
function getApiKey() {
  if (typeof process === "undefined") return null;
  const key = process.env.RENTCAST_API_KEY || process.env.RENTCAST_RAPIDAPI_KEY || "";
  return key.trim() || null;
}

/**
 * Check if adapter can make requests (key present).
 * @returns {boolean}
 */
function isConfigured() {
  return !!getApiKey();
}

/**
 * Extract first line of address from raw (street or formatted).
 */
function pickAddress(raw) {
  if (!raw || typeof raw !== "object") return "";
  const a = raw.address ?? raw.formattedAddress ?? raw.street ?? raw.streetAddress ?? raw.line1 ?? "";
  if (typeof a === "string") return a.trim();
  if (typeof a === "object" && a.line1) return String(a.line1).trim();
  return "";
}

/**
 * Extract photos array from raw. RentCast may use photos, images, media, or single image/picture.
 * @returns {string[]} Array of image URLs
 */
function pickPhotos(raw) {
  if (!raw || typeof raw !== "object") return [];
  const arr = raw.photos ?? raw.images ?? raw.media ?? raw.photosArray ?? raw.pictures;
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.filter((u) => typeof u === "string" && u.startsWith("http")).slice(0, 24);
  }
  const one = raw.image ?? raw.photo ?? raw.picture ?? raw.thumbnail ?? raw.mainPhoto;
  if (typeof one === "string" && one.startsWith("http")) return [one];
  return [];
}

/**
 * Extract description from raw (multiple common field names).
 */
function pickDescription(raw) {
  if (!raw || typeof raw !== "object") return "";
  const s = raw.description ?? raw.details ?? raw.remarks ?? raw.longDescription ?? raw.summary ?? "";
  return typeof s === "string" ? s.trim() : "";
}

/**
 * Normalize a raw listing from RentCast (or similar API) to our listing_cache / display shape.
 * Maps many common field variants so live data surfaces fully.
 * @param {object} raw - Raw response item from RentCast API
 * @returns {object} Normalized listing for listing_cache
 */
function normalizeListing(raw) {
  if (!raw || typeof raw !== "object") return null;
  const externalId = raw.id ?? raw.listingId ?? raw.listing_id ?? raw.propertyId ?? "";
  if (externalId === "") return null;

  return {
    external_id: String(externalId),
    source: SOURCE,
    neighborhood_slug: mapRegionToSlug(raw.region ?? raw.neighborhood ?? raw.area ?? raw.subdivision ?? raw.community),
    address: pickAddress(raw),
    city: raw.city ?? raw.cityName ?? "",
    state: raw.state ?? raw.stateCode ?? "CA",
    zip: raw.zip ?? raw.zipCode ?? raw.postalCode ?? "",
    price: raw.price != null ? Number(raw.price) : (raw.listPrice != null ? Number(raw.listPrice) : null),
    beds: raw.beds != null ? Number(raw.beds) : (raw.bedrooms != null ? Number(raw.bedrooms) : null),
    baths: raw.baths != null ? Number(raw.baths) : (raw.bathrooms != null ? Number(raw.bathrooms) : null),
    sqft: raw.sqft != null ? Number(raw.sqft) : (raw.squareFootage != null ? Number(raw.squareFootage) : raw.sqftLiving != null ? Number(raw.sqftLiving) : null),
    lot_sqft: raw.lotSqft != null ? Number(raw.lotSqft) : (raw.lotSize != null ? Number(raw.lotSize) : raw.lotSquareFootage != null ? Number(raw.lotSquareFootage) : null),
    property_type: raw.propertyType ?? raw.type ?? raw.property_type ?? raw.homeType ?? null,
    status: raw.status ?? raw.listingStatus ?? raw.statusType ?? "active",
    listing_url: raw.url ?? raw.listingUrl ?? raw.link ?? raw.detailsUrl ?? null,
    raw_json: raw,
  };
}

function mapRegionToSlug(region) {
  if (!region || typeof region !== "string") return null;
  return region.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/**
 * Search listings (e.g. by city, zip, or bounds). Fails gracefully if API key missing.
 * TODO: RentCast free tier may expose /listings or /properties; adjust path and query params. Fields in response may differ — use normalizeListing() to unify.
 * @param {object} options - { city?, zip?, state?, limit?, offset? }
 * @returns {Promise<Array>} Normalized listings; [] if key missing or error
 */
async function searchListings(options = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[RentCast] RENTCAST_API_KEY not set — listings will use placeholder fallback.");
    }
    return [];
  }
  try {
    const baseUrl = process.env.RENTCAST_BASE_URL || "https://api.rentcast.io/v1";
    const params = new URLSearchParams();
    if (options.city) params.set("city", options.city);
    if (options.zip) params.set("zipCode", options.zip);
    if (options.state) params.set("state", options.state);
    if (options.limit != null) params.set("limit", String(options.limit));
    if (options.offset != null) params.set("offset", String(options.offset));
    const url = `${baseUrl}/listings?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[RentCast] searchListings non-OK:", res.status, res.statusText, "— using placeholder fallback.");
      }
      return [];
    }
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.listings ?? data.results ?? data.data ?? []);
    const out = list.map((item) => normalizeListing(item)).filter(Boolean);
    if (process.env.NODE_ENV === "development" && out.length > 0) {
      console.log("[RentCast] Live listings returned:", out.length);
    }
    return out;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[RentCast] searchListings error:", e?.message ?? e, "— using placeholder fallback.");
    }
    return [];
  }
}

/**
 * Get a single listing by external id. Fails gracefully if API key missing.
 * TODO: RentCast may use GET /listings/:id or /properties/:id; response shape may differ from search — normalize with normalizeListing().
 * @param {string} id - External listing id (RentCast id)
 * @returns {Promise<object|null>} Normalized listing or null
 */
async function getListingById(id) {
  const apiKey = getApiKey();
  if (!apiKey || !id) return null;
  try {
    const baseUrl = process.env.RENTCAST_BASE_URL || "https://api.rentcast.io/v1";
    const res = await fetch(`${baseUrl}/listings/${encodeURIComponent(id)}`, {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[RentCast] getListingById", id, res.status, "— falling back to placeholder if available.");
      }
      return null;
    }
    const raw = await res.json();
    return normalizeListing(raw);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[RentCast] getListingById error:", e?.message ?? e);
    }
    return null;
  }
}

module.exports = {
  getApiKey,
  isConfigured,
  searchListings,
  getListingById,
  normalizeListing,
  pickPhotos,
  pickDescription,
  SOURCE,
};
