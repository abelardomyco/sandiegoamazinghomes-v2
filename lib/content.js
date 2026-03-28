const { readFileSync, existsSync } = require("fs");
const { join } = require("path");
const matter = require("gray-matter");

const CONTENT_DIR = join(process.cwd(), "content");
const NEIGHBORHOODS_DIR = join(CONTENT_DIR, "neighborhoods");
const NEWSLETTER_DIR = join(CONTENT_DIR, "newsletter");
const BLOG_DIR = join(CONTENT_DIR, "blog");
const EVENTS_DIR = join(CONTENT_DIR, "events");

function readJson(path) {
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * @returns {Array<{ slug: string, name: string, region: string, vibeTags: string[], heroImage: string, shortIntro: string, featured: boolean }>}
 */
function getNeighborhoodIndex() {
  const path = join(NEIGHBORHOODS_DIR, "_index.json");
  const data = readJson(path);
  return Array.isArray(data) ? data : [];
}

/**
 * @param {string} slug
 * @returns {{ meta: object, body: string, slug: string } | null}
 */
function getNeighborhoodBySlug(slug) {
  if (!slug) return null;
  const mdPath = join(NEIGHBORHOODS_DIR, `${slug}.md`);
  if (!existsSync(mdPath)) return null;
  const raw = readFileSync(mdPath, "utf-8");
  const { data: meta, content: body } = matter(raw);
  const index = getNeighborhoodIndex().find((n) => n.slug === slug);
  return {
    meta: { ...index, ...meta },
    body: body.trim(),
    slug,
  };
}

/**
 * @returns {Array<{ slug: string, title: string, date: string }>}
 */
function getNewsletterIndex() {
  const path = join(NEWSLETTER_DIR, "_index.json");
  const data = readJson(path);
  return Array.isArray(data) ? data : [];
}

/**
 * @param {string} slug - e.g. "2026-03"
 * @returns {{ meta: object, body: string, slug: string } | null}
 */
function getNewsletterBySlug(slug) {
  if (!slug) return null;
  const mdPath = join(NEWSLETTER_DIR, `${slug}.md`);
  if (!existsSync(mdPath)) return null;
  const raw = readFileSync(mdPath, "utf-8");
  const { data: meta, content: body } = matter(raw);
  const index = getNewsletterIndex().find((n) => n.slug === slug);
  return {
    meta: { slug, ...index, ...meta },
    body: body.trim(),
    slug,
  };
}

/**
 * @returns {Array<{ slug: string, title: string, date: string, excerpt?: string, category?: string }>}
 */
function getBlogIndex() {
  const path = join(BLOG_DIR, "_list.json");
  const data = readJson(path);
  const list = Array.isArray(data) ? data : [];
  return list.filter((entry) => entry && entry.slug);
}

/**
 * @param {string} slug
 * @returns {{ meta: object, body: string, slug: string } | null}
 */
function getBlogBySlug(slug) {
  if (!slug || typeof slug !== "string") return null;
  const mdPath = join(BLOG_DIR, `${slug}.md`);
  if (!existsSync(mdPath)) return null;
  try {
    const raw = readFileSync(mdPath, "utf-8");
    const { data: meta, content: body } = matter(raw);
    const index = getBlogIndex().find((n) => n && n.slug === slug);
    return {
      meta: { slug, ...(index || {}), ...(meta || {}) },
      body: typeof body === "string" ? body.trim() : "",
      slug,
    };
  } catch {
    return null;
  }
}

/**
 * @param {string} slugOrYYYYMM - e.g. "2026-03"
 * @returns {{ lifestyleEvents: array, openHousesOrWorkshops: array, landAndEscapes: array } | null}
 */
function getEventsByMonth(slugOrYYYYMM) {
  if (!slugOrYYYYMM) return null;
  const jsonPath = join(EVENTS_DIR, `${slugOrYYYYMM}.json`);
  const data = readJson(jsonPath);
  if (!data || typeof data !== "object") return null;
  return {
    lifestyleEvents: Array.isArray(data.lifestyleEvents) ? data.lifestyleEvents : [],
    openHousesOrWorkshops: Array.isArray(data.openHousesOrWorkshops) ? data.openHousesOrWorkshops : [],
    landAndEscapes: Array.isArray(data.landAndEscapes) ? data.landAndEscapes : [],
  };
}

module.exports = {
  getNeighborhoodIndex,
  getNeighborhoodBySlug,
  getNewsletterIndex,
  getNewsletterBySlug,
  getBlogIndex,
  getBlogBySlug,
  getEventsByMonth,
};
