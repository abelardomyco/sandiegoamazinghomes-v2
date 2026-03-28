"use client";

import Link from "next/link";

/**
 * Polished fallback when Mapbox token is missing: show neighborhood heat as a table with color bars.
 * Keeps the dashboard useful without the map. Toggle metric is passed from parent.
 */
export default function HeatMapFallback({ heatData = {}, metric = "priceGrowth", metricLabel = "Price growth" }) {
  const entries = Object.entries(heatData).map(([slug, v]) => ({
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: typeof v === "object" && v != null && typeof v[metric] === "number" ? v[metric] : 0.5,
  })).sort((a, b) => b.value - a.value);

  function heatColor(v) {
    if (v >= 0.65) return "bg-green-500";
    if (v >= 0.35) return "bg-yellow-500";
    return "bg-red-500";
  }

  return (
    <div
      className="rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-6"
      role="region"
      aria-label="Market heat by neighborhood"
    >
      <p className="text-slate-700 font-medium mb-1">Market heat by neighborhood</p>
      <p className="text-slate-600 text-sm mb-4 max-w-md">
        Showing <strong>{metricLabel}</strong>. Add <code className="text-xs bg-slate-200 px-1 rounded">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to .env.local for the interactive map.
      </p>
      <div className="w-full max-w-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-1.5 font-semibold text-slate-900">Neighborhood</th>
              <th className="py-1.5 font-semibold text-slate-900 w-24">Heat</th>
              <th className="py-1.5 w-8" />
            </tr>
          </thead>
          <tbody>
            {entries.slice(0, 12).map(({ slug, name, value }) => (
              <tr key={slug} className="border-b border-slate-100">
                <td className="py-1.5">
                  <Link href={`/neighborhoods/${slug}`} className="text-slate-900 hover:text-sd-600 font-medium">
                    {name}
                  </Link>
                </td>
                <td className="py-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${heatColor(value)}`}
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-500 text-xs w-6">{(value * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td>
                  <Link href="/#contact" className="text-sd-600 text-xs hover:underline">Ask</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Accelerating</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Neutral</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Declining</span>
      </div>
    </div>
  );
}
