import { getPublicSiteUrl } from "@/lib/public-site-url";

export default function SiteJsonLd() {
  const url = getPublicSiteUrl();

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: "Rosamelia Lopez-Platt",
      url,
      description:
        "REALTOR® serving San Diego County — La Jolla, Del Mar, Coronado, Rancho Santa Fe, and surrounding areas.",
      worksFor: {
        "@type": "Organization",
        name: "Royal California Real Estate",
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "San Diego County",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "San Diego Amazing Homes",
      url,
      publisher: {
        "@type": "Organization",
        name: "San Diego Amazing Homes",
        url,
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
