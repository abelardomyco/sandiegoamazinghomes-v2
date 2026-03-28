import { join } from "path";

/**
 * Paths for `public/images/sdah photos to use/` (gallery subfolder, optional Instaloader sync).
 * Not Instagram-specific — shared disk location for homepage gallery assets.
 */
export function getSdahPhotosFolderConstants(cwd = process.cwd()) {
  const dir = join(cwd, "public", "images", "sdah photos to use");
  const base = "/images/sdah%20photos%20to%20use";
  return { SDAH_PHOTOS_DIR: dir, SDAH_PHOTOS_BASE: base };
}
