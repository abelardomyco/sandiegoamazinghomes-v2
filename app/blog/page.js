import Link from "next/link";
import Image from "next/image";
import { getBlogIndex } from "@/lib/content";
import { getBlogSunsetHeroPath } from "@/lib/blog-hero-image";
import { FileText } from "lucide-react";

const siteUrl =
  (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://sandiegoamazinghomes.com";

export const metadata = {
  title: "Blog",
  description:
    "San Diego real estate insights for buyers and relocators: first-time buying, neighborhoods, schools, and market tips.",
  alternates: { canonical: `${siteUrl.replace(/\/$/, "")}/blog` },
  openGraph: {
    title: "San Diego real estate blog | San Diego Amazing Homes",
    description:
      "Practical articles for buyers and relocators—neighborhoods, schools, first-time buying, and local market context.",
    type: "website",
    url: `${siteUrl.replace(/\/$/, "")}/blog`,
  },
};

function formatBlogDate(dateStr, short = false) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", short
    ? { month: "short", day: "numeric", year: "numeric" }
    : { month: "long", day: "numeric", year: "numeric" });
}

export default function BlogIndexPage() {
  const posts = getBlogIndex();
  const heroSrc = getBlogSunsetHeroPath();

  return (
    <div className="space-y-8">
      <div className="relative w-full aspect-video max-h-[min(40vh,22.5rem)] sm:max-h-[min(42vh,26rem)] rounded-xl overflow-hidden border border-slate-200 bg-slate-800 shadow-sm">
        {heroSrc ? (
          <>
            <Image
              src={heroSrc}
              alt="San Diego at sunset"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1152px) 100vw, 1152px"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/20 to-slate-900/10 pointer-events-none"
              aria-hidden
            />
          </>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-700 via-sd-800 to-slate-900"
            aria-hidden
          />
        )}
        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-5 pb-3 sm:pb-4 pt-12 sm:pt-16 flex items-end">
          <p className="text-sm sm:text-base font-semibold text-white tracking-wide drop-shadow-md">
            San Diego Real Estate Insights
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-sd-600 flex-shrink-0" />
          Blog
        </h1>
        <p className="text-slate-600 mt-1.5 text-sm max-w-2xl leading-relaxed">
          Practical notes for buyers and relocators—neighborhoods, schools, first-time buying, and what the market is doing locally. See the{" "}
          <Link href="/market" className="text-sd-600 font-medium hover:underline">
            market dashboard
          </Link>{" "}
          and{" "}
          <Link href="/neighborhoods" className="text-sd-600 font-medium hover:underline">
            neighborhood guides
          </Link>
          .
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">All articles</h2>
        <ul className="space-y-3">
          {posts.filter((post) => post && post.slug).map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="flex flex-wrap items-baseline gap-2 rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-sd-200 hover:shadow-md transition-all"
              >
                <span className="font-semibold text-slate-900">{post.title || "Article"}</span>
                {formatBlogDate(post.date, true) && (
                  <span className="text-slate-500 text-sm">
                    {formatBlogDate(post.date, true)}
                  </span>
                )}
                {post.category && (
                  <span className="text-xs font-medium text-sd-700 uppercase tracking-wide">
                    {post.category}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {posts.length === 0 && (
        <p className="text-slate-600 py-6 rounded-xl bg-slate-50 border border-slate-200 px-4 text-center">
          No articles yet. Check back soon.
        </p>
      )}
    </div>
  );
}
