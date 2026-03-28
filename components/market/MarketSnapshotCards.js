"use client";

function Card({ text, tone = "neutral" }) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : tone === "bad"
        ? "border-rose-200 bg-rose-50 text-rose-950"
        : "border-slate-200 bg-white text-slate-900";
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm font-semibold leading-snug ${cls}`}>
      {text}
    </div>
  );
}

export default function MarketSnapshotCards({ items = [] }) {
  const list = Array.isArray(items) ? items.filter(Boolean).slice(0, 4) : [];
  if (!list.length) return null;
  return (
    <section aria-label="Market snapshot cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {list.map((it, i) => (
        <Card key={i} text={it.text} tone={it.tone} />
      ))}
    </section>
  );
}

