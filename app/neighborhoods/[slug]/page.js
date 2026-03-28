import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { getNeighborhoodBySlug, getNeighborhoodIndex } from "@/lib/content";
import { getNeighborhoodImagePaths, getNeighborhoodHeroPath } from "@/lib/neighborhood-images";
import { parseMarkdownSections, firstSentence } from "@/lib/markdown";
import LiveabilityScorecard from "@/components/neighborhoods/LiveabilityScorecard";
import NeighborhoodMap from "@/components/neighborhoods/NeighborhoodMap";
import NeighborhoodHeroCarousel from "@/components/neighborhoods/NeighborhoodHeroCarousel";
import LeadCaptureArea from "@/components/lead/LeadCaptureArea";

const siteUrl =
  (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://sandiegoamazinghomes.com";

export async function generateStaticParams() {
  const index = getNeighborhoodIndex();
  return index.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }) {
  const resolved = params && typeof params.then === "function" ? await params : params || {};
  const slug = resolved.slug;
  if (!slug) return { title: "Neighborhood" };
  const data = getNeighborhoodBySlug(slug);
  if (!data) return { title: "Neighborhood" };
  const name = data.meta.name || slug;
  const description =
    (typeof data.meta.shortIntro === "string" && data.meta.shortIntro) || `Living in ${name}, San Diego County.`;
  const canonical = `${siteUrl.replace(/\/$/, "")}/neighborhoods/${slug}`;
  return {
    title: `${name} neighborhood guide`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} | San Diego Amazing Homes`,
      description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | San Diego Amazing Homes`,
      description,
    },
  };
}

export default async function NeighborhoodDetailPage({ params }) {
  const resolved = params && typeof params.then === "function" ? await params : params || {};
  const slug = resolved.slug;
  if (!slug) notFound();
  const data = getNeighborhoodBySlug(slug);
  if (!data) notFound();

  const sections = parseMarkdownSections(data.body);
  const sectionBlurbs = {};
  Object.entries(sections).forEach(([title, content]) => {
    sectionBlurbs[title] = firstSentence(content);
  });

  const meta = data.meta;
  const heroImages = getNeighborhoodImagePaths(slug);
  const useCarousel = heroImages.length > 0;
  const heroFallbackSrc = getNeighborhoodHeroPath(slug, meta.region);

  return (
    <div className="space-y-6">
      {useCarousel ? (
        <NeighborhoodHeroCarousel
          images={heroImages}
          neighborhoodName={meta.name}
          slug={slug}
        >
          <h1 className="text-xl sm:text-2xl font-bold">{meta.name}</h1>
          {meta.region && (
            <p className="text-white/90 text-xs mt-0.5">{meta.region}</p>
          )}
        </NeighborhoodHeroCarousel>
      ) : (
        <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden bg-slate-200">
          <Image
            src={heroFallbackSrc}
            alt={`${meta.name} — neighborhood photo`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 bg-black/25 flex items-end">
            <div className="p-3 sm:p-4 text-white">
              <h1 className="text-xl sm:text-2xl font-bold">{meta.name}</h1>
              {meta.region && (
                <p className="text-white/90 text-xs mt-0.5">{meta.region}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="prose prose-slate prose-sm max-w-none">
        <ReactMarkdown>{data.body}</ReactMarkdown>
      </div>

      <LiveabilityScorecard
        neighborhood={meta}
        sectionBlurbs={sectionBlurbs}
      />

      <NeighborhoodMap />

      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Next steps</h2>
          <p className="text-slate-600 text-sm mb-3">
            See homes in {meta.name} or compare areas—take the Matchmaker or contact Rosamelia.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/#contact"
              className="inline-flex items-center rounded-lg border border-sd-600 bg-sd-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-sd-700 transition-colors"
            >
              Ask for listings
            </Link>
            <Link
              href="/matchmaker"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white text-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              Matchmaker
            </Link>
          </div>
        </div>
        <LeadCaptureArea areaName={meta.name} />
      </div>
    </div>
  );
}
