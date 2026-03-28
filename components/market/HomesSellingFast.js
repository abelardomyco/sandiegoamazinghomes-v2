"use client";

import Link from "next/link";

export default function HomesSellingFast({ fastestSelling = [] }) {
  const items = fastestSelling.slice(0, 5);
  if (!items.length) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="homes-selling-fast-title">
      <h2 id="homes-selling-fast-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Homes Selling Fast
      </h2>
      <p className="text-xs text-slate-500 mb-1.5">Lowest average days on market</p>
      <ul className="space-y-1">
        {items.map((n) => (
          <li key={n.slug} className="flex items-center justify-between gap-2">
            <Link href={"/neighborhoods/" + encodeURIComponent(n.slug)} className="text-sm font-medium text-slate-900 hover:text-sd-600">
              {n.name}
            </Link>
            <span className="text-xs text-slate-500 shrink-0">{n.avgDOM ?? "—"} days</span>
          </li>
        ))}
      </ul>
      <Link href="/market" className="inline-block mt-2 text-sm font-medium text-sd-600 hover:text-sd-700">
        More market signals →
      </Link>
    </section>
  );
}
