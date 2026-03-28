"use client";

import Link from "next/link";

/**
 * Property neighborhood block: link to neighborhood page + optional nearby areas.
 */
export default function PropertyNeighborhood({ neighborhood, nearby = [] }) {
  if (!neighborhood && (!nearby || nearby.length === 0)) return null;

  return (
    <div className="border-t border-slate-200 pt-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Neighborhood</h2>
      {neighborhood && (
        <p className="text-slate-600 mb-3">
          <Link
            href={`/neighborhoods/${neighborhood.slug}`}
            className="font-medium text-sd-600 hover:text-sd-700"
          >
            {neighborhood.name}
          </Link>
          {neighborhood.shortIntro && (
            <span className="block text-sm mt-1 text-slate-500">{neighborhood.shortIntro}</span>
          )}
        </p>
      )}
      {nearby && nearby.length > 0 && (
        <>
          <p className="text-sm text-slate-600 mb-2">Nearby areas</p>
          <ul className="flex flex-wrap gap-2">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/neighborhoods/${n.slug}`}
                  className="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 hover:border-sd-300 transition-colors"
                >
                  {n.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
