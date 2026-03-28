import { getNeighborhoodIndex } from "@/lib/content";
import { getNeighborhoodHeroPath } from "@/lib/neighborhood-images";
import NeighborhoodList from "@/components/neighborhoods/NeighborhoodList";

const siteUrl =
  (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://sandiegoamazinghomes.com";

export const metadata = {
  title: "Neighborhoods",
  description:
    "Explore San Diego neighborhoods—Coastal, Urban Core, North County. Find your fit with our liveability dashboards.",
  alternates: { canonical: `${siteUrl.replace(/\/$/, "")}/neighborhoods` },
  openGraph: {
    title: "San Diego neighborhood guides | San Diego Amazing Homes",
    description:
      "Coastal, urban, and suburban areas—liveability notes to help you compare before you buy or sell.",
    type: "website",
    url: `${siteUrl.replace(/\/$/, "")}/neighborhoods`,
  },
};

export default function NeighborhoodsPage() {
  const index = getNeighborhoodIndex();
  const neighborhoods = index.map((n) => ({
    ...n,
    heroImage: getNeighborhoodHeroPath(n.slug, n.region),
    heroImageResolved: getNeighborhoodHeroPath(n.slug, n.region),
  }));

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">
          Neighborhood Liveability Dashboard
        </h1>
        <p className="text-slate-600 mt-2">
          Explore San Diego areas by vibe, region, and lifestyle. No scores—just
          curated notes to help you find your fit.
        </p>
      </div>
      <NeighborhoodList neighborhoods={neighborhoods} />
    </div>
  );
}
