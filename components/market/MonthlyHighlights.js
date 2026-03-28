"use client";

/**
 * Monthly highlights: snapshot, trends, luxury, first-time blurbs.
 * Data: array of { title, summary, slug }.
 */

export default function MonthlyHighlights({ items = [] }) {
  if (!items.length) {
    return (
<section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="monthly-highlights-title">
      <h2 id="monthly-highlights-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Monthly Trends
      </h2>
      <p className="text-slate-500 text-sm">No trends yet.</p>
    </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="monthly-highlights-title">
      <h2 id="monthly-highlights-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Monthly Trends
      </h2>
      <ul className="space-y-1">
        {items.map((h) => (
          <li key={h.slug} className="p-2 rounded-lg border border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-900">{h.title}</h3>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{h.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
