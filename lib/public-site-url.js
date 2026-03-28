/**
 * Canonical production origin for sitemap, robots, and absolute URLs.
 * Trailing slashes removed. VERCEL_URL is host-only — https:// is prepended.
 */
export function getPublicSiteUrl() {
  const fromEnv =
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const vercel = typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//i, "").replace(/\/+$/, "")}`;
  return "https://sandiegoamazinghomes.com";
}
