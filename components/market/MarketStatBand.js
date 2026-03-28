"use client";

/**
 * Compact row of 6 market stat cards: Median Price, Active Listings, Days on Market,
 * Price per Sq Ft, Sales Volume, Price Reduction Rate. Optional delta indicators.
 */

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + Number(n).toLocaleString();
}

function Delta({ value, format, invert }) {
  if (value == null) return null;
  const isPositive = typeof value === "number" ? value > 0 : String(value).startsWith("+");
  const isGood = invert ? !isPositive : isPositive;
  const text =
    format === "percent"
      ? (typeof value === "number" && value > 0 ? "+" : "") + value.toFixed(1) + "%"
      : (typeof value === "number" && value > 0 ? "+" : "") + value;
  return (
    <span
      className={"ml-1 text-[10px] font-medium " + (isGood ? "text-emerald-600" : "text-rose-600")}
      aria-label={"Change: " + text}
    >
      {text}
    </span>
  );
}

function StatCard({ label, value, valueFormatter, delta, deltaFormat, deltaInvert }) {
  return (
    <div className="rounded border border-slate-200 bg-white px-2 py-1.5 min-w-0">
      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide truncate">{label}</p>
      <p className="text-sm font-semibold text-slate-900 mt-0.5 flex items-baseline flex-wrap">
        {valueFormatter ? valueFormatter(value) : value ?? "—"}
        {delta != null && <Delta value={delta} format={deltaFormat} invert={deltaInvert} />}
      </p>
    </div>
  );
}

export default function MarketStatBand({
  medianPrice,
  activeListings,
  daysOnMarket,
  pricePerSqft,
  salesVolume,
  priceReductionRate,
  medianPriceDelta,
  activeListingsDelta,
  daysOnMarketDelta,
  salesVolumeDelta,
  priceReductionRateDelta,
}) {
  return (
    <section
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5"
      aria-label="Market at a glance"
    >
      <StatCard
        label="Median Price"
        value={medianPrice}
        valueFormatter={formatPrice}
        delta={medianPriceDelta}
        deltaFormat="percent"
      />
      <StatCard
        label="Active Listings"
        value={activeListings}
        valueFormatter={(v) => (v != null ? v.toLocaleString() : "—")}
        delta={activeListingsDelta}
        deltaFormat="percent"
      />
      <StatCard
        label="Days on Market"
        value={daysOnMarket}
        delta={daysOnMarketDelta}
        deltaFormat="number"
        deltaInvert
      />
      <StatCard
        label="Median $/Sq Ft"
        value={pricePerSqft}
        valueFormatter={(v) => (v != null ? "$" + v : "—")}
      />
      <StatCard
        label="Sales Volume"
        value={salesVolume}
        valueFormatter={(v) => (v != null ? v.toLocaleString() : "—")}
        delta={salesVolumeDelta}
        deltaFormat="percent"
      />
      <StatCard
        label="Price Reduction Rate"
        value={priceReductionRate}
        valueFormatter={(v) => (v != null ? v + "%" : "—")}
        delta={priceReductionRateDelta}
        deltaFormat="number"
        deltaInvert
      />
    </section>
  );
}
