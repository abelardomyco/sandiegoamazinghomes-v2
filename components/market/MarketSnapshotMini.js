"use client";

function Pill({ tone = "neutral", icon, title, value }) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : tone === "bad"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-slate-200 bg-white text-slate-900";
  return (
    <div className={`rounded-lg border px-3 py-2 min-w-0 ${cls}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 flex items-baseline gap-2">
        {icon && <span className="text-base" aria-hidden>{icon}</span>}
        <span className="text-sm font-semibold truncate">{value}</span>
      </p>
    </div>
  );
}

export default function MarketSnapshotMini({ marketType, priceDirection, inventory, buyerAdvantage }) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-2" aria-label="Market snapshot">
      <Pill
        title="Market type"
        icon="●"
        tone={marketType?.toLowerCase().includes("competitive") ? "bad" : marketType?.toLowerCase().includes("buyer") ? "good" : "neutral"}
        value={marketType || "—"}
      />
      <Pill
        title="Price direction"
        icon={priceDirection?.startsWith("Up") ? "↑" : priceDirection?.startsWith("Down") ? "↓" : "→"}
        tone={priceDirection?.startsWith("Down") ? "good" : priceDirection?.startsWith("Up") ? "bad" : "neutral"}
        value={priceDirection || "—"}
      />
      <Pill
        title="Inventory"
        icon={inventory?.toLowerCase().includes("low") ? "↓" : inventory?.toLowerCase().includes("increasing") ? "↑" : "→"}
        tone={inventory?.toLowerCase().includes("low") ? "bad" : inventory?.toLowerCase().includes("increasing") ? "good" : "neutral"}
        value={inventory || "—"}
      />
      <Pill
        title="Buyer advantage"
        icon={buyerAdvantage?.toLowerCase().includes("high") ? "↑" : buyerAdvantage?.toLowerCase().includes("low") ? "↓" : "→"}
        tone={buyerAdvantage?.toLowerCase().includes("high") ? "good" : buyerAdvantage?.toLowerCase().includes("low") ? "bad" : "neutral"}
        value={buyerAdvantage || "—"}
      />
    </section>
  );
}

