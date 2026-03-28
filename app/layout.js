import "./globals.css";
import { Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getNeighborhoodIndex } from "@/lib/content";
import MatchmakerFloat from "@/components/matchmaker/MatchmakerFloat";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { getPublicSiteUrl } from "@/lib/public-site-url";

const sourceSerif = Source_Serif_4({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = getPublicSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl.replace(/\/$/, "")),
  title: {
    default: "San Diego Amazing Homes | Real Estate in San Diego",
    template: "%s | San Diego Amazing Homes",
  },
  description:
    "San Diego real estate with Rosamelia Lopez-Platt, REALTOR®. La Jolla, Del Mar, Coronado, Rancho Santa Fe, and all of San Diego County. Royal California Real Estate.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "San Diego Amazing Homes",
    title: "San Diego Amazing Homes | Real Estate in San Diego",
    description:
      "San Diego real estate with Rosamelia Lopez-Platt, REALTOR®. Neighborhood guides, market insight, and local expertise.",
    url: siteUrl.replace(/\/$/, ""),
  },
  twitter: {
    card: "summary_large_image",
    title: "San Diego Amazing Homes",
    description: "San Diego real estate with Rosamelia Lopez-Platt, REALTOR®.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }) {
  const neighborhoods = getNeighborhoodIndex();
  return (
    <html lang="en" className={sourceSerif.variable} data-site="sandiegoamazinghomes">
      <body className="font-body min-h-screen flex flex-col bg-slate-50 site-sdah">
        <SiteJsonLd />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        <Header />
        <div
          role="presentation"
          className="w-full h-2 bg-sd-600"
        />
        <main className="flex-1 w-full min-h-[40vh]">
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
        <div role="presentation" className="w-full h-1 bg-slate-300" />
        <Footer />
        <MatchmakerFloat neighborhoods={neighborhoods} />
      </body>
    </html>
  );
}
