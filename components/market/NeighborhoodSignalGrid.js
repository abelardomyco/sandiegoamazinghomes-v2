"use client";

import Link from "next/link";

function pctFromSignal01(v) {
  // Map 0..1 to -5..+5 "signal %" (not literal YoY). Keeps the UI scannable without implying precision.
  const clamped = Math.max(0, Math.min(1, typeof v === "number" ? v : 0.5));
  const pct = (clamped - 0.5) * 10;
  return Math.round(pct * 10) / 10;
}

function badge(label) {
  const l = String(label || "").toLowerCase();
  if (l === "fast") return "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (l === "slow") return "bg-rose-50 text-rose-800 border-rose-200";
  if (l === "strong") return "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (l === "weak") return "bg-rose-50 text-rose-800 border-rose-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function NeighborhoodSignalGrid({ rows = [] }) {
  if (!rows.length) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white overflow-hidden" aria-label="Neighborhood signals">
      <div className="px-3 py-2 border-b border-slate-200 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900">Neighborhood signals</h2>
        <p className="text-[11px] text-slate-500">Quick read: trend, speed, value</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => {
          const trendPct = pctFromSignal01(r.priceGrowth);
          const trendUp = trendPct >= 0;
          const trendCls = trendUp ? "text-emerald-700" : "text-rose-700";
          const trendText = `${trendUp ? "↑" : "↓"} ${trendUp ? "+" : ""}${trendPct.toFixed(1)}%`;

          return (
            <div key={r.slug} className="px-3 py-2 border-b border-slate-100 sm:border-r sm:last:border-r-0">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/neighborhoods/${r.slug}`}
                  className="font-semibold text-sd-700 hover:text-sd-800 hover:underline truncate"
                >
                  {r.name}
                </Link>
                <span className={`text-xs font-semibold tabular-nums ${trendCls}`} title="Price trend (signal)">
                  {trendText}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap gap-2">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badge(r.speed)}`}>
                  {r.speed}
                </span>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badge(r.value)}`}>
                  {r.value}
                </span>
                <Link
                  href="/#contact"
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                >
                  Ask →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-3 py-2 bg-slate-50/70 border-t border-slate-200 text-[11px] text-slate-500">
        Signals are summarized from the market heat metrics (trend/speed/inventory/reductions) for quick comparison.
      </div>
    </section>
  );
}

