"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function getStrengthColor(strength) {
  if (strength >= 0.7) return "fill-emerald-500 stroke-emerald-700";
  if (strength >= 0.5) return "fill-sd-500 stroke-sd-700";
  if (strength >= 0.35) return "fill-amber-400 stroke-amber-600";
  return "fill-rose-400 stroke-rose-600";
}

export default function MarketMatrix({ matrixData }) {
  const data = matrixData || [];
  const [hoverSlug, setHoverSlug] = useState(null);

  const chart = useMemo(() => {
    if (!data.length) return { points: [], width: 100, height: 72, padding: 10 };
    const w = 100;
    const h = 72;
    const pad = 10;
    const xMin = Math.min(...data.map((d) => d.priceGrowth));
    const xMax = Math.max(...data.map((d) => d.priceGrowth));
    const yMin = Math.min(...data.map((d) => d.inventoryPressure));
    const yMax = Math.max(...data.map((d) => d.inventoryPressure));
    const xRange = xMax - xMin || 0.5;
    const yRange = yMax - yMin || 0.5;
    const scaleX = (v) => pad + ((v - xMin) / xRange) * (w - 2 * pad);
    const scaleY = (v) => h - pad - ((v - yMin) / yRange) * (h - 2 * pad);
    const minStr = Math.min(...data.map((d) => d.marketStrength));
    const sizeRange = Math.max(...data.map((d) => d.marketStrength)) - minStr || 1;
    const points = data.map((d) => ({
      ...d,
      cx: scaleX(d.priceGrowth),
      cy: scaleY(d.inventoryPressure),
      r: 3 + (4 * (d.marketStrength - minStr)) / sizeRange,
    }));
    return { points, width: w, height: h, padding: pad };
  }, [data]);

  if (data.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="market-matrix-title">
        <h2 id="market-matrix-title" className="text-sm font-bold text-slate-900 mb-2">
          Neighborhood market matrix
        </h2>
        <p className="text-xs text-slate-500">Connect neighborhood metrics to compare markets.</p>
      </section>
    );
  }

  const hovered = chart.points.find((p) => p.slug === hoverSlug);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="market-matrix-title">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h2 id="market-matrix-title" className="text-sm font-bold text-slate-900">
          Neighborhood market matrix
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>Low price growth</span>
          <span>High</span>
        </div>
      </div>
      <p className="text-[10px] text-slate-500 mb-1.5">
        X: price growth, Y: inventory pressure, color: market strength
      </p>
      <div className="relative">
        <svg
          viewBox={"0 0 " + chart.width + " " + chart.height}
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ height: "220px" }}
          aria-hidden
        >
          <line
            x1={chart.padding}
            y1={chart.height - chart.padding}
            x2={chart.width - chart.padding}
            y2={chart.height - chart.padding}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-slate-300"
          />
          <line
            x1={chart.padding}
            y1={chart.height - chart.padding}
            x2={chart.padding}
            y2={chart.padding}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-slate-300"
          />
          {chart.points.map((p) => (
            <g
              key={p.slug}
              onMouseEnter={() => setHoverSlug(p.slug)}
              onMouseLeave={() => setHoverSlug(null)}
            >
              <Link href={"/neighborhoods/" + p.slug} className="cursor-pointer">
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  className={getStrengthColor(p.marketStrength) + " stroke-[1.5] hover:opacity-90"}
                  aria-label={p.name + ", strength " + (p.marketStrength * 100).toFixed(0)}
                />
              </Link>
            </g>
          ))}
        </svg>
        {hovered && (
          <div
            className="absolute bottom-0 left-0 right-0 rounded bg-slate-800 text-white px-2 py-1 text-xs font-medium flex items-center justify-between"
            role="status"
          >
            <span>
              <Link href={"/neighborhoods/" + hovered.slug} className="hover:underline font-semibold">
                {hovered.name}
              </Link>
              {" · strength " + (hovered.marketStrength * 100).toFixed(0) + "%"}
            </span>
          </div>
        )}
      </div>
      <p className="text-[10px] text-slate-500 mt-1">
        <Link href="/market" className="text-sd-600 hover:underline">
          Market dashboard
        </Link>
      </p>
    </section>
  );
}
