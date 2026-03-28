"use client";

/**
 * Market snapshot: median price, price per sqft, days on market, active listings, new listings trend.
 * Data from props (server-provided placeholder or API).
 */

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + Number(n).toLocaleString();
}

export default function MarketSnapshot({
  medianPrice,
  pricePerSqft,
  inventory,
  activeListings,
  daysOnMarket,
  newListingsTrend,
  updatedAt,
}) {
  const listings = activeListings != null ? activeListings : inventory;
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="market-snapshot-title">
      <h2 id="market-snapshot-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Market Snapshot
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Median Price</p>
          <p className="text-base font-semibold text-slate-900 mt-0.5">{formatPrice(medianPrice)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Price / Sq Ft</p>
          <p className="text-base font-semibold text-slate-900 mt-0.5">
            {pricePerSqft != null ? `$${pricePerSqft}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Days on Market</p>
          <p className="text-base font-semibold text-slate-900 mt-0.5">{daysOnMarket ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Listings</p>
          <p className="text-base font-semibold text-slate-900 mt-0.5">
            {listings != null ? listings.toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">New Listings</p>
          <p className="text-base font-semibold text-slate-900 mt-0.5">
            {newListingsTrend != null ? (
              <span className={newListingsTrend.startsWith("+") ? "text-emerald-600" : "text-slate-900"}>{newListingsTrend}</span>
            ) : "—"}
          </p>
        </div>
      </div>
      {updatedAt && (
        <p className="text-xs text-slate-400 mt-1.5">As of {updatedAt}</p>
      )}
    </section>
  );
}
