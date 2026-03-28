const { existsSync, readdirSync } = require("fs");
const { join } = require("path");

/**
 * Neighborhood image resolution order:
 * 1) public/images/neighborhoods/{slug}/ (e.g. hero.jpg, then lifestyle, homes, etc.)
 * 2) Curated area photos: public/images/sdah photos to use/Areas/ (filename map by slug)
 * 3) Region fallback: public/images/neighborhoods/_fallbacks/{region-slug}/
 * 4) Global banner (FALLBACK_BANNER). Missing slug folders are not auto-created.
 */

/** Preferred image names in order (hero first). Up to 5 images per neighborhood. */
const PREFERRED_NAMES = ["hero", "lifestyle", "homes", "coast", "village", "map"];
const MAX_IMAGES = 5;
const FALLBACK_BANNER = "/images/placeholder-listing.svg";

/** Region slug for area-specific fallback (e.g. Coastal -> coastal). */
const REGION_TO_FALLBACK_SLUG = {
  Coastal: "coastal",
  "North County": "north-county",
  "Urban Core": "urban-core",
  "South Bay": "south-bay",
  Inland: "inland",
};

function getImageExtensions() {
  return [".jpg", ".jpeg", ".webp", ".png"];
}

function hasValidImageExt(name) {
  const lower = name.toLowerCase();
  return getImageExtensions().some((ext) => lower.endsWith(ext));
}

function getAreasResolved() {
  const base = join(process.cwd(), "public", "images", "sdah photos to use");
  for (const folderName of ["Areas", "areas"]) {
    const dir = join(base, folderName);
    if (existsSync(dir)) return { dir, folderName };
  }
  return null;
}

/**
 * Map neighborhood slug → image filenames under Areas/ (titles match client-provided assets).
 * Only files that exist on disk are used. Order = carousel order (first = hero).
 */
const AREAS_FILES_BY_SLUG = {
  "la-jolla": ["la jolla.PNG", "la jolla 2.PNG", "la jolla house.PNG"],
  "del-mar": ["del mar.PNG"],
  coronado: ["coronado.PNG"],
  encinitas: ["encinitas.PNG"],
  "rancho-santa-fe": ["rancho santa fe.PNG"],
  "carmel-valley": ["carmel valley.PNG"],
  "north-park": ["north park 2.PNG"],
  "downtown-san-diego": ["downtown san diego.PNG"],
  "mission-valley": ["mission valley.PNG"],
  clairemont: ["clairemont.PNG"],
  "bay-park": ["bay park.PNG"],
  "point-loma": ["point loma.PNG"],
  "pacific-beach": ["pacific beach.PNG"],
  "scripps-ranch": ["scripps ranch.PNG"],
  "la-mesa": ["la mesa.PNG"],
  "chula-vista": ["chula vista.PNG"],
  eastlake: ["eastlake.PNG"],
  otay: ["otay ranch.PNG", "otay ranch 2.PNG"],
  "imperial-beach": ["imperial beach.PNG"],
  "national-city": ["national city.PNG"],
  "el-cajon": ["el cajon.PNG"],
  /** Present in Areas; use if added to neighborhood index */
  carlsbad: ["carlsbad.PNG", "Carlsbad sign.PNG", "carlsbad sign(1).PNG"],
  "solana-beach": ["solana beach.PNG"],
};

function areasPublicPath(filename, folderSegment) {
  const seg1 = encodeURIComponent("sdah photos to use");
  const seg2 = encodeURIComponent(folderSegment);
  const seg3 = encodeURIComponent(filename);
  return `/images/${seg1}/${seg2}/${seg3}`;
}

function getAreasImagePaths(slug) {
  if (!slug || typeof slug !== "string") return [];
  const filenames = AREAS_FILES_BY_SLUG[slug];
  if (!filenames?.length) return [];
  const resolved = getAreasResolved();
  if (!resolved) return [];
  const { dir, folderName } = resolved;
  const out = [];
  for (const name of filenames) {
    const full = join(dir, name);
    if (existsSync(full)) {
      out.push(areasPublicPath(name, folderName));
      if (out.length >= MAX_IMAGES) break;
    }
  }
  return out;
}

function toPublicPath(slug, filename) {
  return `/images/neighborhoods/${slug}/${filename}`;
}

/**
 * Get 3–5 curated image paths for a neighborhood from public/images/neighborhoods/{slug}/,
 * or from public/images/sdah photos to use/{Areas|areas}/ when the slug folder is missing or empty.
 * Uses preferred names first (hero, lifestyle, homes, …), then other images, sorted.
 * Returns at most MAX_IMAGES paths.
 *
 * @param {string} slug - Neighborhood slug (e.g. "la-jolla")
 * @returns {string[]} - Paths like ["/images/neighborhoods/la-jolla/hero.jpg", ...]
 */
function getNeighborhoodImagePaths(slug) {
  if (!slug || typeof slug !== "string") return [];
  const dir = join(process.cwd(), "public", "images", "neighborhoods", slug);
  if (existsSync(dir)) {
    const dirents = readdirSync(dir, { withFileTypes: true });
    const files = dirents
      .filter((f) => f.isFile() && hasValidImageExt(f.name))
      .map((f) => f.name);
    const byBase = {};
    files.forEach((f) => {
      const base = f.replace(/\.(jpe?g|webp|png)$/i, "").toLowerCase();
      if (!byBase[base]) byBase[base] = f;
    });
    const paths = [];
    for (const name of PREFERRED_NAMES) {
      if (byBase[name]) {
        paths.push(toPublicPath(slug, byBase[name]));
        delete byBase[name];
      }
    }
    const rest = Object.values(byBase).sort((a, b) => a.localeCompare(b));
    for (const f of rest) {
      if (paths.length >= MAX_IMAGES) break;
      paths.push(toPublicPath(slug, f));
    }
    if (paths.length > 0) return paths.slice(0, MAX_IMAGES);
  }
  return getAreasImagePaths(slug).slice(0, MAX_IMAGES);
}

/**
 * First image (hero) for a neighborhood. Area-specific fallback then global banner.
 * @param {string} slug - Neighborhood slug
 * @param {string} [region] - Optional region (e.g. "Coastal") for area fallback
 * @returns {string}
 */
function getNeighborhoodHeroPath(slug, region) {
  const paths = getNeighborhoodImagePaths(slug);
  if (paths.length > 0) return paths[0];
  const fallbackSlug = region && REGION_TO_FALLBACK_SLUG[region];
  if (fallbackSlug) {
    const fallbackDir = join(process.cwd(), "public", "images", "neighborhoods", "_fallbacks", fallbackSlug);
    if (existsSync(fallbackDir)) {
      const dirents = readdirSync(fallbackDir, { withFileTypes: true });
      const first = dirents.find((f) => f.isFile() && hasValidImageExt(f.name));
      if (first) return `/images/neighborhoods/_fallbacks/${fallbackSlug}/${first.name}`;
    }
  }
  return FALLBACK_BANNER;
}

module.exports = {
  getNeighborhoodImagePaths,
  getNeighborhoodHeroPath,
  FALLBACK_BANNER,
  PREFERRED_NAMES,
  MAX_IMAGES,
  REGION_TO_FALLBACK_SLUG,
};
