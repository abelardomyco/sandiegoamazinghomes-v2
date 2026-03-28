const { readFileSync, existsSync } = require("fs");
const { join } = require("path");

const DATA_DIR = join(process.cwd(), "data");
const LISTINGS_PATH = join(DATA_DIR, "listings.json");

let _listingsCache = null;

function loadListings() {
  if (_listingsCache) return _listingsCache;
  if (!existsSync(LISTINGS_PATH)) {
    _listingsCache = [];
    return _listingsCache;
  }
  const raw = readFileSync(LISTINGS_PATH, "utf-8");
  try {
    _listingsCache = JSON.parse(raw);
    return Array.isArray(_listingsCache) ? _listingsCache : [];
  } catch {
    _listingsCache = [];
    return _listingsCache;
  }
}

/**
 * @param {object} filters - { priceMin?, priceMax?, bedsMin?, bathsMin?, propertyType?, neighborhood?, neighborhoods? }
 *   neighborhoods: array of slugs — list only in these areas (overrides single neighborhood when both set).
 * @returns {Array} listing objects
 */
function getListings(filters = {}) {
  let list = loadListings();
  const {
    priceMin,
    priceMax,
    bedsMin,
    bathsMin,
    propertyType,
    neighborhood,
    neighborhoods,
  } = filters;

  if (Array.isArray(neighborhoods) && neighborhoods.length > 0) {
    const set = new Set(neighborhoods.map((s) => String(s).trim()).filter(Boolean));
    list = list.filter((l) => set.has(String(l.neighborhood || "").trim()));
  } else if (neighborhood && neighborhood !== "") {
    list = list.filter((l) => (l.neighborhood || "") === neighborhood);
  }

  if (priceMin != null && priceMin !== "") {
    const p = Number(priceMin);
    if (!Number.isNaN(p)) list = list.filter((l) => l.price >= p);
  }
  if (priceMax != null && priceMax !== "") {
    const p = Number(priceMax);
    if (!Number.isNaN(p)) list = list.filter((l) => l.price <= p);
  }
  if (bedsMin != null && bedsMin !== "") {
    const b = Number(bedsMin);
    if (!Number.isNaN(b)) list = list.filter((l) => (l.beds || 0) >= b);
  }
  if (bathsMin != null && bathsMin !== "") {
    const b = Number(bathsMin);
    if (!Number.isNaN(b)) list = list.filter((l) => (l.baths || 0) >= b);
  }
  if (propertyType && propertyType !== "") {
    list = list.filter((l) => (l.propertyType || "").toLowerCase() === propertyType.toLowerCase());
  }

  return list;
}

/**
 * @param {string} id
 * @returns {object|null} listing or null
 */
function getListingById(id) {
  if (!id) return null;
  const list = loadListings();
  return list.find((l) => String(l.id) === String(id)) || null;
}

/**
 * Unique property types from listings (for filter dropdown).
 */
function getPropertyTypes() {
  const list = loadListings();
  const set = new Set(list.map((l) => l.propertyType).filter(Boolean));
  return Array.from(set).sort();
}

/**
 * Neighborhood slugs that appear in listings (for filter dropdown).
 * Can be merged with full neighborhood list from content if desired.
 */
function getNeighborhoodSlugsFromListings() {
  const list = loadListings();
  const set = new Set(list.map((l) => l.neighborhood).filter(Boolean));
  return Array.from(set).sort();
}

module.exports = {
  getListings,
  getListingById,
  getPropertyTypes,
  getNeighborhoodSlugsFromListings,
  loadListings,
};
