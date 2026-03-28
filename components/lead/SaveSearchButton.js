"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { getAnonymousId } from "@/lib/lead-anonymous-id";

/**
 * Save-search trigger for /homes. Calls POST /api/lead/saved-search with current filters.
 * Pass filters_json: { priceMin, priceMax, beds, baths, propertyType, neighborhoods }.
 */
export default function SaveSearchButton({ filtersJson = {}, name }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (saved || loading) return;
    const anonId = getAnonymousId();
    if (!anonId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/lead/saved-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymous_id: anonId,
          name: name || "My search",
          filters_json: typeof filtersJson === "object" ? filtersJson : {},
          notify: false,
        }),
      });
      if (res.ok) setSaved(true);
    } catch (_) {}
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        saved
          ? "border-sd-600 bg-sd-50 text-sd-700"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
      aria-label={saved ? "Search saved" : "Save this search"}
    >
      <Bookmark className={`w-4 h-4 ${saved ? "fill-sd-600" : ""}`} />
      {saved ? "Saved" : "Save search"}
    </button>
  );
}
