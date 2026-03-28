import { getPublicSiteUrl } from "@/lib/public-site-url";

/** @type {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  const BASE = getPublicSiteUrl();
  const { getBlogIndex, getNeighborhoodIndex } = require("@/lib/content");
  const blogPosts = getBlogIndex();
  const blogUrls = (blogPosts || []).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const neighborhoods = getNeighborhoodIndex();
  const neighborhoodUrls = (neighborhoods || []).map((n) => ({
    url: `${BASE}/neighborhoods/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...blogUrls,
    { url: `${BASE}/market`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/neighborhoods`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...neighborhoodUrls,
  ];
}
