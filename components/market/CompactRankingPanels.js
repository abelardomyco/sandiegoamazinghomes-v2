"use client";

import Link from "next/link";

/**
 * Tight leaderboard cards: Hottest, Cooling, Best Value in one row.
 */

function Panel({ items, title, id, subLabel }) {
  const list = items || [];
  if (list.length === 0) {
    return (
      <div className="rounded border border-slate-200 bg-white p-2 min-w-0">
        <h3 id={id} className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
          {title}
        </h3>
        <p className="text-[10px] text-slate-500">{subLabel}</p>
        <p className="text-xs text-slate-500 mt-1">—</p>
      </div>
    );
  }
  return (
    <div className="rounded border border-slate-200 bg-white p-2 min-w-0">
      <h3 id={id} className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
        {title}
      </h3>
      <p className="text-[10px] text-slate-500 mb-1">{subLabel}</p>
      <ul className="space-y-0.5">
        {list.slice(0, 5).map((n, i) => (
          <li key={n.slug || i}>
            <Link
              href={"/neighborhoods/" + (n.slug || "")}
              className="text-xs font-medium text-slate-900 hover:text-sd-600"
            >
              {i + 1}. {n.name}
              {n.avgDOM != null && <span className="text-slate-500 font-normal ml-0.5">({n.avgDOM}d)</span>}
              {n.priceChangePct != null && (
                <span className="text-slate-500 font-normal ml-0.5">({n.priceChangePct}%)</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CompactRankingPanels({
  hottest = [],
  cooling = [],
  bestValue = [],
}) {
  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-3 gap-1.5"
      aria-labelledby="compact-rankings-title"
    >
      <h2 id="compact-rankings-title" className="sr-only">
        Neighborhood rankings
      </h2>
      <Panel
        items={hottest}
        title="Hottest neighborhoods"
        id="rank-hottest"
        subLabel="Strong demand, fast movement"
      />
      <Panel
        items={cooling}
        title="Cooling neighborhoods"
        id="rank-cooling"
        subLabel="More room to negotiate"
      />
      <Panel
        items={bestValue}
        title="Best value areas"
        id="rank-value"
        subLabel="Price-to-value standouts"
      />
    </section>
  );
}
