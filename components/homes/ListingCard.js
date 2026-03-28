import Link from "next/link";
import Image from "next/image";

/** Neutral placeholder when listing has no image (matches lib/homes-data.js). Never use SDAH banner. */
const FALLBACK_LISTING_IMAGE = "/images/placeholder-listing.svg";

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Number(n).toLocaleString()}`;
}

/** One-line address: street or "Address on request" style. */
function addressLine(listing) {
  if (listing.address && listing.address.trim()) return listing.address.trim();
  if (listing.city) return listing.city;
  return null;
}

export default function ListingCard({ listing, neighborhoodName }) {
  const img = listing.images?.[0] || FALLBACK_LISTING_IMAGE;
  const isPlaceholderImage = img === FALLBACK_LISTING_IMAGE || img?.endsWith("placeholder-listing.svg");
  const specs = [
    listing.beds != null && `${listing.beds} bd`,
    listing.baths != null && `${listing.baths} ba`,
    listing.sqft != null && `${listing.sqft.toLocaleString()} sqft`,
    listing.lotSize != null && listing.lotSize > 0 && `${(listing.lotSize / 43560).toFixed(2)} ac`,
  ].filter(Boolean);
  const loc = neighborhoodName || listing.city || null;
  const status = listing.status && listing.status !== "active" ? listing.status : null;
  const propertyType = listing.propertyType || null;

  return (
    <Link
      href="/#contact"
      className="block rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-sd-300 transition-all"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        <Image
          src={img}
          alt={listing.address ? `${listing.address} listing` : "Property"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 320px"
        />
        {isPlaceholderImage && (
          <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
            Photo not available
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="font-semibold text-slate-900">{formatPrice(listing.price)}</p>
        {addressLine(listing) && (
          <p className="text-sm text-slate-700 mt-0.5 truncate" title={listing.address}>
            {addressLine(listing)}
          </p>
        )}
        {specs.length > 0 && (
          <p className="text-xs text-slate-600 mt-0.5">
            {specs.join(" · ")}
          </p>
        )}
        {(propertyType || status) && (
          <p className="text-[10px] text-slate-500 mt-0.5">
            {[propertyType, status].filter(Boolean).join(" · ")}
          </p>
        )}
        {loc && (
          <p className="text-xs text-slate-500 mt-0.5">{loc}</p>
        )}
        <p className="text-xs text-sd-600 font-medium mt-1.5">Ask for details →</p>
      </div>
    </Link>
  );
}
