"use client";

import Link from "next/link";
import { FileText, TrendingUp } from "lucide-react";

/**
 * Lead capture block for /market: blog + contact.
 */
export default function LeadCaptureMarket() {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-2">
      <h2 className="text-sm font-bold text-slate-900 mb-1">Stay in the loop</h2>
      <p className="text-slate-600 text-sm mb-2">
        Read local market and neighborhood articles on the blog, or reach out directly for a conversation.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-lg bg-sd-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-sd-700 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Read the blog
        </Link>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 text-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-white hover:border-slate-400 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Ask Rosamelia about the market
        </Link>
      </div>
    </div>
  );
}
