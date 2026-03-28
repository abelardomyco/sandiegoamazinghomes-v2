"use client";

/**
 * Inventory pressure: months of inventory + trend chart.
 */

export default function InventoryPressure({ monthsOfInventory, inventoryTrend = [] }) {
  const maxInv = inventoryTrend.length
    ? Math.max(...inventoryTrend.map((d) => d.inventory), 1)
    : 1;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4" aria-labelledby="inventory-pressure-title">
      <h2 id="inventory-pressure-title" className="text-base font-bold text-slate-900 mb-3">
        Inventory Pressure
      </h2>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Months of inventory</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">
            {monthsOfInventory != null ? monthsOfInventory.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Lower = seller&apos;s market</p>
        </div>
        {inventoryTrend.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Inventory trend</p>
            <div className="space-y-1.5">
              {inventoryTrend.map((d) => (
                <div key={d.month} className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 w-14 shrink-0">{d.label}</span>
                  <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-sd-600 rounded min-w-[2px]"
                      style={{ width: `${(d.inventory / maxInv) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-900 w-10 text-right">{d.inventory.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
