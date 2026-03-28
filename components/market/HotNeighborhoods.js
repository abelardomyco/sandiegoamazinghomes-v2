"use client";

import Link from "next/link";

/**
 * Hot neighborhoods: list with link to neighborhood page and optional See Homes.
 * Data: array of { slug, name, blurb }.
 */

export default function HotNeighborhoods({ items = [] }) {
  if (!items.length) {
    return (
<section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="hot-neighborhoods-title">
      <h2 id="hot-neighborhoods-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Neighborhood Highlights
      </h2>
      <p className="text-slate-500 text-sm">No data yet.</p>
    </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="hot-neighborhoods-title">
      <h2 id="hot-neighborhoods-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Neighborhood Highlights
      </h2>
      <ul className="space-y-1">
        {items.map((n) => (
          <li key={n.slug} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div>
              <Link
                href={`/neighborhoods/${n.slug}`}
                className="font-semibold text-slate-900 hover:text-sd-600"
              >
                {n.name}
              </Link>
              {n.blurb && <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{n.blurb}</p>}
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center text-sm font-medium text-sd-600 hover:text-sd-700 shrink-0"
            >
              Ask for listings →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
