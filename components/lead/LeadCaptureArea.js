"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

/**
 * Lead capture for neighborhood (and property) pages: Ask Rosamelia about this area.
 * Single CTA to contact. Optional areaName for context.
 */
export default function LeadCaptureArea({ areaName }) {
  const label = areaName
    ? `Ask Rosamelia about ${areaName}`
    : "Ask Rosamelia about this area";

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-slate-700 text-sm mb-3">
        {areaName
          ? `Questions about ${areaName}—schools, commute, or what’s on the market?`
          : "Questions about this area—schools, commute, or what’s on the market?"}
      </p>
      <Link
        href="/#contact"
        className="inline-flex items-center gap-2 rounded-lg border border-sd-600 bg-sd-600 text-white px-4 py-2 text-sm font-medium hover:bg-sd-700 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        {label}
      </Link>
    </div>
  );
}
