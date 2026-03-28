import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getBlogBySlug, getBlogIndex } from "@/lib/content";
import { ArrowLeft, Calendar } from "lucide-react";

const siteUrl =
  (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://sandiegoamazinghomes.com";

export const dynamicParams = true;

export async function generateStaticParams() {
  const index = getBlogIndex();
  return index.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const resolved = params && typeof params.then === "function" ? await params : params || {};
  const slug = resolved.slug;
  if (!slug) return { title: "Blog" };
  const post = getBlogBySlug(slug);
  if (!post?.meta?.title) return { title: "Blog" };
  const title = post.meta.title;
  const description =
    (typeof post.meta.excerpt === "string" && post.meta.excerpt.trim()) ||
    (typeof post.body === "string" ? post.body.replace(/\s+/g, " ").trim().slice(0, 160) : "");
  const canonical = `${siteUrl.replace(/\/$/, "")}/blog/${slug}`;
  return {
    title,
    description: description || undefined,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${title} | San Diego Amazing Homes`,
      description: description || undefined,
      url: canonical,
      publishedTime: post.meta.date || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | San Diego Amazing Homes`,
      description: description || undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const resolved = params && typeof params.then === "function" ? await params : params || {};
  const slug = resolved.slug;
  if (!slug) notFound();

  const data = getBlogBySlug(slug);
  if (!data) notFound();

  const meta = data.meta || {};
  const body = typeof data.body === "string" ? data.body : "";
  const dateStr = meta.date;
  const isValidDate = dateStr && typeof dateStr === "string" && !Number.isNaN(new Date(dateStr).getTime());
  const formattedDate = isValidDate
    ? new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const index = getBlogIndex();
  const currentIndex = index.findIndex((p) => p && p.slug === slug);
  const prevPost = currentIndex > 0 ? index[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < index.length - 1 ? index[currentIndex + 1] : null;

  const pageUrl = `${siteUrl.replace(/\/$/, "")}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title || slug,
    datePublished: meta.date || undefined,
    author: { "@type": "Person", name: "Rosamelia Lopez-Platt" },
    publisher: {
      "@type": "Organization",
      name: "San Diego Amazing Homes",
      url: siteUrl.replace(/\/$/, ""),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    description:
      (typeof meta.excerpt === "string" && meta.excerpt) ||
      (body ? body.replace(/\s+/g, " ").trim().slice(0, 300) : undefined),
  };

  return (
    <div className="max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="space-y-6">
        <header className="border-b border-slate-200 pb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sd-600 hover:text-sd-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {meta.title || slug}
          </h1>
          {formattedDate && (
            <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </p>
          )}
          {meta.category && (
            <span className="inline-block mt-2 text-xs font-semibold text-sd-700 uppercase tracking-wider">
              {meta.category}
            </span>
          )}
        </header>

        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-sd-600 prose-blockquote:border-sd-500 prose-blockquote:bg-sd-50 prose-blockquote:py-1 prose-blockquote:rounded">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>

        <footer className="pt-6 border-t border-slate-200 space-y-4">
          <p className="text-sm text-slate-600">
            Explore:{" "}
            <Link href="/market" className="font-medium text-sd-600 hover:underline">
              Market snapshot
            </Link>
            {" · "}
            <Link href="/neighborhoods" className="font-medium text-sd-600 hover:underline">
              Neighborhood guides
            </Link>
            {" · "}
            <Link href="/#contact" className="font-medium text-sd-600 hover:underline">
              Contact
            </Link>
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/blog" className="text-sm font-medium text-sd-600 hover:underline">
            All articles
          </Link>
          <nav className="flex gap-4 text-sm" aria-label="Previous and next posts">
            {prevPost && (
              <Link href={`/blog/${prevPost.slug}`} className="text-sd-600 hover:underline">
                ← {prevPost.title}
              </Link>
            )}
            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`} className="text-sd-600 hover:underline ml-auto">
                {nextPost.title} →
              </Link>
            )}
          </nav>
          </div>
        </footer>
      </article>
    </div>
  );
}
