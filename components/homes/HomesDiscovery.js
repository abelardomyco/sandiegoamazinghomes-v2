"use client";

import { useMemo, useState, useCallback } from "react";
import HomeFilters from "./HomeFilters";
import ListingCard from "./ListingCard";
import ListingsMap from "./ListingsMap";
import SaveSearchButton from "@/components/lead/SaveSearchButton";

const DEFAULT_FILTERS = {
  priceMin: "",
  priceMax: "",
  bedsMin: "",
  bathsMin: "",
  propertyType: "",
  neighborhood: "",
};

export default function HomesDiscovery({ initialListings = [], dataSource = "placeholder", neighborhoods = [], propertyTypes = [], mapboxToken, initialFilters = {} }) {
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  }));
  const isLive = dataSource === "rentcast_live";

  const filtered = useMemo(() => {
    let list = initialListings;
    const { priceMin, priceMax, bedsMin, bathsMin, propertyType, neighborhood } = filters;
    if (priceMin) {
      const p = Number(priceMin);
      if (!Number.isNaN(p)) list = list.filter((l) => l.price >= p);
    }
    if (priceMax) {
      const p = Number(priceMax);
      if (!Number.isNaN(p)) list = list.filter((l) => l.price <= p);
    }
    if (bedsMin) {
      const b = Number(bedsMin);
      if (!Number.isNaN(b)) list = list.filter((l) => (l.beds || 0) >= b);
    }
    if (bathsMin) {
      const b = Number(bathsMin);
      if (!Number.isNaN(b)) list = list.filter((l) => (l.baths || 0) >= b);
    }
    if (propertyType) {
      list = list.filter((l) => (l.propertyType || "").toLowerCase() === propertyType.toLowerCase());
    }
    if (neighborhood) {
      list = list.filter((l) => (l.neighborhood || "") === neighborhood);
    }
    return list;
  }, [initialListings, filters]);

  const handleFilterChange = useCallback((next) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const handleMarkerClick = useCallback((id) => {
    const el = document.getElementById(`listing-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const slugToName = useMemo(() => {
    const m = {};
    neighborhoods.forEach((n) => { m[n.slug] = n.name; });
    return m;
  }, [neighborhoods]);

  return (
    <div className="flex flex-col h-full min-h-[70vh]">
      <HomeFilters
        {...filters}
        onFilterChange={handleFilterChange}
        neighborhoods={neighborhoods}
        propertyTypes={propertyTypes}
      />
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
            isLive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
          }`}
          title={isLive ? "Listings from live API" : "Sample data from placeholder"}
        >
          {isLive ? "Live listings" : "Sample data"}
        </span>
        <span className="text-slate-500 text-xs">
          {filtered.length} {filtered.length === 1 ? "home" : "homes"}
        </span>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 mt-2 min-h-0">
        <div className="flex flex-col min-h-[320px] lg:min-h-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h2 className="text-sm font-semibold text-slate-700 sr-only">
              Listings
            </h2>
            <SaveSearchButton
              filtersJson={{
                priceMin: filters.priceMin || undefined,
                priceMax: filters.priceMax || undefined,
                bedsMin: filters.bedsMin || undefined,
                bathsMin: filters.bathsMin || undefined,
                propertyType: filters.propertyType || undefined,
                neighborhood: filters.neighborhood || undefined,
              }}
              name="Homes search"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filtered.length === 0 ? (
              <p className="text-slate-500 text-sm py-6">No listings match your filters.</p>
            ) : (
              filtered.map((listing) => (
                <div key={listing.id} id={`listing-${listing.id}`}>
                  <ListingCard
                    listing={listing}
                    neighborhoodName={slugToName[listing.neighborhood]}
                  />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="h-[300px] lg:h-auto lg:min-h-[400px] sticky top-4">
          <ListingsMap
            listings={filtered}
            onMarkerClick={handleMarkerClick}
            accessToken={mapboxToken}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
