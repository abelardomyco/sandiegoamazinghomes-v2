"use client";

export default function MicroInsights({ items = [] }) {
  const list = Array.isArray(items) ? items.filter(Boolean).slice(0, 3) : [];
  if (!list.length) return null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-2" aria-label="Micro insights">
      {list.map((t, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">Insight</p>
          <p className="text-sm text-slate-800 leading-snug mt-1">{t}</p>
        </div>
      ))}
    </section>
  );
}

