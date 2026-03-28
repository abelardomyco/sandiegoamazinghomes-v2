"use client";

import Link from "next/link";

/**
 * Hottest neighborhoods with links to neighborhood pages.
 */

export default function NeighborhoodMarketLeaders({ hottest = [] }) {
  const items = hottest.slice(0, 6);
  if (!items.length) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="market-leaders-title">
      <h2 id="market-leaders-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Neighborhood Market Leaders
      </h2>
      <p className="text-xs text-slate-500 mb-1.5">Hottest neighborhoods by demand</p>
      <ul className="space-y-0.5">
        {items.map((n) => (
          <li key={n.slug}>
            <Link href={"/neighborhoods/" + n.slug} className="text-sm font-medium text-slate-900 hover:text-sd-600">
              {n.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/neighborhoods" className="inline-block mt-1.5 text-xs font-medium text-sd-600 hover:text-sd-700">
        All neighborhoods →
      </Link>
    </section>
  );
}
