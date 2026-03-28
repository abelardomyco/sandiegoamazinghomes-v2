import { redirect } from "next/navigation";

const FALLBACK_LISTING_IMAGE = "/images/placeholder-listing.svg";

function formatPrice(n) {
  if (n == null) return "";
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Number(n).toLocaleString()}`;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata() {
  return {
    title: "Listing",
    description: "San Diego real estate guidance: market, neighborhoods, and local insights.",
    robots: { index: false, follow: true },
  };
}

export default function PropertyPage() {
  // Homes/listings pages removed for now.
  redirect("/");
}
