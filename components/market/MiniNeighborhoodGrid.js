"use client";

import Link from "next/link";

function Tag({ label }) {
  const l = String(label || "").toLowerCase();
  const cls =
    l.includes("fast") || l.includes("competitive")
      ? "border-rose-200 bg-rose-50 text-rose-900"
      : l.includes("flex") || l.includes("value") || l.includes("easing")
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border-slate-200 bg-slate-50 text-slate-800";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

export default function MiniNeighborhoodGrid({ rows = [] }) {
  const list = Array.isArray(rows) ? rows.filter(Boolean).slice(0, 12) : [];
  if (!list.length) return null;
  return (
    <section className="rounded-lg border border-slate-200 bg-white overflow-hidden" aria-label="Mini neighborhood grid">
      <div className="px-3 py-2 border-b border-slate-200 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900">Neighborhood grid</h2>
        <p className="text-[11px] text-slate-500">Fast labels. No fake precision.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <div key={r.slug} className="px-3 py-2 border-b border-slate-100 sm:border-r sm:last:border-r-0 flex items-center justify-between gap-3">
            <Link
              href={`/neighborhoods/${r.slug}`}
              className="font-semibold text-sd-700 hover:text-sd-800 hover:underline truncate"
            >
              {r.name}
            </Link>
            <Tag label={r.label} />
          </div>
        ))}
      </div>
    </section>
  );
}

