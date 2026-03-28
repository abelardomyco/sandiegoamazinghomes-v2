"use client";

import Link from "next/link";

/**
 * Days on market: county average + fastest-selling areas (DOM by neighborhood).
 * Data: snapshot.daysOnMarket (number), fastestSelling (array of { slug, name, avgDOM }).
 */
export default function DaysOnMarketChart({ daysOnMarket, fastestSelling = [] }) {
  const countyDOM = daysOnMarket != null ? Number(daysOnMarket) : null;
  const maxDOM = fastestSelling.length
    ? Math.max(...fastestSelling.map((n) => n.avgDOM ?? 0), 1)
    : 1;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="dom-chart-title">
      <h2 id="dom-chart-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Days on Market
      </h2>
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <p className="text-xl font-semibold text-slate-900">{countyDOM != null ? countyDOM : "—"}</p>
        <p className="text-xs text-slate-500">county avg</p>
      </div>
      {fastestSelling.length > 0 ? (
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Fastest-selling areas</p>
          {fastestSelling.slice(0, 5).map((n) => (
            <div key={n.slug} className="flex items-center gap-2">
              <Link
                href={`/neighborhoods/${n.slug}`}
                className="text-sm font-medium text-slate-900 hover:text-sd-600 w-28 shrink-0"
              >
                {n.name}
              </Link>
              <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden max-w-[120px]">
                <div
                  className="h-full bg-sd-600 rounded"
                  style={{
                    width: `${Math.max(10, ((n.avgDOM ?? 0) / maxDOM) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs text-slate-600 w-8">{n.avgDOM ?? "—"}d</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">Connect neighborhood DOM data for area breakdown.</p>
      )}
    </section>
  );
}
