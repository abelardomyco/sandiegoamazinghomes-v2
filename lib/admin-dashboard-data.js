const { createServerClient } = require("./supabase");
const {
  getBlogIndex,
  getNeighborhoodIndex,
  getNeighborhoodBySlug,
  getBlogBySlug,
} = require("./content");
const { getNeighborhoodHeroPath, FALLBACK_BANNER } = require("./neighborhood-images");
const { readFileSync, existsSync, readdirSync } = require("fs");
const { join } = require("path");

const SITE = "sandiegoamazinghomes";
const SDAH_DIR = join(process.cwd(), "public", "images", "sdah photos to use");

/**
 * @returns {Promise<{ ok: boolean, reason?: string, rows: object[] }>}
 */
async function getRecentContacts() {
  const supabase = createServerClient();
  if (!supabase) {
    return { ok: false, reason: "Supabase not configured (URL/key).", rows: [] };
  }
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("created_at, email, name, message, source, site")
    .eq("site", SITE)
    .order("created_at", { ascending: false })
    .limit(25);
  if (error) {
    return {
      ok: false,
      reason: `${error.message} (use SUPABASE_SERVICE_ROLE_KEY if RLS blocks reads.)`,
      rows: [],
    };
  }
  return { ok: true, rows: data || [] };
}

function getMarketNotesSnippet() {
  const p = join(process.cwd(), "content", "admin", "market-notes.md");
  if (!existsSync(p)) {
    return {
      exists: false,
      text: "Create `content/admin/market-notes.md` for internal market reminders (shown here only).",
    };
  }
  const raw = readFileSync(p, "utf8").trim();
  return { exists: true, text: raw.length > 2500 ? `${raw.slice(0, 2500)}…` : raw };
}

function countSdahPhotoFiles() {
  try {
    if (!existsSync(SDAH_DIR)) return { count: 0, note: "Folder missing" };
    const n = readdirSync(SDAH_DIR).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f)).length;
    return { count: n, note: `${SDAH_DIR.replace(process.cwd(), "")}` };
  } catch (e) {
    return { count: 0, note: e.message };
  }
}

function getBlogInventory() {
  const index = getBlogIndex();
  return index.map((p) => ({
    slug: p.slug,
    title: p.title || "",
    date: p.date || "",
    category: p.category || "",
    hasMd: !!getBlogBySlug(p.slug),
  }));
}

function getNeighborhoodInventory() {
  const index = getNeighborhoodIndex();
  return index.map((n) => {
    const data = getNeighborhoodBySlug(n.slug);
    const hero = getNeighborhoodHeroPath(n.slug, n.region);
    return {
      slug: n.slug,
      name: n.name,
      region: n.region,
      hasMd: !!data,
      heroIsPlaceholder: hero === FALLBACK_BANNER,
    };
  });
}

/**
 * @returns {Promise<object>}
 */
async function loadAdminDashboardSnapshot() {
  const [contacts, blogRows, neighborhoodRows, sdahPhotos, marketNotes] = await Promise.all([
    getRecentContacts(),
    Promise.resolve(getBlogInventory()),
    Promise.resolve(getNeighborhoodInventory()),
    Promise.resolve(countSdahPhotoFiles()),
    Promise.resolve(getMarketNotesSnippet()),
  ]);

  const placeholderNeighborhoods = neighborhoodRows.filter((n) => n.heroIsPlaceholder).length;

  return {
    contacts,
    blog: {
      count: blogRows.length,
      missingMd: blogRows.filter((b) => !b.hasMd).length,
      rows: blogRows.slice(0, 12),
    },
    neighborhoods: {
      count: neighborhoodRows.length,
      missingMd: neighborhoodRows.filter((n) => !n.hasMd).length,
      placeholderHeroes: placeholderNeighborhoods,
      rows: neighborhoodRows.slice(0, 12),
    },
    assets: sdahPhotos,
    marketNotes,
    analytics: {
      status: "not_configured",
      recommendation:
        "Privacy-friendly options: Plausible Analytics, Cloudflare Web Analytics, or Vercel Analytics (no raw IP storage as primary product surface). Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN + add script in root layout when ready.",
    },
    seoNote:
      "See docs/Admin-Dashboard-SEO-Launch-2026-03-26.md and docs/Publishing-Readiness-sandiegoamazinghomes-2026-03-26.md. This dashboard does not store visitor IPs.",
  };
}

module.exports = { loadAdminDashboardSnapshot };
