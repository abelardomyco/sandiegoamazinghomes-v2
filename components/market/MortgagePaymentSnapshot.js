"use client";

import Link from "next/link";

/**
 * Quick monthly payment estimate (one example); link to full calculator or contact.
 */

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return "$" + Number(n).toLocaleString();
}

export default function MortgagePaymentSnapshot({ mortgage }) {
  if (!mortgage) return null;
  const rate = mortgage.rate;
  const examples = mortgage.paymentExamples || [];
  const example = examples[1] || examples[0];
  const price = example ? example.price : 950000;
  const payment = example ? example.payment : null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="mortgage-snapshot-title">
      <h2 id="mortgage-snapshot-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Mortgage Payment Snapshot
      </h2>
      <p className="text-xs text-slate-500 mb-1.5">
        Est. at {rate != null ? `${Number(rate).toFixed(2)}%` : "—"} (30-yr fixed)
      </p>
      <div className="mb-2">
        <p className="text-xl font-semibold text-slate-900">
          {payment != null ? formatPrice(payment) : "—"}
          <span className="text-sm font-normal text-slate-500">/mo</span>
        </p>
        <p className="text-xs text-slate-600 mt-0.5">for a {formatPrice(price)} home (approx)</p>
      </div>
      <Link
        href="/#contact"
        className="text-sm font-medium text-sd-600 hover:text-sd-700"
      >
        Full calculator & pre-approval help →
      </Link>
    </section>
  );
}
