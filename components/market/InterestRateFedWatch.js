"use client";

import Link from "next/link";

/**
 * Compact Interest Rate / Fed Watch panel. Structure ready for official or configurable rate data.
 */

export default function InterestRateFedWatch({ mortgage }) {
  if (!mortgage) return null;
  const { rate, rateDirection, rateNote } = mortgage;

  return (
    <section className="rounded-lg border border-slate-200 bg-white px-2.5 py-2" aria-labelledby="fed-watch-title">
      <h2 id="fed-watch-title" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
        Interest rate / Fed watch
      </h2>
      <p className="text-sm font-semibold text-slate-900">
        {rate != null ? `${Number(rate).toFixed(2)}%` : "—"} 30-yr fixed
        {rateDirection && rateDirection !== "stable" && (
          <span className={`ml-1 text-xs font-medium ${rateDirection === "up" ? "text-rose-600" : "text-emerald-600"}`}>
            {rateDirection === "up" ? "↑ trending up" : "↓ trending down"}
          </span>
        )}
      </p>
      <p className="text-xs text-slate-600 mt-0.5">
        {rateNote || "Rates affect monthly payments and buying power. We can help you run scenarios and connect you with pre-approval."}
      </p>
      <Link href="/#contact" className="inline-block mt-1.5 text-xs font-medium text-sd-600 hover:text-sd-700">
        Pre-approval & scenarios →
      </Link>
    </section>
  );
}
