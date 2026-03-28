import { readFileSync, existsSync } from "fs";
import { join } from "path";
import Link from "next/link";
import Image from "next/image";

const ROYAL_CALIFORNIA_LOGO_PATH = join(process.cwd(), "public", "images", "royal california logo.jpg");

function getAboutContent() {
  try {
    const path = join(process.cwd(), "content", "about.md");
    return readFileSync(path, "utf8").trim();
  } catch (_) {
    return "";
  }
}

const siteUrl =
  (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://sandiegoamazinghomes.com";

export const metadata = {
  title: "About Us",
  description:
    "About Rosamelia Lopez-Platt, REALTOR® — over 40 years in San Diego. La Jolla, Del Mar, Coronado, Rancho Santa Fe, and all of San Diego County.",
  alternates: { canonical: `${siteUrl.replace(/\/$/, "")}/about` },
  openGraph: {
    title: "About Rosamelia Lopez-Platt | San Diego Amazing Homes",
    description:
      "REALTOR® with Royal California Real Estate — decades of experience across San Diego County neighborhoods.",
    type: "website",
    url: `${siteUrl.replace(/\/$/, "")}/about`,
  },
};

export default function AboutPage() {
  const body = getAboutContent();
  const showRoyalCaliforniaLogo = existsSync(ROYAL_CALIFORNIA_LOGO_PATH);

  const rosameliaBio = body || `Rosamelia Lopez-Platt has been a San Diego resident for over 40 years. Houses have been her passion for just as long—she has explored every corner of the county and understands the unique character of each neighborhood.

Whether you are looking in La Jolla, Del Mar, Coronado, Rancho Santa Fe, Downtown, Mission Valley, or the South Bay, Rosamelia has the experience to understand your needs: to help you find a home you love or to get your house sold.

She is a REALTOR® with Royal California Real Estate (DRE #02026714) and is based in La Jolla.`;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-slate-900">About Us</h1>
      <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
        San Diego Amazing Homes combines local real estate expertise with digital media and market intelligence to help buyers and sellers better understand the San Diego housing market.
      </p>

      {/* Rosamelia — Agent */}
      <section className="gap-8" aria-labelledby="rosamelia-heading">
        <h2 id="rosamelia-heading" className="sr-only">Rosamelia Lopez-Platt, Agent</h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start max-w-4xl">
          <div className="flex flex-col items-center gap-3 shrink-0 w-[200px] mx-auto sm:mx-0">
            <div className="relative w-full aspect-[1/1] rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
              <Image
                src="/images/Rosa-010.jpg"
                alt="Rosamelia Lopez-Platt, REALTOR®"
                fill
                className="object-contain object-center"
                sizes="200px"
                priority
              />
            </div>
            {showRoyalCaliforniaLogo && (
              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
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
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="font-bold text-slate-900 text-lg">Rosamelia Lopez-Platt</p>
              <p className="text-slate-600 font-medium">Agent · REALTOR®</p>
              <p className="text-slate-500 text-sm mt-1">DRE #02026714 · Royal California Real Estate</p>
            </div>
            <div className="text-[0.9em] space-y-1 text-slate-700 text-sm leading-relaxed">
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
              <p>La Jolla, CA 92037</p>
            </div>
            <div className="whitespace-pre-wrap text-slate-600 leading-relaxed text-sm">{rosameliaBio}</div>
          </div>
        </div>
      </section>

      {/* Abelardo Rodriguez — Media, Design & Marketing */}
      <section
        className="gap-8 border-t-2 border-slate-200 pt-10 mt-2 rounded-xl bg-white/70 px-4 sm:px-6 py-8 shadow-sm"
        aria-labelledby="abelardo-heading"
      >
        <h2 id="abelardo-heading" className="sr-only">Abelardo Rodriguez, Media, Design & Marketing</h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start max-w-4xl">
          <div className="shrink-0 w-[200px] mx-auto sm:mx-0">
            <div className="relative w-full aspect-[1/1] rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
              <Image
                src="/images/Abelardo-photo.jpg"
                alt="Abelardo Rodriguez"
                fill
                className="object-contain object-center"
                sizes="200px"
              />
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="font-bold text-slate-900 text-lg">Abelardo Rodriguez</p>
              <p className="text-slate-600 font-medium">Media, Design &amp; Marketing</p>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
              Abelardo leads the digital media and platform development behind San Diego Amazing Homes. He built and manages the website, video production, design, and marketing that showcase San Diego neighborhoods, properties, and housing trends. By combining visual storytelling, technology, and market research, he helps present the local real estate market in a clear and engaging way while supporting the platform that connects buyers and sellers with Rosamelia&apos;s professional guidance.
            </p>
          </div>
        </div>
      </section>

      <p>
        <Link href="/" className="text-sd-600 hover:text-sd-700 font-medium">
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}
