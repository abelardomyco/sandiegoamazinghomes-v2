"use client";

import Link from "next/link";

/**
 * CTA to contact Rosamelia (for property detail and lead capture).
 */
export default function PropertyCTA() {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
      <h2 className="text-sm font-bold text-slate-900 mb-2">Contact agent</h2>
      <p className="text-slate-600 text-sm mb-3">
        Interested in this property? Reach out to Rosamelia for a showing or more information.
      </p>
      <Link
        href="/#contact"
        className="inline-flex items-center rounded-lg border border-sd-600 bg-sd-600 text-white px-4 py-2 text-sm font-medium hover:bg-sd-700 transition-colors"
      >
        Contact Rosamelia
      </Link>
    </div>
  );
}
