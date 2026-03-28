"use client";

import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

const PRICE_OPTIONS = [
  { value: "", label: "Any price" },
  { value: "200000", label: "$200K+" },
  { value: "500000", label: "$500K+" },
  { value: "750000", label: "$750K+" },
  { value: "1000000", label: "$1M+" },
  { value: "1500000", label: "$1.5M+" },
  { value: "2000000", label: "$2M+" },
  { value: "3000000", label: "$3M+" },
  { value: "5000000", label: "$5M+" },
];

export default function HomeFilters({
  priceMin,
  priceMax,
  bedsMin,
  bathsMin,
  propertyType,
  neighborhood,
  neighborhoods = [],
  propertyTypes = [],
  onFilterChange,
}) {
  const set = useCallback(
    (key, value) => {
      onFilterChange({ [key]: value });
    },
    [onFilterChange]
  );

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </span>
      <label className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500">Min price</span>
        <select
          value={priceMin ?? ""}
          onChange={(e) => set("priceMin", e.target.value)}
          className="select-field py-1.5 text-sm min-w-[5rem] border-slate-200"
        >
          {PRICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500">Max price</span>
        <select
          value={priceMax ?? ""}
          onChange={(e) => set("priceMax", e.target.value)}
          className="select-field py-1.5 text-sm min-w-[5rem] border-slate-200"
        >
          {PRICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500">Beds</span>
        <select
          value={bedsMin ?? ""}
          onChange={(e) => set("bedsMin", e.target.value)}
          className="select-field py-1.5 text-sm min-w-[4rem] border-slate-200"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}+</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500">Baths</span>
        <select
          value={bathsMin ?? ""}
          onChange={(e) => set("bathsMin", e.target.value)}
          className="select-field py-1.5 text-sm min-w-[4rem] border-slate-200"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>{n}+</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500">Type</span>
        <select
          value={propertyType ?? ""}
          onChange={(e) => set("propertyType", e.target.value)}
          className="select-field py-1.5 text-sm min-w-[7rem] border-slate-200"
        >
          <option value="">Any</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500">Area</span>
        <select
          value={neighborhood ?? ""}
          onChange={(e) => set("neighborhood", e.target.value)}
          className="select-field py-1.5 text-sm min-w-[8rem] border-slate-200"
        >
          <option value="">All areas</option>
          {neighborhoods.map((n) => (
            <option key={n.slug} value={n.slug}>{n.name}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
