"use client";

/**
 * Rental market: median rent, rent growth, rent vs buy comparison.
 */

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return "$" + Number(n).toLocaleString();
}

export default function RentalMarket({ rental }) {
  if (!rental) return null;
  const { medianRent, rentGrowthYoy, rentVsBuyRatio } = rental;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="rental-market-title">
      <h2 id="rental-market-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Rental Market
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Median rent</p>
          <p className="text-lg font-semibold text-slate-900 mt-0.5">{formatPrice(medianRent)}/mo</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rent growth (yoy)</p>
          <p className="text-lg font-semibold text-slate-900 mt-0.5">
            {rentGrowthYoy != null ? `${rentGrowthYoy}%` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rent vs buy</p>
          <p className="text-lg font-semibold text-slate-900 mt-0.5">
            {rentVsBuyRatio != null ? `Ratio ${rentVsBuyRatio}` : "—"}
          </p>
        </div>
      </div>
      {rentVsBuyRatio != null && (
        <p className="text-xs text-slate-500 mt-1.5">Rent-to-price ratio. Lower can favor buying.</p>
      )}
    </section>
  );
}
