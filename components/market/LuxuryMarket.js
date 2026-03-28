"use client";

/**
 * Luxury market: $2M+ stats — count, median, avg days on market.
 */

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  return "$" + Number(n).toLocaleString();
}

export default function LuxuryMarket({ luxury }) {
  if (!luxury) return null;
  const { thresholdPrice, listingCount, avgDaysOnMarket, medianPrice } = luxury;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="luxury-market-title">
      <h2 id="luxury-market-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Luxury Market
      </h2>
      <p className="text-xs text-slate-500 mb-1.5">
        Listings at {formatPrice(thresholdPrice)}+
      </p>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Listings</p>
          <p className="text-lg font-semibold text-slate-900 mt-0.5">
            {listingCount != null ? listingCount.toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Median price</p>
          <p className="text-lg font-semibold text-slate-900 mt-0.5">{formatPrice(medianPrice)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg DOM</p>
          <p className="text-lg font-semibold text-slate-900 mt-0.5">{avgDaysOnMarket ?? "—"}</p>
        </div>
      </div>
    </section>
  );
}
