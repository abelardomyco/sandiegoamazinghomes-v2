"use client";

import Link from "next/link";

/**
 * Expert commentary block; visually distinct from data widgets. CTA to contact Rosamelia.
 */

export default function RosameliaInsight({ insight }) {
  if (!insight || !insight.trim()) return null;

  return (
    <section
      className="rounded-lg border-2 border-sd-600/40 bg-sd-50/50 px-2.5 py-2"
      aria-labelledby="rosamelia-insight-title"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-sd-700 uppercase tracking-wide">Expert take</span>
        <span className="text-slate-400">·</span>
        <span className="text-sm font-medium text-slate-700">Rosamelia Lopez-Platt</span>
      </div>
      <h2 id="rosamelia-insight-title" className="sr-only">
        Rosamelia&apos;s market insight
      </h2>
      <p className="text-slate-800 text-sm leading-snug mb-1.5">
        &ldquo;{insight}&rdquo;
      </p>
      <Link
        href="/#contact"
        className="inline-flex items-center rounded-lg bg-sd-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-sd-700 transition-colors"
      >
        Ask Rosamelia
      </Link>
    </section>
  );
}
