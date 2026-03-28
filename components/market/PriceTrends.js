"use client";

/**
 * Price trends: 12-month median price chart + price per sqft trend.
 * Data: priceTrend12mo [{ month, label, medianPrice }], pricePerSqftTrend [{ month, label, pricePerSqft }].
 */

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

export default function PriceTrends({ priceTrend12mo = [], pricePerSqftTrend = [] }) {
  const maxPrice = priceTrend12mo.length
    ? Math.max(...priceTrend12mo.map((d) => d.medianPrice), 1)
    : 1;
  const minPriceSqft = pricePerSqftTrend.length
    ? Math.min(...pricePerSqftTrend.map((d) => d.pricePerSqft))
    : 0;
  const maxPriceSqft = pricePerSqftTrend.length
    ? Math.max(...pricePerSqftTrend.map((d) => d.pricePerSqft))
    : 1;
  const rangeSqft = maxPriceSqft - minPriceSqft || 1;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4" aria-labelledby="price-trends-title">
      <h2 id="price-trends-title" className="text-base font-bold text-slate-900 mb-3">
        Price Trends
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {priceTrend12mo.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">12-month median price</p>
            <div className="space-y-1">
              {priceTrend12mo.slice(-8).map((d) => (
                <div key={d.month} className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 w-12 shrink-0">{d.label}</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-sd-600 rounded min-w-[2px]"
                      style={{ width: `${(d.medianPrice / maxPrice) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-900 w-14 text-right">${formatPrice(d.medianPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {pricePerSqftTrend.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Price per sq ft trend</p>
            <div className="space-y-1">
              {pricePerSqftTrend.map((d) => (
                <div key={d.month} className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 w-12 shrink-0">{d.label}</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-sd-500 rounded min-w-[2px]"
                      style={{ width: `${((d.pricePerSqft - minPriceSqft) / rangeSqft) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-900 w-10 text-right">${d.pricePerSqft}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {priceTrend12mo.length === 0 && pricePerSqftTrend.length === 0 && (
          <p className="text-sm text-slate-500 col-span-2">Connect market data for price trends.</p>
        )}
      </div>
    </section>
  );
}
