import { readFileSync, existsSync } from "fs";
import { join } from "path";

const GEO_PATH = join(process.cwd(), "data", "neighborhoods-geo.json");

/**
 * Load neighborhood GeoJSON for Mapbox (polygons by slug).
 * @returns {object|null} GeoJSON FeatureCollection or null
 */
export function getNeighborhoodGeoJson() {
  if (!existsSync(GEO_PATH)) return null;
  try {
    return JSON.parse(readFileSync(GEO_PATH, "utf-8"));
  } catch {
    return null;
  }
}
