import { getPublicSiteUrl } from "@/lib/public-site-url";

/** @type {import('next').MetadataRoute.Robots} */
export default function robots() {
  const base = getPublicSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
