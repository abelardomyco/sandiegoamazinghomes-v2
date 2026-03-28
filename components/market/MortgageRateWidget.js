"use client";

/**
 * Mortgage rate widget: latest rate + monthly payment examples.
 */

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + Number(n).toLocaleString();
}

export default function MortgageRateWidget({ mortgage }) {
  if (!mortgage) return null;
  const { rate, paymentExamples = [] } = mortgage;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="mortgage-widget-title">
      <h2 id="mortgage-widget-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Mortgage Rate
      </h2>
      <div className="mb-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Current average (30-yr fixed)</p>
        <p className="text-2xl font-semibold text-slate-900 mt-0.5">
          {rate != null ? `${Number(rate).toFixed(2)}%` : "—"}
        </p>
      </div>
      {paymentExamples.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Monthly payment (approx)</p>
          <ul className="space-y-1">
            {paymentExamples.map((ex, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-slate-600">Home at {formatPrice(ex.price)}</span>
                <span className="font-medium text-slate-900">~{formatPrice(ex.payment)}/mo</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
