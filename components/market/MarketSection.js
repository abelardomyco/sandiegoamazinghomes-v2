"use client";

/**
 * Editorial section wrapper for /market. Consistent card, title, and optional summary.
 */
export default function MarketSection({ id, title, summary, children, className = "" }) {
  return (
    <section
      id={id}
      className={`rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden ${className}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2
          id={id ? `${id}-title` : undefined}
          className="text-lg font-bold text-slate-900"
        >
          {title}
        </h2>
        {summary && (
          <p className="text-sm text-slate-600 mt-1">{summary}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
