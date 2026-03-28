"use client";

/**
 * Top market signals row: compact cards only (no charts).
 * 1. Price per Sq Ft  2. Days on Market  3. Monthly Sales Volume
 * 4. Interest Rate Watch  5. Inventory Pressure
 */

function formatNum(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

function Arrow({ direction, positive }) {
  const isUp = direction === "up";
  const color = positive ? "text-emerald-600" : "text-rose-600";
  return (
    <span className={`inline-flex ${color}`} aria-hidden>
      {isUp ? "↑" : "↓"}
    </span>
  );
}

function SignalCard({ label, value, valueFormat, pctChange, positive, sub }) {
  const showPct = pctChange != null;
  const good = positive === true;
  const bad = positive === false;
  const pctClass = showPct ? (good ? "text-emerald-600" : bad ? "text-rose-600" : "text-slate-600") : "";
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 min-w-0">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide truncate">{label}</p>
      <div className="flex items-baseline gap-1 mt-0.5 flex-wrap">
        <span className="text-sm font-semibold text-slate-900">
          {valueFormat === "currency" && value != null ? "$" + Number(value).toLocaleString() : valueFormat === "number" ? formatNum(value) : value ?? "—"}
        </span>
        {showPct && (
          <span className={`text-xs font-medium ${pctClass}`}>
            {(pctChange >= 0 ? "+" : "") + pctChange}%
          </span>
        )}
        {showPct && (good || bad) && (
          <Arrow direction={positive ? "up" : "down"} positive={good} />
        )}
      </div>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function MarketSignalCards({ signals }) {
  if (!signals) return null;

  const {
    pricePerSqft,
    pricePerSqftPct,
    pricePerSqftDirection,
    daysOnMarket,
    daysOnMarketPct,
    daysOnMarketImproving,
    salesVolume,
    salesVolumePct,
    salesVolumeDirection,
    rate,
    rateDirection,
    rateNote,
    inventoryLabel,
    inventoryMetric,
  } = signals;

  return (
    <section
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5"
      aria-label="Market signals at a glance"
    >
      <SignalCard
        label="Price per sq ft"
        value={pricePerSqft != null ? "$" + Number(pricePerSqft).toLocaleString() : null}
        valueFormat={null}
        pctChange={pricePerSqftPct}
        positive={pricePerSqftDirection === "up"}
        sub="County median"
      />
      <SignalCard
        label="Days on market"
        value={daysOnMarket}
        valueFormat="number"
        pctChange={daysOnMarketPct}
        positive={daysOnMarketPct != null ? daysOnMarketPct <= 0 : null}
        sub={daysOnMarket != null ? `${daysOnMarket} days` : null}
      />
      <SignalCard
        label="Monthly sales volume"
        value={salesVolume}
        valueFormat="number"
        pctChange={salesVolumePct}
        positive={salesVolumeDirection === "up"}
      />
      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 min-w-0">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Interest rate watch</p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5">
          {rate != null ? `${Number(rate).toFixed(2)}%` : "—"}
          {rateDirection && rateDirection !== "stable" && (
            <span className={`ml-1 text-xs font-medium ${rateDirection === "up" ? "text-rose-600" : "text-emerald-600"}`}>
              {rateDirection === "up" ? "↑" : "↓"}
            </span>
          )}
        </p>
        {rateNote && <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{rateNote}</p>}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 min-w-0">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Inventory pressure</p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5">{inventoryLabel ?? "—"}</p>
        {inventoryMetric && <p className="text-[10px] text-slate-500 mt-0.5">{inventoryMetric}</p>}
      </div>
    </section>
  );
}
