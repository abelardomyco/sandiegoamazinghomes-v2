"use client";

import { useEffect, useMemo, useState } from "react";

export default function RotatingInsights({ items = [] }) {
  const list = useMemo(() => (Array.isArray(items) ? items.filter(Boolean) : []), [items]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 3200);
    return () => clearInterval(t);
  }, [list.length]);

  if (!list.length) return null;

  return (
    <section aria-label="Micro insights" className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">Micro insights</h2>
        {list.length > 1 && (
          <span className="text-[11px] text-slate-500">
            {idx + 1}/{list.length}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-900 leading-snug">
        {list[idx]}
      </p>
    </section>
  );
}

