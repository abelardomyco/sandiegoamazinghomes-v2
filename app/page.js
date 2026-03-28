import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import Link from "next/link";
import Image from "next/image";
import { Home, ExternalLink, Compass, FileText } from "lucide-react";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { getSdahPhotosFolderConstants } from "@/lib/sdah-photos-paths";
import { getPublicSiteUrl } from "@/lib/public-site-url";

const INSTAGRAM_HANDLE = "sandiegoamazinghomes";
const INSTAGRAM_URL = "https://www.instagram.com/sandiegoamazinghomes/";
const PARTNER_SITE = {
  name: "The Baja Land Company",
  url: "https://thebajalandcompany.com/",
  description: "Looking for land in Baja California, Mexico? Our partner helps you acquire land across the border—same region, different side.",
};

/**
 * Homepage gallery: `public/images/sdah photos to use/gallery/`.
 * **Featured order (LTR)** first, then every other image file in the folder (alphabetical).
 */
const HOME_GALLERY_FEATURED_SLOTS = [
  { candidates: ["Open house.png"], alt: "Open house" },
  { candidates: ["sold 1.png"], alt: "Recently sold San Diego home" },
  { candidates: ["sold coronado.png", "sold coronado.jpg"], alt: "Sold in Coronado" },
  { candidates: ["sold 4.jpg", "sold 4.png"], alt: "Recently sold San Diego home" },
  { candidates: ["sold 3.jpg", "sold 3.png", "sold 3.2.png"], alt: "Recently sold San Diego home" },
];

function isGalleryImageFilename(name) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(name) && !name.startsWith("._");
}

/** Human-ish caption for non-featured files (filename without extension). */
function galleryFilenameCaption(name) {
  return name.replace(/\.[^.]+$/i, "").replace(/_/g, " ");
}

/**
 * All gallery images: featured slots first (if present on disk), then remaining files A–Z.
 */
function getHomeGalleryImages() {
  const { SDAH_PHOTOS_DIR, SDAH_PHOTOS_BASE } = getSdahPhotosFolderConstants();
  const galleryDir = join(SDAH_PHOTOS_DIR, "gallery");
  const urlBase = `${SDAH_PHOTOS_BASE}/gallery`;
  if (!existsSync(galleryDir)) return [];

  const used = new Set();
  const featured = [];
  for (const slot of HOME_GALLERY_FEATURED_SLOTS) {
    const name = slot.candidates.find((n) => existsSync(join(galleryDir, n)));
    if (name) {
      used.add(name);
      featured.push({ path: `${urlBase}/${encodeURIComponent(name)}`, caption: slot.alt });
    }
  }

  let restNames = [];
  try {
    restNames = readdirSync(galleryDir).filter((n) => isGalleryImageFilename(n) && !used.has(n));
  } catch {
    return featured;
  }
  restNames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  const rest = restNames.map((name) => ({
    path: `${urlBase}/${encodeURIComponent(name)}`,
    caption: galleryFilenameCaption(name),
  }));

  return [...featured, ...rest];
}

const ROSAMELIA_BIO =
  "Rosamelia knows San Diego! She has been here for over 40 years and understands the niche markets throughout the county of San Diego—whether it is La Jolla, Del Mar, Coronado, Rancho Santa Fe, Downtown or Mission Valley or South Bay—she has the experience to understand your needs to both deliver something you love or get your house sold.";

/** Compact homepage blog links (under Contact / Rosamelia bio). */
const HOME_BLOG_SPOTLIGHT = [
  {
    slug: "how-to-find-good-value-in-san-diego-real-estate",
    title: "How to Find Good Value in San Diego Real Estate",
  },
  {
    slug: "san-diego-housing-market-forecast-2026",
    title: "San Diego Housing Market Forecast (2026)",
  },
  {
    slug: "moving-to-san-diego-everything-you-need-to-know",
    title: "Moving to San Diego: Everything You Need to Know",
  },
  {
    slug: "best-neighborhoods-san-diego-2026",
    title: "Best Neighborhoods in San Diego (2026 Guide)",
  },
];

function getHomeContent() {
  try {
    const path = join(process.cwd(), "content", "homepage.md");
    const raw = readFileSync(path, "utf8");
    const sections = {};
    let current = "";
    let body = [];
    raw.split("\n").forEach((line) => {
      if (line.startsWith("## ")) {
        if (current) sections[current] = body.join("\n").trim();
        current = line.replace(/^##\s*/, "").trim();
        body = [];
      } else if (current) {
        body.push(line);
      }
    });
    if (current) sections[current] = body.join("\n").trim();
    return sections;
  } catch (_) {
    return {};
  }
}

const homeCanonical = getPublicSiteUrl();

export const metadata = {
  title: "San Diego Amazing Homes | Real Estate in San Diego",
  description:
    "San Diego real estate with Rosamelia Lopez-Platt, REALTOR®. Neighborhood guides, market insight, and local expertise.",
  alternates: { canonical: homeCanonical },
  openGraph: {
    url: homeCanonical,
    title: "San Diego Amazing Homes | Real Estate in San Diego",
    description:
      "San Diego real estate with Rosamelia Lopez-Platt, REALTOR®. Neighborhood guides, market insight, and local expertise.",
    type: "website",
  },
};

/** ISR: homepage gallery reads the `gallery/` folder; refresh periodically without tying to removed Instagram API. */
export const revalidate = 3600;

export default function HomePage() {
  const sections = getHomeContent();
  const welcome = sections["Welcome"] || "";
  const tagline = sections["Tagline"] || "Houses are my passion!";
  const galleryImages = getHomeGalleryImages();
  // ROYAL CALIFORNIA LOGO: Only under Rosamelia's photo here and on About Us. Same width as profile, centered.
  const ROYAL_CALIFORNIA_LOGO_PATH = join(process.cwd(), "public", "images", "royal california logo.jpg");
  const showRoyalCaliforniaLogo = existsSync(ROYAL_CALIFORNIA_LOGO_PATH);

  return (
    <div className="space-y-0">
      <section className="section-light py-3 pb-2">
        <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-xl overflow-hidden mb-2 border border-slate-200 shadow-card bg-slate-100">
          <Image
            src="/images/cropped-SDAH-web-banner.png"
            alt="San Diego Amazing Homes — Real estate in San Diego"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          San Diego Amazing Homes
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mb-1">
          {welcome || "Welcome to San Diego Amazing Homes! San Diego is dubbed \"America's Finest City\" for a reason—year-round weather, a thriving market, and decades of growth. I've been here for over 40 years, and with houses as my passion, I've explored every corner of the county. Whether you're looking to buy or sell, I'm here to help."}
        </p>
        <p className="text-lg text-slate-700 font-medium">{tagline}</p>
      </section>

      <section className="section-alt py-4 border-t border-slate-200">
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/#contact"
            className="card-hover flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <Home className="w-5 h-5 text-sd-600 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 block text-sm">Looking for a house?</span>
              <span className="text-xs text-slate-600">Tell me what you want and I’ll send options.</span>
            </div>
          </Link>
          <Link
            href="/#contact"
            className="card-hover flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <Home className="w-5 h-5 text-sd-600 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 block text-sm">Want to list your home?</span>
              <span className="text-xs text-slate-600">Sell with an agent who knows San Diego.</span>
            </div>
          </Link>
          <Link
            href="/matchmaker"
            className="card-hover flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <Compass className="w-5 h-5 text-sd-600 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 block text-sm">Find your neighborhood?</span>
              <span className="text-xs text-slate-600">Answer 3 quick questions →</span>
            </div>
          </Link>
        </div>
      </section>

      <section id="contact" className="section-light border-t border-slate-200 py-5">
        <header className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Contact</h2>
          <p className="text-slate-600 text-sm">Call or email with any questions.</p>
        </header>
        {/*
          Use flex (not 50/50 grid): a 2-col grid left half empty while contact content is narrow,
          which made the bio look far away. Left column is content-width; bio starts right after gap.
        */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-x-4">
          {/* Left: profile photo + Royal California logo (centered, uniform 200px) then contact info */}
          <div className="flex flex-col sm:flex-row gap-3 items-start w-full shrink-0 lg:w-auto">
            <div className="flex flex-col items-center gap-3 shrink-0 w-[200px] mx-auto sm:mx-0">
              <div className="relative w-full aspect-[1/1] rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                <Image
                  src="/images/Rosa-010.jpg"
                  alt="Rosamelia Lopez-Platt, REALTOR®"
                  fill
                  className="object-contain object-center"
                  sizes="200px"
                />
              </div>
              {showRoyalCaliforniaLogo && (
                <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100" data-royal-california-logo-contact-only>
                  <Image
                    src="/images/royal%20california%20logo.jpg"
                    alt="Royal California Real Estate"
                    fill
                    className="object-cover object-center"
                    sizes="200px"
                  />
                </div>
              )}
            </div>
            <div className="min-w-0 sm:max-w-[min(100%,20rem)] text-[0.9em] space-y-1 text-slate-700 text-sm leading-relaxed">
              <p className="font-bold text-slate-900 text-lg whitespace-nowrap">Rosamelia Lopez-Platt</p>
              <p>REALTOR®</p>
              <p>DRE #02026714</p>
              <p className="whitespace-nowrap">Royal California Real Estate</p>
              <p>
                <a href="mailto:amazinghsd@gmail.com" className="text-sd-600 hover:text-sd-700 font-medium">
                  amazinghsd@gmail.com
                </a>
              </p>
              <p>
                <a href="tel:+16195482832" className="text-sd-600 hover:text-sd-700 font-medium">
                  cel 619 548 2832
                </a>
              </p>
              <p>7445 Girard Ave. Suite #11</p>
              <p>La Jolla, Ca. 92037</p>
            </div>
          </div>
          {/* Right: Rosamelia bio + blog spotlight (same row on lg+; blog on the right) */}
          <div className="min-w-0 flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 lg:gap-x-10 lg:gap-y-5 lg:pt-6">
            <p className="text-slate-600 leading-relaxed flex-1 min-w-0">{ROSAMELIA_BIO}</p>
            <div className="shrink-0 w-full lg:w-auto lg:max-w-[17rem] lg:ml-2 border-t lg:border-t-0 border-slate-200 pt-4 lg:pt-0 text-left lg:flex lg:flex-col lg:items-start">
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-sd-600 shrink-0" aria-hidden />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">From the blog</h3>
              </div>
              <ul className="space-y-1.5 w-full lg:w-full text-left">
                {HOME_BLOG_SPOTLIGHT.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm text-slate-800 hover:text-sd-600 font-medium leading-snug inline-block text-left"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog"
                className="mt-2.5 text-xs font-semibold text-sd-600 hover:text-sd-700 inline-block text-left"
              >
                Read more posts on the blog →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light border-t border-slate-200 py-4" aria-labelledby="home-gallery-heading">
        <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
          <h2 id="home-gallery-heading" className="text-lg font-bold text-slate-900">
            Gallery
          </h2>
          {galleryImages.length > 0 && (
            <p className="text-xs text-slate-500 tabular-nums">{galleryImages.length} photos</p>
          )}
        </div>
        {galleryImages.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">Gallery photos will appear here once they are added to the site.</p>
        ) : (
          <ImageCarousel
            images={galleryImages.map((img) => ({ path: img.path, caption: img.caption }))}
            slidesToShow={5}
            enableLightbox
            viewAllLabel="View all photos"
          />
        )}
      </section>

      <section className="section-alt border-t border-slate-200 py-4" aria-labelledby="instagram-heading">
        <h2 id="instagram-heading" className="text-lg font-bold text-slate-900 mb-1">
          Instagram
        </h2>
        <p className="text-sm text-slate-600 mb-3 max-w-xl">
          Follow along for new listings, open houses, and neighborhood snapshots—we post on Instagram.
        </p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-sd-600 bg-white px-4 py-2.5 text-sm font-semibold text-sd-700 shadow-sm hover:bg-sd-50 transition-colors"
        >
          Open @{INSTAGRAM_HANDLE} on Instagram
          <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
        </a>
      </section>

      <section className="section-light border-t border-slate-200 py-4" aria-labelledby="baja-section-heading">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative w-full aspect-[3/2] md:aspect-auto md:min-h-[200px] bg-slate-200">
              <Image
                src="/images/la-escondida-vista.jpg"
                alt="La Escondida vista — Baja California"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-4 sm:p-5 flex flex-col justify-center">
              <h2 id="baja-section-heading" className="text-lg font-bold text-slate-900 mb-1">
                Interested in Baja California land or property?
              </h2>
              <p className="text-slate-600 text-sm mb-4">
                Our partner The Baja Land Company can help—same region, different side.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={PARTNER_SITE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-sd-600 bg-sd-600 text-white min-w-72 py-3 text-sm font-medium hover:bg-sd-700 hover:border-sd-700 transition-colors shrink-0"
                >
                  Visit The Baja Land Company
                  <ExternalLink className="w-4 h-4" aria-hidden />
                </a>
                <a
                  href={PARTNER_SITE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block h-[6.5rem] w-72 shrink-0"
                  aria-label="The Baja Land Company"
                >
                  <Image
                    src="/images/baja-land-logo.png"
                    alt=""
                    fill
                    className="object-contain object-left"
                    sizes="288px"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
