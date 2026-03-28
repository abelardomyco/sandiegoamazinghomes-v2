"use client";

/**
 * Two small cards: who has more leverage right now (Buyer signal / Seller signal).
 */

export default function BuyerSellerSignal({ buyerAdvantage }) {
  const score = buyerAdvantage && typeof buyerAdvantage.score === "number"
    ? Math.max(1, Math.min(10, buyerAdvantage.score))
    : 5;
  const label = (buyerAdvantage && buyerAdvantage.label) || (score <= 3 ? "Buyer's market" : score >= 7 ? "Seller's market" : "Balanced");
  const buyerStrength = score <= 3 ? "strong" : score <= 5 ? "moderate" : "weak";
  const sellerStrength = score >= 7 ? "strong" : score >= 5 ? "moderate" : "weak";

  return (
    <section className="grid grid-cols-2 gap-1.5" aria-labelledby="buyer-seller-signal-title">
      <h2 id="buyer-seller-signal-title" className="sr-only">Buyer and seller leverage</h2>
      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Buyer signal</p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5 capitalize">{buyerStrength}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Leverage in negotiations</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Seller signal</p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5 capitalize">{sellerStrength}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">Current market: {label}</p>
      </div>
    </section>
  );
}
