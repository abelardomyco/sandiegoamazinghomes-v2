"use client";

import Link from "next/link";

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + Number(n).toLocaleString();
}

function StrengthBadge({ label }) {
  const c =
    label === "Hot"
      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
      : label === "Cooling"
        ? "bg-slate-100 text-slate-700 border border-slate-200"
        : "bg-sd-100 text-sd-800 border border-sd-200";
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${c}`}>
      {label}
    </span>
  );
}

export default function MarketScoreboard({ scoreboardData = [] }) {
  if (!scoreboardData.length) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-3" aria-labelledby="scoreboard-title">
        <h2 id="scoreboard-title" className="text-sm font-bold text-slate-900 mb-2">
          Neighborhood market scoreboard
        </h2>
        <p className="text-xs text-slate-500">Connect neighborhood metrics to see the table.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white overflow-hidden" aria-labelledby="scoreboard-title">
      <h2 id="scoreboard-title" className="text-sm font-bold text-slate-900 px-3 pt-2.5 pb-2 border-b border-slate-200">
        Neighborhood market scoreboard
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-2.5 font-semibold text-slate-700">Neighborhood</th>
              <th className="px-3 py-2.5 font-semibold text-slate-700 text-right">Median price</th>
              <th className="px-3 py-2.5 font-semibold text-slate-700 text-right">Price trend</th>
              <th className="px-3 py-2.5 font-semibold text-slate-700 text-right">Days on market</th>
              <th className="px-3 py-2.5 font-semibold text-slate-700 text-right">Market</th>
            </tr>
          </thead>
          <tbody>
            {scoreboardData.map((row) => (
              <tr key={row.slug} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="px-3 py-2">
                  <Link href={"/neighborhoods/" + row.slug} className="font-semibold text-sd-700 hover:text-sd-800 hover:underline">
                    {row.neighborhood}
                  </Link>
                </td>
                <td className="px-3 py-2 text-right font-medium text-slate-800">{formatPrice(row.medianPrice)}</td>
                <td className="px-3 py-2 text-right text-slate-700">{row.priceTrend}</td>
                <td className="px-3 py-2 text-right text-slate-700">{row.daysOnMarket}</td>
                <td className="px-3 py-2 text-right">
                  <StrengthBadge label={row.marketStrengthLabel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
