"use client";

import { useRef, useState } from "react";

function monthlyPI(principal, annualPct, years = 30) {
  if (principal <= 0 || annualPct < 0) return 0;
  const r = annualPct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

function paymentFromValues(price, downPct, rate) {
  if (!Number.isFinite(price) || !Number.isFinite(downPct) || !Number.isFinite(rate)) return 0;
  const loan = Math.max(0, price * (1 - Math.min(100, Math.max(0, downPct)) / 100));
  return Math.round(monthlyPI(loan, rate, 30));
}

function parseInput(ref) {
  const raw = ref?.current?.value;
  if (raw == null || String(raw).trim() === "") return NaN;
  const n = parseFloat(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

const btnClass =
  "shrink-0 rounded border border-slate-300 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-700 hover:bg-slate-100 active:bg-slate-200";

const numberInputClass =
  "w-full min-w-0 rounded border border-slate-200 px-1.5 py-1 text-xs tabular-nums";

/**
 * Uncontrolled number inputs + refs so Calculate always reads the live DOM values.
 * (Controlled number inputs + valueAsNumber often break typing and clicks in React.)
 */
export default function MarketMiniMortgage({
  defaultPrice = 950000,
  defaultDownPct = 20,
  defaultRate = 6.75,
}) {
  const priceRef = useRef(null);
  const downRef = useRef(null);
  const rateRef = useRef(null);

  const [payment, setPayment] = useState(() =>
    paymentFromValues(Number(defaultPrice), Number(defaultDownPct), Number(defaultRate))
  );

  const calculate = () => {
    const price = parseInput(priceRef);
    const downPct = parseInput(downRef);
    const rate = parseInput(rateRef);
    if (!Number.isFinite(price) || !Number.isFinite(downPct) || !Number.isFinite(rate)) {
      setPayment(0);
      return;
    }
    setPayment(paymentFromValues(price, downPct, rate));
  };

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 h-auto self-start w-full min-h-0"
      aria-label="Estimated mortgage payment"
    >
      <h2 className="m-0 text-[11px] font-extrabold text-slate-700 uppercase tracking-wide leading-tight">
        Mortgage mini (est.)
      </h2>
      <p className="m-0 text-[10px] text-slate-500 mt-0.5 leading-tight">
        Ballpark P&amp;I — not a quote; tax, insurance, HOA extra.
      </p>
      <div className="mt-0.5 grid grid-cols-3 gap-1">
        <label className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[9px] font-bold text-slate-500 uppercase">Price</span>
          <input
            ref={priceRef}
            type="number"
            inputMode="numeric"
            min={0}
            step={10000}
            autoComplete="off"
            defaultValue={defaultPrice}
            className={numberInputClass}
          />
        </label>
        <label className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[9px] font-bold text-slate-500 uppercase">Down %</span>
          <input
            ref={downRef}
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            autoComplete="off"
            defaultValue={defaultDownPct}
            className={numberInputClass}
          />
        </label>
        <label className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[9px] font-bold text-slate-500 uppercase">Rate %</span>
          <input
            ref={rateRef}
            type="number"
            inputMode="decimal"
            min={0}
            max={20}
            step={0.125}
            autoComplete="off"
            defaultValue={defaultRate}
            className={numberInputClass}
          />
        </label>
      </div>
      <p className="m-0 mt-0.5 flex flex-nowrap items-baseline gap-x-1.5 leading-tight min-w-0">
        <span className="text-sm font-bold text-slate-900 tabular-nums shrink-0">
          ~${payment.toLocaleString()}/mo
        </span>
        <button type="button" className={btnClass} onClick={calculate}>
          Calculate
        </button>
        <span className="text-[11px] font-semibold text-slate-500">est. P&amp;I</span>
      </p>
    </section>
  );
}
