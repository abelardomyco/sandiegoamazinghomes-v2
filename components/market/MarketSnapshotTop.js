"use client";

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + Number(n).toLocaleString();
}

function DeltaPill({ value, invert }) {
  if (value == null || Number.isNaN(value)) return null;
  const up = value > 0;
  const good = invert ? !up : up;
  const sign = value > 0 ? "+" : "";
  const cls = good ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      <span aria-hidden>{up ? "↑" : "↓"}</span>
      {sign}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function Chip({ tone = "neutral", children }) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "bad"
        ? "border-rose-200 bg-rose-50 text-rose-800"
        : "border-slate-200 bg-slate-50 text-slate-700";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {children}
    </span>
  );
}

function MetricCard({ label, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 min-w-0">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide truncate">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        {children}
      </div>
    </div>
  );
}

export default function MarketSnapshotTop({
  medianPrice,
  medianPriceDeltaPct,
  daysOnMarket,
  daysOnMarketDeltaPct,
  inventoryLabel,
  buyerSellerLabel,
  priceReductionsPct,
  priceReductionsDeltaPts,
  interestRate,
  rateDirection,
}) {
  const invTone =
    inventoryLabel?.toLowerCase().includes("seller") ? "bad" : inventoryLabel?.toLowerCase().includes("buyer") ? "good" : "neutral";
  const buyerSellerTone =
    buyerSellerLabel?.toLowerCase().includes("seller") ? "bad" : buyerSellerLabel?.toLowerCase().includes("buyer") ? "good" : "neutral";

  return (
    <section aria-label="Market snapshot" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      <MetricCard label="Median price">
        <span className="text-sm font-semibold text-slate-900">{formatPrice(medianPrice)}</span>
        <DeltaPill value={medianPriceDeltaPct} />
      </MetricCard>

      <MetricCard label="Days on market">
        <span className="text-sm font-semibold text-slate-900">{daysOnMarket != null ? `${daysOnMarket}d` : "—"}</span>
        <DeltaPill value={daysOnMarketDeltaPct} invert />
      </MetricCard>

      <MetricCard label="Inventory level">
        <Chip tone={invTone}>{inventoryLabel || "—"}</Chip>
        <span className="text-[11px] text-slate-500">Supply</span>
      </MetricCard>

      <MetricCard label="Buyer vs seller">
        <Chip tone={buyerSellerTone}>{buyerSellerLabel || "—"}</Chip>
        <span className="text-[11px] text-slate-500">Leverage</span>
      </MetricCard>

      <MetricCard label="Price reductions">
        <span className="text-sm font-semibold text-slate-900">
          {priceReductionsPct != null ? `${priceReductionsPct}%` : "—"}
        </span>
        {priceReductionsDeltaPts != null ? (
          <span className={`text-[11px] font-semibold ${priceReductionsDeltaPts <= 0 ? "text-emerald-700" : "text-rose-700"}`}>
            {(priceReductionsDeltaPts > 0 ? "+" : "") + priceReductionsDeltaPts.toFixed(1)} pts
          </span>
        ) : (
          <span className="text-[11px] text-slate-500">vs last month</span>
        )}
      </MetricCard>

      <MetricCard label="Interest rate">
        <span className="text-sm font-semibold text-slate-900">
          {interestRate != null ? `${Number(interestRate).toFixed(2)}%` : "—"}
        </span>
        <span className="text-[11px] font-semibold text-slate-600">
          {rateDirection === "up" ? "↑" : rateDirection === "down" ? "↓" : "→"} {rateDirection || "stable"}
        </span>
      </MetricCard>
    </section>
  );
}

