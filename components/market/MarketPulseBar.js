"use client";

function Chip({ label, value, tone = "neutral" }) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
      : tone === "bad"
        ? "bg-rose-50 text-rose-900 border-rose-200"
        : "bg-white text-slate-900 border-slate-200";
  return (
    <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <span className="text-slate-500 font-extrabold uppercase tracking-wide text-[10px]">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export default function MarketPulseBar({ items = [] }) {
  const list = Array.isArray(items) ? items.filter(Boolean).slice(0, 5) : [];
  if (!list.length) return null;
  return (
    <section
      aria-label="Market pulse"
      className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50/60 px-2 py-1 overflow-x-auto"
    >
      <div className="flex gap-1.5 min-w-max">
        {list.map((it) => (
          <Chip key={it.label} label={it.label} value={it.value} tone={it.tone} />
        ))}
      </div>
    </section>
  );
}

