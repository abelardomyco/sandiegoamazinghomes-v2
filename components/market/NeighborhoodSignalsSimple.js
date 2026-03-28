"use client";

import Link from "next/link";

function labelTone(label) {
  const l = String(label || "").toLowerCase();
  if (l.includes("competitive")) return "border-rose-200 bg-rose-50 text-rose-900";
  if (l.includes("easing") || l.includes("value")) return "border-emerald-200 bg-emerald-50 text-emerald-900";
  return "border-slate-200 bg-slate-50 text-slate-800";
}

export default function NeighborhoodSignalsSimple({ rows = [] }) {
  if (!rows.length) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white overflow-hidden" aria-label="Neighborhood signals">
      <div className="px-3 py-2 border-b border-slate-200">
        <h2 className="text-sm font-bold text-slate-900">Neighborhood signals</h2>
        <p className="text-[11px] text-slate-500 mt-0.5">No fake precision — just the read.</p>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map((r) => (
          <div key={r.slug} className="px-3 py-2 flex items-center justify-between gap-3">
            <Link
              href={`/neighborhoods/${r.slug}`}
              className="font-semibold text-sd-700 hover:text-sd-800 hover:underline truncate"
            >
              {r.name}
            </Link>
            <span className={`shrink-0 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${labelTone(r.label)}`}>
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

