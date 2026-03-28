"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Compass, X, ChevronRight } from "lucide-react";
import { Check } from "lucide-react";

const BUDGET_OPTIONS = [
  { value: "under-500", label: "Under $500k" },
  { value: "500-750", label: "$500k – $750k" },
  { value: "750-1.25", label: "$750k – $1.25M" },
  { value: "1.25-2", label: "$1.25M – $2M" },
  { value: "2-plus", label: "$2M+" },
];

const LIFESTYLE_OPTIONS = [
  "Coastal",
  "Urban",
  "Walkable",
  "Foodie",
  "Upscale",
  "Chill",
  "Family-friendly",
  "Surf",
  "Artsy",
];

const COMMUTE_OPTIONS = [
  { value: "minimal", label: "Minimal — work from home or nearby" },
  { value: "short", label: "Short — under 30 min" },
  { value: "medium", label: "Medium — 30–45 min OK" },
  { value: "flexible", label: "Flexible" },
];

/** Score neighborhoods from 3 answers; return top 3 with fit % (0–100). */
function matchNeighborhoods(neighborhoods, answers) {
  const list = Array.isArray(neighborhoods) ? neighborhoods : [];
  const vibeSet = new Set(answers.lifestyle || []);
  const budget = answers.budget || "";
  const commute = answers.commute || "";

  const scored = list.map((n) => {
    let score = 0;
    const tags = n.vibeTags || [];
    tags.forEach((t) => {
      if (vibeSet.has(t)) score += 3;
    });
    const costScore = n.scores?.["Cost-friendly"] ?? 5;
    if (budget === "under-500" && costScore >= 6) score += 4;
    if (budget === "500-750" && costScore >= 4) score += 3;
    if (budget === "750-1.25") score += 2;
    if (budget === "1.25-2" && (costScore <= 5 || n.scores?.Upscale >= 7)) score += 3;
    if (budget === "2-plus" && (n.scores?.Upscale >= 8 || n.featured)) score += 4;
    if (commute === "minimal" && n.region === "Urban Core") score += 2;
    if (commute === "short" && (n.region === "Urban Core" || n.region === "Coastal")) score += 1;
    if ((commute === "medium" || commute === "flexible") && n.region) score += 1;
    if (n.featured) score += 2;
    return { ...n, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  const top = scored.slice(0, 3);
  const maxScore = Math.max(...top.map((s) => s._score), 1);
  return top.map((s) => ({
    slug: s.slug,
    name: s.name,
    region: s.region,
    shortIntro: s.shortIntro,
    fitPercent: Math.min(100, Math.round((s._score / maxScore) * 100)),
  }));
}

export default function MatchmakerWidget({ neighborhoods = [], mode = "floating", defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState("");
  const [lifestyle, setLifestyle] = useState(new Set());
  const [commute, setCommute] = useState("");
  const [results, setResults] = useState(null);

  const toggleLifestyle = (v) => {
    setLifestyle((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  const canNext = () => {
    if (step === 1) return !!budget;
    if (step === 2) return lifestyle.size > 0;
    if (step === 3) return !!commute;
    return false;
  };

  const handleFinish = () => {
    const matched = matchNeighborhoods(neighborhoods, {
      budget,
      lifestyle: Array.from(lifestyle),
      commute,
    });
    setResults(matched);
  };

  const handleReset = () => {
    setStep(1);
    setBudget("");
    setLifestyle(new Set());
    setCommute("");
    setResults(null);
  };

  const neighborhoodSlugs = results?.length ? results.map((r) => r.slug) : [];
  const neighborhoodsUrl = neighborhoodSlugs.length
    ? `/neighborhoods?focus=${neighborhoodSlugs.join(",")}`
    : "/neighborhoods";

  const panel = (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden w-full max-w-md">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
        <span className="font-semibold text-slate-900 flex items-center gap-2">
          <Compass className="w-5 h-5 text-sd-600" />
          Find your area
        </span>
        {mode === "floating" && (
          <button
            type="button"
            onClick={() => { setOpen(false); setResults(null); setStep(1); }}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {results ? (
          <>
            <p className="text-sm font-medium text-slate-700">Top 3 neighborhoods for you</p>
            <ul className="space-y-2">
              {results.map((r, i) => (
                <li
                  key={r.slug}
                  className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 border border-slate-100"
                >
                  <span className="font-medium text-slate-900">{r.name}</span>
                  <span className="text-sm font-semibold text-sd-600 whitespace-nowrap">{r.fitPercent}% fit</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/#contact"
                className="flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg bg-sd-600 text-white font-semibold text-sm hover:bg-sd-700 transition-colors"
              >
                Get matched listings
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href={neighborhoodsUrl}
                className="flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg border-2 border-sd-600 text-sd-600 font-semibold text-sm hover:bg-sd-50 transition-colors"
              >
                Browse neighborhoods
              </Link>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full text-sm text-slate-500 hover:text-slate-700"
            >
              Start over
            </button>
          </>
        ) : (
          <>
            <div className="flex gap-1" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i <= step ? "bg-sd-600" : "bg-slate-100"}`}
                />
              ))}
            </div>

            {step === 1 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="select-field w-full py-2.5"
                >
                  <option value="">Select budget range</option>
                  {BUDGET_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lifestyle</label>
                <p className="text-xs text-slate-500 mb-2">Pick what matters most (one or more)</p>
                <div className="flex flex-wrap gap-2">
                  {LIFESTYLE_OPTIONS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleLifestyle(v)}
                      className={`tag text-xs ${lifestyle.has(v) ? "tag-active" : "tag-default"}`}
                    >
                      {lifestyle.has(v) && <Check className="w-3 h-3 inline mr-0.5" />}
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Commute tolerance</label>
                <select
                  value={commute}
                  onChange={(e) => setCommute(e.target.value)}
                  className="select-field w-full py-2.5"
                >
                  <option value="">Select</option>
                  {COMMUTE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Back
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext()}
                  className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={!canNext()}
                  className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  See matches
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (mode === "inline") {
    return <div className="w-full max-w-md mx-auto">{panel}</div>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-sd-600 text-white shadow-lg hover:bg-sd-700 transition-colors"
        aria-label="Open Find your area"
      >
        <Compass className="w-6 h-6" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pb-24 sm:pb-6 sm:items-center sm:justify-center bg-black/30">
          <div className="sm:max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {panel}
          </div>
        </div>
      )}
    </>
  );
}
