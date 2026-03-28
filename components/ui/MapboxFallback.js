"use client";

import Link from "next/link";
import { MapPin, Mail } from "lucide-react";

/**
 * Polished fallback when NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set.
 * Use in ListingsMap, PropertyMap, NeighborhoodsMapMapbox.
 * Add token in .env.local — see .env.example and docs for Mapbox.
 */
export default function MapboxFallback({ className = "", compact = false }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-6 sm:p-8 ${className}`}
      role="region"
      aria-label="Map unavailable"
    >
      <p className="text-slate-700 font-medium mb-1">
        Interactive map is temporarily unavailable
      </p>
      <p className="text-slate-600 text-sm mb-5 max-w-sm">
        You can still browse neighborhoods below.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/neighborhoods"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 text-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-white transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Browse neighborhoods
        </Link>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 text-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-white transition-colors"
        >
          <Mail className="w-4 h-4" />
          Contact Rosamelia
        </Link>
      </div>
    </div>
  );
}
