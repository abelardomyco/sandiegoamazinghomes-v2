"use client";

import Link from "next/link";

/**
 * Cooling neighborhoods: areas with price reductions or softening. Data: { slug, name, priceChangePct? }[].
 */
export default function CoolingNeighborhoods({ items = [] }) {
  if (!items.length) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="cooling-title">
        <h2 id="cooling-title" className="text-sm font-bold text-slate-900 mb-1.5">Cooling neighborhoods</h2>
        <p className="text-slate-500 text-sm">No data yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="cooling-title">
      <h2 id="cooling-title" className="text-sm font-bold text-slate-900 mb-1.5">Cooling neighborhoods</h2>
      <p className="text-xs text-slate-500 mb-1.5">Areas with recent price reductions or softening demand.</p>
      <ul className="space-y-1">
        {items.map((n) => (
          <li key={n.slug} className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-50 border border-slate-100">
            <Link href={`/neighborhoods/${n.slug}`} className="font-medium text-slate-900 hover:text-sd-600 text-sm">
              {n.name}
            </Link>
            {n.priceChangePct != null && (
              <span className="text-xs text-red-600 font-medium">{n.priceChangePct}%</span>
            )}
            <Link href="/#contact" className="text-xs text-sd-600 hover:text-sd-700 shrink-0">Ask →</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
