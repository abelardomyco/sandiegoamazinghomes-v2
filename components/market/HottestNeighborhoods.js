"use client";

import Link from "next/link";

/**
 * Hottest neighborhoods: list with links to neighborhood and homes.
 * Data: array of { slug, name } (leaderboards.hottest).
 */
export default function HottestNeighborhoods({ items = [] }) {
  if (!items.length) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="hottest-title">
        <h2 id="hottest-title" className="text-sm font-bold text-slate-900 mb-1.5">
          Hottest Neighborhoods
        </h2>
        <p className="text-slate-500 text-sm">No data yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="hottest-title">
      <h2 id="hottest-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Hottest Neighborhoods
      </h2>
      <ul className="space-y-1">
        {items.map((n) => (
          <li key={n.slug} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <Link
              href={`/neighborhoods/${n.slug}`}
              className="font-semibold text-slate-900 hover:text-sd-600"
            >
              {n.name}
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-sd-600 hover:text-sd-700 shrink-0"
            >
              Ask for listings →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
