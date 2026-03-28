"use client";

/**
 * Inventory trend: simple bar/list display. Replace with chart library when needed.
 * Data: array of { month, label, inventory }.
 */

export default function InventoryTrend({ data = [] }) {
  if (!data.length) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4" aria-labelledby="inventory-trend-title">
        <h2 id="inventory-trend-title" className="text-base font-bold text-slate-900 mb-3">
          Inventory Trend
        </h2>
        <p className="text-slate-500 text-sm">No trend data yet.</p>
      </section>
    );
  }

  const maxInv = Math.max(...data.map((d) => d.inventory), 1);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4" aria-labelledby="inventory-trend-title">
      <h2 id="inventory-trend-title" className="text-base font-bold text-slate-900 mb-3">
        Monthly Inventory Trend
      </h2>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.month} className="flex items-center gap-2">
            <span className="text-xs text-slate-600 w-16 shrink-0">{d.label}</span>
            <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
              <div
                className="h-full bg-sd-600 rounded"
                style={{ width: `${(d.inventory / maxInv) * 100}%`, minWidth: d.inventory ? "4px" : 0 }}
              />
            </div>
            <span className="text-xs font-medium text-slate-900 w-12 text-right">{d.inventory.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
