"use client";
import Image from "next/image";

const FALLBACK_IMAGE = "/images/placeholder-listing.svg";

function formatPrice(n) {
  if (n == null) return "";
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}

export default function FeaturedHomes({ listings = [], neighborhoodNames = {} }) {
  const show = listings.slice(0, 5);
  if (!show.length) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="featured-homes-title">
      <div className="flex items-center justify-between mb-1.5">
        <h2 id="featured-homes-title" className="text-sm font-bold text-slate-900">
          Featured Listings
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
        {show.map((listing) => {
          const img = listing.images && listing.images[0] ? listing.images[0] : FALLBACK_IMAGE;
          const neighborhoodName = neighborhoodNames[listing.neighborhood];
          return (
            <div
              key={listing.id}
              className="block rounded-lg border border-slate-200 overflow-hidden bg-slate-50"
              role="group"
              aria-label="Listing preview"
            >
              <div className="relative aspect-[4/3] bg-slate-200">
                <Image src={img} alt="" fill className="object-cover" sizes="160px" />
              </div>
              <div className="p-1.5">
                <p className="font-semibold text-slate-900 text-sm">{formatPrice(listing.price)}</p>
                <p className="text-xs text-slate-600 truncate">
                  {[listing.beds != null && `${listing.beds}b`, listing.baths != null && `${listing.baths}ba`, listing.sqft != null && `${listing.sqft} sqft`].filter(Boolean).join(" · ") || "—"}
                </p>
                {neighborhoodName && <p className="text-xs text-slate-500 truncate">{neighborhoodName}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
