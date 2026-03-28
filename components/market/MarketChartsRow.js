"use client";

/**
 * Two compact charts side by side: median price trend and inventory (or price/sqft) trend.
 * Denser layout with delta indicators. Research-dashboard feel.
 */

function formatShort(n) {
  if (n == null || Number.isNaN(n)) return "";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

function LineChart({ data, valueKey, height = 52, className = "text-sd-600" }) {
  if (!data || data.length === 0) return null;
  const values = data.map((d) => d[valueKey]).filter((v) => v != null);
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 100;
  const h = height;
  const padding = 2;
  const points = data
    .map((d, i) => {
      const x = padding + (data.length > 1 ? (i / (data.length - 1)) * (w - 2 * padding) : w / 2);
      const y = h - padding - ((d[valueKey] - min) / range) * (h - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: `${h}px` }}>
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" className={className} points={points} />
    </svg>
  );
}

function DeltaBadge({ value, label }) {
  if (value == null) return null;
  const isPos = typeof value === "number" ? value >= 0 : String(value).startsWith("+");
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
        isPos ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {label} {typeof value === "number" && value > 0 ? "+" : ""}
      {typeof value === "number" ? value.toFixed(1) : value}%
    </span>
  );
}

export default function MarketChartsRow({
  priceTrend12mo = [],
  inventoryTrend = [],
  pricePerSqftTrend = [],
}) {
  const priceData = priceTrend12mo.slice(-12);
  const invData = inventoryTrend?.slice(-12) || [];
  const sqftData = pricePerSqftTrend?.slice(-8) || [];
  const priceFirst = priceData[0]?.medianPrice;
  const priceLast = priceData[priceData.length - 1]?.medianPrice;
  const priceDelta =
    priceFirst != null && priceLast != null && priceFirst > 0
      ? (((priceLast - priceFirst) / priceFirst) * 100).toFixed(1)
      : null;
  const invFirst = invData[0]?.inventory;
  const invLast = invData[invData.length - 1]?.inventory;
  const invDelta =
    invFirst != null && invLast != null && invFirst > 0 ? (((invLast - invFirst) / invFirst) * 100).toFixed(1) : null;

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-2"
      aria-labelledby="market-charts-row-title"
    >
      <h2 id="market-charts-row-title" className="sr-only">
        Price and inventory trends
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Median price 12mo */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-xs font-semibold text-slate-700">Median price (12 mo)</p>
            {priceDelta != null && <DeltaBadge value={parseFloat(priceDelta)} label="YoY" />}
          </div>
          {priceData.length > 0 ? (
            <>
              <LineChart data={priceData} valueKey="medianPrice" height={52} />
              <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                <span>${formatShort(priceFirst)}</span>
                <span>${formatShort(priceLast)}</span>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 py-2">No trend data</p>
          )}
        </div>

        {/* Inventory or $/sqft */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-xs font-semibold text-slate-700">
              {invData.length > 0 ? "Inventory trend" : "Price per sq ft"}
            </p>
            {invData.length > 0 && invDelta != null && (
              <DeltaBadge value={parseFloat(invDelta)} label="YoY" />
            )}
          </div>
          {invData.length > 0 ? (
            <>
              <LineChart data={invData} valueKey="inventory" height={52} className="text-slate-600" />
              <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                <span>{invFirst?.toLocaleString()}</span>
                <span>{invLast?.toLocaleString()}</span>
              </div>
            </>
          ) : sqftData.length > 0 ? (
            <>
              <LineChart data={sqftData} valueKey="pricePerSqft" height={52} className="text-slate-600" />
              <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                <span>${sqftData[0]?.pricePerSqft}</span>
                <span>${sqftData[sqftData.length - 1]?.pricePerSqft}</span>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 py-2">No trend data</p>
          )}
        </div>
      </div>
    </section>
  );
}
