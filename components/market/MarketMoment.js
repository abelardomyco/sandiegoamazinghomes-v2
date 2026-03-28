"use client";

export default function MarketMoment({ text, updatedAt }) {
  if (!text || !text.trim()) return null;
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5" aria-label="Market moment">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">
          Market moment
        </h2>
        {updatedAt && (
          <span className="text-[11px] text-slate-500">Updated {updatedAt}</span>
        )}
      </div>
      <p className="text-sm text-slate-800 leading-snug mt-1">{text}</p>
    </section>
  );
}

