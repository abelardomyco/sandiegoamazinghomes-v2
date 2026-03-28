import Link from "next/link";
import Image from "next/image";
import { getNeighborhoodIndex } from "@/lib/content";
import { getNeighborhoodHeroPath } from "@/lib/neighborhood-images";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Your matches",
  description: "Neighborhood matches based on your preferences.",
  robots: { index: false, follow: true },
};

export default async function MatchesPage({ searchParams }) {
  const resolved =
    searchParams && typeof searchParams.then === "function"
      ? await searchParams
      : searchParams || {};
  const slugsParam = resolved.slugs || "";
  const scoresParam = resolved.scores || "";
  const slugs = slugsParam
    ? slugsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const scores = scoresParam
    ? scoresParam.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n))
    : [];

  const index = getNeighborhoodIndex();
  const matched = slugs.length
    ? slugs.map((slug, i) => {
        const n = index.find((ne) => ne.slug === slug);
        return n
          ? {
              ...n,
              fitPercent: scores[i] ?? 100,
              heroImage: getNeighborhoodHeroPath(n.slug, n.region),
            }
          : null;
      }).filter(Boolean)
    : index.slice(0, 3).map((n) => ({
        ...n,
        fitPercent: null,
        heroImage: getNeighborhoodHeroPath(n.slug, n.region),
      }));

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Your neighborhood matches
        </h1>
        <p className="text-slate-600 mt-2">
          Based on your preferences, here are neighborhoods worth exploring.
          Click through to see the full dashboard.
        </p>
      </div>

      <ul className="space-y-6">
        {matched.map((n, i) => (
          <li key={n.slug}>
            <Link
              href={`/neighborhoods/${n.slug}`}
              className="block rounded-xl border-2 border-slate-200 bg-white overflow-hidden shadow-card card-hover"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-40 sm:h-auto sm:min-h-[180px] shrink-0 bg-slate-200">
                  <Image
                    src={n.heroImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                  <span className="absolute top-2 left-2 flex h-10 w-10 items-center justify-center rounded-full bg-sd-600 text-white font-bold text-lg shadow">
                    {i + 1}
                  </span>
                  {n.fitPercent != null && (
                    <span className="absolute top-2 right-2 rounded-lg bg-white/95 px-2 py-1 text-sm font-semibold text-sd-700 shadow">
                      {n.fitPercent}% fit
                    </span>
                  )}
                </div>
                <div className="p-4 sm:p-5 flex-1 min-w-0">
                  <h2 className="font-bold text-slate-900 text-lg">{n.name}</h2>
                  {n.region && (
                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {n.region}
                    </p>
                  )}
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {n.shortIntro}
                  </p>
                  {n.vibeTags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {n.vibeTags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-sd-600">
                    View dashboard
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {matched.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
          <p className="text-slate-600 font-medium">No matches yet.</p>
          <Link
            href="/matchmaker"
            className="inline-block mt-3 text-sd-600 hover:underline font-semibold"
          >
            Take the Matchmaker
          </Link>{" "}
          to get personalized suggestions.
        </div>
      )}

      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
        <p className="text-slate-700 font-medium mb-3">
          Ready to see homes or dig deeper?
        </p>
        <Link href="/#contact" className="btn-primary">
          Contact Rosamelia
        </Link>
      </div>
    </div>
  );
}
