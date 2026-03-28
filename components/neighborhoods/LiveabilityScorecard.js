import { Sparkles } from "lucide-react";

/**
 * Compact liveability scorecard: scores (strong / less) + short prose blurb.
 */
function scoreSummary(scores, strongCount = 4, weakCount = 3) {
  if (!scores || typeof scores !== "object") return { strong: [], weak: [] };
  const entries = Object.entries(scores).filter(([, v]) => typeof v === "number");
  if (entries.length === 0) return { strong: [], weak: [] };
  entries.sort((a, b) => b[1] - a[1]);
  const strong = entries.slice(0, strongCount).map(([k, v]) => ({ label: k, value: v }));
  const weak = entries.slice(-weakCount).map(([k, v]) => ({ label: k, value: v }));
  return { strong, weak };
}

export default function LiveabilityScorecard({ neighborhood, signals, sectionBlurbs = {} }) {
  const scores = neighborhood?.scores ?? {};
  const { strong, weak } = scoreSummary(scores, 4, 3);
  const tags = neighborhood?.vibeTags ?? [];
  const fallback =
    "Curated notes for this neighborhood—ask Rosamelia for the full picture.";
  const valueBlurb =
    sectionBlurbs["Rosamelia notes"] ||
    "A quick take on what buyers are finding in this market.";
  const vibeBlurb =
    sectionBlurbs["The vibe"] ||
    "The feel of the area—walkability, energy, and who it suits.";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles className="w-4 h-4 text-sd-600" aria-hidden />
        <h3 className="text-sm font-bold text-slate-900">Liveability snapshot</h3>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded bg-sd-100 px-2 py-0.5 text-[10px] font-medium text-sd-800"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {(strong.length > 0 || weak.length > 0) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3">
          {strong.length > 0 && (
            <div>
              <span className="font-semibold text-slate-700">Strong: </span>
              <span className="text-slate-600">
                {strong.map((s) => `${s.label} ${s.value}`).join(", ")}
              </span>
            </div>
          )}
          {weak.length > 0 && (
            <div>
              <span className="font-semibold text-slate-700">Less: </span>
              <span className="text-slate-600">
                {weak.map((s) => `${s.label} ${s.value}`).join(", ")}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 text-xs text-slate-600">
        <p>{vibeBlurb || fallback}</p>
        <p>{valueBlurb || fallback}</p>
      </div>
    </div>
  );
}
