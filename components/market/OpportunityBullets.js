"use client";

export default function OpportunityBullets({ title = "Where the opportunities are", items = [] }) {
  const list = Array.isArray(items) ? items.filter(Boolean).slice(0, 5) : [];
  if (!list.length) return null;
  return (
    <section className="rounded-lg border border-slate-200 bg-white px-3 py-2.5" aria-label={title}>
      <h2 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">{title}</h2>
      <ul className="mt-2 space-y-1.5 text-sm text-slate-800">
        {list.map((t, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-slate-400 mt-[2px]" aria-hidden>•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

