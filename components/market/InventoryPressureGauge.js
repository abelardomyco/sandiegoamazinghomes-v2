"use client";

export default function InventoryPressureGauge({ monthsOfInventory, buyerAdvantage }) {
  const months = monthsOfInventory != null ? Number(monthsOfInventory) : null;
  const label = buyerAdvantage && buyerAdvantage.label ? buyerAdvantage.label : (months >= 4 ? "Buyer's market" : months <= 2 ? "Seller's market" : "Balanced");

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="inventory-gauge-title">
      <h2 id="inventory-gauge-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Inventory Pressure Gauge
      </h2>
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <p className="text-xl font-semibold text-slate-900">{months != null ? months.toFixed(1) : "—"}</p>
        <p className="text-xs text-slate-500">months of inventory</p>
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs font-medium text-slate-500">Market:</span>
        <span className="text-sm font-semibold text-slate-900">{label}</span>
      </div>
      <p className="text-xs text-slate-500 leading-snug">
        Under 3 months favors sellers; over 4 months favors buyers.
      </p>
    </section>
  );
}
