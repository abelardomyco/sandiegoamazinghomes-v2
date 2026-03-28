"use client";

/**
 * Buyer vs seller advantage: score 1–10 (1 = buyer's market, 10 = seller's market), simple visual meter.
 */

export default function BuyerAdvantageMeter({ buyerAdvantage }) {
  const score = buyerAdvantage && typeof buyerAdvantage.score === "number"
    ? Math.max(1, Math.min(10, buyerAdvantage.score))
    : 5;
  const label = (buyerAdvantage && buyerAdvantage.label) || (score <= 3 ? "Buyer's market" : score >= 7 ? "Seller's market" : "Balanced");
  const pct = (score / 10) * 100;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="market-pulse-title">
      <h2 id="market-pulse-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Market Pulse Bar
      </h2>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500 shrink-0">Buyer</span>
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-500 shrink-0">Seller</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm font-semibold text-slate-900">{score}/10 — {label}</p>
      </div>
    </section>
  );
}
