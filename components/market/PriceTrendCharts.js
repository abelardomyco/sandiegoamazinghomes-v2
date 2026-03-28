"use client";

/**
 * Compact line charts: 12-month median price + price per sqft trend.
 */

function formatPriceShort(n) {
  if (n == null || Number.isNaN(n)) return "";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

function LineChart({ data, valueKey, labelKey, formatValue, height = 48, className = "" }) {
  if (!data || data.length === 0) return null;
  const values = data.map((d) => d[valueKey]).filter((v) => v != null);
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 100;
  const h = height;
  const padding = 2;
  const points = data.map((d, i) => {
    const x = padding + (data.length > 1 ? (i / (data.length - 1)) * (w - 2 * padding) : w / 2);
    const y = h - padding - ((d[valueKey] - min) / range) * (h - 2 * padding);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: `${h}px` }}>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-sd-600"
          points={points}
        />
      </svg>
    </div>
  );
}

export default function PriceTrendCharts({ priceTrend12mo = [], pricePerSqftTrend = [] }) {
  const medianData = priceTrend12mo.slice(-12);
  const sqftData = pricePerSqftTrend.slice(-8);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="price-trend-charts-title">
      <h2 id="price-trend-charts-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Price Trend Charts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {medianData.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Median price (12 mo)</p>
            <LineChart data={medianData} valueKey="medianPrice" labelKey="label" formatValue={formatPriceShort} height={44} />
            <div className="flex justify-between mt-0.5 text-xs text-slate-500">
              <span>${formatPriceShort(medianData[0]?.medianPrice)}</span>
              <span>${formatPriceShort(medianData[medianData.length - 1]?.medianPrice)}</span>
            </div>
          </div>
        )}
        {sqftData.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Price per sq ft</p>
            <LineChart data={sqftData} valueKey="pricePerSqft" labelKey="label" formatValue={(v) => "$" + v} height={44} />
            <div className="flex justify-between mt-0.5 text-xs text-slate-500">
              <span>${sqftData[0]?.pricePerSqft}</span>
              <span>${sqftData[sqftData.length - 1]?.pricePerSqft}</span>
            </div>
          </div>
        )}
        {medianData.length === 0 && sqftData.length === 0 && (
          <p className="text-xs text-slate-500 col-span-2">Connect market data for trends.</p>
        )}
      </div>
    </section>
  );
}
