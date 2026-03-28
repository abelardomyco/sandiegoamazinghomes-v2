"use client";

/**
 * Three compact dashboard charts (12 months): Price per sq ft trend, Days on market trend, Monthly sales volume.
 * Dense layout, shorter height for dashboard feel.
 */

function formatShort(n) {
  if (n == null || Number.isNaN(n)) return "";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

function MiniLineChart({ data, valueKey, height = 40, className = "text-sd-600", valueFormat = "number" }) {
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
  const first = data[0]?.[valueKey];
  const last = data[data.length - 1]?.[valueKey];
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: `${height}px` }}>
        <polyline fill="none" stroke="currentColor" strokeWidth="1.5" className={className} points={points} />
      </svg>
      <div className="flex justify-between mt-0.5 text-[10px] text-slate-500">
        <span>{valueFormat === "currency" && first != null ? "$" + first : formatShort(first)}</span>
        <span>{valueFormat === "currency" && last != null ? "$" + last : formatShort(last)}</span>
      </div>
    </div>
  );
}

export default function MarketDashboardCharts({
  pricePerSqftTrend = [],
  daysOnMarketTrend = [],
  salesVolumeTrend = [],
}) {
  const sqftData = pricePerSqftTrend.slice(-12);
  const domData = daysOnMarketTrend.slice(-12);
  const salesData = salesVolumeTrend.slice(-12);

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-2"
      aria-labelledby="dashboard-charts-title"
    >
      <h2 id="dashboard-charts-title" className="sr-only">
        Market trends: price per sq ft, days on market, sales volume
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Price per sq ft (12 mo)
          </p>
          {sqftData.length > 0 ? (
            <MiniLineChart data={sqftData} valueKey="pricePerSqft" height={40} className="text-sd-600" />
          ) : (
            <p className="text-xs text-slate-500 py-2">No data</p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Days on market (12 mo)
          </p>
          {domData.length > 0 ? (
            <MiniLineChart data={domData} valueKey="daysOnMarket" height={40} className="text-slate-600" />
          ) : (
            <p className="text-xs text-slate-500 py-2">No data</p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Monthly sales volume
          </p>
          {salesData.length > 0 ? (
            <MiniLineChart data={salesData} valueKey="sales" height={40} className="text-slate-600" />
          ) : (
            <p className="text-xs text-slate-500 py-2">No data</p>
          )}
        </div>
      </div>
    </section>
  );
}
