"use client";

/**
 * Single compact trend chart (line or bar) for dashboard. Reusable for sales volume, DOM, price reduction %.
 */
function LineChart({ data, valueKey, height = 40 }) {
  if (!data || data.length === 0) return null;
  const values = data.map((d) => d[valueKey]).filter((v) => v != null);
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 100;
  const h = height;
  const padding = 2;
  const points = data.map((d, i) => {
    const x = padding + (data.length > 1 ? (i / (data.length - 1)) * (w - 2 * padding) : w / 2);
    const y = h - padding - ((d[valueKey] - min) / range) * (h - 2 * padding);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height: `${h}px` }}>
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sd-600" points={points} />
    </svg>
  );
}

/** Format a value for display. format: "number" | "percent" | "currency" | undefined (raw) */
function formatDisplayValue(value, format) {
  if (value == null) return "—";
  switch (format) {
    case "number":
      return typeof value === "number" ? value.toLocaleString() : String(value);
    case "percent":
      return `${value}%`;
    case "currency":
      return typeof value === "number" ? "$" + value.toLocaleString() : "$" + value;
    default:
      return value;
  }
}

export default function CompactTrendChart({ title, data, valueKey, format = "number", height = 40, className = "" }) {
  if (!data || data.length === 0) {
    return (
      <div className={`rounded-lg border border-slate-200 bg-white p-2 ${className}`}>
        <h3 className="text-xs font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-500">No data</p>
      </div>
    );
  }
  const first = data[0]?.[valueKey];
  const last = data[data.length - 1]?.[valueKey];
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-2 ${className}`}>
      <h3 className="text-xs font-bold text-slate-900 mb-1">{title}</h3>
      <LineChart data={data} valueKey={valueKey} height={height} />
      <div className="flex justify-between mt-0.5 text-[10px] text-slate-500">
        <span>{formatDisplayValue(first, format)}</span>
        <span>{formatDisplayValue(last, format)}</span>
      </div>
    </div>
  );
}
