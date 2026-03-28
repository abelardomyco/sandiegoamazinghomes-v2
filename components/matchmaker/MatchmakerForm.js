"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BUDGET_OPTIONS = [
  { value: "", label: "Select budget range" },
  { value: "under-500", label: "Under $500k" },
  { value: "500-750", label: "$500k – $750k" },
  { value: "750-1.25", label: "$750k – $1.25M" },
  { value: "1.25-plus", label: "$1.25M+" },
];

const COMMUTE_OPTIONS = [
  { value: "", label: "Select commute tolerance" },
  { value: "minimal", label: "Minimal—I work from home or nearby" },
  { value: "short", label: "Short—under 30 min" },
  { value: "medium", label: "Medium—30–45 min OK" },
  { value: "flexible", label: "Flexible" },
];

const VIBE_OPTIONS = [
  "Coastal",
  "Urban",
  "Walkable",
  "Foodie",
  "Artsy",
  "Upscale",
  "Chill",
  "Family-friendly",
  "Surf",
];

const PRIORITY_OPTIONS = [
  { value: "", label: "Select priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

/** Simple match: vibe tag overlap + region preference. Returns top 3 with scores (0–10 scale). */
function matchNeighborhoods(neighborhoods, answers) {
  const vibeSet = new Set(answers.vibes || []);
  const wantBeach = answers.beach === "high";
  const wantUrban = vibeSet.has("Urban") || vibeSet.has("Artsy");

  const scored = neighborhoods.map((n) => {
    let score = 0;
    const tags = n.vibeTags || [];
    tags.forEach((t) => {
      if (vibeSet.has(t)) score += 2;
    });
    if (wantBeach && (n.region === "Coastal" || n.region === "North County")) score += 2;
    if (wantUrban && n.region === "Urban Core") score += 2;
    if (n.featured) score += 1;
    return { slug: n.slug, score, name: n.name };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3);
  const maxScore = Math.max(...top.map((s) => s.score), 1);
  return top.map((s) => ({
    slug: s.slug,
    fitPercent: Math.round((s.score / maxScore) * 100),
  }));
}

export default function MatchmakerForm({ neighborhoods }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState("");
  const [commute, setCommute] = useState("");
  const [vibes, setVibes] = useState(new Set());
  const [schools, setSchools] = useState("");
  const [beach, setBeach] = useState("");

  const totalSteps = 5;
  const toggleVibe = (v) => {
    setVibes((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  const canNext = () => {
    if (step === 1) return !!budget;
    if (step === 2) return !!commute;
    if (step === 3) return vibes.size > 0;
    if (step === 4) return !!schools;
    if (step === 5) return !!beach;
    return false;
  };

  const handleSubmit = () => {
    const payload = {
      budget,
      commute,
      vibes: Array.from(vibes),
      schools,
      beach,
    };
    const list = Array.isArray(neighborhoods) ? neighborhoods : [];
    const results = matchNeighborhoods(list, payload);
    const slugs = results.map((r) => r.slug);
    const scores = results.map((r) => r.fitPercent).join(",");
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "matchmaker_results",
          JSON.stringify({ payload, slugs, results })
        );
      } catch (_) {}
    }
    router.push(`/matches?slugs=${slugs.join(",")}&scores=${scores}`);
  };

  const stepLabels = ["Budget", "Commute", "Vibe", "Schools", "Beach"];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Find your neighborhood
        </h1>
        <p className="text-slate-600 mt-1 text-sm">
          Five quick choices—we&apos;ll suggest a few areas that fit.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-card space-y-5">
        <div className="flex gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps} aria-label="Progress">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i + 1 <= step ? "bg-sd-600" : "bg-slate-100"
              }`}
              aria-hidden
              title={stepLabels[i]}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="select-field"
            >
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Commute
            </label>
            <select
              value={commute}
              onChange={(e) => setCommute(e.target.value)}
              className="select-field"
            >
              {COMMUTE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Vibe (pick any)
            </label>
            <div className="flex flex-wrap gap-2">
              {VIBE_OPTIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleVibe(v)}
                  className={`tag ${vibes.has(v) ? "tag-active" : "tag-default"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Schools
            </label>
            <select
              value={schools}
              onChange={(e) => setSchools(e.target.value)}
              className="select-field"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 5 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Beach
            </label>
            <select
              value={beach}
              onChange={(e) => setBeach(e.target.value)}
              className="select-field"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-between items-center pt-1">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Back
          </button>
          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canNext()}
              className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0"
            >
              See matches
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center">
        <Link href="/neighborhoods" className="text-sd-600 hover:underline">
          Browse all neighborhoods
        </Link>
      </p>
    </div>
  );
}
