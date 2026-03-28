"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const MONTHLY_MIN = 2000;
const MONTHLY_MAX = 12000;
const MONTHLY_STEP = 250;
const RATE_MIN = 4;
const RATE_MAX = 9;
const RATE_STEP = 0.25;
const DOWN_MIN = 0;
const DOWN_MAX = 50;
const DOWN_STEP = 5;
const LOAN_TERM_MONTHS = 360;

function paymentToLoanAmount(monthlyPayment, annualRatePct) {
  if (!monthlyPayment || monthlyPayment <= 0) return 0;
  const r = (annualRatePct || 0) / 100 / 12;
  if (r <= 0) return monthlyPayment * LOAN_TERM_MONTHS;
  const n = LOAN_TERM_MONTHS;
  const factor = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return monthlyPayment / factor;
}

function formatPrice(n) {
  if (n == null || Number.isNaN(n) || n < 0) return "—";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + Math.round(n);
}

/** Round to nearest 25000 for cleaner CTA. */
function roundToPrice(loanPlusDown) {
  const n = Math.round(loanPlusDown / 25000) * 25000;
  return Math.max(0, n);
}

export default function AffordabilityWidget() {
  const [monthlyBudget, setMonthlyBudget] = useState(4000);
  const [ratePct, setRatePct] = useState(6.75);
  const [downPct, setDownPct] = useState(20);

  const estimatedHomePrice = useMemo(() => {
    const loan = paymentToLoanAmount(monthlyBudget, ratePct);
    const downDecimal = (downPct || 0) / 100;
    if (downDecimal >= 1) return 0;
    const homePrice = loan / (1 - downDecimal);
    return roundToPrice(homePrice);
  }, [monthlyBudget, ratePct, downPct]);

  const priceMaxParam = estimatedHomePrice > 0 ? estimatedHomePrice : "";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="affordability-widget-title">
      <h2 id="affordability-widget-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Affordability
      </h2>
      <p className="text-xs text-slate-500 mb-2">Est. home price from your monthly budget (P&I, 30-yr fixed)</p>

      <div className="space-y-2">
        <label className="block">
          <span className="text-xs font-medium text-slate-600">Monthly budget (P&I)</span>
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="range"
              min={MONTHLY_MIN}
              max={MONTHLY_MAX}
              step={MONTHLY_STEP}
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none bg-slate-200 accent-sd-600"
            />
            <span className="text-sm font-semibold text-slate-900 w-16 text-right">{formatPrice(monthlyBudget)}/mo</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-slate-600">Interest rate (%)</span>
          <input
            type="number"
            min={RATE_MIN}
            max={RATE_MAX}
            step={RATE_STEP}
            value={ratePct}
            onChange={(e) => setRatePct(Number(e.target.value) || RATE_MIN)}
            className="mt-0.5 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-slate-600">Down payment (%)</span>
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="range"
              min={DOWN_MIN}
              max={DOWN_MAX}
              step={DOWN_STEP}
              value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none bg-slate-200 accent-sd-600"
            />
            <span className="text-sm font-semibold text-slate-900 w-10 text-right">{downPct}%</span>
          </div>
        </label>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">Estimated home price</p>
        <p className="text-lg font-semibold text-slate-900">{formatPrice(estimatedHomePrice)}</p>
        {priceMaxParam > 0 && (
          <Link
            href="/#contact"
            className="inline-block mt-1.5 rounded-lg bg-sd-600 text-white px-3 py-2 text-sm font-semibold hover:bg-sd-700"
          >
            Ask for options under {formatPrice(estimatedHomePrice)}
          </Link>
        )}
      </div>
    </section>
  );
}
