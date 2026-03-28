/**
 * Listing images service.
 * Reads/writes listing_images table (per listing_cache id).
 * TODO: Production — populate from adapter image URLs; optional Supabase Storage for uploads.
 */

// Dynamic require for ESM compat; createServerClient may be export default
const getSupabase = () => {
  try {
    const mod = require("../supabase");
    return (mod.createServerClient || mod.default?.createServerClient)?.();
  } catch {
    return null;
  }
};

/**
 * Get images for a listing by listing_cache id.
 * @param {string} listingId - UUID from listing_cache
 * @returns {Promise<Array<{ url, sort_order, caption }>>}
 */
async function getImagesByListingId(listingId) {
  const supabase = getSupabase();
  if (!supabase || !listingId) return [];

  const { data, error } = await supabase
    .from("listing_images")
    .select("url, sort_order, caption")
    .eq("listing_id", listingId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[listings/images] getImagesByListingId error:", error);
    return [];
  }
  return data || [];
}

/**
 * Insert or replace images for a listing.
 * @param {string} listingId - UUID from listing_cache
 * @param {Array<{ url: string, sort_order?: number, caption?: string }>} images
 */
async function setImagesForListing(listingId, images) {
  const supabase = getSupabase();
  if (!supabase || !listingId || !Array.isArray(images)) return;

  await supabase.from("listing_images").delete().eq("listing_id", listingId);
  if (images.length === 0) return;

  const rows = images.map((img, i) => ({
    listing_id: listingId,
    url: img.url,
    sort_order: img.sort_order ?? i,
    caption: img.caption ?? null,
  }));
  await supabase.from("listing_images").insert(rows);
}

module.exports = {
  getImagesByListingId,
  setImagesForListing,
};
