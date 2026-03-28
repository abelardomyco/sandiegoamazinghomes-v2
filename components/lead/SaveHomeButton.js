"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { getAnonymousId } from "@/lib/lead-anonymous-id";

/**
 * Save-home trigger for property detail. Calls POST /api/lead/saved-home.
 * Shows Saved state after success. No account UI.
 */
export default function SaveHomeButton({ listingId, externalId, source = "cache" }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (saved || loading) return;
    const anonId = getAnonymousId();
    if (!anonId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/lead/saved-home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymous_id: anonId,
          listing_id: listingId || null,
          external_id: externalId || null,
          source,
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
      aria-label={saved ? "Saved" : "Save this home"}
    >
      <Heart className={`w-4 h-4 ${saved ? "fill-sd-600" : ""}`} />
      {saved ? "Saved" : "Save home"}
    </button>
  );
}
