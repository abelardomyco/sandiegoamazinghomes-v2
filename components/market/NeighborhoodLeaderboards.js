"use client";

import Link from "next/link";

export default function NeighborhoodLeaderboards({ leaderboards }) {
  const hottest = (leaderboards && leaderboards.hottest) || [];
  const bestValue = (leaderboards && leaderboards.bestValue) || [];
  const fastestSelling = (leaderboards && leaderboards.fastestSelling) || [];

  function List({ items, title, id }) {
    if (!items.length) return null;
    return (
      <div>
        <h3 id={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          {title}
        </h3>
        <ul className="space-y-0.5">
          {items.map((n, i) => (
            <li key={n.slug || i}>
              <Link href={`/neighborhoods/${n.slug}`} className="text-sm font-medium text-slate-900 hover:text-sd-600">
                {n.name}
                {n.avgDOM != null && <span className="text-slate-500 font-normal ml-1">({n.avgDOM} days)</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-2" aria-labelledby="leaderboards-title">
      <h2 id="leaderboards-title" className="text-sm font-bold text-slate-900 mb-1.5">
        Neighborhood Leaderboards
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <List items={hottest} title="Hottest" id="leaderboard-hottest" />
        <List items={bestValue} title="Best value" id="leaderboard-value" />
        <List items={fastestSelling} title="Fastest selling" id="leaderboard-fastest" />
      </div>
    </section>
  );
}
