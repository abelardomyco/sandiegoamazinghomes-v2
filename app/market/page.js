import Link from "next/link";
import {
  getMarketStatBandData,
  getBuyerAdvantage,
  getMarketSnapshot,
  getInventoryPressure,
  getNeighborhoodHeatMetricsForMatrix,
  getMortgageWidget,
  getRentalMarket,
} from "@/lib/market-data";
import { getNeighborhoodIndex } from "@/lib/content";
import MarketPulseBar from "@/components/market/MarketPulseBar";
import MarketMiniMortgage from "@/components/market/MarketMiniMortgage";
import { getPublicSiteUrl } from "@/lib/public-site-url";

function marketSnapshotFreshLabel(updatedAt) {
  if (!updatedAt || typeof updatedAt !== "string") return null;
  const t = new Date(updatedAt).getTime();
  if (Number.isNaN(t)) return `Updated ${updatedAt}`;
  const ms = Date.now() - t;
  const weekMs = 7 * 86400000;
  if ((ms >= 0 && ms <= weekMs) || t > Date.now()) return "Updated this week";
  return `Updated ${updatedAt}`;
}

function monthlyPI(principal, annualPct, years = 30) {
  if (principal <= 0 || annualPct < 0) return 0;
  const r = annualPct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

function paymentAtDown(price, downPct, rate) {
  const loan = Math.max(0, price * (1 - downPct / 100));
  return Math.round(monthlyPI(loan, rate, 30));
}

function MicroModule({ title, lines = [], className: extraClass = "" }) {
  const list = Array.isArray(lines) ? lines.filter(Boolean).slice(0, 6) : [];
  if (!list.length) return null;
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white px-2 py-1.5 h-auto self-start w-full min-h-0 ${extraClass}`.trim()}
    >
      <h2 className="m-0 text-[11px] font-extrabold text-slate-700 uppercase tracking-wide leading-tight">{title}</h2>
      <ul className="mt-0.5 m-0 p-0 list-none space-y-px">
        {list.map((line, i) => (
          <li key={i} className="text-[13px] font-semibold text-slate-900 leading-tight">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Slightly heavier: key takeaway. `wideSpan`: 2 cols on sm+ when only 3 tiles in row; off when 4 tiles (Shift + Rate) share one row. */
function CalloutModule({ lines = [], wideSpan = true }) {
  const list = Array.isArray(lines) ? lines.filter(Boolean).slice(0, 2) : [];
  if (!list.length) return null;
  return (
    <section
      className={`rounded-lg border-2 border-sd-300/80 bg-gradient-to-br from-sd-50 via-white to-slate-50/50 px-2 py-1.5 shadow-sm h-auto self-start w-full min-h-0 ${wideSpan ? "sm:col-span-2" : ""}`.trim()}
      aria-label="Market takeaway"
    >
      {list.map((line, i) => (
        <p
          key={i}
          className={`m-0 text-[13px] font-bold text-slate-900 leading-tight ${i > 0 ? "mt-1 text-slate-800" : ""}`}
        >
          {line}
        </p>
      ))}
    </section>
  );
}

/** Single scannable line */
function OneLineModule({ kicker, text }) {
  if (!text) return null;
  return (
    <section className="rounded-md border border-slate-300/90 bg-slate-50/90 px-2 py-1 h-auto self-start w-full min-h-0">
      {kicker ? (
        <p className="m-0 text-[9px] font-extrabold uppercase tracking-wide text-slate-500 leading-none">{kicker}</p>
      ) : null}
      <p className="m-0 text-[13px] font-semibold text-slate-900 leading-tight mt-0.5">{text}</p>
    </section>
  );
}

function QuickScenarioModule({ price, rate }) {
  const p = Number(price) || 0;
  const r = Number(rate) || 0;
  if (p <= 0 || r < 0) return null;
  const rows = [10, 20, 30].map((d) => ({
    d,
    pay: paymentAtDown(p, d, r),
  }));
  return (
    <section className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 h-auto self-start w-full min-h-0">
      <h2 className="m-0 text-[11px] font-extrabold text-slate-700 uppercase tracking-wide leading-tight">Quick scenario (P&amp;I)</h2>
      <p className="m-0 text-[10px] text-slate-500 mt-0.5 leading-tight">
        Same price (~${Math.round(p / 1000)}K), different down — est. only
      </p>
      <ul className="mt-0.5 m-0 p-0 list-none space-y-px font-mono text-[11px] font-semibold text-slate-800 tabular-nums">
        {rows.map(({ d, pay }) => (
          <li key={d} className="leading-tight">
            {d}% down → ~${pay.toLocaleString()}/mo
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionLabel({ children, isFirst = false }) {
  return (
    <div className={`w-full pb-0.5 border-b border-slate-200/80 ${isFirst ? "pt-0" : "pt-1.5"}`}>
      <p className="m-0 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 leading-none">{children}</p>
    </div>
  );
}

/** Four tiles — matches `lg:grid-cols-4` (e.g. Callout spans 2 + two singles). */
function ModuleRow4({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-1.5 gap-y-1 items-start content-start [grid-auto-rows:min-content]">
      {children}
    </div>
  );
}

/**
 * Three tiles — dedicated 3-col row (not a 4-col row with an empty track).
 * On sm, third tile spans full width of row 2 so no orphan column.
 */
function ModuleRow3({ children }) {
  return (
    <div className="grid grid-cols-1 gap-x-1.5 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 [&>*:nth-child(3)]:sm:col-span-2 [&>*:nth-child(3)]:lg:col-span-1 items-start content-start [grid-auto-rows:min-content]">
      {children}
    </div>
  );
}

const marketOgUrl = `${getPublicSiteUrl()}/market`;

export const metadata = {
  title: "Market Dashboard",
  description:
    "San Diego County market insight at a glance: what’s tight, what’s easing, and how to think about it right now.",
  alternates: {
    canonical: marketOgUrl,
  },
  openGraph: {
    title: "San Diego County market dashboard | San Diego Amazing Homes",
    description:
      "What’s tight, what’s easing, and how to think about San Diego housing right now — paired with neighborhood context.",
    type: "website",
    url: marketOgUrl,
  },
};

export default async function MarketPage() {
  const [
    buyerAdvantage,
    neighborhoodIndex,
    snapshot,
    inventoryPressure,
    matrix,
    mortgageWidget,
    rentalMarket,
  ] = await Promise.all([
    Promise.resolve(getBuyerAdvantage()),
    Promise.resolve(getNeighborhoodIndex()),
    Promise.resolve(getMarketSnapshot()),
    Promise.resolve(getInventoryPressure()),
    Promise.resolve(getNeighborhoodHeatMetricsForMatrix()),
    Promise.resolve(getMortgageWidget()),
    Promise.resolve(getRentalMarket()),
  ]);

  const bySlugName = new Map((neighborhoodIndex || []).map((n) => [n.slug, n.name]));

  const stat = getMarketStatBandData();
  const rate = snapshot?.mortgageRate ?? null;

  const buyerPower = (() => {
    const s = buyerAdvantage?.score;
    if (typeof s !== "number") return "Low–Moderate";
    if (s <= 3) return "High";
    if (s <= 5) return "Moderate";
    return "Low";
  })();

  const priceDir = (() => {
    const d = stat?.medianPriceDelta;
    if (typeof d !== "number") return "Stable";
    if (d >= 2) return "Prices ↑ 2–3% (est.)";
    if (d >= 0.8) return "Prices ↑ slightly";
    if (d <= -2) return "Prices ↓ 2–3% (est.)";
    if (d <= -0.8) return "Prices ↓ slightly";
    return "Prices → stable";
  })();

  const inventoryLabel = (() => {
    const base =
      inventoryPressure?.label?.toLowerCase().includes("seller")
        ? "Inventory: Low"
        : inventoryPressure?.label?.toLowerCase().includes("cool")
          ? "Inventory: Increasing"
          : "Inventory: Moderate";
    return base;
  })();

  const speedLabel = (() => {
    const dom = snapshot?.daysOnMarket ?? stat?.daysOnMarket;
    if (typeof dom !== "number") return "Speed: Normal";
    if (dom <= 22) return "Homes selling fast";
    if (dom >= 40) return "Homes taking longer";
    return "Speed: Normal";
  })();

  const marketType = (() => {
    const s = buyerAdvantage?.score;
    if (typeof s !== "number") return buyerAdvantage?.label || "Balanced";
    if (s >= 7) return "Slightly competitive";
    if (s <= 3) return "Buyer-friendly";
    return "Balanced";
  })();

  const sorted = (matrix || []).slice().sort((a, b) => (b.marketStrength ?? 0.5) - (a.marketStrength ?? 0.5));

  const hotBalancedFlexible = (() => {
    const hotN = sorted.filter((r) => (r.marketStrength ?? 0.5) >= 0.62).slice(0, 3);
    const balN = sorted.filter((r) => {
      const x = r.marketStrength ?? 0.5;
      return x < 0.62 && x >= 0.48;
    }).slice(0, 3);
    const coolN = sorted.filter((r) => (r.marketStrength ?? 0.5) < 0.48).slice(0, 3);
    const fmt = (rows) =>
      rows
        .map((r) => bySlugName.get(r.slug) || r.name)
        .filter(Boolean)
        .join(", ");
    return [
      `Hotter: ${fmt(hotN) || "coastal & move-up pockets"}`,
      `Balanced: ${fmt(balN) || "many mid-tier strips"}`,
      `More room to negotiate: ${fmt(coolN) || "pockets with supply"}`,
    ];
  })();

  /** Merged buyer window + under-$1M nuance + luxury first line */
  const offerBands = (() => {
    const label = marketType.toLowerCase().includes("buyer")
      ? "more flexible"
      : marketType.toLowerCase().includes("competitive")
        ? "competitive"
        : "mixed";
    const under = label === "more flexible" ? "mixed" : "competitive";
    const mid = "mixed";
    const s = buyerAdvantage?.score;
    const under1m =
      typeof s === "number" && s <= 3
        ? "Under ~$1M: still mixed—ugly ducklings linger, sharp ones don’t"
        : "Under ~$1M: clean listings still draw a crowd";
    const lux = (() => {
      const ls = buyerAdvantage?.score;
      const l = typeof ls === "number" && ls <= 4 ? "more flexible at the top" : "mixed but terms-heavy";
      return `$1.5M+ → ${l}`;
    })();
    return [`Under $800K → ${under}`, `$800K–$1.2M → ${mid}`, under1m, lux];
  })();

  const smartBuyers = (() => {
    const out = [
      "Expand geography before you downgrade must-haves",
      "Strike on clean, well-priced listings—stalling rarely ages well",
      "Leverage inspections and credits when days-on-market stack up",
    ];
    if (inventoryLabel.includes("Increasing")) out.unshift("Track fresh listings; leverage shows up block by block");
    return out.slice(0, 4);
  })();

  const pickSlugsWithTag = (tag, limit = 3) => {
    const t = String(tag || "").toLowerCase();
    return (neighborhoodIndex || [])
      .filter((n) => (n?.vibeTags || []).some((x) => String(x).toLowerCase() === t))
      .map((n) => n.slug)
      .filter(Boolean)
      .slice(0, limit);
  };

  const namesFromSlugs = (slugs) =>
    (Array.isArray(slugs) ? slugs : [])
      .map((slug) => bySlugName.get(slug) || slug)
      .filter(Boolean);

  const whereValue = (() => {
    const preferred = ["chula-vista", "otay", "imperial-beach", "national-city", "el-cajon", "la-mesa"];
    const picked = preferred.map((slug) => bySlugName.get(slug)).filter(Boolean).slice(0, 3);
    if (picked.length) return picked;
    return sorted
      .slice(-6)
      .map((r) => bySlugName.get(r.slug) || r.name)
      .filter(Boolean)
      .slice(0, 3);
  })();

  const valuePockets = (() => {
    const vibe = namesFromSlugs(pickSlugsWithTag("Value", 4)).slice(0, 3);
    const names = vibe.length ? vibe : whereValue;
    return [`Watch: ${names.join(", ")}`, "Street-level still beats region labels—drive the blocks"];
  })();

  const coastalPressure = (() => {
    const coastal = namesFromSlugs(pickSlugsWithTag("Coastal", 3));
    return [
      `Bluff & boardwalk pockets → ${inventoryLabel.includes("Low") ? "still tight" : "some breathing room"}`,
      coastal.length ? `Names in rotation: ${coastal.join(", ")}` : "Worth timing showings for tide + tourists",
    ];
  })();

  const southBaySignal = (() => {
    const south = namesFromSlugs(pickSlugsWithTag("Value", 3));
    return [
      `South Bay → ${inventoryLabel.includes("Increasing") ? "more to see each month" : "block-by-block"}`,
      south.length ? `Examples: ${south.join(", ")}` : "Value hunt lives here for many buyers",
    ];
  })();

  const condoVsHouse = [
    "Condos: buyers pinch every basis point",
    "Detached: emotional bids still land",
    "Same ZIP, two different negotiations",
  ];

  const priceCuts = (() => {
    const d = stat?.priceReductionRateDelta;
    const lead =
      typeof d === "number"
        ? d > 0
          ? "Markdowns picking up vs the earlier pull"
          : "Markdowns flat vs the earlier pull"
        : "Markdowns: watch the next data drop";
    return [lead, "Stale listings: that’s where your margin lives", "Skip the ‘almost’ house at full pop"];
  })();

  const rateForMini = rate != null ? Number(rate) : Number(mortgageWidget?.rate ?? 6.75);
  const medianForDisplay = stat?.medianPrice ?? snapshot?.medianPrice ?? 950000;
  const defaultPriceRounded = Math.round(medianForDisplay / 25000) * 25000;

  const interestRatePulse = (() => {
    const r30 = rateForMini;
    const dir = String(mortgageWidget?.rateDirection || "stable").toLowerCase();
    const arrow = dir === "up" ? "↑" : dir === "down" ? "↓" : "→";
    const note = dir === "up" ? "nudging up" : dir === "down" ? "easing slightly" : "flat";
    return [`30-yr fixed (est.) ${r30.toFixed(2)}%`, `${arrow} ${note} (update when you wire live data)`];
  })();

  const whatMeansRightNow = (() => {
    const s = buyerAdvantage?.score;
    if (typeof s === "number" && s >= 7) {
      return [
        "Salt-air ZIPs still collect the premium bids.",
        "Sub-$1M turn-key: weekend traffic, not open houses.",
      ];
    }
    if (typeof s === "number" && s <= 4) {
      return [
        "Outer rings: more wiggle than the postcard coast.",
        "Sitting inventory = conversation, not panic.",
      ];
    }
    return [
      "County’s a patchwork—one offer story doesn’t fit all.",
      "Right-priced still wins; wrong-priced still waits.",
    ];
  })();

  const incomeRealityCheck = (() => {
    const med = medianForDisplay;
    const medK = Math.round(med / 1000);
    const incK = Math.max(85, Math.round(med / 5200));
    return [
      `Median (est.): ~$${medK}K`,
      `Income ballpark ~$${incK}K+/yr — lender sets the real number`,
    ];
  })();

  const rentVsBuySnapshot = (() => {
    const rent = rentalMarket?.medianRent;
    const examples = mortgageWidget?.paymentExamples || [];
    const ex =
      examples.find((p) => Math.abs((p.price || 0) - medianForDisplay) < 80000) ||
      examples.find((p) => p.price === 950000) ||
      examples[1];
    const own = ex?.payment;
    if (typeof rent !== "number" || typeof own !== "number") {
      return ["Rent vs own: rates move the math weekly — we’ll model yours."];
    }
    const priceLabel = (ex?.price || 950000).toLocaleString();
    return [
      `Rent (rough): ~$${Math.round(rent / 50) * 50}/mo`,
      `Own P&I at ~$${priceLabel}: ~$${own.toLocaleString()}/mo before tax/HOA`,
    ];
  })();

  /** Comparison vs earlier data — no fake “last week” precision */
  const recentShiftLines = (() => {
    const lines = [];
    if (typeof stat?.activeListingsDelta === "number") {
      if (stat.activeListingsDelta > 1) lines.push("More for-sale signs than last time we checked");
      else if (stat.activeListingsDelta < -1) lines.push("Fewer active listings than last time we checked");
      else lines.push("For-sale count: flat vs last check");
    }
    if (typeof stat?.medianPriceDelta === "number") {
      if (Math.abs(stat.medianPriceDelta) < 0.3) lines.push("Median barely budged—noise, not a trend");
      else lines.push(`Median ${stat.medianPriceDelta > 0 ? "up" : "down"} vs last check (broad brush)`);
    }
    return lines.slice(0, 2);
  })();

  const inventoryOneLiner = inventoryLabel.includes("Increasing")
    ? "Inventory inching up—more to tour if you’re patient"
    : inventoryLabel.includes("Low")
      ? "Still a thin shelf in the neighborhoods people want"
      : "Listings neither flooding nor empty—pick your ZIP";

  const calloutLines = (() => {
    const s = buyerAdvantage?.score;
    const first =
      "Well-priced homes still move fast—hesitation often costs more than a small rate swing right now.";
    if (typeof s === "number" && s <= 4) {
      return [first, "You’ve got more room to ask for repairs and credits when DOM stacks—use it surgically."];
    }
    if (typeof s === "number" && s >= 7) {
      return [first, "Competition’s real: narrow your must-haves before you narrow your neighborhoods."];
    }
    return [first, "Mixed map: win on preparation, not on timing the headline."];
  })();

  const ifBuyingNow = [
    "Line up pre-approval, non-negotiables, and a short list—then commit when the fit’s obvious.",
    "If it’s been sitting, assume there’s a story—price, condition, or both—not just ‘bad luck.’",
  ];

  return (
    <div className="flex flex-col gap-1">
      <header className="border-b border-slate-200 pb-0.5 m-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="m-0 text-xl sm:text-2xl font-bold text-slate-900 leading-tight">San Diego market</h1>
          {snapshot?.updatedAt && (
            <span className="text-xs font-medium text-sd-700 bg-sd-50 border border-sd-200 rounded px-1.5 py-0.5">
              {marketSnapshotFreshLabel(snapshot.updatedAt)}
            </span>
          )}
        </div>
        <p className="m-0 text-slate-600 text-xs mt-0.5 leading-snug">Signals first · plain language · ranges not decimals</p>
      </header>

      <MarketPulseBar
        items={[
          {
            label: "Rates",
            value: rate != null ? `${Number(rate).toFixed(2)}%` : "—",
            tone: "neutral",
          },
          { label: "Prices", value: priceDir, tone: priceDir.includes("↑") ? "bad" : priceDir.includes("↓") ? "good" : "neutral" },
          { label: "Inventory", value: inventoryLabel.replace("Inventory: ", ""), tone: inventoryLabel.includes("Low") ? "bad" : inventoryLabel.includes("Increasing") ? "good" : "neutral" },
          { label: "Speed", value: speedLabel, tone: speedLabel.includes("fast") ? "bad" : speedLabel.includes("longer") ? "good" : "neutral" },
          { label: "Buyer power", value: buyerPower, tone: buyerPower.includes("High") ? "good" : buyerPower.includes("Low") ? "bad" : "neutral" },
        ]}
      />

      {/* Explicit row groups by tile count — no single mega-grid */}
      <div className="flex flex-col gap-1">
        <SectionLabel isFirst>Core signals</SectionLabel>
        <ModuleRow4>
          <CalloutModule lines={calloutLines} wideSpan={recentShiftLines.length === 0} />
          <OneLineModule kicker="Inventory pulse" text={inventoryOneLiner} />
          {recentShiftLines.length > 0 ? (
            <MicroModule title="Shift vs last check" lines={recentShiftLines} />
          ) : null}
          <MicroModule title="Rate & financing pulse" lines={interestRatePulse} />
        </ModuleRow4>

        <SectionLabel>Financial reality</SectionLabel>
        <ModuleRow4>
          <MarketMiniMortgage
            key={`${defaultPriceRounded}-${rateForMini}`}
            defaultPrice={defaultPriceRounded}
            defaultDownPct={20}
            defaultRate={rateForMini}
          />
          <QuickScenarioModule price={defaultPriceRounded} rate={rateForMini} />
          <MicroModule title="Income check (rough)" lines={incomeRealityCheck} />
          <MicroModule title="Rent vs own (rough)" lines={rentVsBuySnapshot} />
        </ModuleRow4>

        <SectionLabel>Market interpretation</SectionLabel>
        <ModuleRow3>
          <MicroModule title="Right now" lines={whatMeansRightNow} />
          <MicroModule title="Price cuts & leverage" lines={priceCuts} />
          <MicroModule title="Condo vs detached" lines={condoVsHouse} />
        </ModuleRow3>

        <SectionLabel>Geographic insights</SectionLabel>
        <ModuleRow4>
          <MicroModule title="Heat map (names)" lines={hotBalancedFlexible} />
          <MicroModule title="Value pockets" lines={valuePockets} />
          <MicroModule title="Coastal strip" lines={coastalPressure} />
          <MicroModule title="South Bay" lines={southBaySignal} />
        </ModuleRow4>

        <SectionLabel>Action layer</SectionLabel>
        <ModuleRow3>
          <MicroModule title="If you’re buying right now" lines={ifBuyingNow} />
          <MicroModule title="What working buyers do" lines={smartBuyers} />
          <MicroModule title="Offers by price band" lines={offerBands} />
        </ModuleRow3>
      </div>

      <p className="m-0 text-sm text-slate-600 pt-1 border-t border-slate-200 leading-snug">
        Pair this with{" "}
        <Link href="/neighborhoods" className="font-medium text-sd-600 hover:underline">
          neighborhood guides
        </Link>
        ,{" "}
        <Link href="/blog" className="font-medium text-sd-600 hover:underline">
          local articles
        </Link>
        , and{" "}
        <Link href="/#contact" className="font-medium text-sd-600 hover:underline">
          a conversation with Rosamelia
        </Link>
        .
      </p>
    </div>
  );
}
