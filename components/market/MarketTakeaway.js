"use client";

/** 2–3 sentence market summary. Compact, high-signal block. */
export default function MarketTakeaway({ text }) {
  if (!text || !text.trim()) return null;
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-2" aria-labelledby="market-takeaway-title">
      <h2 id="market-takeaway-title" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
        Market takeaway
      </h2>
      <p className="text-sm text-slate-800 leading-snug">{text}</p>
    </section>
  );
}
