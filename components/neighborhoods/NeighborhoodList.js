"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Check } from "lucide-react";

const ALL_REGIONS = "All regions";
const NEIGHBORHOOD_HERO_FALLBACK = "/images/placeholder-listing.svg";
const EXCLUDED_HERO_PATTERNS = [
  "royal california real estate",
  "Screen-Shot-2025-01-03-hero",
];
function safeHeroSrc(src) {
  if (!src) return NEIGHBORHOOD_HERO_FALLBACK;
  const lower = src.toLowerCase();
  if (EXCLUDED_HERO_PATTERNS.some((p) => lower.includes(p.toLowerCase()))) return NEIGHBORHOOD_HERO_FALLBACK;
  return src;
}

function ListCardImage({ src, alt }) {
  const [error, setError] = useState(false);
  const resolvedSrc = error ? NEIGHBORHOOD_HERO_FALLBACK : safeHeroSrc(src);
  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 144px, 176px"
      onError={() => setError(true)}
    />
  );
}

/** From scores object, return sorted entries for display: [{ label, value }, ...] (top N by value). */
function scoreEntries(scores, limit = 6) {
  if (!scores || typeof scores !== "object") return [];
  const entries = Object.entries(scores)
    .filter(([, v]) => typeof v === "number")
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
  return entries;
}

export default function NeighborhoodList({ neighborhoods }) {
  const [region, setRegion] = useState(ALL_REGIONS);
  const [selectedVibes, setSelectedVibes] = useState(new Set());

  const regions = useMemo(() => {
    const set = new Set(neighborhoods.map((n) => n.region));
    return [ALL_REGIONS, ...Array.from(set).sort()];
  }, [neighborhoods]);

  const allVibes = useMemo(() => {
    const set = new Set(neighborhoods.flatMap((n) => n.vibeTags || []));
    return Array.from(set).sort();
  }, [neighborhoods]);

  const toggleVibe = (v) => {
    setSelectedVibes((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return neighborhoods.filter((n) => {
      const matchRegion = region === ALL_REGIONS || n.region === region;
      const matchVibes =
        selectedVibes.size === 0 ||
        (n.vibeTags && n.vibeTags.some((t) => selectedVibes.has(t)));
      return matchRegion && matchVibes;
    });
  }, [neighborhoods, region, selectedVibes]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start gap-3 rounded-lg bg-slate-50/80 px-3 py-2.5 border border-slate-100">
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="select-field py-1.5 text-sm min-w-[8rem] border-slate-200"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-600">Vibe</span>
            <div className="flex flex-wrap gap-1">
              {allVibes.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleVibe(v)}
                  className={`tag inline-flex items-center gap-1 text-xs ${
                    selectedVibes.has(v) ? "tag-active" : "tag-default"
                  }`}
                >
                  {selectedVibes.has(v) && <Check className="w-3 h-3" />}
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full flex items-center justify-between gap-3 mt-1">
            <span className="text-[11px] text-slate-500 truncate">
              Click any neighborhood to see what it’s actually like to live there.
            </span>
            <span className="text-xs text-slate-500 flex-shrink-0">
              <span className="font-medium text-slate-600">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "area" : "areas"}
              {region !== ALL_REGIONS && ` · ${region}`}
            </span>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden">
        {filtered.map((n) => {
          const entries = scoreEntries(n.scores);
          return (
            <li key={n.slug}>
              <Link
                href={`/neighborhoods/${n.slug}`}
                className="group flex flex-wrap items-center gap-x-5 gap-y-3 px-4 sm:px-5 py-4 sm:py-5 hover:bg-slate-50 transition-colors sm:flex-nowrap"
              >
                <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
                  <div className="relative w-36 h-24 sm:w-44 sm:h-28 flex-shrink-0 rounded-md bg-slate-100 overflow-hidden border border-slate-200/80 shadow-sm">
                    <ListCardImage src={n.heroImageResolved ?? n.heroImage} alt="" />
                  </div>
                  <div className="min-w-0 max-w-[11rem] sm:max-w-[15rem]">
                    <h2 className="font-semibold text-slate-900 text-base sm:text-lg leading-snug truncate">
                      {n.name}
                    </h2>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {n.region}
                    </span>
                  </div>
                </div>
                <p className="flex-1 min-w-0 text-sm text-slate-600 line-clamp-2 sm:line-clamp-3 hidden sm:block leading-relaxed">
                  {n.shortIntro || "Neighborhood in " + n.region + "."}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-[14.5rem] sm:w-[16rem] flex-shrink-0">
                  {entries.map(({ label, value }) => (
                    <span
                      key={label}
                      className="inline-flex items-center justify-between rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700"
                      title={`${label}: ${value}/10`}
                    >
                      <span className="text-slate-500 font-normal truncate">{label}</span>
                      <span className="ml-1 font-semibold text-slate-800 flex-shrink-0">{value}</span>
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-sd-600 group-hover:underline flex-shrink-0">
                  View →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center">
          <p className="text-sm text-slate-600">No areas match. Try a different region or vibe.</p>
        </div>
      )}
    </div>
  );
}
